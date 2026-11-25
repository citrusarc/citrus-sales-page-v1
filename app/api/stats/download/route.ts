import { cookies, headers } from "next/headers"

import { incr, KEY, pushCapped } from "@/lib/kv"
import { malaysianState } from "@/lib/region"

const COUNTED = "ca_dl"

// Counts a Basic download, once per browser, so repeat clicks don't inflate it,
// and adds it to the download alerts (state name and time only).
export async function POST() {
  const jar = await cookies()
  if (jar.has(COUNTED)) return new Response(null, { status: 204 })
  try {
    await incr(KEY.downloads)
    const state = malaysianState(await headers())
    await pushCapped(KEY.recentDownloads, JSON.stringify({ state, at: Date.now() }), 30)
  } catch (err) {
    console.error("Download count failed", err)
    return new Response(null, { status: 204 })
  }
  jar.set(COUNTED, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
  return new Response(null, { status: 204 })
}
