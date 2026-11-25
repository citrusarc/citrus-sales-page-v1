// JSON-LD for search and answer engines. Server-rendered (app/page.tsx) so
// crawlers that never run JavaScript still read it. The page's server HTML is
// in BM, so the FAQ here is the BM one, matching what's visible.

import { dict } from "@/lib/dict"
import type { Price } from "@/lib/product"
import { SITE_NAME, SITE_URL, STUDIO } from "@/lib/site"

export function homeSchema(price: Price) {
  const bm = dict.bm
  const image = `${SITE_URL}/opengraph-image.png`
  const offer = (name: string, priceRM: number, validUntil?: string | null) => ({
    "@type": "Offer",
    name,
    price: priceRM.toFixed(2),
    priceCurrency: "MYR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/#harga`,
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
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: "Meta Ads Skill untuk Claude — Citrus Arc Studio",
        inLanguage: "ms-MY",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: [{ "@id": `${SITE_URL}/#basic` }, { "@id": `${SITE_URL}/#advanced` }],
        primaryImageOfPage: image,
      },
      product(
        "basic",
        "Meta Ads Basic — Claude Skill",
        "Skill Claude percuma untuk owner SME Malaysia: pilih objective, tulis hook dan ads dalam BM atau English, baca result Ads Manager, semak landing page.",
        offer("Meta Ads Basic", 0)
      ),
      product(
        "advanced",
        "Meta Ads Advanced — Claude Skill",
        "Semua dalam Basic, tambah audit akaun penuh dari CSV Ads Manager, analisis creative, anomali & fatigue, testing & scaling, funnel Click-to-WhatsApp, compliance Malaysia (KKLIU, halal, PDPA), riset competitor dan laporan mingguan.",
        offer("Meta Ads Advanced", price.priceRM, price.launchEndsAt)
      ),
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        inLanguage: "ms-MY",
        mainEntity: bm.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  }
}
