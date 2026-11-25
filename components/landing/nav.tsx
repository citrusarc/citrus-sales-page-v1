"use client"

import * as React from "react"
import { Download } from "lucide-react"

import { useActions } from "@/components/landing/actions"
import { AnnouncementBar } from "@/components/landing/announcement-bar"
import { BrandLogo } from "@/components/landing/brand-logo"
import { useLang } from "@/lib/i18n"
import type { Lang } from "@/lib/dict"
import { cn } from "@/lib/utils"

export function LangToggle({
  dark = false,
  className,
}: {
  dark?: boolean
  className?: string
}) {
  const { lang, setLang } = useLang()
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn(
        "relative grid grid-cols-2 rounded-full p-1 text-xs font-semibold transition-colors",
        dark ? "bg-white/10" : "bg-muted",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out",
          dark ? "bg-white" : "bg-ink",
          lang === "en" && "translate-x-full"
        )}
      />
      {(["bm", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={lang === l}
          onClick={() => setLang(l)}
          className={cn(
            "relative z-10 min-w-10 px-3 py-1.5 uppercase transition-colors",
            lang === l
              ? dark
                ? "text-ink"
                : "text-white"
              : dark
                ? "text-white/70"
                : "text-muted-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export function Nav() {
  const { t } = useLang()
  const { downloadBasic } = useActions()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    // Over the dark hero the bar is see-through; past it, it turns solid.
    const on = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  const links = [
    ["#modul", t.nav.modules],
    ["#doktor", t.nav.doctor],
    ["#harga", t.nav.pricing],
    ["#tutorial", t.nav.tutorial],
    ["#soalan", t.nav.faq],
  ] as const
  const dark = !scrolled

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <AnnouncementBar />
      <div className="px-3 pt-3 sm:px-6 sm:pt-5">
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border py-2 pr-2 pl-4 transition-all duration-300 sm:pl-5",
            dark
              ? "border-transparent text-white"
              : "border-border bg-white/85 text-ink shadow-[0_8px_30px_rgb(0_0_0/0.06)] backdrop-blur-md"
          )}
        >
          <a
            href="#"
            className="flex items-center gap-2.5"
            aria-label="Citrus Arc"
          >
            <BrandLogo className="h-7 w-auto" />
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              Meta Ads Skill
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  dark
                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                    : "text-muted-foreground hover:bg-brand hover:text-white"
                )}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LangToggle dark={dark} />
            <button
              onClick={downloadBasic}
              className="hidden items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep sm:flex"
            >
              <Download className="size-4" />
              {t.nav.cta}
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
