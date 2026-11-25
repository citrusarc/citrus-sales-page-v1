"use client"

import * as React from "react"
import { CreditCard, RotateCw, X } from "lucide-react"

import { ContactLinks } from "@/components/landing/final-cta"
import { Pill } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"

/** Shown when CHIP sends the buyer back after a failed payment. */
export function FailedDialog({
  open,
  onClose,
  onRetry,
}: {
  open: boolean
  onClose: () => void
  onRetry: () => void
}) {
  const { t } = useLang()
  const f = t.pricing.failed
  const ref = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="failed-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-border bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm open:animate-in-up"
    >
      <div className="relative p-6 sm:p-8">
        <button
          onClick={onClose}
          aria-label={f.close}
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-ink"
        >
          <X className="size-5" />
        </button>

        <span className="grid size-12 place-items-center rounded-full bg-accent text-brand">
          <CreditCard className="size-6" />
        </span>
        <h3 id="failed-title" className="mt-5 text-3xl leading-none font-semibold tracking-tight uppercase">
          {f.title}
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">{f.body}</p>

        <Pill autoFocus onClick={onRetry} className="mt-6 w-full" icon={<RotateCw className="size-5" />}>
          {f.retry}
        </Pill>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-sm text-muted-foreground">{f.charged}</p>
          <ContactLinks className="mt-3 flex flex-wrap gap-2" />
        </div>
      </div>
    </dialog>
  )
}
