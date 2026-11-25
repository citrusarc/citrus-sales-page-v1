import type { Metadata, Viewport } from "next"

import { Document } from "@/components/document"
import { layoutMetadata } from "@/lib/seo"

// Root layout for the BM pages: /, /terma, /privasi, /terima-kasih.
// (/en has its own root layout so its <html lang> is "en".)
export const metadata: Metadata = layoutMetadata("bm")
export const viewport: Viewport = { themeColor: "#0a0a0a" }

export default function BmLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Document lang="bm">{children}</Document>
}
