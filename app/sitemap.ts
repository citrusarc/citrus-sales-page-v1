import type { MetadataRoute } from "next"

import { LEGAL_UPDATED } from "@/lib/legal"
import { HOME_LANGUAGES } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...(["/", "/en"] as const).map((path) => ({
      url: `${SITE_URL}${path === "/" ? "/" : path}`,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(Object.entries(HOME_LANGUAGES).map(([k, v]) => [k, `${SITE_URL}${v}`])),
      },
    })),
    { url: `${SITE_URL}/terma`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privasi`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ]
}
