import type { Metadata } from "next"
import { cookies, headers } from "next/headers"

import { ThanksView } from "@/components/landing/thanks-view"
import { getPurchase, isPaidAdvanced } from "@/lib/chip"
import { deliverAdvanced, storedLang } from "@/lib/deliver"
import { PURCHASE_COOKIE } from "@/lib/product"

export const metadata: Metadata = {
  title: "Terima kasih — Meta Ads Advanced",
  robots: { index: false },
}

async function siteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  if (fromEnv) return fromEnv
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

export default async function ThanksPage({ searchParams }: PageProps<"/terima-kasih">) {
  // Local only: /terima-kasih?preview=paid|pending|missing|failed shows each
  // state without a purchase. Nothing is sent.
  const preview = (await searchParams).preview
  if (process.env.NODE_ENV !== "production" && typeof preview === "string") {
    if (preview === "paid") return <ThanksView state="paid" email="anda@email.com" />
    if (preview === "failed") return <ThanksView state="paid" emailFailed />
    if (preview === "pending" || preview === "missing") return <ThanksView state={preview} />
  }

  const id = (await cookies()).get(PURCHASE_COOKIE)?.value
  const purchase = id ? await getPurchase(id) : null

  const dead = ["error", "cancelled", "expired", "blocked", "refunded", "chargeback"]
  const paid = isPaidAdvanced(purchase)
  const state = paid ? "paid" : purchase && !dead.includes(purchase.status) ? "pending" : "missing"

  // Emails the file (with the zip attached). Safe to call on every visit:
  // the sent log makes sure each purchase is emailed once, even if CHIP's
  // callback got there first.
  const delivery = paid ? await deliverAdvanced(purchase, await siteOrigin()) : null
  const emailed = delivery === "sent" || delivery === "already"

  // Show the page in the language they paid in (same as their email). If it
  // wasn't recorded, the page keeps the language saved in this browser.
  const lang = (purchase && (await storedLang(purchase.id))) || undefined

  return <ThanksView state={state} lang={lang} email={paid && emailed ? (purchase?.client?.email ?? null) : null} emailFailed={paid && !emailed} />
}
