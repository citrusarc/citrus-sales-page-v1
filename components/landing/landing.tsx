"use client"

import { ActionsProvider } from "@/components/landing/actions"
import { AdDoctor } from "@/components/landing/ad-doctor"
import { Faq } from "@/components/landing/faq"
import { FinalCta, Footer } from "@/components/landing/final-cta"
import { Hero } from "@/components/landing/hero"
import { Marquee } from "@/components/landing/marquee"
import { Modules } from "@/components/landing/modules"
import { Myths } from "@/components/landing/myths"
import { Nav } from "@/components/landing/nav"
import { Pricing } from "@/components/landing/pricing"
import { PurchaseAlerts } from "@/components/landing/purchase-alerts"
import { Tutorial } from "@/components/landing/tutorial"
import type { Price } from "@/lib/product"

export function Landing({ price }: { price: Price }) {
  return (
    <ActionsProvider price={price}>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Myths />
        <AdDoctor />
        <Modules />
        <Pricing />
        <Tutorial />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <PurchaseAlerts />
    </ActionsProvider>
  )
}
