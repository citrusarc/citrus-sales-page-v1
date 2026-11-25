// Server-side only: uses CHIP_API_KEY. Import from route handlers and
// server components, never from a "use client" file.
import { ADVANCED } from "@/lib/product"

// Same variable names as citrus-class-v1, so the keys can be shared.
const API = (process.env.CHIP_API_URL || "https://gate.chip-in.asia/api/v1").replace(/\/$/, "")

export type ChipPurchase = {
  id: string
  status: string
  brand_id: string
  reference?: string
  checkout_url?: string
  client?: { email?: string; full_name?: string }
  purchase?: { total?: number; currency?: string }
  /** Unix seconds. */
  paid_on?: number | null
}

export function chipConfigured() {
  return Boolean(process.env.CHIP_API_KEY && process.env.CHIP_BRAND_ID)
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.CHIP_API_KEY}`,
    "Content-Type": "application/json",
  }
}

/** CHIP can only call back a public https address, not localhost. */
const isPublic = (origin: string) =>
  origin.startsWith("https://") && !/\/\/(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(origin)

export async function createAdvancedPurchase(input: {
  email: string
  fullName?: string
  origin: string
}): Promise<ChipPurchase> {
  const res = await fetch(`${API}/purchases/`, {
    method: "POST",
    headers: headers(),
    cache: "no-store",
    body: JSON.stringify({
      brand_id: process.env.CHIP_BRAND_ID,
      reference: ADVANCED.reference,
      // We email the skill file ourselves (lib/deliver.ts), so no CHIP receipt.
      send_receipt: false,
      client: {
        email: input.email,
        ...(input.fullName ? { full_name: input.fullName } : {}),
      },
      purchase: {
        currency: "MYR",
        products: [{ name: ADVANCED.name, price: ADVANCED.priceRM * 100 }],
      },
      success_redirect: `${input.origin}/terima-kasih`,
      failure_redirect: `${input.origin}/?bayar=gagal#harga`,
      cancel_redirect: `${input.origin}/#harga`,
      // Delivers the email even if the buyer closes the tab before the redirect.
      ...(isPublic(input.origin) ? { success_callback: `${input.origin}/api/chip/callback` } : {}),
    }),
  })
  if (!res.ok) {
    throw new Error(`CHIP create purchase failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

export async function getPurchase(id: string): Promise<ChipPurchase | null> {
  // CHIP purchase ids are UUIDs; reject anything else before calling out.
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const res = await fetch(`${API}/purchases/${id}/`, {
    headers: headers(),
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

/** A purchase unlocks the download only if it is ours, for this product, and paid. */
export function isPaidAdvanced(p: ChipPurchase | null): boolean {
  return Boolean(
    p &&
      p.status === "paid" &&
      p.brand_id === process.env.CHIP_BRAND_ID &&
      p.reference === ADVANCED.reference
  )
}

// --- Callback signature (same check as citrus-class-v1) ---

let publicKey: Promise<CryptoKey> | null = null

/** CHIP's RSA public key (PEM), imported once per server instance. */
function getPublicKey() {
  publicKey ??= (async () => {
    let pem = process.env.CHIP_PUBLIC_KEY
    if (!pem) {
      const res = await fetch(`${API}/public_key/`, { headers: headers(), cache: "no-store" })
      if (!res.ok) throw new Error(`CHIP public key ${res.status}`)
      pem = (await res.json()) as string
    }
    // Env values often keep a PEM's line breaks as literal "\n".
    const der = base64ToBytes(pem.replace(/-----(BEGIN|END) PUBLIC KEY-----|\\n|\s/g, ""))
    return crypto.subtle.importKey("spki", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"])
  })().catch((error) => {
    publicKey = null
    throw error
  })
  return publicKey
}

const base64ToBytes = (value: string) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0))

/** Checks CHIP's X-Signature: base64 RSA-SHA256 over the raw body. */
export async function verifyCallbackSignature(rawBody: string, signature: string | null) {
  if (!signature) return false
  try {
    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      await getPublicKey(),
      base64ToBytes(signature),
      new TextEncoder().encode(rawBody)
    )
  } catch (error) {
    console.error("CHIP signature check failed", error)
    return false
  }
}
