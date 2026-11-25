import { Geist, Geist_Mono } from "next/font/google"

import "@/app/globals.css"
import { CookieConsent } from "@/components/landing/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import type { Lang } from "@/lib/dict"
import { LangProvider } from "@/lib/i18n"
import { CONSENT_KEY, GTM_ID } from "@/lib/site"
import { cn } from "@/lib/utils"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

// Before first paint: show the cookie notice if no choice is saved yet.
const askConsent = `(function(){var c=null;try{c=localStorage.getItem('${CONSENT_KEY}')}catch(e){}if(c!=='granted'&&c!=='denied')document.documentElement.setAttribute('data-consent','ask')})();`

// A visitor who chose English lands on /en instead of the BM home page.
const englishHome = `(function(){try{if(location.pathname==='/'&&localStorage.getItem('ca-lang')==='en')location.replace('/en'+location.search+location.hash)}catch(e){}})();`

// Consent Mode default (queued before GTM loads), then the standard GTM loader,
// started once the page has loaded and the browser is idle so it doesn't
// compete with the page itself. Events pushed before then are kept in the
// dataLayer and replayed by GTM.
// Analytics cookies stay off until the visitor allows them; ads storage is
// always denied.
const gtm = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;var c=null;try{c=localStorage.getItem('${CONSENT_KEY}')}catch(e){}gtag('consent','default',{analytics_storage:c==='granted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});function go(){var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)}function later(){(w.requestIdleCallback||function(c){setTimeout(c,1)})(go,{timeout:3000})}d.readyState==='complete'?later():w.addEventListener('load',later)})(window,document,'script','dataLayer','${GTM_ID}');`

// Analytics only on the real site, not `next dev`.
const ANALYTICS = process.env.NODE_ENV === "production"

/** The <html> shell shared by the BM and EN root layouts. */
export function Document({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html
      lang={lang === "en" ? "en" : "ms"}
      suppressHydrationWarning
      className={cn("antialiased", "light", sans.variable, mono.variable)}
    >
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout shell */}
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: askConsent + (lang === "bm" ? englishHome : "") + (ANALYTICS ? gtm : "") }}
        />
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
          <LangProvider initial={lang}>
            {children}
            {ANALYTICS && <CookieConsent />}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
