"use client"

import { Rich } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { CONSENT_KEY } from "@/lib/site"

/**
 * Asks before Google Analytics may set cookies (same approach as
 * citrusarc.studio). Until the visitor chooses, Consent Mode keeps
 * analytics_storage denied, so GA runs cookieless. The notice is in the server
 * HTML, hidden; a script in <head> sets <html data-consent="ask"> when no
 * choice is saved, which shows it before the first paint.
 */
export function CookieConsent() {
  const { t } = useLang()
  const c = t.cookies

  const choose = (choice: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, choice)
    } catch {}
    window.gtag?.("consent", "update", { analytics_storage: choice })
    document.documentElement.removeAttribute("data-consent")
  }

  return (
    <div
      role="region"
      aria-label={c.label}
      className="fixed right-4 bottom-4 left-4 z-95 hidden flex-col gap-4 rounded-2xl border border-white/15 bg-ink/95 p-5 text-white shadow-2xl backdrop-blur-md in-data-[consent=ask]:flex sm:right-auto sm:max-w-md"
    >
      <p className="text-sm leading-relaxed text-white/85">
        {c.message} <Rich text={c.privacyLink} />
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="flex-1 rounded-full border border-brand bg-brand px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white hover:text-brand"
        >
          {c.accept}
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="flex-1 rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
        >
          {c.decline}
        </button>
      </div>
    </div>
  )
}
