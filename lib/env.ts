// Server-side settings.
//
// Non-secret settings can be set as Cloudflare *Build* variables: next.config.ts
// bakes them into the server code at build time (Cloudflare git deploys drop
// plain runtime Variables, but Build variables persist). Each also has a
// built-in default, so the site works even if none are set. The references
// below must stay written out as process.env.NAME for the baking to work.
//
// Real secrets (CHIP_API_KEY, MAILJET_API_KEY/SECRET, UPSTASH_REDIS_REST_TOKEN)
// are read at runtime and must be Cloudflare *Secrets*.

import { CONTACT } from "@/lib/product"

const clean = (v: string | undefined) => v?.trim() || undefined

export const DEFAULTS = {
  CHIP_API_URL: "https://gate.chip-in.asia/api/v1",
  /** Citrus Arc Studio brand on CHIP (an ID, not a secret; the API key decides test vs live). */
  CHIP_BRAND_ID: "75d28d7e-adeb-4ab3-88d0-8099fc7ba732",
  /** Upstash database address (not a secret; the token is). */
  UPSTASH_REDIS_REST_URL: "https://artistic-sawfly-95335.upstash.io",
  MAIL_FROM: "noreply@citrusarc.studio",
  MAIL_FROM_NAME: "Citrus Arc Studio",
  /** Gets the "Jualan baru" email. */
  ADMIN_EMAIL: CONTACT.email,
} as const

/** Settings actually set (build or runtime), for /api/health. */
export const settingsSet = () => ({
  CHIP_API_URL: Boolean(clean(process.env.CHIP_API_URL)),
  CHIP_BRAND_ID: Boolean(clean(process.env.CHIP_BRAND_ID)),
  UPSTASH_REDIS_REST_URL: Boolean(clean(process.env.UPSTASH_REDIS_REST_URL)),
  MAIL_FROM: Boolean(clean(process.env.MAIL_FROM)),
  MAIL_FROM_NAME: Boolean(clean(process.env.MAIL_FROM_NAME)),
  ADMIN_EMAIL: Boolean(clean(process.env.ADMIN_EMAIL)),
})

export const env = {
  chipApiUrl: () => (clean(process.env.CHIP_API_URL) ?? DEFAULTS.CHIP_API_URL).replace(/\/$/, ""),
  chipBrandId: () => clean(process.env.CHIP_BRAND_ID) ?? DEFAULTS.CHIP_BRAND_ID,
  chipApiKey: () => clean(process.env.CHIP_API_KEY),
  upstashUrl: () => clean(process.env.UPSTASH_REDIS_REST_URL) ?? DEFAULTS.UPSTASH_REDIS_REST_URL,
  upstashToken: () => clean(process.env.UPSTASH_REDIS_REST_TOKEN),
  mailFrom: () => clean(process.env.MAIL_FROM) ?? DEFAULTS.MAIL_FROM,
  mailFromName: () => clean(process.env.MAIL_FROM_NAME) ?? DEFAULTS.MAIL_FROM_NAME,
  adminEmail: () => clean(process.env.ADMIN_EMAIL) ?? DEFAULTS.ADMIN_EMAIL,
}
