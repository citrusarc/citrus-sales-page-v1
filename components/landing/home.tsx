import { Landing } from "@/components/landing/landing"
import type { Lang } from "@/lib/dict"
import { LangProvider } from "@/lib/i18n"
import { currentPrice } from "@/lib/product"
import { homeSchema } from "@/lib/schema"

/**
 * A home page in one language: "/" (BM) or "/en" (EN). The URL decides the
 * language, so switching it moves between the two pages, and both are
 * server-rendered in their own language for search engines.
 */
export function Home({ lang }: { lang: Lang }) {
  const price = currentPrice()
  return (
    <>
      <script
        type="application/ld+json"
        // "<" escaped so a string in the data can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema(price, lang)).replace(/</g, "\\u003c") }}
      />
      <LangProvider initial={lang} urlBased>
        <Landing price={price} />
      </LangProvider>
    </>
  )
}
