import type { Metadata } from "next"

import type { Lang } from "@/lib/dict"
import { SITE_NAME, SITE_URL, STUDIO } from "@/lib/site"

/** hreflang pairs for the two home pages. */
export const HOME_LANGUAGES = { "ms-MY": "/", "en-MY": "/en", "x-default": "/" }

const COPY = {
  bm: {
    title: "Meta Ads Skill untuk Claude — Citrus Arc Studio",
    description:
      "Skill Claude untuk owner SME Malaysia: pilih objective, tulis hook BM, baca result Ads Manager dan audit akaun Facebook & Instagram. Basic percuma.",
    og: "Skill Claude untuk owner SME Malaysia. Basic percuma, Advanced untuk audit akaun penuh.",
    locale: "ms_MY",
    alt: "en_MY",
  },
  en: {
    title: "Meta Ads Skill for Claude — Citrus Arc Studio",
    description:
      "A Claude skill for Malaysian SME owners: pick the right objective, write hooks, read Ads Manager results and audit Facebook & Instagram ad accounts. Basic is free.",
    og: "A Claude skill for Malaysian SME owners. Basic is free; Advanced adds full account audits.",
    locale: "en_MY",
    alt: "ms_MY",
  },
} as const

/** Site-wide defaults for a root layout (no canonical here: each page sets its own). */
export function layoutMetadata(lang: Lang): Metadata {
  const c = COPY[lang]
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: c.title, template: `%s · ${STUDIO.name}` },
    description: c.description,
    applicationName: SITE_NAME,
    authors: [{ name: STUDIO.name, url: STUDIO.url }],
    creator: STUDIO.name,
    publisher: STUDIO.name,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      title: c.title,
      description: c.og,
      siteName: STUDIO.name,
      locale: c.locale,
      alternateLocale: [c.alt],
      type: "website",
    },
    twitter: { card: "summary_large_image", site: "@citrusarcstudio", creator: "@citrusarcstudio" },
    category: "business",
  }
}

/** Metadata for a home page: its own canonical plus the BM/EN hreflang pair. */
export function homeMetadata(lang: Lang): Metadata {
  const path = lang === "en" ? "/en" : "/"
  return {
    alternates: { canonical: path, languages: HOME_LANGUAGES },
    openGraph: { ...layoutMetadata(lang).openGraph, url: path },
  }
}
