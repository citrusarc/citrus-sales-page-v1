import { env } from "@/lib/env"
import { SITE_URL } from "@/lib/site"

// Setup check: what this deployment can use, and whether Upstash answers.
// Shows yes/no only, never a key or token. "default" means the built-in value
// from lib/env.ts is in use (fine for non-secret settings).
export const dynamic = "force-dynamic"

const src = (k: string) => (process.env[k]?.trim() ? "env" : "default")
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
      settings: {
        CHIP_BRAND_ID: src("CHIP_BRAND_ID"),
        CHIP_API_URL: src("CHIP_API_URL"),
        UPSTASH_REDIS_REST_URL: src("UPSTASH_REDIS_REST_URL"),
        MAIL_FROM: src("MAIL_FROM"),
        ADMIN_EMAIL: src("ADMIN_EMAIL"),
      },
      upstashPing: await upstashPing(),
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
