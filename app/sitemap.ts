import type { MetadataRoute } from "next"

import { LEGAL_UPDATED } from "@/lib/legal"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/terma`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privasi`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ]
}
