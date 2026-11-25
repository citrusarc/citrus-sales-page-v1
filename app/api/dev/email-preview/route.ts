import { buyerEmail } from "@/lib/email-template"

// Local only: shows the buyer email in the browser without sending anything.
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 })
  const { html } = buyerEmail({
    name: "Aisyah Rahman",
    purchaseId: "00000000-0000-0000-0000-000000000000",
    siteUrl: new URL(request.url).origin,
    totalSen: 2900,
    paidAt: new Date(),
  })
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}
