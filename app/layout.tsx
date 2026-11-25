import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LangProvider } from "@/lib/i18n"
import { ADVANCED } from "@/lib/product"
import { cn } from "@/lib/utils"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Meta Ads Skill untuk Claude — Citrus Arc",
  description:
    "Ajar Claude jadi pakar Facebook & Instagram Ads untuk bisnes anda. Skill Basic percuma, Advanced untuk audit akaun, creative, testing, WhatsApp funnel & compliance Malaysia.",
  openGraph: {
    title: "Meta Ads Skill untuk Claude — Citrus Arc",
    description: `Skill Claude untuk owner SME Malaysia. Basic percuma, Advanced RM${ADVANCED.priceRM}.`,
    locale: "ms_MY",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ms"
      suppressHydrationWarning
      className={cn("antialiased", "light", sans.variable, mono.variable)}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          <LangProvider>{children}</LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
