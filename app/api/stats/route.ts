import { getCount, KEY, readList, setSize } from "@/lib/kv"
import { STATS_MIN } from "@/lib/product"

const DAY = 24 * 60 * 60 * 1000

export type RecentEvent =
  | { kind: "sale"; name: string | null; at: number }
  | { kind: "download"; state: string | null; at: number }

function parse<T>(raw: string[]): T[] {
  return raw.flatMap((r) => {
    try {
      return [JSON.parse(r) as T]
    } catch {
      return []
    }
  })
}

// Real numbers and events only. Counts are null until they reach STATS_MIN.
// `recent` mixes real purchases (last 30 days; masked name, see lib/mask.ts)
// and real Basic downloads (last 7 days; state only), newest first.
export async function GET() {
  try {
    const [downloads, sales, rawSales, rawDownloads] = await Promise.all([
      getCount(KEY.downloads),
      setSize(KEY.sales),
      readList(KEY.recent, 10),
      readList(KEY.recentDownloads, 10),
    ])
    const now = Date.now()
    const recent: RecentEvent[] = [
      ...parse<{ name?: unknown; at?: unknown }>(rawSales)
        .map((o) => ({ kind: "sale" as const, name: typeof o.name === "string" ? o.name : null, at: Number(o.at) }))
        .filter((e) => e.at >= now - 30 * DAY),
      ...parse<{ state?: unknown; at?: unknown }>(rawDownloads)
        .map((o) => ({ kind: "download" as const, state: typeof o.state === "string" ? o.state : null, at: Number(o.at) }))
        .filter((e) => e.at >= now - 7 * DAY),
    ]
      .sort((a, b) => b.at - a.at)
      .slice(0, 10)

    return Response.json(
      {
        downloads: downloads >= STATS_MIN.downloads ? downloads : null,
        sales: sales >= STATS_MIN.sales ? sales : null,
        recent,
      },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    )
  } catch (err) {
    console.error("Stats read failed", err)
    return Response.json({ downloads: null, sales: null, recent: [] })
  }
}
