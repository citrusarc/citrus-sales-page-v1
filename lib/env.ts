// Server-side settings. Cloudflare git deploys drop dashboard *Variables*
// (only *Secrets* survive), so every non-secret setting has a built-in default
// here and the site keeps working after any deploy. Env values still win when
// set. Real secrets (CHIP_API_KEY, MAILJET_API_KEY/SECRET,
// UPSTASH_REDIS_REST_TOKEN) must be Cloudflare *Secrets*.

import { CONTACT } from "@/lib/product"

const read = (k: string) => process.env[k]?.trim() || undefined

export const env = {
  chipApiUrl: () => (read("CHIP_API_URL") ?? "https://gate.chip-in.asia/api/v1").replace(/\/$/, ""),
  /** Citrus Arc Studio brand on CHIP (an ID, not a secret; the API key decides test vs live). */
  chipBrandId: () => read("CHIP_BRAND_ID") ?? "75d28d7e-adeb-4ab3-88d0-8099fc7ba732",
  chipApiKey: () => read("CHIP_API_KEY"),
  /** Upstash database address (not a secret; the token is). */
  upstashUrl: () => read("UPSTASH_REDIS_REST_URL") ?? "https://artistic-sawfly-95335.upstash.io",
  upstashToken: () => read("UPSTASH_REDIS_REST_TOKEN"),
  mailFrom: () => read("MAIL_FROM") ?? "noreply@citrusarc.studio",
  mailFromName: () => read("MAIL_FROM_NAME") ?? "Citrus Arc Studio",
  /** Gets the "Jualan baru" email. Falls back to the studio inbox. */
  adminEmail: () => read("ADMIN_EMAIL") ?? CONTACT.email,
}
