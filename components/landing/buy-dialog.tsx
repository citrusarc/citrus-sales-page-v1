"use client"

import * as React from "react"
import { ArrowRight, Loader2, Lock, X } from "lucide-react"

import { Pill, Rich } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { ADVANCED } from "@/lib/product"

const input =
  "mt-2 w-full rounded-xl border border-input bg-canvas px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ink focus:bg-white"

export function BuyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang()
  const ref = React.useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), name: fd.get("name") }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }
      const key = data.error as keyof typeof t.buy.errors
      setError(t.buy.errors[key] ?? t.buy.errors.generic)
    } catch {
      setError(t.buy.errors.generic)
    }
    setLoading(false)
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-border bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm open:animate-in-up"
    >
      <div className="relative p-6 sm:p-8">
        <button
          onClick={onClose}
          aria-label={t.buy.close}
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-ink"
        >
          <X className="size-5" />
        </button>

        <span className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
          Meta Ads Advanced · RM{ADVANCED.priceRM}
        </span>
        <h3 className="mt-3 text-3xl leading-none font-semibold tracking-tight uppercase">{t.buy.title}</h3>
        <p className="mt-2 text-muted-foreground">{t.buy.sub}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            {t.buy.name}
            <input name="name" autoComplete="name" className={input} />
          </label>
          <label className="block text-sm font-medium">
            {t.buy.email}
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="anda@email.com"
              className={input}
            />
          </label>

          {/* PDPA notice before payment. Leaving the name blank is the opt-out. */}
          <p className="-mt-1 text-xs leading-relaxed text-muted-foreground">{t.buy.showName}</p>

          {error && (
            <p role="alert" className="rounded-xl bg-destructive/8 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Pill
            type="submit"
            disabled={loading}
            className="w-full"
            icon={loading ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
          >
            {loading ? t.buy.loading : t.buy.submit}
          </Pill>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            <Rich text={t.buy.agree} />
          </p>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" /> {t.buy.secure}
          </p>
        </form>
      </div>
    </dialog>
  )
}
