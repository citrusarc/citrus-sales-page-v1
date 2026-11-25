import { SITE_URL } from "@/lib/site"

// Setup check: which services this deployment can see, and whether Upstash
// answers. Shows yes/no only, never a key or token.
export const dynamic = "force-dynamic"

const has = (k: string) => Boolean(process.env[k]?.trim())

async function upstash() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim() ?? ""
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? ""
  const out: Record<string, unknown> = {
    UPSTASH_REDIS_REST_URL: Boolean(url),
    UPSTASH_REDIS_REST_TOKEN: Boolean(token),
    urlLooksRight: /^https:\/\/[a-z0-9.-]+\.upstash\.io\/?$/i.test(url),
    hasQuotes: /["']/.test(url) || /["']/.test(token),
  }
  if (!url || !token) return { ...out, ping: "skipped (not set)" }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(["PING"]),
      cache: "no-store",
    })
    const body = (await res.json().catch(() => ({}))) as { result?: string; error?: string }
    return { ...out, ping: res.ok ? body.result : `HTTP ${res.status}${body.error ? `: ${body.error}` : ""}` }
  } catch (err) {
    return { ...out, ping: `failed: ${err instanceof Error ? err.name : "error"}` }
  }
}

export async function GET() {
  return Response.json(
    {
      siteUrl: SITE_URL,
      chip: { CHIP_API_KEY: has("CHIP_API_KEY"), CHIP_BRAND_ID: has("CHIP_BRAND_ID") },
      mailjet: {
        MAILJET_API_KEY: has("MAILJET_API_KEY"),
        MAILJET_API_SECRET: has("MAILJET_API_SECRET"),
        MAIL_FROM: has("MAIL_FROM"),
        ADMIN_EMAIL: has("ADMIN_EMAIL"),
      },
      upstash: await upstash(),
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
