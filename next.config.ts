import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // The paid zip (private/) is bundled into server code at build time by
  // scripts/embed-zip.mjs, so it works on Cloudflare Workers too.
}

export default nextConfig
