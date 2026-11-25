"use client"

import * as React from "react"
import { CheckCircle2, Info, X } from "lucide-react"

import { BuyDialog } from "@/components/landing/buy-dialog"
import { confetti } from "@/components/landing/confetti"
import { FailedDialog } from "@/components/landing/failed-dialog"
import { useLang } from "@/lib/i18n"
import type { RecentEvent } from "@/app/api/stats/route"
import { BASIC, PRICING, type Price } from "@/lib/product"

type Toast = { id: number; text: string; tone: "ok" | "warn" }
/** Real counts from /api/stats; null until there are enough to show. */
export type Stats = {
  downloads: number | null
  sales: number | null
  recent: RecentEvent[]
}
type Actions = {
  stats: Stats
  /** Current price; switches to the regular price when the launch ends. */
  price: Price
  /** "RM19" — fills the {price} token in dict strings. */
  priceLabel: string
  openBuy: () => void
  downloadBasic: (e: React.MouseEvent) => void
  toast: (text: string, tone?: Toast["tone"]) => void
}

const PREVIEW_STATS = (): Stats => ({
  downloads: 214,
  sales: 38,
  recent: [
    { kind: "download", state: "Selangor", at: Date.now() - 3 * 60e3 },
    { kind: "sale", name: "Nur Sy***an", at: Date.now() - 2 * 3600e3 },
    { kind: "download", state: null, at: Date.now() - 5 * 3600e3 },
  ],
})

const Ctx = React.createContext<Actions | null>(null)

export function useActions() {
  const c = React.useContext(Ctx)
  if (!c) throw new Error("useActions outside ActionsProvider")
  return c
}

export function ActionsProvider({ children, price: initialPrice }: { children: React.ReactNode; price: Price }) {
  const { t } = useLang()
  const [buyOpen, setBuyOpen] = React.useState(false)
  const [failedOpen, setFailedOpen] = React.useState(false)
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const [price, setPrice] = React.useState<Price>(initialPrice)

  // Keeps an open tab honest: at the deadline, show the regular price.
  React.useEffect(() => {
    if (!initialPrice.launchEndsAt) return
    const ms = Date.parse(initialPrice.launchEndsAt) - Date.now()
    if (ms > 2 ** 31 - 1) return // more than ~24 days away; the page will have refreshed by then
    const end = () => setPrice({ priceRM: PRICING.regularRM, regularRM: PRICING.regularRM, launchEndsAt: null })
    const id = setTimeout(end, Math.max(0, ms))
    return () => clearTimeout(id)
  }, [initialPrice])

  const [stats, setStats] = React.useState<Stats>({ downloads: null, sales: null, recent: [] })

  React.useEffect(() => {
    // Local only: /?preview=stats shows sample numbers so you can see the
    // layout before real sales exist. Compiled out of production builds.
    if (process.env.NODE_ENV !== "production" && new URLSearchParams(location.search).has("preview")) {
      const t = setTimeout(() => setStats(PREVIEW_STATS()), 0)
      return () => clearTimeout(t)
    }
    let live = true
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: Stats | null) => live && s && setStats({ ...s, recent: s.recent ?? [] }))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])

  const toast = React.useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random()
    setToasts((ts) => [...ts, { id, text, tone }])
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 5200)
  }, [])

  const downloadBasic = React.useCallback(
    (e: React.MouseEvent) => {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
      confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      const a = document.createElement("a")
      a.href = BASIC.href
      a.download = `${BASIC.name}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      // Counted once per browser by the server (see /api/stats/download).
      fetch("/api/stats/download", { method: "POST", keepalive: true }).catch(() => {})
      toast(t.pricing.downloaded)
    },
    [t, toast]
  )

  // CHIP sends failed payments back to /?bayar=gagal
  React.useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get("bayar") !== "gagal") return
    // A dialog rather than a toast: it shouldn't vanish before it's read, and
    // it offers the retry right there. The flag is cleared in the same step
    // that opens it, so a re-run effect (Strict Mode) still sees it.
    const id = setTimeout(() => {
      url.searchParams.delete("bayar")
      window.history.replaceState(null, "", url.pathname + url.search + url.hash)
      setFailedOpen(true)
    }, 300)
    return () => clearTimeout(id)
  }, [])

  const value = React.useMemo(
    () => ({
      stats,
      price,
      priceLabel: `RM${price.priceRM}`,
      openBuy: () => setBuyOpen(true),
      downloadBasic,
      toast,
    }),
    [stats, price, downloadBasic, toast]
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      <BuyDialog open={buyOpen} onClose={() => setBuyOpen(false)} />
      <FailedDialog
        open={failedOpen}
        onClose={() => setFailedOpen(false)}
        onRetry={() => {
          setFailedOpen(false)
          setBuyOpen(true)
        }}
      />
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-90 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((x) => (
          <div
            key={x.id}
            className="pointer-events-auto flex max-w-md animate-in-up items-center gap-3 rounded-full bg-ink py-2.5 pr-2.5 pl-4 text-sm font-medium text-white shadow-xl"
          >
            {x.tone === "ok" ? (
              <CheckCircle2 className="size-5 shrink-0 text-brand" />
            ) : (
              <Info className="size-5 shrink-0 text-peach" />
            )}
            <span>{x.text}</span>
            <button
              onClick={() => setToasts((ts) => ts.filter((y) => y.id !== x.id))}
              className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
