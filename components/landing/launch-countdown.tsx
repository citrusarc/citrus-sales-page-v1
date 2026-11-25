"use client"

import * as React from "react"
import { Timer } from "lucide-react"

import { useActions } from "@/components/landing/actions"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function useNow(active: boolean) {
  // null until mounted, so server and browser render the same HTML.
  const [now, setNow] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (!active) return
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [active])
  return now
}

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

/**
 * The real launch deadline from lib/product.ts (PRICING.launch). Renders
 * nothing once the launch has ended.
 */
export function LaunchCountdown({ variant }: { variant: "hero" | "card" }) {
  const { price } = useActions()
  const { t, lang } = useLang()
  const ends = price.launchEndsAt
  const now = useNow(Boolean(ends))
  if (!ends) return null

  const endsAt = Date.parse(ends)
  const left = now === null ? null : split(endsAt - now)
  const date = new Intl.DateTimeFormat(lang === "bm" ? "ms-MY" : "en-MY", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(endsAt)
  const raises = t.launch.raises.replace("{regular}", `RM${price.regularRM}`).replace("{date}", date)
  const pad = (n: number) => String(n).padStart(2, "0")

  if (variant === "hero") {
    return (
      <p className="mt-5 grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-0.5 rounded-2xl border border-brand/40 bg-brand/10 px-4 py-2.5 text-sm text-white/85 sm:inline-flex sm:flex-wrap sm:rounded-full sm:py-2">
        <Timer className="size-4 text-brand" />
        <strong className="font-semibold text-white">
          {t.launch.label} RM{price.priceRM}
        </strong>
        <span className="hidden text-white/50 sm:inline">·</span>
        <span className="col-start-2">{raises}</span>
        {left && (
          <>
            <span className="hidden text-white/50 sm:inline">·</span>
            <span className="col-start-2 font-mono tabular-nums">
              {left.d > 0 && `${left.d}${t.launch.units.d.charAt(0)} `}
              {pad(left.h)}:{pad(left.m)}:{pad(left.s)}
            </span>
          </>
        )}
      </p>
    )
  }

  return (
    <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
        <Timer className="size-4" /> {t.launch.label} · {t.launch.endsIn}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {(["d", "h", "m", "s"] as const).map((k) => (
          <div key={k} className="rounded-xl bg-white/5 py-2">
            <div className={cn("font-mono text-2xl tabular-nums", !left && "opacity-0")}>
              {left ? pad(left[k]) : "00"}
            </div>
            <div className="text-[11px] text-white/50">{t.launch.units[k]}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-white/60">{raises}</p>
    </div>
  )
}
