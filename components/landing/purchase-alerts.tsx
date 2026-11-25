"use client"

import * as React from "react"
import { BadgeCheck, Download, X } from "lucide-react"

import { useActions } from "@/components/landing/actions"
import { useLang } from "@/lib/i18n"

const FIRST_DELAY = 4000
const SHOW_FOR = 6000
const GAP = 18000
const MAX_PER_VISIT = 4

/**
 * Small bottom-right alerts from real events only (/api/stats → recent): paid
 * Advanced purchases and Basic downloads. Shows nothing when there are none.
 * A few per visit, then stops.
 */
export function PurchaseAlerts() {
  const { t, lang } = useLang()
  const { stats } = useActions()
  const recent = stats.recent
  const [index, setIndex] = React.useState<number | null>(null)
  const [dismissed, setDismissed] = React.useState(false)

  React.useEffect(() => {
    // (With Reduce Motion on, the alert still shows; it just doesn't animate in.)
    if (!recent.length || dismissed) return
    const count = Math.min(recent.length, MAX_PER_VISIT)
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 0; i < count; i++) {
      const start = FIRST_DELAY + i * (SHOW_FOR + GAP)
      timers.push(setTimeout(() => setIndex(i), start))
      timers.push(setTimeout(() => setIndex(null), start + SHOW_FOR))
    }
    return () => timers.forEach(clearTimeout)
  }, [recent, dismissed])

  if (index === null || dismissed) return null
  const item = recent[index]
  if (!item) return null

  return (
    <div
      role="status"
      className="fixed right-4 bottom-4 z-80 flex max-w-[calc(100%-2rem)] animate-in-up items-center gap-3 rounded-2xl border border-border bg-surface py-3 pr-3 pl-3.5 shadow-xl sm:max-w-sm"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-brand">
        {item.kind === "sale" ? <BadgeCheck className="size-5" /> : <Download className="size-5" />}
      </span>
      <div className="min-w-0 text-sm leading-snug">
        {item.kind === "sale" ? (
          <p className="truncate">
            <strong className="font-semibold">{item.name ?? t.alerts.someone}</strong> {t.alerts.bought}
          </p>
        ) : (
          <p className="truncate">
            <strong className="font-semibold">{t.alerts.someone}</strong>
            {item.state ? ` ${t.alerts.from} ${item.state}` : ""} {t.alerts.downloaded}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {timeAgo(item.at, lang === "bm" ? "ms" : "en")}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label={t.alerts.close}
        className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-ink"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

function timeAgo(at: number, locale: string) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  const mins = Math.round((at - Date.now()) / 60000)
  if (mins > -60) return rtf.format(Math.min(mins, -1), "minute")
  const hours = Math.round(mins / 60)
  if (hours > -24) return rtf.format(hours, "hour")
  return rtf.format(Math.round(hours / 24), "day")
}
