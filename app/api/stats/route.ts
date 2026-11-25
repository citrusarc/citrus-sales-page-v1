import { getCount, KEY, readList, setSize } from "@/lib/kv"
import { STATS_MIN } from "@/lib/product"

const RECENT_DAYS = 30

// Real numbers only. Counts are null until they reach STATS_MIN; `recent` is
// the last real purchases (masked name only when the buyer agreed).
export async function GET() {
  try {
    const [downloads, sales, raw] = await Promise.all([
      getCount(KEY.downloads),
      setSize(KEY.sales),
      readList(KEY.recent, 10),
    ])
    const since = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000
    const recent = raw
      .map((r) => {
        try {
          const o = JSON.parse(r) as { name?: string | null; at?: number }
          return { name: typeof o.name === "string" ? o.name : null, at: Number(o.at) }
        } catch {
          return null
        }
      })
      .filter((r): r is { name: string | null; at: number } => !!r && r.at >= since)

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
