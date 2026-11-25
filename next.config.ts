import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // The paid zip lives outside /public so it can only be served (or emailed)
  // after a CHIP payment is verified. Make sure it ships with those routes.
  outputFileTracingIncludes: {
    "/api/download/advanced": ["./private/**/*"],
    "/terima-kasih": ["./private/**/*"],
    "/api/chip/callback": ["./private/**/*"],
  },
}

export default nextConfig
