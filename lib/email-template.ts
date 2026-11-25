// The buyer's email (BM or EN, in the language they used on the page): the
// skill file (attached), install steps and, since CHIP's own receipt is off,
// the purchase summary. Table-based with inline styles so
// it holds up in Gmail, Apple Mail and Outlook.

import { ADVANCED, CONTACT } from "@/lib/product"

export type EmailLang = "bm" | "en"

export type BuyerEmailInput = {
  name: string
  purchaseId: string
  siteUrl: string
  /** In sen, as CHIP reports it. */
  totalSen: number
  paidAt: Date
  /** The language the buyer was using on the page when they paid. */
  lang: EmailLang
}

const LOGO = "https://citrusarc.studio/Images/brand-logo.png"
const C = {
  ink: "#0a0a0a",
  brand: "#f84901",
  peach: "#ffd6a8",
  canvas: "#f6f5f3",
  border: "#e4e1dc",
  muted: "#6b6966",
}
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

const F = ADVANCED.file

// All buyer-facing words, per language. HTML allowed where noted.
const COPY = {
  bm: {
    locale: "ms-MY",
    subject: "Meta Ads Advanced — fail skill anda dah sampai",
    preheader: `${F} dilampirkan. Pasang dalam 2 minit dan mula tanya Claude pasal ads anda.`,
    eyebrow: "Meta Ads Advanced · Claude Skill",
    titleA: "Skill anda",
    titleB: "dah sampai.",
    thanks: "terima kasih! Claude anda kini boleh audit akaun, analisis creative dan rancang testing ads — dalam BM santai.",
    attached: "Dilampirkan dalam emel ini · jangan unzip untuk Claude.ai",
    installEyebrow: "Cara pasang",
    step1: "Settings → Capabilities → hidupkan <strong>Code execution and file creation</strong>.",
    step2: `Customize → Skills → <strong>+</strong> → Create skill → <strong>Upload a skill</strong> → pilih <span style="font:13px ${MONO}">${F}</span>.`,
    step3: "Pastikan suis skill <strong>ON</strong>, kemudian buka chat baru.",
    codeThen: (a: string, b: string) => `Kemudian jalankan ${a} dan taip ${b}.`,
    tutorialBtn: "Tengok tutorial penuh →",
    promptsEyebrow: "Cuba prompt ni dulu",
    prompts: [
      "Audit export.csv ni, target RM25 setiap result.",
      "Tulis 36 variasi ads untuk kedai kek saya, BM rojak.",
      "Banyak WhatsApp masuk tapi tak beli. Kenapa?",
    ],
    receiptEyebrow: "Ringkasan pembelian",
    product: "Produk",
    amount: "Jumlah",
    date: "Tarikh",
    paymentId: "ID pembayaran",
    licence: "Lesen: untuk bisnes anda sendiri &amp; client anda sendiri. Tolong jangan jual semula, kongsi atau upload skill ini.",
    help: (wa: string) => `Perlu bantuan? Balas emel ini atau ${wa}.`,
    waLabel: "WhatsApp kami",
    notAffiliated: "Tidak bersekutu dengan atau disokong oleh Meta Platforms, Inc.",
    textIntro: `Terima kasih kerana membeli Meta Ads Advanced! Fail ${F} dilampirkan dalam emel ini.`,
    textInstall: "CARA PASANG",
    textTry: "CUBA PROMPT NI",
    textTutorial: "Tutorial penuh",
    textHelp: "Perlu bantuan?",
  },
  en: {
    locale: "en-MY",
    subject: "Meta Ads Advanced — your skill file is here",
    preheader: `${F} is attached. Install it in 2 minutes and start asking Claude about your ads.`,
    eyebrow: "Meta Ads Advanced · Claude Skill",
    titleA: "Your skill",
    titleB: "is here.",
    thanks: "thank you! Your Claude can now audit ad accounts, analyse creatives and plan ad tests — in Malay or English.",
    attached: "Attached to this email · don't unzip it for Claude.ai",
    installEyebrow: "How to install",
    step1: "Settings → Capabilities → turn on <strong>Code execution and file creation</strong>.",
    step2: `Customize → Skills → <strong>+</strong> → Create skill → <strong>Upload a skill</strong> → choose <span style="font:13px ${MONO}">${F}</span>.`,
    step3: "Make sure the skill is switched <strong>ON</strong>, then start a new chat.",
    codeThen: (a: string, b: string) => `Then run ${a} and type ${b}.`,
    tutorialBtn: "See the full tutorial →",
    promptsEyebrow: "Try these prompts first",
    prompts: [
      "Audit this export.csv, target RM25 per result.",
      "Write 36 ad variations for my cake shop, in Malay and English.",
      "Lots of WhatsApp chats but no sales. Why?",
    ],
    receiptEyebrow: "Purchase summary",
    product: "Product",
    amount: "Amount",
    date: "Date",
    paymentId: "Payment ID",
    licence: "Licence: for your own business &amp; your own clients. Please don't resell, share or upload this skill.",
    help: (wa: string) => `Need help? Reply to this email or ${wa}.`,
    waLabel: "WhatsApp us",
    notAffiliated: "Not affiliated with or endorsed by Meta Platforms, Inc.",
    textIntro: `Thanks for buying Meta Ads Advanced! ${F} is attached to this email.`,
    textInstall: "HOW TO INSTALL",
    textTry: "TRY THESE PROMPTS",
    textTutorial: "Full tutorial",
    textHelp: "Need help?",
  },
} as const

