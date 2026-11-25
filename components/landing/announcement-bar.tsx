"use client"

import * as React from "react"
import { ArrowRight, X } from "lucide-react"

import { useActions } from "@/components/landing/actions"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const DISMISS_KEY = "ca-banner-dismissed"

/**
 * Top bar announcing the real launch price (PRICING.launch). Collapses once
 * the visitor scrolls, can be dismissed, and is gone when the launch ends.
 */
export function AnnouncementBar() {
  const { t, lang } = useLang()
  const { price, priceLabel, openBuy } = useActions()
  const ends = price.launchEndsAt
  const [dismissed, setDismissed] = React.useState(true) // until checked, so SSR and first paint match
  const [atTop, setAtTop] = React.useState(true)

  React.useEffect(() => {
    if (!ends) return
    const id = setTimeout(() => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem(DISMISS_KEY)
      } catch {}
      setDismissed(saved === ends)
    }, 0)
    const on = () => setAtTop(window.scrollY < 40)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => {
      clearTimeout(id)
      window.removeEventListener("scroll", on)
    }
  }, [ends])

  if (!ends) return null

  const date = new Intl.DateTimeFormat(lang === "bm" ? "ms-MY" : "en-MY", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(Date.parse(ends))
  const fill = (s: string) =>
    s.replace("{price}", priceLabel).replace("{regular}", `RM${price.regularRM}`).replace("{date}", date)
  const open = !dismissed && atTop

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
      aria-hidden={!open}
    >
      <div className="overflow-hidden">
        <div className="relative flex items-center justify-center gap-3 bg-brand px-10 py-2.5 text-center text-sm text-white">
          <p className="leading-snug">
            {/* one line on phones, the full sentence from sm up */}
            <span className="sm:hidden">{fill(t.banner.short)}</span>
            <span className="hidden sm:inline">{fill(t.banner.text)}</span>{" "}
            <button
              onClick={openBuy}
              tabIndex={open ? 0 : -1}
              className="inline-flex items-center gap-1 font-semibold underline decoration-white/40 underline-offset-2 hover:decoration-white"
            >
              {t.banner.cta} <ArrowRight className="size-3.5" />
            </button>
          </p>
          <button
            onClick={() => {
              setDismissed(true)
              try {
                localStorage.setItem(DISMISS_KEY, ends)
              } catch {}
            }}
            tabIndex={open ? 0 : -1}
            aria-label={t.banner.close}
            className="absolute right-3 grid size-7 place-items-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
