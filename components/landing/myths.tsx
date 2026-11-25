"use client"

import * as React from "react"
import { RotateCw } from "lucide-react"

import { SectionHead } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function Myths() {
  const { t } = useLang()
  const [flipped, setFlipped] = React.useState<boolean[]>([false, false, false, false])

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-10 md:py-28">
      <SectionHead eyebrow={t.myths.eyebrow} title={t.myths.title} sub={t.myths.sub} />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.myths.items.map((m, i) => (
          <button
            key={i}
            onClick={() => setFlipped((f) => f.map((v, j) => (j === i ? !v : v)))}
            aria-pressed={flipped[i]}
            className={cn("flip group block h-80 w-full text-left", flipped[i] && "flipped")}
          >
            <div className="flip-inner relative h-full w-full">
              {/* front: the mistake */}
              <div className="flip-face absolute inset-0 flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 transition-colors group-hover:border-ink">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">({String(i + 1).padStart(2, "0")})</span>
                  <span className="font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {t.myths.mythLabel}
                  </span>
                </div>
                <p className="text-2xl leading-tight font-semibold tracking-tight">{m.myth}</p>
                <span className="flex items-center gap-2 text-sm font-medium text-brand-ink">
                  <RotateCw className="size-4 transition-transform duration-500 group-hover:rotate-180" />
                  {t.myths.flip}
                </span>
              </div>
              {/* back: what the skill does */}
              <div className="flip-face flip-back absolute inset-0 flex flex-col justify-between rounded-3xl bg-ink p-6 text-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-white/60">({String(i + 1).padStart(2, "0")})</span>
                  <span className="font-semibold tracking-[0.14em] text-brand-bright uppercase">{t.myths.fixLabel}</span>
                </div>
                <p className="text-lg leading-snug">{m.fix}</p>
                <span className="font-mono text-xs text-white/60">meta-ads-basic</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
