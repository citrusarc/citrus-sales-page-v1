# Meta Ads Skill — sales page

Landing page for the Citrus Arc **Meta Ads** Claude skills. BM by default, EN toggle.

- **Basic** (free): `public/downloads/meta-ads-basic.zip`, served directly.
- **Advanced** (paid, price and launch deadline in `PRICING`, `lib/product.ts`): `private/meta-ads-advanced.zip`, only served by
  `/api/download/advanced` after a CHIP purchase is verified as `paid`.

## Setup

```bash
cp .env.example .env.local   # CHIP + Mailjet keys (same as citrus-class-v1)
npm run dev
```

Local uses the CHIP test account; production uses the live key. Set NEXT_PUBLIC_SITE_URL and the
Upstash vars in production.
Contact details shown on the page live in `CONTACT` in `lib/product.ts`.

## Payment flow

1. Buy dialog → `POST /api/checkout` creates a CHIP purchase (reference `meta-ads-advanced`) and stores
   the purchase ID in an httpOnly cookie.
2. Visitor pays on CHIP → redirected to `/terima-kasih`.
3. `/terima-kasih` and `/api/download/advanced` ask CHIP for the purchase and only unlock the zip if
   it is `paid`, belongs to your brand and has the `meta-ads-advanced` reference.

Failed payments return to `/?bayar=gagal#harga` (a toast explains it).

## Delivery email

CHIP's own receipt is off (`send_receipt: false`). Instead `lib/deliver.ts` emails the buyer through
Mailjet with `meta-ads-advanced.zip` attached and install steps, plus a short "new sale" note to
`ADMIN_EMAIL`. It is triggered from two places so nobody is missed:

- `/terima-kasih`, when the buyer comes back from CHIP;
- `/api/chip/callback` (CHIP `success_callback`, signature checked), for buyers who close the tab.
  Only registered when the site runs on a public https URL.

`lib/sent-log.ts` makes sure each purchase is emailed once (Upstash Redis in production, `.data/` locally).
The Upstash database can be the same one citrus-class-v1 uses: this site only writes keys under
`meta-ads:mailed:*`, which don't overlap with citrus-class's `booking:*`, `bookings`, `discounts`,
`feedback` or `admin-devices`.
Preview the email locally at `/api/dev/email-preview`, and each thank-you state at
`/terima-kasih?preview=paid|failed|pending|missing` (both are off in production).

## Updating the skills

Replace the zips in `public/downloads/` and `private/`. Each zip must contain the skill folder at the
top level (`meta-ads-basic/SKILL.md`), not loose files.

## Notes

- `private/` must be deployed with the app (it is included in the download route's trace via
  `next.config.ts`). Keep this repo private: committing `private/` puts the paid zip in git history.
- Content (both languages) lives in `lib/dict.ts`.

## Real counts and purchase alerts

All from real data in the same store (`lib/kv.ts`), nothing invented:

- **Advanced buyers**: paid CHIP purchases, counted once per purchase ID when the email is sent.
- **Basic downloads**: counted when the Download button is clicked, once per browser.
- Each count stays hidden until it reaches `STATS_MIN` in `lib/product.ts`.
- **Purchase alerts** (bottom-right) show the last real purchases from the past 30 days. A masked name
  (`lib/mask.ts`, e.g. "Nur Sy***an") appears only if the buyer ticked the opt-in box at checkout
  (PDPA); otherwise it says "Seseorang". No sales, no alerts.

## Legal pages and share image

- `/terma` (terms, licence, refund policy at `/terma#bayaran-balik`) and `/privasi` (PDPA notice), BM and EN.
  Content lives in `lib/legal.ts`; bump `LEGAL_UPDATED` when you change it. Linked from the footer, the FAQ
  and the buy form.
- `public/og-image.png` is the link preview for WhatsApp, Facebook and X (no
  price on it, so it stays right when the launch price ends). Source: `scripts/share-image.html`.

## Launch price

