// Server-side only. Emails the paid skill to the buyer, once per purchase.

import { readFile } from "node:fs/promises"
import path from "node:path"

import { isPaidAdvanced, type ChipPurchase } from "@/lib/chip"
import { addToSet, getValue, KEY, pushCapped } from "@/lib/kv"
import { emailConfigured, sendEmail } from "@/lib/mailjet"
import { buyerEmail, esc } from "@/lib/email-template"
import { ADVANCED, CONTACT } from "@/lib/product"
import { claim, release } from "@/lib/sent-log"

export type DeliveryResult = "sent" | "already" | "disabled" | "failed" | "not-paid"

export async function deliverAdvanced(purchase: ChipPurchase | null, siteUrl: string): Promise<DeliveryResult> {
  if (!purchase || !isPaidAdvanced(purchase)) return "not-paid"

  // Real buyer count for the page. A set keyed by purchase id, so the thank-you
  // page and CHIP's callback can both call this without counting twice.
  try {
    if (await addToSet(KEY.sales, purchase.id)) {
      // First time we see this sale: add it to the real purchase alerts.
      const name = await getValue(KEY.alertName(purchase.id))
      await pushCapped(KEY.recent, JSON.stringify({ name, at: Date.now() }), 20)
    }
  } catch (err) {
    console.error("Couldn't record sale", err)
  }

  const email = purchase.client?.email
  if (!email) return "failed"
  if (!emailConfigured()) {
    console.warn("Mailjet isn't set up; skill email not sent for", purchase.id)
    return "disabled"
  }

  if (!(await claim(purchase.id))) return "already"

  try {
    const zip = await readFile(path.join(process.cwd(), "private", ADVANCED.file))
    const name = purchase.client?.full_name?.trim() || ""
    const msg = buyerEmail({
      name,
      purchaseId: purchase.id,
      siteUrl,
      totalSen: purchase.purchase?.total ?? ADVANCED.priceRM * 100,
      paidAt: purchase.paid_on ? new Date(purchase.paid_on * 1000) : new Date(),
    })
    await sendEmail({
      to: { email, name: name || undefined },
      replyTo: CONTACT.email,
      ...msg,
      attachments: [{ filename: ADVANCED.file, contentType: "application/zip", base64: zip.toString("base64") }],
    })
  } catch (err) {
    console.error("Skill email failed", purchase.id, err)
    await release(purchase.id).catch(() => {})
    return "failed"
  }

  // Heads-up to the studio. Never affects the buyer's result.
  const admin = process.env.ADMIN_EMAIL
  if (admin) {
    const total = ((purchase.purchase?.total ?? ADVANCED.priceRM * 100) / 100).toFixed(2)
    const line = `${email} paid RM${total} for Meta Ads Advanced (CHIP ${purchase.id}).`
    sendEmail({
      to: { email: admin },
      subject: `Jualan baru: Meta Ads Advanced — RM${total}`,
      text: line,
      html: `<p>${esc(line)}</p>`,
    }).catch((err) => console.error("Admin sale email failed", err))
  }

  return "sent"
}
