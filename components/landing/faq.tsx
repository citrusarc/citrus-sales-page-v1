"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Eyebrow } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function Faq() {
  const { t } = useLang()
  const [open, setOpen] = React.useState<number | null>(0)

  return (
    <section id="soalan" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-10 md:py-28 lg:grid-cols-[1fr_2fr]">
      <div>
        <Eyebrow>{t.faq.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-4xl leading-[0.95] font-semibold tracking-tight uppercase sm:text-5xl lg:text-6xl">
          {t.faq.title}
        </h2>
      </div>

      <div className="border-t border-border">
        {t.faq.items.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border-b border-border">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-semibold tracking-tight sm:text-xl">{f.q}</span>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    isOpen ? "rotate-45 border-brand bg-brand text-white" : "border-border group-hover:border-ink"
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-6 leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