`PRICING` in `lib/product.ts`: RM19 until 31 Dec 2026 23:59 MYT, then RM29. The price is worked out on the
server, so the page, the countdown and what CHIP charges all switch at the deadline on their own (the home
page re-renders every 5 minutes; an open tab switches itself). Set `launch` to `null` to remove it.

## Alerts

Bottom-right alerts show real events only: paid Advanced purchases (masked name) and Basic downloads
("Seseorang dari Selangor download Meta Ads Basic"). The state comes from the host's geo headers
(Vercel or Cloudflare with visitor location headers on); without them it just says "Seseorang".

## SEO, AEO, GEO and analytics

- **Metadata** (`app/layout.tsx`): title, description, canonical, Open Graph and Twitter cards. Needs
  `NEXT_PUBLIC_SITE_URL` in production for absolute URLs.
- **Structured data** (`lib/schema.ts`, rendered in `app/page.tsx`): Organization (same `@id` as
  citrusarc.studio), WebSite, WebPage, two Products with real Offers (Advanced at today's price, valid until
  the launch deadline) and the FAQ.
- **Crawlers**: `/robots.txt` names the AI answer-engine bots (as on citrusarc.studio) and keeps `/api/` and
  `/terima-kasih` out; `/sitemap.xml`; `/llms.txt` (plain-English summary for AI assistants, price at request time).
- **Analytics**: Google Tag Manager `NEXT_PUBLIC_GTM_ID` (default GTM-K9CKZQXK), production builds only, with
  Consent Mode (analytics cookies only after "Benarkan" in the cookie notice; ads storage always denied).
  dataLayer events for GTM triggers: `file_download` (Basic), `begin_checkout`, `purchase` (once per purchase,
  GA4 ecommerce format with `transaction_id`, `value`, `currency: MYR`).

## Google Tag Manager setup (one time)

`scripts/gtm-container.json` holds the tags for GTM-K9CKZQXK:

1. tagmanager.google.com → the container → **Admin → Import Container** → choose `scripts/gtm-container.json`.
2. Workspace: *Existing (Default Workspace)*. Option: **Merge → Rename conflicting tags, triggers and variables**.
3. Check the variable **GA4 Measurement ID** (`G-KMB66XBXLG`, the citrusarc.studio stream; Google recommends one
   stream for a domain and its subdomains, filter by hostname in GA4). Use another `G-` ID if you prefer.
4. **Preview** on metaads.citrusarc.studio (allow cookies, download Basic → `file_download` fires), then **Submit**.
5. GA4 → Admin → Events: mark `purchase` as a key event.

If the import is refused, create the same by hand: a *Google tag* (tag ID = the G- ID, trigger
*Initialization – All Pages*), and three *GA4 Event* tags (`purchase` and `begin_checkout` with
"Send Ecommerce data" from the Data Layer; `file_download`), each on a *Custom Event* trigger with the same name.

## Cloudflare (OpenNext on Workers)

- **Build variables** (Workers → Settings → Build → Variables and secrets). `NEXT_PUBLIC_*` values are baked
  in at build time, so they must be here: `NEXT_PUBLIC_SITE_URL=https://metaads.citrusarc.studio`,
  `NEXT_PUBLIC_GTM_ID=GTM-K9CKZQXK`.
- **Runtime variables** (Workers → Settings → Variables and Secrets): everything else in `.env.example`.
  Use *Secret* for `CHIP_API_KEY`, `MAILJET_API_SECRET`, `MAILJET_API_KEY`, `UPSTASH_REDIS_REST_TOKEN`.
  Upstash is required on Workers (no file system for the local `.data/` fallback).
- The paid zip is bundled into server code by `npm run build` (`prebuild` → `scripts/embed-zip.mjs`), because
  Workers can't read `private/` from disk.
- For "Seseorang dari Selangor" download alerts: Rules → Transform Rules → Managed Transforms → turn on
  **Add visitor location headers**.
