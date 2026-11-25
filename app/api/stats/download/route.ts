import { cookies } from "next/headers"

import { incr, KEY } from "@/lib/kv"

const COUNTED = "ca_dl"

// Counts a Basic download, once per browser, so repeat clicks don't inflate it.
export async function POST() {
  const jar = await cookies()
  if (jar.has(COUNTED)) return new Response(null, { status: 204 })
  try {
    await incr(KEY.downloads)
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
