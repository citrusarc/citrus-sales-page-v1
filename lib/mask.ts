/**
 * Masks a buyer's name for purchase alerts. Works with Malaysian naming:
 *
 *   Malay    "Ahmad Farhan bin Ali"    → "Ahmad Fa***n"    (common prefix kept)
 *            "Muhammad Hafiz"          → "Muhammad Ha***z"
 *            "Nur Syazwan" / "Siti Aminah binti Yusof" → "Nur Sy***an" / "Siti Am***h"
 *   Indian   "Kavitha a/p Subramaniam" → "Ka***ha"        (patronymic dropped)
 *            "R. Kumaresan"            → "R. Kum***an"    (initial kept)
 *   Chinese  "Tan Wei Ming"            → "Tan W***"       (surname + masked given name)
 *            "Jason Lim"               → "Ja***n"
 *   Other    "Priya Devi"              → "Pr***a"
 *
 * Never shows a full word other than a very common prefix, initial or surname.
 * Returns null when there's nothing usable.
 */

// Everything from here on is a parent's name or a connector, never shown.
const CONNECTORS = new Set(["bin", "binti", "bt", "bte", "bnt", "b", "a/l", "a/p", "s/o", "d/o", "al", "ap", "anak", "ak", "@"])

// Very common first words that identify nobody on their own.
const PREFIXES = new Set([
  "muhammad", "mohammad", "mohamad", "mohamed", "muhamad", "muhammed", "mohd", "muhd", "md",
  "nur", "nurul", "noor", "nor", "siti", "abdul", "abd", "ahmad", "wan", "nik", "che",
  "tengku", "tunku", "raja", "syed", "sharifah", "syarifah", "puteri", "awang", "dayang",
])

// Common Malaysian Chinese surnames (romanised), written first.
const CHINESE_SURNAMES = new Set([
  "tan", "lim", "lee", "li", "ng", "wong", "ong", "chan", "chen", "teo", "goh", "chong", "chua", "koh",
  "lau", "low", "yap", "ho", "liew", "leong", "cheah", "khoo", "yeoh", "teh", "tay", "foo", "chin",
  "cheng", "loh", "choo", "kok", "hew", "ooi", "lai", "kang", "chew", "phang", "siow", "soh", "toh",
  "wee", "yeo", "yong", "yu", "chang", "chia", "chiew", "choy", "fong", "hii", "ling", "liow", "mah",
  "neo", "pang", "poh", "quek", "seah", "sim", "tee", "thong", "tiong", "woo", "wu", "yew",
])

export function maskName(full: string): string | null {
  const raw = full.trim().split(/\s+/).filter(Boolean)
  const words: string[] = []
  for (const r of raw) {
    if (CONNECTORS.has(r.toLowerCase().replace(/\.$/, ""))) break
    const w = r.replace(/[^\p{L}'-]/gu, "")
    if (w) words.push(w)
  }
  if (!words.length) return null

  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  const mask = (w: string) => {
    const start = w.length >= 8 ? 3 : w.length >= 5 ? 2 : 1
    const end = w.length >= 7 ? 2 : w.length >= 5 ? 1 : 0
    return cap(w.slice(0, start)) + "***" + w.slice(w.length - end).toLowerCase()
  }
  const initial = (w: string) => cap(w.charAt(0)) + "***"

  const [first, ...rest] = words
  const lower = first.toLowerCase()

  // Chinese order: surname first, then the given name (often 2 syllables).
  // ("Wan" is left to the Malay prefix rule; "Wan Jia Hui" still → "Wan J***".)
  if (CHINESE_SURNAMES.has(lower) && rest.length) return `${cap(first)} ${initial(rest[0])}`

  // Initial like "R." or "K": keep it and mask the next name.
  if (first.length === 1 && rest.length) return `${cap(first)}. ${mask(rest[0])}`

  // Common prefixes (up to two, e.g. "Wan Nur"): keep them, mask the first real name.
  let i = 0
  while (i < words.length - 1 && i < 2 && PREFIXES.has(words[i].toLowerCase())) i++
  if (i > 0) return `${words.slice(0, i).map(cap).join(" ")} ${mask(words[i])}`

  return mask(first)
}
