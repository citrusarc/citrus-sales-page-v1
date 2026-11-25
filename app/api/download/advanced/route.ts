import { cookies } from "next/headers"

import { advancedZipBytes } from "@/lib/advanced-zip"
import { getPurchase, isPaidAdvanced } from "@/lib/chip"
import { ADVANCED, PURCHASE_COOKIE } from "@/lib/product"

export async function GET(request: Request) {
  const jar = await cookies()
  const id = new URL(request.url).searchParams.get("id") || jar.get(PURCHASE_COOKIE)?.value

  if (!id || !isPaidAdvanced(await getPurchase(id))) {
    return new Response("Pembayaran tidak dijumpai / Payment not found.", { status: 403 })
  }

  return new Response(advancedZipBytes(), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${ADVANCED.file}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
