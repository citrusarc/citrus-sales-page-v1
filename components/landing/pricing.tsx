"use client"

import { Check, CreditCard, Download } from "lucide-react"

import { useActions } from "@/components/landing/actions"
import { Pill, SectionHead } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"

export function Pricing() {
  const { t } = useLang()
  const { openBuy, downloadBasic, stats } = useActions()
  const b = t.pricing.basic
  const a = t.pricing.advanced

  return (
    <section id="harga" className="mx-auto max-w-7xl px-5 py-20 sm:px-10 md:py-28">
      <SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.title} />

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {/* Basic */}
        <div className="flex flex-col rounded-[28px] border border-border bg-surface p-8 sm:p-10">
          <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">(01) Basic</div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight uppercase">{b.name}</h3>
          <p className="mt-1 text-muted-foreground">{b.desc}</p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-6xl font-semibold tracking-tight">{b.price}</span>
            <span className="text-muted-foreground">{b.per}</span>
          </div>
          {stats.downloads !== null && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-ink tabular-nums">{stats.downloads.toLocaleString("en-MY")}</span>{" "}
              {t.hero.statDownloads}
            </p>
          )}
          <ul className="mt-8 flex-1 space-y-3.5 border-t border-border pt-8">
            {b.feats.map((f) => (
              <li key={f} className="flex gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-brand" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Pill onClick={downloadBasic} variant="dark" className="mt-10 w-full" icon={<Download className="size-5" />}>
            {b.cta}
          </Pill>
        </div>

        {/* Advanced */}
        <div className="grid-lines relative flex flex-col overflow-hidden rounded-[28px] bg-ink p-8 text-white sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-40 size-120 rounded-full bg-brand/35 blur-[120px]"
          />
          <span className="absolute top-7 right-7 rotate-6 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wider text-ink uppercase shadow-lg">
            {a.tag}
          </span>
          <div className="relative text-xs font-semibold tracking-[0.18em] text-brand uppercase">(02) Advanced</div>
          <h3 className="relative mt-4 text-2xl font-semibold tracking-tight uppercase">{a.name}</h3>
          <p className="relative mt-1 text-white/60">{a.desc}</p>
          <div className="relative mt-8 flex items-baseline gap-3">
            <span className="text-6xl font-semibold tracking-tight text-brand">{a.price}</span>
            <span className="text-white/60">{a.per}</span>
          </div>
          {stats.sales !== null && (
            <p className="relative mt-2 text-sm text-white/60">
              <span className="font-semibold text-white tabular-nums">{stats.sales.toLocaleString("en-MY")}</span>{" "}
              {t.hero.statSales}
            </p>
          )}
          <ul className="relative mt-8 flex-1 space-y-3.5 border-t border-white/10 pt-8">
            {a.feats.map((f, i) => (
              <li key={f} className="flex gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-brand" />
                <span className={i === 0 ? "font-semibold text-peach" : "text-white/85"}>{f}</span>
              </li>
            ))}
          </ul>
          <Pill onClick={openBuy} className="relative mt-10 w-full">
            {a.cta}
          </Pill>
          <p className="relative mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
            <CreditCard className="size-4" /> {t.pricing.pay}
          </p>
        </div>
      </div>
    </section>
  )
}
