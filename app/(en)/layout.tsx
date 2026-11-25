import type { Metadata, Viewport } from "next"

import { Document } from "@/components/document"
import { layoutMetadata } from "@/lib/seo"

// Root layout for the English home page, /en.
export const metadata: Metadata = layoutMetadata("en")
export const viewport: Viewport = { themeColor: "#0a0a0a" }

export default function EnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Document lang="en">{children}</Document>
}
