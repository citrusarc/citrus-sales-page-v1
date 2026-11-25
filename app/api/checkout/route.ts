import { cookies } from "next/headers"

import { chipConfigured, createAdvancedPurchase } from "@/lib/chip"
import { KEY, setValue } from "@/lib/kv"
import { maskName } from "@/lib/mask"
import { PURCHASE_COOKIE } from "@/lib/product"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
  if (!chipConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 503 })
  }

  let body: { email?: unknown; name?: unknown; lang?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : ""
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ error: "invalid_email" }, { status: 400 })
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin

  try {
    const purchase = await createAdvancedPurchase({ email, fullName: name, origin })
    if (!purchase.checkout_url) throw new Error("No checkout_url in CHIP response")

    // Masked name for the purchase alert (lib/mask.ts). The buy form tells the
    // buyer before they pay; leaving the name blank shows "Seseorang" instead.
    const masked = name ? maskName(name) : null
    if (masked) {
      await setValue(KEY.alertName(purchase.id), masked, 60 * 60 * 24 * 7).catch((err) =>
        console.error("Couldn't save alert name", err)
      )
    }

    // The language the buyer is using, so the email and thank-you page match it.
    await setValue(KEY.lang(purchase.id), body.lang === "en" ? "en" : "bm", 60 * 60 * 24 * 30).catch((err) =>
      console.error("Couldn't save buyer language", err)
    )

    // Remember the purchase in this browser so /terima-kasih can verify it
    // when CHIP redirects back.
    const jar = await cookies()
    jar.set(PURCHASE_COOKIE, purchase.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })

    return Response.json({ checkoutUrl: purchase.checkout_url })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "chip_error" }, { status: 502 })
  }
}
