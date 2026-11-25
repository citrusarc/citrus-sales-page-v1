"use client"

import Link from "next/link"
import { AtSign, Download, Mail, MessageCircle } from "lucide-react"

import { useActions } from "@/components/landing/actions"
import { BrandLogo } from "@/components/landing/brand-logo"
import { Pill } from "@/components/landing/primitives"
import { useLang } from "@/lib/i18n"
import { COMPANY } from "@/lib/legal"
import { CONTACT } from "@/lib/product"

export function FinalCta() {
  const { t } = useLang()
  const { openBuy, downloadBasic, priceLabel } = useActions()
  return (
    <section className="p-2 sm:p-3">
      <div className="bg-citrus relative overflow-hidden rounded-[28px] text-white sm:rounded-[36px]">
        <div className="grid-lines absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-10 md:py-28">
          <h2 className="max-w-4xl text-[clamp(2.4rem,6vw,5rem)] leading-[0.92] font-semibold tracking-[-0.03em] text-balance uppercase">
            {t.final.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/75">{t.final.sub}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Pill onClick={downloadBasic} variant="light" icon={<Download className="size-5" />}>
              {t.hero.ctaFree}
            </Pill>
            <Pill onClick={openBuy} variant="outline" className="text-white">
              {t.hero.ctaPaid.replace("{price}", priceLabel)}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContactLinks({ className }: { className?: string }) {
  const links = [
    { href: CONTACT.whatsapp, label: "WhatsApp", icon: MessageCircle },
    { href: `mailto:${CONTACT.email}`, label: CONTACT.email, icon: Mail },
    { href: CONTACT.instagram, label: "Instagram", icon: AtSign },
  ]
  return (
    <div className={className}>
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:bg-brand hover:text-white"
        >
          <Icon className="size-4" />
          {label}
        </a>
      ))}
    </div>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="mx-auto max-w-7xl px-5 pt-16 pb-12 sm:px-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <a href={CONTACT.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3">
            <BrandLogo className="h-8 w-auto" />
            <span className="font-semibold tracking-tight">Citrus Arc Studio</span>
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            {t.footer.by} · SSM {COMPANY.registration} · © {new Date().getFullYear()}
          </p>
          <nav aria-label="Legal" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
            <Link href="/terma" className="transition-colors hover:text-brand">
              {t.footer.terms}
            </Link>
            <Link href="/privasi" className="transition-colors hover:text-brand">
              {t.footer.privacy}
            </Link>
            <Link href="/terma#bayaran-balik" className="transition-colors hover:text-brand">
              {t.footer.refund}
            </Link>
          </nav>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{t.footer.contact}</div>
          <ContactLinks className="mt-4 flex flex-wrap gap-2" />
        </div>
      </div>
      <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">{t.footer.legal}</p>
    </footer>
  )
}
