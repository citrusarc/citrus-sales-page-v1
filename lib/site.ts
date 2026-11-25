// Site-wide facts for SEO, structured data and llms.txt. Business details match
// citrusarc.studio (citrus-arc-studio/config/site.ts), so search and answer
// engines tie this site to the same Citrus Arc Studio entity.

/** Public URL of this site. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")

export const SITE_NAME = "Meta Ads Skill untuk Claude"

export const STUDIO = {
  name: "Citrus Arc Studio",
  legalName: "CITRUS ARC STUDIO",
  url: "https://citrusarc.studio",
  /** The @id citrusarc.studio uses for the business, so both sites point at one entity. */
  id: "https://citrusarc.studio/#organization",
  logo: "https://citrusarc.studio/Images/brand-logo.png",
  email: "hello@citrusarc.studio",
  phone: "+601159956435",
  registration: "202503267271 (003780123-A)",
  locality: "Cyberjaya",
  region: "Selangor",
  country: "MY",
  sameAs: [
    "https://www.instagram.com/citrusarcstudio",
    "https://www.threads.com/@citrusarcstudio",
    "https://www.linkedin.com/company/citrus-arc-studio",
    "https://x.com/citrusarcstudio",
    "https://www.google.com/search?kgmid=/g/11zz3h33bc",
  ],
} as const

/** Google Tag Manager container. Loads in production builds only. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-K9CKZQXK"

/** localStorage key for the analytics choice (same name as citrusarc.studio). */
export const CONSENT_KEY = "cas-analytics-consent"
