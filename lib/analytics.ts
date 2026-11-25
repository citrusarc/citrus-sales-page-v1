// Events for Google Tag Manager / GA4. They go into the dataLayer; GTM decides
// what to send. Consent Mode (see app/layout.tsx) means GA only sets cookies
// after the visitor allows it in the cookie notice.

type DataLayerEvent = { event: string; [key: string]: unknown }

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  // GA4 recommends clearing the previous ecommerce object first.
  if ("ecommerce" in params) window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({ event, ...params } satisfies DataLayerEvent)
}

const ITEM = { item_id: "meta-ads-advanced", item_name: "Meta Ads Advanced" }

export const analytics = {
  downloadBasic: () => track("file_download", { file_name: "meta-ads-basic.zip", link_text: "Download Basic" }),
  beginCheckout: (priceRM: number) =>
    track("begin_checkout", { ecommerce: { currency: "MYR", value: priceRM, items: [{ ...ITEM, price: priceRM }] } }),
  purchase: (transactionId: string, valueRM: number) =>
    track("purchase", {
      ecommerce: { transaction_id: transactionId, currency: "MYR", value: valueRM, items: [{ ...ITEM, price: valueRM }] },
    }),
}
