import { dict } from "@/lib/dict"
import { currentPrice } from "@/lib/product"
import { SITE_URL, STUDIO } from "@/lib/site"

// llms.txt: a plain summary for AI assistants (llmstxt.org). Built from the same
// copy as the page, with the price worked out at request time.
export const revalidate = 300

export function GET() {
  const p = currentPrice()
  const en = dict.en
  const launch = p.launchEndsAt
    ? `RM${p.priceRM} launch price until ${p.launchEndsAt.slice(0, 10)}, then RM${p.regularRM}`
    : `RM${p.priceRM}`

  const body = `# Meta Ads Skill for Claude

> Claude skills that teach Claude to run Facebook and Instagram (Meta) ads for Malaysian SMEs, in Malay or English. Built by ${STUDIO.name} (SSM ${STUDIO.registration}), ${STUDIO.locality}, ${STUDIO.region}, Malaysia. Not affiliated with Meta or Anthropic.

## Products

- Meta Ads Basic — free download. Boost vs Ads Manager and choosing the objective, 5 hooks and 3 full ads in Malay or English, reading Ads Manager results from a screenshot, a 4-point landing page check.
- Meta Ads Advanced — ${launch}, one-time payment via CHIP (FPX, cards, e-wallets). Everything in Basic plus a full account audit from an Ads Manager CSV (score /100, wasted spend in RM), creative analysis (hook and hold rate), anomaly and fatigue checks, testing and scaling rules, Click-to-WhatsApp funnel with sales tracker, Malaysian ad compliance (KKLIU, NPRA, JAKIM halal, PDPA), competitor research in Meta Ad Library, and weekly client reports. Licence covers your own business and your own clients.

## Modules

${en.modules.items.map((m) => `- ${m.title}${m.tier === "advanced" ? " (Advanced)" : ""}: ${m.desc}`).join("\n")}

## How to install

- Claude.ai / Desktop: Settings → Capabilities → turn on Code execution and file creation; then Customize → Skills → + → Create skill → Upload a skill → choose the .zip.
- Claude Code: unzip the file into ~/.claude/skills/, run claude, then type /meta-ads-basic or /meta-ads-advanced.

## FAQ

${en.faq.items.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Links

- [Home, Malay](${SITE_URL}/)
- [Home, English](${SITE_URL}/en)
- [Terms and refund policy](${SITE_URL}/terma)
- [Privacy policy](${SITE_URL}/privasi)
- [${STUDIO.name}](${STUDIO.url})
- Contact: ${STUDIO.email}
`
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
