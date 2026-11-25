# Meta Ads Skill — sales page

Landing page for the Citrus Arc **Meta Ads** Claude skills. BM by default, EN toggle.

- **Basic** (free): `public/downloads/meta-ads-basic.zip`, served directly.
- **Advanced** (paid, price in `lib/product.ts`): `private/meta-ads-advanced.zip`, only served by
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
