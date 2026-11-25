"use client"

import * as React from "react"

import { dict, type Dict, type Lang } from "@/lib/dict"

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void }

const LangContext = React.createContext<Ctx | null>(null)
const KEY = "ca-lang"

export function LangProvider({ children }: { children: React.ReactNode }) {
  // BM is the default; EN is remembered per visitor once chosen.
  const [lang, setLangState] = React.useState<Lang>("bm")

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved preference after hydration
      if (saved === "en" || saved === "bm") setLangState(saved)
    } catch {}
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = lang === "bm" ? "ms" : "en"
  }, [lang])

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(KEY, l)
    } catch {}
  }, [])

  const value = React.useMemo(() => ({ lang, t: dict[lang], setLang }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = React.useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used inside LangProvider")
  return ctx
}
