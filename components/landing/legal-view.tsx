"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { BrandLogo } from "@/components/landing/brand-logo"
import { Footer } from "@/components/landing/final-cta"
import { LangToggle } from "@/components/landing/nav"
import { Eyebrow, Rich } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { LEGAL, LEGAL_UPDATED } from "@/lib/legal"

const UI = {
  bm: { back: "Kembali", updated: "Dikemas kini", contents: "Dalam halaman ini", eyebrow: "Undang-undang" },
  en: { back: "Back", updated: "Last updated", contents: "On this page", eyebrow: "Legal" },
}

export function LegalView({ kind }: { kind: "terms" | "privacy" }) {
  const { lang } = useLang()
  const doc = LEGAL[kind][lang]
  const ui = UI[lang]
  const date = new Intl.DateTimeFormat(lang === "bm" ? "ms-MY" : "en-MY", { dateStyle: "long" }).format(
    new Date(`${LEGAL_UPDATED}T00:00:00+08:00`)
  )

  return (
    <>
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 pt-6 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Citrus Arc">
          <BrandLogo className="h-7 w-auto" />
          <span className="text-sm font-semibold">Meta Ads Skill</span>
        </Link>
        <LangToggle />
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-14 pb-10 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" /> {ui.back}
        </Link>

        <div className="mt-8">
          <Eyebrow>{ui.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl leading-[0.95] font-semibold tracking-tight uppercase sm:text-6xl">{doc.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {ui.updated} {date}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty">{doc.intro}</p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[220px_1fr]">
          <nav aria-label={ui.contents} className="lg:sticky lg:top-8 lg:self-start">
            <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{ui.contents}</div>
            <ol className="mt-4 space-y-2 text-sm">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-2 text-muted-foreground transition-colors hover:text-brand">
                    <span className="font-mono text-xs leading-5">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-2xl space-y-12">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-8">
                <h2 className="flex items-baseline gap-3 text-xl font-semibold tracking-tight uppercase">
                  <span className="font-mono text-sm text-brand">({String(i + 1).padStart(2, "0")})</span>
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink/80">
                  {s.blocks.map((b, j) =>
                    typeof b === "string" ? (
                      <p key={j}>
                        <Rich text={b} />
                      </p>
                    ) : (
                      <ul key={j} className="space-y-2 pl-1">
                        {b.map((li, k) => (
                          <li key={k} className="flex gap-3">
                            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                            <span>
                              <Rich text={li} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
