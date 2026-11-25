"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Download, Hourglass, MailCheck, MailWarning, PartyPopper, SearchX } from "lucide-react"

import { BrandLogo } from "@/components/landing/brand-logo"
import { confetti } from "@/components/landing/confetti"
import { ContactLinks } from "@/components/landing/final-cta"
import { LangToggle } from "@/components/landing/nav"
import { PillLink } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"

export function ThanksView({
  state,
  email = null,
  emailFailed = false,
}: {
  state: "paid" | "pending" | "missing"
  /** Set when the skill file was emailed to the buyer. */
  email?: string | null
  emailFailed?: boolean
}) {
  const { t } = useLang()
  const router = useRouter()

  React.useEffect(() => {
    if (state === "paid") {
      const id = setTimeout(() => confetti({ x: window.innerWidth / 2, y: window.innerHeight / 3 }), 300)
      return () => clearTimeout(id)
    }
    if (state === "pending") {
      const id = setInterval(() => router.refresh(), 4000)
      return () => clearInterval(id)
    }
  }, [state, router])

  const Icon = state === "paid" ? PartyPopper : state === "pending" ? Hourglass : SearchX
  const title = state === "paid" ? t.thanks.paidTitle : state === "pending" ? t.thanks.pendingTitle : t.thanks.missingTitle
  const sub = state === "paid" ? t.thanks.paidSub : state === "pending" ? t.thanks.pendingSub : t.thanks.missingSub

  return (
    <main className="flex min-h-svh flex-col p-2 sm:p-3">
      <div className="grid-lines relative flex flex-1 flex-col overflow-hidden rounded-[28px] bg-ink text-white sm:rounded-[36px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-60 size-160 rounded-full bg-brand/25 blur-[140px]"
        />
        {/* header and content share one column, so everything lines up */}
        <div className="relative mx-auto flex w-full max-w-2xl items-center justify-between px-5 pt-6 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Citrus Arc">
            <BrandLogo className="h-7 w-auto" />
            <span className="text-sm font-semibold">Meta Ads Skill</span>
          </Link>
          <LangToggle dark />
        </div>

        <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-16 sm:px-8">
          <span className="grid size-14 place-items-center rounded-full bg-brand">
            <Icon className={state === "pending" ? "size-7 animate-pulse" : "size-7"} />
          </span>
          <h1 className="mt-8 text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.95] font-semibold tracking-tight text-balance uppercase">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/65">{sub}</p>

          {state === "paid" && (email || emailFailed) && (
            <p
              role="status"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm leading-relaxed text-white/80"
            >
              {email ? (
                <MailCheck className="mt-0.5 size-5 shrink-0 text-brand" />
              ) : (
                <MailWarning className="mt-0.5 size-5 shrink-0 text-peach" />
              )}
              <span>
                {email ? (
                  <>
                    {t.thanks.emailed.split("{email}")[0]}
                    <strong className="font-semibold text-white">{email}</strong>
                    {t.thanks.emailed.split("{email}")[1]}
                  </>
                ) : (
                  t.thanks.emailFailed
                )}
              </span>
            </p>
          )}

          {state === "paid" ? (
            <div className="mt-8 flex flex-col gap-3">
              <PillLink href="/api/download/advanced" download className="w-full" icon={<Download className="size-5" />}>
                {t.thanks.download}
              </PillLink>
              <PillLink
                href="/#tutorial"
                variant="outline"
                className="w-full text-white"
                icon={<ArrowRight className="size-5" />}
              >
                {t.thanks.next}
              </PillLink>
            </div>
          ) : (
            <Link
              href="/"
              className="mt-10 inline-flex items-center gap-2 self-start rounded-full border border-white/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-white"
            >
              <ArrowLeft className="size-4" /> {t.thanks.back}
            </Link>
          )}

          {state !== "pending" && (
            <div className="mt-12 border-t border-white/10 pt-6">
              <div className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">{t.thanks.help}</div>
              <ContactLinks className="mt-4 flex flex-wrap gap-2 text-ink" />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
