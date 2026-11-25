import type { Metadata } from "next"

import { Home } from "@/components/landing/home"
import { homeMetadata } from "@/lib/seo"

// Re-render every 5 minutes so the launch price ends on time.
export const revalidate = 300

export const metadata: Metadata = homeMetadata("en")

export default function Page() {
  return <Home lang="en" />
}
