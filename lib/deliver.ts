// Server-side only. Emails the paid skill to the buyer, once per purchase.

import { advancedZipBase64 } from "@/lib/advanced-zip"
import { isPaidAdvanced, type ChipPurchase } from "@/lib/chip"
import { addToSet, getValue, KEY, pushCapped, setSize } from "@/lib/kv"
import { emailConfigured, sendEmail } from "@/lib/mailjet"
import { buyerEmail, saleEmail, type EmailLang } from "@/lib/email-template"
import { ADVANCED, CONTACT, currentPrice } from "@/lib/product"
import { claim, release } from "@/lib/sent-log"

/** The language the buyer was using when they paid, or null if not recorded. */
export async function storedLang(purchaseId: string): Promise<EmailLang | null> {
  const v = await getValue(KEY.lang(purchaseId)).catch(() => null)
  return v === "en" || v === "bm" ? v : null
}

const buyerLang = async (purchaseId: string): Promise<EmailLang> => (await storedLang(purchaseId)) ?? "bm"

export type DeliveryResult = "sent" | "already" | "disabled" | "failed" | "not-paid"

export async function deliverAdvanced(purchase: ChipPurchase | null, siteUrl: string): Promise<DeliveryResult> {
  if (!purchase || !isPaidAdvanced(purchase)) return "not-paid"

  // Real buyer count for the page. A set keyed by purchase id, so the thank-you
  // page and CHIP's callback can both call this without counting twice.
  let alertName: string | null = null
  let saleNumber: number | null = null
  try {
    alertName = await getValue(KEY.alertName(purchase.id))
    if (await addToSet(KEY.sales, purchase.id)) {
      // First time we see this sale: add it to the real purchase alerts.
      await pushCapped(KEY.recent, JSON.stringify({ name: alertName, at: Date.now() }), 20)
    }
    saleNumber = await setSize(KEY.sales)
  } catch (err) {
    console.error("Couldn't record sale", err)
  }

  const email = purchase.client?.email
  if (!email) return "failed"
  if (!emailConfigured()) {
    console.warn("Mailjet isn't set up; skill email not sent for", purchase.id)
    return "disabled"
  }

  // The sent log stops duplicate emails. If the store is unreachable (e.g.
  // Upstash not set on Cloudflare), still send: a rare duplicate beats a buyer
  // with no file.
  let first = true
  try {
    first = await claim(purchase.id)
  } catch (err) {
    console.error("Sent log unavailable; sending anyway", err)
  }
  if (!first) return "already"

  const name = purchase.client?.full_name?.trim() || ""
  const lang = await buyerLang(purchase.id)
  const totalSen = purchase.purchase?.total ?? currentPrice().priceRM * 100
  const paidAt = purchase.paid_on ? new Date(purchase.paid_on * 1000) : new Date()

  try {
    const msg = buyerEmail({ name, purchaseId: purchase.id, siteUrl, totalSen, paidAt, lang })
    await sendEmail({
      to: { email, name: name || undefined },
      replyTo: CONTACT.email,
      ...msg,
      attachments: [{ filename: ADVANCED.file, contentType: "application/zip", base64: advancedZipBase64() }],
    })
  } catch (err) {
    console.error("Skill email failed", purchase.id, err)
    await release(purchase.id).catch(() => {})
    return "failed"
  }

  // Heads-up to the studio. Never affects the buyer's result.
  const admin = process.env.ADMIN_EMAIL
  if (admin) {
    const msg = saleEmail({ buyerName: name, buyerEmail: email, purchaseId: purchase.id, totalSen, paidAt, saleNumber, alertName, buyerLang: lang, siteUrl })
    // Awaited so serverless hosts don't cut it off; a failure never affects the buyer.
    await sendEmail({ to: { email: admin }, replyTo: email, ...msg }).catch((err) =>
      console.error("Admin sale email failed", err)
    )
  }

  return "sent"
}
