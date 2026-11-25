// Single source of truth for what is sold and for how much.
export const ADVANCED = {
  reference: "meta-ads-advanced",
  name: "Meta Ads Advanced — Claude Skill",
  file: "meta-ads-advanced.zip",
} as const

// Price in whole ringgit (CHIP takes sen, see lib/chip.ts). During the launch
// window the launch price applies everywhere, including what CHIP charges;
// after `endsAt` the regular price applies automatically. Set launch to null
// to drop it.
export const PRICING: { regularRM: number; launch: { priceRM: number; endsAt: string } | null } = {
  regularRM: 29,
  launch: { priceRM: 19, endsAt: "2026-12-31T23:59:59+08:00" },
}

export type Price = { priceRM: number; regularRM: number; launchEndsAt: string | null }

export function currentPrice(now = Date.now()): Price {
  const l = PRICING.launch
  const live = l && now < Date.parse(l.endsAt) ? l : null
  return {
    priceRM: live ? live.priceRM : PRICING.regularRM,
    regularRM: PRICING.regularRM,
    launchEndsAt: live ? live.endsAt : null,
  }
}

export const BASIC = {
  name: "meta-ads-basic",
  href: "/downloads/meta-ads-basic.zip",
} as const

export const PURCHASE_COOKIE = "ca_purchase"

// Public counts are real (lib/kv.ts) and shown once they reach these numbers.
// Raise them if you'd rather hide small figures early on.
// Buyers stay hidden until there are enough to look good; downloads show from 1.
export const STATS_MIN = { downloads: 1, sales: 10 } as const

// Same contact details as citrusarc.studio (citrus-arc-studio/config/site.ts).
export const CONTACT = {
  email: "hello@citrusarc.studio",
  whatsapp: "https://wa.me/601159956435",
  instagram: "https://www.instagram.com/citrusarcstudio",
  site: "https://citrusarc.studio",
} as const
