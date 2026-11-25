import { getPurchase, verifyCallbackSignature } from "@/lib/chip"
import { deliverAdvanced } from "@/lib/deliver"

// CHIP calls this when a purchase is paid, even if the buyer closed the tab
// before being redirected back. Only set up when the site is publicly
// reachable (see createAdvancedPurchase).
export async function POST(request: Request) {
  const raw = await request.text()
  if (!(await verifyCallbackSignature(raw, request.headers.get("x-signature")))) {
    return Response.json({ error: "Bad signature" }, { status: 401 })
  }

  let id: string | undefined
  try {
    id = (JSON.parse(raw) as { id?: string }).id
  } catch {
    return Response.json({ error: "Bad body" }, { status: 400 })
  }
  if (!id) return Response.json({ ok: true })

  // Re-reads the purchase from CHIP rather than trusting the body.
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin
  const result = await deliverAdvanced(await getPurchase(id), origin)

  // A failed send returns 500 so CHIP retries later.
  if (result === "failed") return Response.json({ error: "Try again" }, { status: 500 })
  return Response.json({ ok: true, result })
}
