"use client"

import * as React from "react"
import { Frown, Hourglass, Meh, MousePointerClick, Rocket, Smile } from "lucide-react"

import { SectionHead } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type Inputs = {
  spend: number
  impressions: number
  clicks: number
  results: number
  frequency: number
  days: number
  target: number
}
type VerdictKey = "wait" | "hook" | "page" | "fatigue" | "keep" | "scale"

const FIELDS: { key: keyof Inputs; min: number; max: number; step: number }[] = [
  { key: "spend", min: 0, max: 3000, step: 10 },
  { key: "impressions", min: 1000, max: 200000, step: 500 },
  { key: "clicks", min: 0, max: 4000, step: 5 },
  { key: "results", min: 0, max: 200, step: 1 },
  { key: "frequency", min: 1, max: 8, step: 0.1 },
  { key: "days", min: 1, max: 30, step: 1 },
  { key: "target", min: 5, max: 200, step: 1 },
]

// Order matches the labels in dict doctor.presets: weak hook, healthy, fatigued, after the click.
const PRESETS: Inputs[] = [
  { spend: 300, impressions: 25000, clicks: 150, results: 9, frequency: 1.8, days: 5, target: 25 },
  { spend: 600, impressions: 40000, clicks: 720, results: 40, frequency: 1.6, days: 7, target: 25 },
  { spend: 900, impressions: 52000, clicks: 690, results: 24, frequency: 4.2, days: 21, target: 25 },
  { spend: 450, impressions: 30000, clicks: 600, results: 6, frequency: 1.9, days: 6, target: 25 },
]

// Mirrors references/read-results.md: wait → CTR → fatigue → after-click → scale/keep.
function diagnose(x: Inputs) {
  const cpm = (x.spend / x.impressions) * 1000
  const ctr = (x.clicks / x.impressions) * 100
  const cpr = x.results > 0 ? x.spend / x.results : Infinity
  const conv = x.clicks > 0 ? (x.results / x.clicks) * 100 : 0
  let key: VerdictKey
  if (x.days < 3 || x.spend < 2 * x.target) key = "wait"
  else if (ctr < 1) key = "hook"
  else if (x.frequency > 3 && cpr > x.target) key = "fatigue"
  else if (x.results === 0 || cpr > 1.5 * x.target) key = "page"
  else if (cpr <= x.target) key = "scale"
  else key = "keep"
  return { key, cpm, ctr, cpr, conv }
}

const LOOK: Record<VerdictKey, { score: number; icon: typeof Smile }> = {
  wait: { score: 50, icon: Hourglass },
  hook: { score: 25, icon: Frown },
  page: { score: 38, icon: MousePointerClick },
  fatigue: { score: 32, icon: Meh },
  keep: { score: 66, icon: Smile },
  scale: { score: 92, icon: Rocket },
}

const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString("en-MY", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—"

export function AdDoctor() {
  const { t } = useLang()
  const [x, setX] = React.useState<Inputs>(PRESETS[0])
  const d = diagnose(x)
  const v = t.doctor.verdicts[d.key]
  const look = LOOK[d.key]
  const Icon = look.icon
  const activePreset = PRESETS.findIndex((p) => (Object.keys(p) as (keyof Inputs)[]).every((k) => p[k] === x[k]))

  return (
    <section id="doktor" className="mx-auto max-w-7xl px-5 py-20 sm:px-10 md:py-28">
      <SectionHead eyebrow={t.doctor.eyebrow} title={t.doctor.title} sub={t.doctor.sub} />

      <div className="mt-14 grid overflow-hidden rounded-[28px] border border-border bg-surface lg:grid-cols-[1.15fr_1fr]">
        {/* inputs */}
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {t.doctor.presetsLabel}
            </span>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setX(p)}
                aria-pressed={activePreset === i}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  activePreset === i ? "border-ink bg-ink text-white" : "border-border hover:border-ink"
                )}
              >
                {t.doctor.presets[i]}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {FIELDS.map((f) => {
              const val = x[f.key]
              const fill = ((Math.min(val, f.max) - f.min) / (f.max - f.min)) * 100
              return (
                <label key={f.key} className={cn("block", f.key === "target" && "sm:col-span-2")}>
                  <span className="mb-3 flex items-center justify-between gap-2 text-sm font-medium">
                    {t.doctor.fields[f.key]}
                    <input
                      type="number"
                      inputMode="decimal"
                      value={val}
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      aria-label={t.doctor.fields[f.key]}
                      onChange={(e) => {
                        const n = Number(e.target.value)
                        if (Number.isFinite(n)) setX((s) => ({ ...s, [f.key]: Math.max(f.min, n) }))
                      }}
                      className="w-24 rounded-lg border border-border bg-canvas px-2.5 py-1 text-right font-mono text-sm outline-none focus:border-ink focus:bg-white"
                    />
                  </span>
                  <input
                    type="range"
                    className="slider w-full"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={Math.min(val, f.max)}
                    style={{ "--fill": `${fill}%` } as React.CSSProperties}
                    onChange={(e) => setX((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
                  />
                </label>
              )
            })}
          </div>
        </div>

        {/* result */}
        <div className="grid-lines flex flex-col gap-6 bg-ink p-6 text-white sm:p-10">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {(
              [
                ["cpm", `RM${fmt(d.cpm)}`],
                ["ctr", `${fmt(d.ctr)}%`],
                ["cpr", `RM${fmt(d.cpr)}`],
                ["conv", `${fmt(d.conv, 1)}%`],
              ] as const
            ).map(([k, val]) => (
              <div key={k} className="bg-ink px-4 py-3.5">
                <div className="text-xs text-white/65">{t.doctor.metrics[k]}</div>
                <div className="mt-0.5 font-mono text-xl tabular-nums">{val}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <Gauge score={look.score} />
            <div key={d.key} className="animate-in-up">
              <div className="text-xs font-semibold tracking-[0.18em] text-brand-bright uppercase">{t.doctor.verdictLabel}</div>
              <h3 className="mt-1.5 flex items-center gap-2.5 text-2xl leading-tight font-semibold tracking-tight uppercase sm:text-3xl">
                <Icon className="size-7 shrink-0 text-brand-bright" />
                {v.title}
              </h3>
            </div>
          </div>

          <p key={`b-${d.key}`} className="animate-in-up leading-relaxed text-white/70">
            {v.body}
          </p>

          <div key={`a-${d.key}`} className="animate-in-up rounded-2xl bg-brand p-5">
            <div className="text-xs font-semibold tracking-[0.18em] text-white uppercase">{t.doctor.actionLabel}</div>
            <p className="mt-1.5 font-medium">{v.action}</p>
          </div>

          <p className="mt-auto text-xs leading-relaxed text-white/60">{t.doctor.disclaimer}</p>
        </div>
      </div>
    </section>
  )
}

function Gauge({ score }: { score: number }) {
  const angle = -90 + (score / 100) * 180
  const arc = "M10 62 A50 50 0 0 1 110 62"
  return (
    <svg viewBox="0 0 120 70" className="w-28 shrink-0" aria-hidden>
      <path d={arc} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="10" strokeLinecap="round" />
      <path
        d={arc}
        fill="none"
        stroke="var(--brand-bright)"
        strokeWidth="10"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${score} 100`}
        style={{ transition: "stroke-dasharray .6s cubic-bezier(.2,.7,.2,1)" }}
      />
      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: "60px 62px",
          transition: "transform .6s cubic-bezier(.2,.7,.2,1)",
        }}
      >
        <line x1="60" y1="62" x2="60" y2="26" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="62" r="5" fill="#fff" />
    </svg>
  )
}
