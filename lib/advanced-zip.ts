// Server-side only. The paid skill file, bundled at build time
// (scripts/embed-zip.mjs) so it works on Cloudflare Workers, which have no file
// system. To ship a new version: replace private/meta-ads-advanced.zip and build.
import { ADVANCED_ZIP_BASE64 } from "@/lib/generated/advanced-zip"

export const advancedZipBase64 = () => ADVANCED_ZIP_BASE64

export const advancedZipBytes = () => Uint8Array.from(atob(ADVANCED_ZIP_BASE64), (c) => c.charCodeAt(0))
