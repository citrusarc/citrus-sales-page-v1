import { buyerEmail, saleEmail } from "@/lib/email-template"

// Local only: shows the emails in the browser without sending anything.
//   /api/dev/email-preview         → the buyer's email
//   /api/dev/email-preview?lang=en → the buyer's email in English
//   /api/dev/email-preview?sale    → the studio's sale email
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 })
  const url = new URL(request.url)
  const common = { purchaseId: "00000000-0000-0000-0000-000000000000", siteUrl: url.origin, totalSen: 2900, paidAt: new Date() }
  const lang = url.searchParams.get("lang") === "en" ? "en" : "bm"
  const { html } = url.searchParams.has("sale")
    ? saleEmail({ ...common, buyerName: "Aisyah Rahman", buyerEmail: "aisyah@email.com", saleNumber: 3, alertName: "Ai***h", buyerLang: lang })
    : buyerEmail({ ...common, name: "Aisyah Rahman", lang })
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}
