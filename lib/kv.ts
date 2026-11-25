// Server-side only. A tiny key-value store for the email log and the public
// counts. Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are set (needed on
// serverless hosts; safe to share with citrus-class-v1, every key here starts
// with "meta-ads:"), otherwise a local file in .data/ (fine for `next dev`).

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

export const KEY = {
  mailed: (purchaseId: string) => `meta-ads:mailed:${purchaseId}`,
  sales: "meta-ads:sales", // set of paid purchase ids
  downloads: "meta-ads:basic-downloads", // counter
  alertName: (purchaseId: string) => `meta-ads:alert-name:${purchaseId}`, // masked name, only with consent
  recent: "meta-ads:recent", // list of recent real purchases, newest first
} as const

const redisEnabled = () => Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
    body: JSON.stringify(command),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`)
  return (await res.json()).result as T
}

// --- local file fallback ---

type FileData = {
  keys: Record<string, number>
  sets: Record<string, string[]>
  counters: Record<string, number>
  values: Record<string, string>
  lists: Record<string, string[]>
}
const FILE = path.join(process.cwd(), ".data", "kv.json")

async function load(): Promise<FileData> {
  try {
    const d = JSON.parse(await readFile(FILE, "utf8"))
    return { keys: d.keys ?? {}, sets: d.sets ?? {}, counters: d.counters ?? {}, values: d.values ?? {}, lists: d.lists ?? {} }
  } catch {
    return { keys: {}, sets: {}, counters: {}, values: {}, lists: {} }
  }
}

// Serialises file access within this process so two writes can't interleave.
let queue: Promise<unknown> = Promise.resolve()
function withFile<T>(fn: (d: FileData) => T, write = true): Promise<T> {
  const run = queue.then(async () => {
    const d = await load()
    const out = fn(d)
    if (write) {
      await mkdir(path.dirname(FILE), { recursive: true })
      await writeFile(FILE, JSON.stringify(d, null, 2))
    }
    return out
  })
  queue = run.catch(() => {})
  return run
}

// --- operations ---

/** Sets the key only if it doesn't exist. True if this call set it. */
export async function setOnce(key: string, ttlSeconds: number): Promise<boolean> {
  if (redisEnabled()) return (await redis<string | null>(["SET", key, Date.now(), "NX", "EX", ttlSeconds])) === "OK"
  return withFile((d) => {
    if (d.keys[key]) return false
    d.keys[key] = Date.now()
    return true
  })
}

export async function del(key: string) {
  if (redisEnabled()) return void (await redis(["DEL", key]))
  await withFile((d) => {
    delete d.keys[key]
  })
}

/** Adds a member to a set. True if it wasn't there before. */
export async function addToSet(key: string, member: string): Promise<boolean> {
  if (redisEnabled()) return (await redis<number>(["SADD", key, member])) === 1
  return withFile((d) => {
    const s = new Set(d.sets[key] ?? [])
    if (s.has(member)) return false
    s.add(member)
    d.sets[key] = [...s]
    return true
  })
}

export async function setSize(key: string): Promise<number> {
  if (redisEnabled()) return Number(await redis<number>(["SCARD", key])) || 0
  return withFile((d) => (d.sets[key] ?? []).length, false)
}

export async function incr(key: string): Promise<number> {
  if (redisEnabled()) return Number(await redis<number>(["INCR", key]))
  return withFile((d) => (d.counters[key] = (d.counters[key] ?? 0) + 1))
}

export async function setValue(key: string, value: string, ttlSeconds: number) {
  if (redisEnabled()) return void (await redis(["SET", key, value, "EX", ttlSeconds]))
  await withFile((d) => {
    d.values[key] = value
  })
}

export async function getValue(key: string): Promise<string | null> {
  if (redisEnabled()) return await redis<string | null>(["GET", key])
  return withFile((d) => d.values[key] ?? null, false)
}

/** Adds to the front of a list and keeps only the newest `max` entries. */
export async function pushCapped(key: string, value: string, max: number) {
  if (redisEnabled()) {
    await redis(["LPUSH", key, value])
    await redis(["LTRIM", key, 0, max - 1])
    return
  }
  await withFile((d) => {
    d.lists[key] = [value, ...(d.lists[key] ?? [])].slice(0, max)
  })
}

export async function readList(key: string, max: number): Promise<string[]> {
  if (redisEnabled()) return (await redis<string[] | null>(["LRANGE", key, 0, max - 1])) ?? []
  return withFile((d) => (d.lists[key] ?? []).slice(0, max), false)
}

export async function getCount(key: string): Promise<number> {
  if (redisEnabled()) return Number(await redis<string | null>(["GET", key])) || 0
  return withFile((d) => d.counters[key] ?? 0, false)
}
