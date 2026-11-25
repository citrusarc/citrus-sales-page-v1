// JSON-LD for search and answer engines. Server-rendered with each home page
// ("/" BM, "/en" EN) so crawlers that never run JavaScript still read it, in
// the same language as the visible page.

import { dict, type Lang } from "@/lib/dict"
import type { Price } from "@/lib/product"
import { OG_IMAGE, SITE_NAME, SITE_URL, STUDIO } from "@/lib/site"

const PRODUCT_COPY = {
  bm: {
    pageName: "Meta Ads Skill untuk Claude — Citrus Arc Studio",
    basic:
      "Skill Claude percuma untuk owner SME Malaysia: pilih objective, tulis hook dan ads dalam BM atau English, baca result Ads Manager, semak landing page.",
    advanced:
      "Semua dalam Basic, tambah audit akaun penuh dari CSV Ads Manager, analisis creative, anomali & fatigue, testing & scaling, funnel Click-to-WhatsApp, compliance Malaysia (KKLIU, halal, PDPA), riset competitor dan laporan mingguan.",
  },
  en: {
    pageName: "Meta Ads Skill for Claude — Citrus Arc Studio",
    basic:
      "Free Claude skill for Malaysian SME owners: choose the right objective, write hooks and ads in Malay or English, read Ads Manager results, check the landing page.",
    advanced:
      "Everything in Basic plus a full account audit from an Ads Manager CSV, creative analysis, anomaly and fatigue checks, testing and scaling, Click-to-WhatsApp funnel, Malaysian compliance (KKLIU, halal, PDPA), competitor research and weekly reports.",
  },
} as const

export function homeSchema(price: Price, lang: Lang) {
  const d = dict[lang]
  const c = PRODUCT_COPY[lang]
  const pageUrl = lang === "en" ? `${SITE_URL}/en` : `${SITE_URL}/`
  const inLanguage = lang === "en" ? "en-MY" : "ms-MY"
  const image = `${SITE_URL}${OG_IMAGE.url}`
  const offer = (name: string, priceRM: number, validUntil?: string | null) => ({
    "@type": "Offer",
    name,
    price: priceRM.toFixed(2),
    priceCurrency: "MYR",
    availability: "https://schema.org/InStock",
    url: `${pageUrl}#harga`,
    seller: { "@id": STUDIO.id },
    ...(validUntil ? { priceValidUntil: validUntil.slice(0, 10) } : {}),
  })
  const product = (id: string, name: string, description: string, o: object) => ({
    "@type": "Product",
    "@id": `${SITE_URL}/#${id}`,
    name,
    description,
    image,
    category: "Claude Skill / Facebook & Instagram ads",
    brand: { "@type": "Brand", name: STUDIO.name },
    manufacturer: { "@id": STUDIO.id },
    offers: o,
  })

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": STUDIO.id,
        name: STUDIO.name,
        legalName: STUDIO.legalName,
        url: STUDIO.url,
        logo: STUDIO.logo,
        email: STUDIO.email,
        telephone: STUDIO.phone,
        identifier: { "@type": "PropertyValue", propertyID: "SSM", value: STUDIO.registration },
        address: {
          "@type": "PostalAddress",
          addressLocality: STUDIO.locality,
          addressRegion: STUDIO.region,
          addressCountry: STUDIO.country,
        },
        sameAs: STUDIO.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: ["ms-MY", "en-MY"],
        publisher: { "@id": STUDIO.id },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: c.pageName,
        inLanguage,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: [{ "@id": `${SITE_URL}/#basic` }, { "@id": `${SITE_URL}/#advanced` }],
        primaryImageOfPage: image,
      },
      product(
        "basic",
        "Meta Ads Basic — Claude Skill",
        c.basic,
        offer("Meta Ads Basic", 0)
      ),
      product(
        "advanced",
        "Meta Ads Advanced — Claude Skill",
        c.advanced,
        offer("Meta Ads Advanced", price.priceRM, price.launchEndsAt)
      ),
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage,
        mainEntity: d.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  }
}
