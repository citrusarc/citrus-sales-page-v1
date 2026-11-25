"use client"

import * as React from "react"

import { dict, type Dict, type Lang } from "@/lib/dict"

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void }

const LangContext = React.createContext<Ctx | null>(null)
const KEY = "ca-lang"

const homePath = (l: Lang) => (l === "en" ? "/en" : "/")

/**
 * Language for the page.
 * - urlBased (the home pages "/" and "/en"): the URL decides. Switching
 *   language goes to the other home page, and the choice is remembered.
 * - otherwise (terms, privacy, thank-you): starts at `initial`, then follows
 *   the language the visitor chose before; switching happens in place.
 */
export function LangProvider({
  children,
  initial = "bm",
  urlBased = false,
}: {
  children: React.ReactNode
  initial?: Lang
  urlBased?: boolean
}) {
  const [lang, setLangState] = React.useState<Lang>(initial)

  React.useEffect(() => {
    try {
      if (urlBased) {
        localStorage.setItem(KEY, initial)
        return
      }
      const saved = localStorage.getItem(KEY)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved preference after hydration
      if (saved === "en" || saved === "bm") setLangState(saved)
    } catch {}
  }, [initial, urlBased])

  React.useEffect(() => {
    document.documentElement.lang = lang === "bm" ? "ms" : "en"
  }, [lang])

  const setLang = React.useCallback(
    (l: Lang) => {
      try {
        localStorage.setItem(KEY, l)
      } catch {}
      if (urlBased && l !== initial) {
        window.location.assign(homePath(l) + window.location.hash)
        return
      }
      setLangState(l)
    },
    [urlBased, initial]
  )

  const value = React.useMemo(() => ({ lang, t: dict[lang], setLang }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = React.useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used inside LangProvider")
  return ctx
}

/** "/" or "/en", for links back to the home page in the current language. */
export const homeHref = (l: Lang) => homePath(l)
