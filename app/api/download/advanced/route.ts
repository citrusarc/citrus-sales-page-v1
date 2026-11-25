import { readFile } from "node:fs/promises"
import path from "node:path"
import { cookies } from "next/headers"

import { getPurchase, isPaidAdvanced } from "@/lib/chip"
import { ADVANCED, PURCHASE_COOKIE } from "@/lib/product"

export async function GET(request: Request) {
  const jar = await cookies()
  const id = new URL(request.url).searchParams.get("id") || jar.get(PURCHASE_COOKIE)?.value

  if (!id || !isPaidAdvanced(await getPurchase(id))) {
    return new Response("Pembayaran tidak dijumpai / Payment not found.", { status: 403 })
  }

  const file = await readFile(path.join(process.cwd(), "private", ADVANCED.file))
  return new Response(file, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${ADVANCED.file}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
