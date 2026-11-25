import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

// Same list as citrusarc.studio: some answer engines skip a site unless their
// own user-agent is named, so listing them is what makes the page quotable in
// ChatGPT, Claude, Perplexity, Gemini and Copilot answers.
const ANSWER_ENGINE_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "Amazonbot",
  "CCBot",
  "DuckAssistBot",
  "meta-externalagent",
  "meta-externalfetcher",
]

// Checkout, downloads and the thank-you page have nothing to index.
const PRIVATE = ["/api/", "/terima-kasih"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...ANSWER_ENGINE_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
