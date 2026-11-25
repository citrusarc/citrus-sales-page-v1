import type { Metadata } from "next"

import { LegalView } from "@/components/landing/legal-view"
import { LEGAL } from "@/lib/legal"

export const metadata: Metadata = {
  title: `${LEGAL.terms.bm.title} — Meta Ads Skill · Citrus Arc`,
  description: LEGAL.terms.bm.description,
}

export default function TermsPage() {
  return <LegalView kind="terms" />
}
