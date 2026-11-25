import type { NextConfig } from "next"

// Non-secret settings that may be set as Cloudflare *Build* variables. They are
// baked into the server code here so they exist at runtime too (Build
// variables persist across git deploys; plain runtime Variables don't). Only
// the ones set at build time are baked; the rest fall back to lib/env.ts.
// Never list secrets here.
const BUILD_SETTINGS = [
  "CHIP_API_URL",
  "CHIP_BRAND_ID",
  "UPSTASH_REDIS_REST_URL",
  "MAIL_FROM",
  "MAIL_FROM_NAME",
  "ADMIN_EMAIL",
] as const

const nextConfig: NextConfig = {
  // The paid zip (private/) is bundled into server code at build time by
  // scripts/embed-zip.mjs, so it works on Cloudflare Workers too.
  env: Object.fromEntries(
    BUILD_SETTINGS.filter((k) => process.env[k]?.trim()).map((k) => [k, process.env[k]!.trim()])
  ),
}

export default nextConfig
