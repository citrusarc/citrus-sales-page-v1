import type { Metadata } from "next"

import { LegalView } from "@/components/landing/legal-view"
import { LEGAL } from "@/lib/legal"
import { OG_IMAGE } from "@/lib/site"

export const metadata: Metadata = {
  title: `${LEGAL.terms.bm.title} — Meta Ads Skill · Citrus Arc`,
  description: LEGAL.terms.bm.description,
  alternates: { canonical: "/terma" },
  // Page-level openGraph replaces the layout's, so the image is repeated here.
  openGraph: { url: "/terma", images: [OG_IMAGE] },
}

export default function TermsPage() {
  return <LegalView kind="terms" />
}
