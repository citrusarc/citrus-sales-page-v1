"use client"

import { Download, ShieldCheck } from "lucide-react"

import { useActions } from "@/components/landing/actions"
import { ChatDemo } from "@/components/landing/chat-demo"
import { Pill } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"

export function Hero() {
  const { t } = useLang()
  const { openBuy, downloadBasic, stats } = useActions()
  const counts = [
    { n: stats.downloads, label: t.hero.statDownloads },
    { n: stats.sales, label: t.hero.statSales },
  ].filter((c): c is { n: number; label: string } => c.n !== null)

  return (
    <section className="p-2 sm:p-3">
      <div className="grid-lines relative overflow-hidden rounded-[28px] bg-ink text-white sm:rounded-[36px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-60 size-160 rounded-full bg-brand/25 blur-[140px]"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pt-32 pb-16 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-40 lg:pb-24">
          <div className="min-w-0">
            <p className="flex items-center gap-2.5 text-sm text-white/70">
              <span className="size-2 rounded-full bg-brand" />
              {t.hero.badge}
            </p>

            <h1 className="mt-6 text-[clamp(2.6rem,6.2vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-balance uppercase">
              {t.hero.h1a} <span className="text-brand">{t.hero.h1b}</span> {t.hero.h1c}
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-relaxed text-pretty text-white/65">{t.hero.sub}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Pill onClick={downloadBasic} icon={<Download className="size-5" />}>
                {t.hero.ctaFree}
              </Pill>
              <Pill onClick={openBuy} variant="outline" className="text-white">
                {t.hero.ctaPaid}
              </Pill>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-white/50">
              <ShieldCheck className="size-4 text-brand" />
              {t.hero.note}
            </p>

            {/* Real counts only (lib/kv.ts); hidden until they reach STATS_MIN. */}
            {counts.length > 0 && (
              <dl className="mt-8 flex animate-in-up gap-10 border-t border-white/10 pt-6">
                {counts.map((c) => (
                  <div key={c.label}>
                    <dt className="sr-only">{c.label}</dt>
                    <dd className="text-3xl font-semibold tracking-tight tabular-nums">
                      {c.n.toLocaleString("en-MY")}
                    </dd>
                    <dd className="text-sm text-white/50">{c.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="relative min-w-0">
            <span className="absolute -top-3 right-5 z-10 rotate-6 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wider text-ink uppercase shadow-lg">
              {t.hero.tag}
            </span>
            <ChatDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
