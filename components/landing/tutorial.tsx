"use client"

import * as React from "react"
import { ArrowRight, Check, Copy, FileArchive, Monitor, PartyPopper, Plus, Send, Sparkles, Terminal, Upload } from "lucide-react"

import { confetti } from "@/components/landing/confetti"
import { SectionHead } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type Tab = "web" | "code"

export function Tutorial() {
  const { t } = useLang()
  const tt = t.tutorial
  const [tab, setTab] = React.useState<Tab>("web")
  const [step, setStep] = React.useState(0)
  const [done, setDone] = React.useState<Record<Tab, Set<number>>>({ web: new Set(), code: new Set() })
  const panelRef = React.useRef<HTMLDivElement>(null)

  const steps = tab === "web" ? tt.web : tt.code
  const doneSet = done[tab]
  const pct = Math.round((doneSet.size / steps.length) * 100)

  const toggle = (i: number, force?: boolean) => {
    const s = new Set(doneSet)
    const on = force ?? !s.has(i)
    if (on) s.add(i)
    else s.delete(i)
    if (on && s.size === steps.length && doneSet.size !== steps.length) {
      const r = panelRef.current?.getBoundingClientRect()
      confetti(r ? { x: r.left + r.width / 2, y: r.top + 80 } : undefined)
    }
    setDone((d) => ({ ...d, [tab]: s }))
  }

  const next = () => {
    toggle(step, true)
    if (step < steps.length - 1) setStep(step + 1)
  }

  const s = steps[step]

  return (
    <section id="tutorial" className="mx-auto max-w-7xl px-5 py-20 sm:px-10 md:py-28">
      <SectionHead eyebrow={tt.eyebrow} title={tt.title} sub={tt.sub} />

      <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-grid w-full grid-cols-2 rounded-full bg-muted p-1 sm:w-auto">
          {(
            [
              ["web", Monitor, tt.tabs.web],
              ["code", Terminal, tt.tabs.code],
            ] as const
          ).map(([k, Icon, label]) => (
            <button
              key={k}
              onClick={() => {
                setTab(k)
                setStep(0)
              }}
              aria-pressed={tab === k}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                tab === k ? "bg-ink text-white" : "text-muted-foreground hover:text-ink"
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="w-full sm:max-w-xs">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {doneSet.size}/{steps.length} {tt.progress}
            </span>
            <span className="font-mono">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[360px_1fr]">
        <ol className="overflow-hidden rounded-3xl border border-border bg-surface">
          {steps.map((st, i) => {
            const isDone = doneSet.has(i)
            return (
              <li key={`${tab}-${i}`} className="border-b border-border last:border-0">
                <div className={cn("flex items-center gap-3 px-4 py-3 transition-colors", step === i && "bg-accent")}>
                  <button
                    onClick={() => toggle(i)}
                    aria-label={`${i + 1}: ${st.title}`}
                    aria-pressed={isDone}
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors",
                      isDone ? "border-brand bg-brand text-white" : "border-border hover:border-ink"
                    )}
                  >
                    {isDone ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                  </button>
                  <button
                    onClick={() => setStep(i)}
                    className={cn(
                      "flex-1 py-1 text-left font-medium",
                      isDone && step !== i && "text-muted-foreground line-through"
                    )}
                  >
                    {st.title}
                  </button>
                </div>
              </li>
            )
          })}
        </ol>

        <div ref={panelRef} className="overflow-hidden rounded-3xl border border-border bg-surface">
          <div key={`${tab}-${step}`} className="grid animate-in-up gap-8 p-6 sm:p-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <span className="font-mono text-sm text-brand-ink">
                ({String(step + 1).padStart(2, "0")}/{String(steps.length).padStart(2, "0")})
              </span>
              <h3 className="mt-3 text-3xl leading-none font-semibold tracking-tight uppercase">{s.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{s.body}</p>
              <button
                onClick={next}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand"
              >
                {step < steps.length - 1 ? (
                  <>
                    {tt.nextBtn}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                ) : (
                  <>
                    <Check className="size-4" strokeWidth={3} /> {tt.finishBtn}
                  </>
                )}
              </button>
            </div>
            <div>
              {"cmd" in s ? (
                <TerminalMock cmd={s.cmd} isPrompt={step === steps.length - 1} />
              ) : (
                <WebMock kind={s.mock} />
              )}
            </div>
          </div>

          {pct === 100 && (
            <div className="flex animate-in-up items-center justify-center gap-2 bg-brand px-6 py-4 text-center font-semibold text-white">
              <PartyPopper className="size-5" /> {tt.done}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{tt.promptsTitle}</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {tt.prompts.map((p) => (
            <CopyCard key={p} text={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

function useCopy() {
  const [copied, setCopied] = React.useState(false)
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {}
  }
  return { copied, copy }
}

function CopyCard({ text }: { text: string }) {
  const { t } = useLang()
  const { copied, copy } = useCopy()
  return (
    <button
      onClick={() => copy(text)}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-ink"
    >
      <Sparkles className="mt-0.5 size-5 shrink-0 text-brand" />
      <span className="flex-1 font-medium">{text}</span>
      <span
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
          copied ? "bg-brand text-white" : "bg-muted text-muted-foreground group-hover:bg-ink group-hover:text-white"
        )}
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? t.tutorial.copied : t.tutorial.copy}
      </span>
    </button>
  )
}

function TerminalMock({ cmd, isPrompt }: { cmd: string; isPrompt: boolean }) {
  const { t } = useLang()
  const { copied, copy } = useCopy()
  return (
    <div className="overflow-hidden rounded-2xl bg-ink text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-white/15" />
          ))}
        </div>
        <button
          onClick={() => copy(cmd)}
          className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium hover:bg-brand"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? t.tutorial.copied : t.tutorial.copy}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        <span className="text-brand-bright">{isPrompt ? "> " : "$ "}</span>
        {cmd}
        <span className="ml-0.5 inline-block h-4 w-2 animate-blink bg-brand align-middle" />
      </pre>
    </div>
  )
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-500",
        on ? "bg-brand" : "bg-input"
      )}
    >
      <span
        className={cn(
          "absolute top-1 left-1 size-4 rounded-full bg-white shadow transition-transform duration-500 ease-out",
          on && "translate-x-5"
        )}
      />
    </span>
  )
}

function WebMock({ kind }: { kind: string }) {
  const { t } = useLang()
  const m = t.tutorial.mocks
  const [on, setOn] = React.useState(false)
  React.useEffect(() => {
    const id = setTimeout(() => setOn(true), 600)
    return () => clearTimeout(id)
  }, [kind])

  const shell = (children: React.ReactNode, title: string) => (
    <div className="overflow-hidden rounded-2xl border border-border bg-canvas">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5 text-xs text-muted-foreground">
        <span className="size-2 rounded-full bg-brand" />
        {title}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )

  if (kind === "zip")
    return shell(
      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
        <FileArchive className="size-9 text-brand" />
        <div className="flex-1">
          <div className="font-mono text-sm">meta-ads-basic.zip</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand transition-[width] duration-1000" style={{ width: on ? "100%" : "8%" }} />
          </div>
        </div>
        {on && <Check className="size-5 animate-in-up text-brand" strokeWidth={3} />}
      </div>,
      "Downloads"
    )

  if (kind === "toggle")
    return shell(
      <div>
        <div className="text-xs text-muted-foreground">
          {m.settings} › {m.capabilities}
        </div>
        <div
          className={cn(
            "mt-3 flex items-center justify-between gap-3 rounded-xl border bg-surface p-4 transition-colors",
            on ? "border-brand" : "border-border"
          )}
        >
          <span className="text-sm font-medium">{m.codeExec}</span>
          <Switch on={on} />
        </div>
      </div>,
      m.settings
    )

  if (kind === "upload")
    return shell(
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{m.customize}</span>
          <span className="grid size-8 place-items-center rounded-full border border-border bg-surface">
            <Plus className="size-4" />
          </span>
        </div>
        <div className="mt-2 ml-auto w-48 overflow-hidden rounded-xl border border-border bg-surface text-sm shadow-sm">
          <div className="px-3 py-2 text-muted-foreground">{m.createSkill}</div>
          <div className={cn("flex items-center gap-2 px-3 py-2 transition-colors", on && "bg-brand text-white")}>
            <Upload className="size-4" /> {m.uploadSkill}
          </div>
        </div>
        <div
          className={cn(
            "mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed p-4 font-mono text-xs transition-colors",
            on ? "border-brand bg-accent" : "border-input"
          )}
        >
          <FileArchive className="size-4 text-brand" /> meta-ads-basic.zip
        </div>
      </div>,
      "claude.ai"
    )

  if (kind === "list")
    return shell(
      <div className="space-y-2">
        {["meta-ads-basic", "meta-ads-advanced"].map((n, i) => (
          <div
            key={n}
            className={cn("flex items-center justify-between rounded-xl border border-border bg-surface p-3", i === 1 && "opacity-50")}
          >
            <span className="flex items-center gap-2 font-mono text-sm">
              <Sparkles className="size-4 text-brand" /> {n}
            </span>
            <Switch on={i === 0 ? on : false} />
          </div>
        ))}
      </div>,
      m.customize
    )

  return shell(
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-2 pl-4">
      <span className="flex-1 truncate text-sm">
        {on ? m.chatPrompt : ""}
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-blink bg-ink align-middle" />
      </span>
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full transition-colors",
          on ? "bg-brand text-white" : "bg-muted text-muted-foreground"
        )}
      >
        <Send className="size-4" />
      </span>
    </div>,
    "claude.ai"
  )
}
