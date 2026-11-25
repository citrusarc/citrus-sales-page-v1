"use client"

import * as React from "react"
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  LayoutTemplate,
  Lock,
  MessageCircle,
  PenLine,
  Scale,
  Search,
  Siren,
  Target,
} from "lucide-react"

import { CountUp, SectionHead } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const ICONS = [Target, PenLine, BarChart3, ClipboardCheck, ImageIcon, Siren, FlaskConical, MessageCircle, Scale, Search, LayoutTemplate, FileText]

export function Modules() {
  const { t } = useLang()
  const [tier, setTier] = React.useState<"basic" | "advanced">("advanced")
  const [sel, setSel] = React.useState(3)
  const items = t.modules.items
  const m = items[sel]
  const SelIcon = ICONS[sel]
  const selLocked = tier === "basic" && m.tier === "advanced"

  return (
    <section id="modul" className="mx-auto max-w-7xl px-5 py-20 sm:px-10 md:py-28">
      <SectionHead eyebrow={t.modules.eyebrow} title={t.modules.title} sub={t.modules.sub} />

      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4">
        {t.modules.stats.map((s, i) => (
          <div key={i} className="bg-surface px-6 py-7">
            <CountUp to={s.n} className="text-5xl font-semibold tracking-tight tabular-nums" />
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="relative grid grid-cols-2 rounded-full bg-muted p-1 font-semibold">
          <span
            aria-hidden
            className={cn(
              "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out",
              tier === "advanced" ? "translate-x-full bg-brand" : "bg-ink"
            )}
          />
          {(["basic", "advanced"] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                setTier(k)
                // Basic can't show an Advanced-only module: go back to the first one.
                if (k === "basic" && items[sel].tier === "advanced") setSel(0)
              }}
              aria-pressed={tier === k}
              className={cn(
                "relative z-10 px-8 py-3 text-sm transition-colors sm:px-12",
                tier === k ? "text-white" : "text-muted-foreground hover:text-ink"
              )}
            >
              {t.modules[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((it, i) => {
            const Icon = ICONS[i]
            const locked = tier === "basic" && it.tier === "advanced"
            const active = sel === i
            return (
              <button
                key={it.n}
                onClick={() => setSel(i)}
                disabled={locked}
                aria-pressed={active}
                className={cn(
                  "group flex min-h-40 flex-col justify-between gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
                  active
                    ? "border-ink bg-ink text-white"
                    : locked
                      ? "cursor-not-allowed border-border bg-transparent opacity-45"
                      : "border-border bg-surface hover:-translate-y-0.5 hover:border-ink"
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-full transition-colors",
                      active ? "bg-brand text-white" : locked ? "bg-muted text-muted-foreground" : "bg-accent text-brand"
                    )}
                  >
                    {locked ? <Lock className="size-4" /> : <Icon className="size-5" />}
                  </span>
                  <span className={cn("font-mono text-xs", active ? "text-white/60" : "text-muted-foreground")}>
                    ({String(it.n).padStart(2, "0")})
                  </span>
                </div>
                <span className="leading-tight font-semibold">{it.title}</span>
              </button>
            )
          })}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div key={`${sel}-${tier}`} className="animate-in-up rounded-3xl border border-border bg-surface p-7">
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-full bg-brand text-white">
                <SelIcon className="size-6" />
              </span>
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
                  selLocked ? "bg-muted text-muted-foreground" : "bg-accent text-brand-ink"
                )}
              >
                {selLocked && <Lock className="size-3" />}
                {selLocked ? t.modules.locked : t.modules.included}
              </span>
            </div>
            <h3 className="mt-6 text-2xl leading-tight font-semibold tracking-tight uppercase">{m.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{m.desc}</p>

            <div className="mt-6 space-y-3">
              <div className="ml-8 rounded-2xl rounded-br-md bg-accent px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.14em] text-brand-ink uppercase">{t.modules.ask}</div>
                <p className="mt-0.5 font-medium">“{m.ask}”</p>
              </div>
              <div className="mr-8 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {t.modules.get}
                </div>
                <p className="mt-0.5 font-medium">{m.get}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
