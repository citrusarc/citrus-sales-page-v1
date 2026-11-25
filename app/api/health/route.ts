import { env, settingsSet } from "@/lib/env"
import { SITE_URL } from "@/lib/site"

// Setup check: what this deployment can use, and whether Upstash answers.
// Shows yes/no only, never a key or token. For settings, "set" means a value
// came from Cloudflare (Build or runtime); "default" means lib/env.ts's
// built-in value is used (fine for non-secret settings).
export const dynamic = "force-dynamic"

const secret = (k: string) => Boolean(process.env[k]?.trim())

async function upstashPing() {
  const url = env.upstashUrl()
  const token = env.upstashToken()
  if (!token) return "skipped (UPSTASH_REDIS_REST_TOKEN not set)"
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(["PING"]),
      cache: "no-store",
    })
    const body = (await res.json().catch(() => ({}))) as { result?: string; error?: string }
    return res.ok ? body.result : `HTTP ${res.status}${body.error ? `: ${body.error}` : ""}`
  } catch (err) {
    return `failed: ${err instanceof Error ? err.name : "error"}`
  }
}

export async function GET() {
  return Response.json(
    {
      siteUrl: SITE_URL,
      secrets: {
        CHIP_API_KEY: secret("CHIP_API_KEY"),
        MAILJET_API_KEY: secret("MAILJET_API_KEY"),
        MAILJET_API_SECRET: secret("MAILJET_API_SECRET"),
        UPSTASH_REDIS_REST_TOKEN: secret("UPSTASH_REDIS_REST_TOKEN"),
      },
      settings: Object.fromEntries(Object.entries(settingsSet()).map(([k, v]) => [k, v ? "set" : "default"])),
      upstashPing: await upstashPing(),
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
