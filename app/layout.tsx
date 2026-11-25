import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { CookieConsent } from "@/components/landing/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import { LangProvider } from "@/lib/i18n"
import { CONSENT_KEY, GTM_ID, SITE_NAME, SITE_URL, STUDIO } from "@/lib/site"
import { cn } from "@/lib/utils"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const TITLE = "Meta Ads Skill untuk Claude — Citrus Arc Studio"
const DESCRIPTION =
  "Skill Claude untuk owner SME Malaysia: pilih objective, tulis hook BM, baca result Ads Manager dan audit akaun Facebook & Instagram. Basic percuma."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${STUDIO.name}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: STUDIO.name, url: STUDIO.url }],
  creator: STUDIO.name,
  publisher: STUDIO.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    title: TITLE,
    description: "Skill Claude untuk owner SME Malaysia. Basic percuma, Advanced untuk audit akaun penuh.",
    url: "/",
    siteName: STUDIO.name,
    locale: "ms_MY",
    alternateLocale: ["en_MY"],
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@citrusarcstudio", creator: "@citrusarcstudio" },
  category: "business",
}

export const viewport: Viewport = { themeColor: "#0a0a0a" }

// Before first paint: show the cookie notice if no choice is saved yet.
const askConsent = `(function(){var c=null;try{c=localStorage.getItem('${CONSENT_KEY}')}catch(e){}if(c!=='granted'&&c!=='denied')document.documentElement.setAttribute('data-consent','ask')})();`

// Consent Mode default (queued before GTM loads), then the standard GTM loader.
// Analytics cookies stay off until the visitor allows them; ads storage is
// always denied.
const gtm = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;var c=null;try{c=localStorage.getItem('${CONSENT_KEY}')}catch(e){}gtag('consent','default',{analytics_storage:c==='granted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`

// Analytics only on the real site, not `next dev`.
const ANALYTICS = process.env.NODE_ENV === "production"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms" suppressHydrationWarning className={cn("antialiased", "light", sans.variable, mono.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: askConsent + (ANALYTICS ? gtm : "") }} />
      </head>
      <body>
        {ANALYTICS && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          <LangProvider>
            {children}
            {ANALYTICS && <CookieConsent />}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
