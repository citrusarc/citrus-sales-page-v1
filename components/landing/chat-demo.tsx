"use client"

import * as React from "react"
import { Lock, Sparkles } from "lucide-react"

import { BrandLogo } from "@/components/landing/brand-logo"
import { useLang } from "@/lib/i18n"
import type { ChatScript } from "@/lib/dict"
import { cn } from "@/lib/utils"

// Typing speed: a few chars per frame-ish tick, so the reply takes ~1.5s with
// far fewer re-renders than one per character.
const CHARS_PER_TICK = 6
const TICK_MS = 28

export function ChatDemo() {
  const { t, lang } = useLang()
  const chats = t.chats
  const [active, setActive] = React.useState(0)
  const [manual, setManual] = React.useState(false)
  const chat = chats[active]

  // Auto-advance to the next sample until the visitor picks one themselves.
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const onDone = React.useCallback(() => {
    if (manual) return
    timer.current = setTimeout(() => setActive((i) => (i + 1) % chats.length), 6000)
  }, [manual, chats.length])
  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-ink-soft shadow-2xl">
      {/* right side left empty: the hero's tag sits over that corner */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5 pr-32 text-xs sm:pr-36">
        <span className="flex shrink-0 items-center gap-2 font-mono whitespace-nowrap text-white/60">
          <Sparkles className="size-3.5 text-brand" />
          {chat.advanced ? "meta-ads-advanced" : "meta-ads-basic"}
        </span>
        <span className="text-white/30">·</span>
        <span className="truncate text-white/60">{t.hero.demoLabel}</span>
      </div>

      {/* keyed so every new sample (or language switch) replays from scratch */}
      <Conversation
        key={`${active}-${lang}`}
        chat={chat}
        typing={t.hero.typing}
        onDone={onDone}
        instant={active === 0 && !manual}
      />

      <div className="border-t border-white/10 p-4">
        <p className="mb-3 text-xs text-white/60">{t.hero.demoTry}</p>
        <div className="flex flex-wrap gap-2">
          {chats.map((c: ChatScript, i: number) => (
            <button
              key={c.chip}
              onClick={() => {
                clearTimeout(timer.current)
                setManual(true)
                setActive(i)
              }}
              aria-pressed={i === active}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                i === active
                  ? "border-white bg-white text-ink"
                  : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
              )}
            >
              {c.advanced && <Lock className={cn("size-3", i === active ? "text-brand" : "text-brand/80")} />}
              {c.chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Conversation({
  chat,
  typing,
  onDone,
  instant = false,
}: {
  chat: ChatScript
  typing: string
  onDone: () => void
  /** Show the whole reply at once (the first sample, on page load). */
  instant?: boolean
}) {
  const full = React.useMemo(() => chat.reply.join("").length, [chat])
  const [phase, setPhase] = React.useState<"user" | "typing" | "reply">(instant ? "reply" : "user")
  const [shown, setShown] = React.useState(instant ? full : 0)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (instant) return
    const a = setTimeout(() => setPhase("typing"), 500)
    const b = setTimeout(() => setPhase("reply"), 1400)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [instant])

  React.useEffect(() => {
    if (phase !== "reply") return
    if (shown >= full) {
      onDone()
      return
    }
    const id = setTimeout(() => setShown((s) => Math.min(full, s + CHARS_PER_TICK)), TICK_MS)
    return () => clearTimeout(id)
  }, [phase, shown, full, onDone])

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown, phase])

  return (
    <div ref={scrollRef} className="h-96 space-y-5 overflow-y-auto p-5">
      <div className="flex animate-in-up justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5 text-sm text-white">{chat.user}</p>
      </div>

      {phase === "typing" && (
        <div className="flex items-center gap-2.5 text-xs text-white/60">
          <Avatar />
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-bounce rounded-full bg-brand"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
          {typing}
        </div>
      )}

      {phase === "reply" && (
        <div className="flex gap-3">
          <Avatar />
          <Reply lines={chat.reply} shown={shown} />
        </div>
      )}
    </div>
  )
}

function Avatar() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10">
      <BrandLogo className="h-3.5 w-auto" />
    </span>
  )
}

function Reply({ lines, shown }: { lines: string[]; shown: number }) {
  let offset = 0
  const out: React.ReactNode[] = []
  const rows: React.ReactNode[] = []

  const flushTable = (key: string) => {
    if (!rows.length) return
    out.push(
      <div key={key} className="overflow-hidden rounded-xl border border-white/10">
        {rows.splice(0)}
      </div>
    )
  }

  lines.forEach((line, i) => {
    const start = offset
    offset += line.length
    const visible = Math.max(0, Math.min(line.length, shown - start))
    if (visible === 0) return

    if (line.startsWith("|")) {
      const [, k, v] = line.split("|").map((s) => s.trim())
      rows.push(
        <div key={i} className="grid animate-in-up grid-cols-2 border-b border-white/10 text-xs last:border-0">
          <span className="px-3 py-2 text-white/60">{k}</span>
          <span className="px-3 py-2 font-mono text-white">{v}</span>
        </div>
      )
      return
    }
    flushTable(`t-${i}`)
    const text = line.slice(0, visible)
    if (line.startsWith("→")) {
      out.push(
        <p key={i} className="rounded-xl border border-brand/40 bg-brand/15 px-3.5 py-2.5 text-sm font-medium text-peach">
          {text}
        </p>
      )
    } else if (line.startsWith("•")) {
      out.push(
        <p key={i} className="flex gap-2 text-sm text-white/80">
          <span className="text-brand-bright">•</span>
          {text.slice(1).trim()}
        </p>
      )
    } else {
      out.push(
        <p key={i} className="text-sm text-white/90">
          {text}
        </p>
      )
    }
  })
  flushTable("t-end")

  return <div className="min-w-0 flex-1 space-y-2.5">{out}</div>
}
