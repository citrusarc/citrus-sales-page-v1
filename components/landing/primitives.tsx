"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

/** Small tracked label with a sparkle, as on citrusarc.studio. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-brand-ink uppercase",
        className
      )}
    >
      <Sparkles className="size-3.5" />
      {children}
    </span>
  )
}

/** Left-aligned section header: label + heading, with the sub-line on the right. */
export function SectionHead({
  eyebrow,
  title,
  sub,
  className,
}: {
  eyebrow: string
  title: string
  sub?: string
  className?: string
}) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end", className)}>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-4xl leading-[0.95] font-semibold tracking-tight text-balance uppercase sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>
      {sub && <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">{sub}</p>}
    </div>
  )
}

type PillVariant = "brand" | "light" | "dark" | "outline"
type PillOwn = { icon?: React.ReactNode; variant?: PillVariant }

const PILL = {
  brand: "bg-brand text-white border-brand hover:bg-white hover:text-brand",
  light: "bg-white text-ink border-white hover:bg-brand hover:border-brand hover:text-white",
  dark: "bg-ink text-white border-ink hover:bg-brand hover:border-brand",
  outline: "bg-transparent text-current border-current/25 hover:border-current",
}
const PILL_ICON = {
  brand: "bg-white text-brand group-hover:bg-brand group-hover:text-white",
  light: "bg-ink text-white group-hover:bg-white group-hover:text-brand",
  dark: "bg-white text-ink group-hover:text-brand",
  outline: "bg-current/10",
}

function pillClass(variant: PillVariant, className?: string) {
  return cn(
    "group inline-flex min-h-14 max-w-full items-center gap-3 rounded-full border py-1.5 pr-1.5 pl-6 text-center leading-tight font-semibold transition-colors sm:gap-4 sm:whitespace-nowrap duration-200 disabled:pointer-events-none disabled:opacity-60",
    PILL[variant],
    className
  )
}

function PillInner({ children, icon, variant }: { children: React.ReactNode; icon: React.ReactNode; variant: PillVariant }) {
  return (
    <>
      <span className="nudge-y mx-auto min-w-0">{children}</span>
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-200",
          PILL_ICON[variant]
        )}
      >
        <span className="nudge-x">{icon}</span>
      </span>
    </>
  )
}

/** The Citrus Arc call to action: a label with its icon in a circle. */
export function Pill({
  children,
  icon = <ArrowRight className="size-5" />,
  variant = "brand",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & PillOwn) {
  return (
    <button className={pillClass(variant, className)} {...props}>
      <PillInner icon={icon} variant={variant}>
        {children}
      </PillInner>
    </button>
  )
}

/** Same as Pill, as a plain link (downloads, external pages). */
export function PillLink({
  children,
  icon = <ArrowRight className="size-5" />,
  variant = "brand",
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & PillOwn) {
  return (
    <a className={pillClass(variant, className)} {...props}>
      <PillInner icon={icon} variant={variant}>
        {children}
      </PillInner>
    </a>
  )
}

/** Counts up from 0 when first visible. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [n, setN] = React.useState(0)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1000)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  )
}

/** Renders [text](url) links inside a plain string. */
export function Rich({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!m) return <React.Fragment key={i}>{p}</React.Fragment>
        const [, label, href] = m
        const cls =
          linkClassName ?? "font-medium text-brand-ink underline decoration-brand-ink/30 underline-offset-2 hover:decoration-brand-ink"
        return href.startsWith("/") ? (
          <Link key={i} href={href} className={cls}>
            {label}
          </Link>
        ) : (
          <a key={i} href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>
        )
      })}
    </>
  )
}