const stripTags = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&")

export function buyerEmail({ name, purchaseId, siteUrl, totalSen, paidAt, lang }: BuyerEmailInput) {
  const t = COPY[lang]
  const first = name.split(/\s+/)[0] ?? ""
  const hi = first ? `Hi ${first},` : "Hi,"
  const tutorial = `${siteUrl}${lang === "en" ? "/en" : "/"}#tutorial`
  const amount = `RM${(totalSen / 100).toFixed(2)}`
  const date = new Intl.DateTimeFormat(t.locale, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(paidAt)

  const text = `${hi}

${t.textIntro}

${t.receiptEyebrow.toUpperCase()}
${t.product}: Meta Ads Advanced (Claude Skill)
${t.amount}: ${amount}
${t.date}: ${date}
${t.paymentId}: ${purchaseId}

${t.textInstall} — Claude.ai / Desktop
1. ${stripTags(t.step1)}
2. ${stripTags(t.step2)}
3. ${stripTags(t.step3)}

${t.textInstall} — Claude Code
  unzip ~/Downloads/${F} -d ~/.claude/skills/
${t.codeThen('"claude"', "/meta-ads-advanced")}

${t.textTry}
${t.prompts.map((p) => `- "${p}"`).join("\n")}

${t.textTutorial}: ${tutorial}

${stripTags(t.licence)}

${t.textHelp} WhatsApp ${CONTACT.whatsapp} · ${CONTACT.email}
Citrus Arc Studio — ${CONTACT.site}
`

  const step = (n: number, html: string) => `
    <tr>
      <td width="36" valign="top" style="padding:0 0 14px">
        <div style="width:26px;height:26px;line-height:26px;border-radius:13px;background:${C.brand};color:#fff;font:600 13px/26px ${FONT};text-align:center">${n}</div>
      </td>
      <td valign="top" style="padding:3px 0 14px;font:15px/1.5 ${FONT};color:${C.ink}">${html}</td>
    </tr>`

  const row = (label: string, value: string, mono = false) => `
    <tr>
      <td style="padding:10px 0;border-top:1px solid ${C.border};font:14px ${FONT};color:${C.muted}">${label}</td>
      <td align="right" style="padding:10px 0;border-top:1px solid ${C.border};font:${mono ? `12px ${MONO}` : `600 14px ${FONT}`};color:${C.ink}">${value}</td>
    </tr>`

  const prompt = (s: string) => `
    <tr><td style="padding:0 0 8px">
      <div style="background:${C.canvas};border:1px solid ${C.border};border-radius:12px;padding:12px 14px;font:14px/1.45 ${FONT};color:${C.ink}">
        <span style="color:${C.brand}">✦</span>&nbsp; ${esc(s)}
      </div>
    </td></tr>`

  const card = (inner: string, pad = 28) =>
    `<tr><td style="padding:0 0 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid ${C.border};border-radius:20px"><tr><td style="padding:${pad}px">${inner}</td></tr></table></td></tr>`

  const eyebrow = (s: string, color: string = C.brand) =>
    `<div style="font:600 11px ${FONT};letter-spacing:2px;text-transform:uppercase;color:${color}">${s}</div>`

  const h2 = (s: string, top = 8) =>
    `<h2 style="margin:${top}px 0 16px;font:700 20px ${FONT};text-transform:uppercase;letter-spacing:-.3px;color:${C.ink}">${s}</h2>`

  const code = (s: string) => `<span style="font:13px ${MONO};color:${C.ink}">${s}</span>`

  const html = `<!doctype html>
<html lang="${lang === "bm" ? "ms" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(t.subject)}</title></head>
<body style="margin:0;padding:0;background:${C.canvas}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas}">
<tr><td align="center" style="padding:28px 12px 40px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">

  <tr><td style="padding:0 4px 18px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td><img src="${LOGO}" width="40" height="25" alt="Citrus Arc" style="display:block;border:0"></td>
      <td style="padding-left:10px;font:600 14px ${FONT};color:${C.ink}">Citrus Arc Studio</td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 0 12px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.ink}" style="background:${C.ink};border-radius:24px">
      <tr><td style="padding:36px 32px 32px">
        ${eyebrow(t.eyebrow)}
        <h1 style="margin:14px 0 0;font:700 34px/1 ${FONT};letter-spacing:-1px;text-transform:uppercase;color:#ffffff">${t.titleA}<br><span style="color:${C.brand}">${t.titleB}</span></h1>
        <p style="margin:18px 0 0;font:16px/1.55 ${FONT};color:#b5b3b0">${esc(hi)} ${t.thanks}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr>
          <td style="background:#1c1c1c;border:1px solid #2e2e2e;border-radius:14px;padding:12px 16px">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="font:20px ${FONT};padding-right:12px">📎</td>
              <td>
                <div style="font:600 14px ${MONO};color:#ffffff">${F}</div>
                <div style="font:12px ${FONT};color:#8a8885;margin-top:2px">${t.attached}</div>
              </td>
            </tr></table>
          </td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>

  ${card(`
    ${eyebrow(t.installEyebrow)}
    ${h2("Claude.ai / Desktop")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${step(1, t.step1)}
      ${step(2, t.step2)}
      ${step(3, t.step3)}
    </table>
    ${h2("Claude Code", 10)}
    <div style="background:${C.ink};border-radius:12px;padding:14px 16px;font:13px/1.5 ${MONO};color:#ffffff;word-break:break-all"><span style="color:${C.brand}">$</span> unzip ~/Downloads/${F} -d ~/.claude/skills/</div>
    <p style="margin:12px 0 22px;font:14px/1.5 ${FONT};color:${C.muted}">${t.codeThen(code("claude"), code("/meta-ads-advanced"))}</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td bgcolor="${C.brand}" style="border-radius:999px">
        <a href="${esc(tutorial)}" style="display:inline-block;padding:14px 24px;font:600 15px ${FONT};color:#ffffff;text-decoration:none;border-radius:999px">${t.tutorialBtn}</a>
      </td>
    </tr></table>
  `)}

  ${card(`
    ${eyebrow(t.promptsEyebrow)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px">
      ${t.prompts.map(prompt).join("")}
    </table>
  `, 24)}

  ${card(`
    ${eyebrow(t.receiptEyebrow, C.muted)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">
      ${row(t.product, "Meta Ads Advanced")}
      ${row(t.amount, esc(amount))}
      ${row(t.date, esc(date))}
      ${row(t.paymentId, esc(purchaseId), true)}
    </table>
    <p style="margin:14px 0 0;font:13px/1.5 ${FONT};color:${C.muted}">${t.licence}</p>
  `, 24)}

  <tr><td align="center" style="padding:20px 8px 0">
    <p style="margin:0;font:14px/1.6 ${FONT};color:${C.ink}">${t.help(`<a href="${CONTACT.whatsapp}" style="color:${C.brand};font-weight:600;text-decoration:none">${t.waLabel}</a>`)}</p>
    <p style="margin:14px 0 0;font:12px/1.6 ${FONT};color:${C.muted}">
      <a href="${CONTACT.site}" style="color:${C.muted}">Citrus Arc Studio</a> · Cyberjaya, Malaysia<br>
      ${t.notAffiliated}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`

  return { subject: t.subject, text, html }
}

// --- Studio notification: one per real sale, to ADMIN_EMAIL ---

export type SaleEmailInput = {
  buyerName: string
  buyerEmail: string
  purchaseId: string
  totalSen: number
  paidAt: Date
  /** How many real Advanced sales so far, including this one. */
  saleNumber: number | null
  /** What the public purchase alert shows for this sale. */
  alertName: string | null
  /** Language of the email the buyer received. */
  buyerLang: EmailLang
  siteUrl: string
}

export function saleEmail(i: SaleEmailInput) {
  const amount = `RM${(i.totalSen / 100).toFixed(2)}`
  const date = new Intl.DateTimeFormat("ms-MY", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(i.paidAt)
  const nth = i.saleNumber ? `Jualan ke-${i.saleNumber}` : "Jualan baru"
  const subject = `💰 ${nth}: Meta Ads Advanced — ${amount}`
  const alert = i.alertName ?? "Seseorang (tiada nama)"
  const reply = `mailto:${i.buyerEmail}?subject=${encodeURIComponent("Meta Ads Advanced — Citrus Arc Studio")}`

  const text = `${nth} — Meta Ads Advanced, ${amount}

Pembeli: ${i.buyerName || "(tiada nama)"}
Emel: ${i.buyerEmail}
Tarikh: ${date}
ID pembayaran (CHIP): ${i.purchaseId}
Notifikasi di laman: ${alert}
Fail skill: dah diemel ke pembeli

Laman: ${i.siteUrl}
`

  const row = (label: string, value: string, mono = false) => `
    <tr>
      <td style="padding:11px 0;border-top:1px solid ${C.border};font:14px ${FONT};color:${C.muted}">${label}</td>
      <td align="right" style="padding:11px 0;border-top:1px solid ${C.border};font:${mono ? `12px ${MONO}` : `600 14px ${FONT}`};color:${C.ink}">${value}</td>
    </tr>`

  const button = (href: string, label: string, primary: boolean) =>
    `<td bgcolor="${primary ? C.brand : "#ffffff"}" style="border-radius:999px;${primary ? "" : `border:1px solid ${C.border};`}">
      <a href="${esc(href)}" style="display:inline-block;padding:12px 20px;font:600 14px ${FONT};color:${primary ? "#ffffff" : C.ink};text-decoration:none;border-radius:999px">${label}</a>
    </td>`

  const html = `<!doctype html>
<html lang="ms"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.canvas}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(`${amount} dari ${i.buyerEmail}`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas}">
<tr><td align="center" style="padding:28px 12px 40px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">

  <tr><td style="padding:0 4px 18px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td><img src="${LOGO}" width="40" height="25" alt="Citrus Arc" style="display:block;border:0"></td>
      <td style="padding-left:10px;font:600 14px ${FONT};color:${C.ink}">Meta Ads Skill · Jualan</td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 0 12px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.ink}" style="background:${C.ink};border-radius:24px">
      <tr><td style="padding:32px">
        <div style="font:600 11px ${FONT};letter-spacing:2px;text-transform:uppercase;color:${C.brand}">${esc(nth)} · Meta Ads Advanced</div>
        <div style="margin:14px 0 0;font:700 56px/1 ${FONT};letter-spacing:-2px;color:#ffffff">${esc(amount)}</div>
        <p style="margin:14px 0 0;font:15px/1.5 ${FONT};color:#b5b3b0">dibayar oleh <strong style="color:#ffffff">${esc(i.buyerName || i.buyerEmail)}</strong> · ${esc(date)}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px"><tr>
          <td style="background:#1c1c1c;border:1px solid #2e2e2e;border-radius:999px;padding:8px 14px;font:13px ${FONT};color:${C.peach}">✓&nbsp; Fail skill dah diemel ke pembeli</td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 0 12px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid ${C.border};border-radius:20px"><tr><td style="padding:24px">
      <div style="font:600 11px ${FONT};letter-spacing:2px;text-transform:uppercase;color:${C.muted}">Butiran</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">
        ${row("Pembeli", esc(i.buyerName || "(tiada nama)"))}
        ${row("Emel", `<a href="mailto:${esc(i.buyerEmail)}" style="color:${C.brand};text-decoration:none">${esc(i.buyerEmail)}</a>`)}
        ${row("Jumlah", esc(amount))}
        ${row("Notifikasi di laman", esc(alert))}
        ${row("Bahasa emel pembeli", i.buyerLang === "en" ? "English" : "Bahasa Melayu")}
        ${row("ID pembayaran", esc(i.purchaseId), true)}
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px"><tr>
        ${button(reply, "Balas pembeli", true)}
        <td width="8"></td>
        ${button("https://portal.chip-in.asia/", "Buka CHIP", false)}
      </tr></table>
    </td></tr></table>
  </td></tr>

  <tr><td align="center" style="padding:12px 8px 0;font:12px/1.6 ${FONT};color:${C.muted}">
    Emel automatik dari <a href="${esc(i.siteUrl)}" style="color:${C.muted}">${esc(i.siteUrl.replace(/^https?:\/\//, ""))}</a>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`

  return { subject, text, html }
}
