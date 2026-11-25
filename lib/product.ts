// Single source of truth for what is sold and for how much.
export const ADVANCED = {
  reference: "meta-ads-advanced",
  name: "Meta Ads Advanced — Claude Skill",
  // RM, whole ringgit. CHIP takes cents, see lib/chip.ts.
  priceRM: 29,
  file: "meta-ads-advanced.zip",
} as const

export const BASIC = {
  name: "meta-ads-basic",
  href: "/downloads/meta-ads-basic.zip",
} as const

export const PURCHASE_COOKIE = "ca_purchase"

// Public counts are real (lib/kv.ts) and only shown once they reach these
// numbers, since a tiny figure like "2 buyers" works against the page.
export const STATS_MIN = { downloads: 20, sales: 5 } as const

// Same contact details as citrusarc.studio (citrus-arc-studio/config/site.ts).
export const CONTACT = {
  email: "hello@citrusarc.studio",
  whatsapp: "https://wa.me/601159956435",
  instagram: "https://www.instagram.com/citrusarcstudio",
  site: "https://citrusarc.studio",
} as const
