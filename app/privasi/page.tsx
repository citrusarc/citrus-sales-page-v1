import type { Metadata } from "next"

import { LegalView } from "@/components/landing/legal-view"
import { LEGAL } from "@/lib/legal"

export const metadata: Metadata = {
  title: `${LEGAL.privacy.bm.title} — Meta Ads Skill · Citrus Arc`,
  description: LEGAL.privacy.bm.description,
}

export default function PrivacyPage() {
  return <LegalView kind="privacy" />
}
