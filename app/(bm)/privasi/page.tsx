import type { Metadata } from "next"

import { LegalView } from "@/components/landing/legal-view"
import { LEGAL } from "@/lib/legal"
import { OG_IMAGE } from "@/lib/site"

export const metadata: Metadata = {
  title: `${LEGAL.privacy.bm.title} — Meta Ads Skill · Citrus Arc`,
  description: LEGAL.privacy.bm.description,
  alternates: { canonical: "/privasi" },
  // Page-level openGraph replaces the layout's, so the image is repeated here.
  openGraph: { url: "/privasi", images: [OG_IMAGE] },
}

export default function PrivacyPage() {
  return <LegalView kind="privacy" />
}
