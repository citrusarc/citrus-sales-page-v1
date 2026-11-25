// Server-side only. Remembers which purchases already got their email, so the
// thank-you page and CHIP's callback never both send it.

import { del, KEY, setOnce } from "@/lib/kv"

/** True if this caller is the first to claim the purchase (and should send). */
export const claim = (purchaseId: string) => setOnce(KEY.mailed(purchaseId), 60 * 60 * 24 * 365)

/** Undo a claim after a failed send, so the next attempt can retry. */
export const release = (purchaseId: string) => del(KEY.mailed(purchaseId))
