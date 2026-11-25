"use client"

import { useLang } from "@/lib/i18n"

export function Marquee() {
  const { t } = useLang()
  const items = [...t.marquee, ...t.marquee]
  return (
    <div
      className="overflow-hidden py-10"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee gap-10 hover:paused">
        {items.map((x, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm font-semibold tracking-[0.18em] whitespace-nowrap text-muted-foreground uppercase"
          >
            {x}
            <span className="size-1.5 rounded-full bg-brand" />
          </span>
        ))}
      </div>
    </div>
  )
}
