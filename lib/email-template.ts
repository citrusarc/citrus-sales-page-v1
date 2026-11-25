// The buyer's email: the skill file (attached), install steps and, since CHIP's
// own receipt is off, the purchase summary. Table-based with inline styles so
// it holds up in Gmail, Apple Mail and Outlook.

import { ADVANCED, CONTACT } from "@/lib/product"

export type BuyerEmailInput = {
  name: string
  purchaseId: string
  siteUrl: string
  /** In sen, as CHIP reports it. */
  totalSen: number
  paidAt: Date
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

export function buyerEmail({ name, purchaseId, siteUrl, totalSen, paidAt }: BuyerEmailInput) {
  const first = name.split(/\s+/)[0] ?? ""
  const hi = first ? `Hi ${first},` : "Hi,"
  const tutorial = `${siteUrl}/#tutorial`
  const amount = `RM${(totalSen / 100).toFixed(2)}`
  const date = new Intl.DateTimeFormat("ms-MY", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(paidAt)
  const subject = "Meta Ads Advanced — fail skill anda dah sampai"
  const preheader = `${ADVANCED.file} dilampirkan. Pasang dalam 2 minit dan mula tanya Claude pasal ads anda.`

  const text = `${hi}

Terima kasih kerana membeli Meta Ads Advanced! Fail ${ADVANCED.file} dilampirkan dalam emel ini.

RINGKASAN PEMBELIAN
Produk: Meta Ads Advanced (Claude Skill)
Jumlah: ${amount}
Tarikh: ${date}
ID pembayaran: ${purchaseId}

CARA PASANG — Claude.ai / Desktop
1. Settings → Capabilities → hidupkan "Code execution and file creation".
2. Customize → Skills → "+" → Create skill → Upload a skill → pilih ${ADVANCED.file} (jangan unzip).
3. Pastikan skill ON, kemudian buka chat baru.

CARA PASANG — Claude Code
  unzip ~/Downloads/${ADVANCED.file} -d ~/.claude/skills/
Kemudian jalankan "claude" dan taip /meta-ads-advanced.

CUBA PROMPT NI
- "Audit export.csv ni, target RM25 setiap result."
- "Tulis 36 variasi ads untuk kedai kek saya, BM rojak."

Tutorial penuh: ${tutorial}

Lesen: untuk bisnes anda sendiri dan client anda sendiri. Tolong jangan jual semula, kongsi atau upload skill ini.

---
ENGLISH: Thanks for buying Meta Ads Advanced! ${ADVANCED.file} is attached. Install: Claude.ai → Settings → Capabilities → turn on Code execution, then Customize → Skills → Upload a skill. Claude Code: unzip into ~/.claude/skills/. Full tutorial: ${tutorial}

Perlu bantuan? / Need help? WhatsApp ${CONTACT.whatsapp} · ${CONTACT.email}
Citrus Arc Studio — ${CONTACT.site}
`

  const step = (n: number, html: string) => `
    <tr>
      <td width="36" valign="top" style="padding:0 0 14px">
        <div style="width:26px;height:26px;line-height:26px;border-radius:13px;background:${C.brand};color:#fff;font:600 13px ${FONT};text-align:center">${n}</div>
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

  const eyebrow = (s: string, color = C.brand) =>
    `<div style="font:600 11px ${FONT};letter-spacing:2px;text-transform:uppercase;color:${color}">${s}</div>`

  const html = `<!doctype html>
<html lang="ms"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.canvas}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas}">
<tr><td align="center" style="padding:28px 12px 40px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">

  <!-- brand -->
  <tr><td style="padding:0 4px 18px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td><img src="${LOGO}" width="40" height="25" alt="Citrus Arc" style="display:block;border:0"></td>
      <td style="padding-left:10px;font:600 14px ${FONT};color:${C.ink}">Citrus Arc Studio</td>
    </tr></table>
  </td></tr>

  <!-- hero -->
  <tr><td style="padding:0 0 12px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.ink}" style="background:${C.ink};border-radius:24px">
      <tr><td style="padding:36px 32px 32px">
        ${eyebrow("Meta Ads Advanced · Claude Skill")}
        <h1 style="margin:14px 0 0;font:700 34px/1 ${FONT};letter-spacing:-1px;text-transform:uppercase;color:#ffffff">Skill anda<br><span style="color:${C.brand}">dah sampai.</span></h1>
        <p style="margin:18px 0 0;font:16px/1.55 ${FONT};color:#b5b3b0">${esc(hi)} terima kasih! Claude anda kini boleh audit akaun, analisis creative dan rancang testing ads — dalam BM santai.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr>
          <td style="background:#1c1c1c;border:1px solid #2e2e2e;border-radius:14px;padding:12px 16px">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="font:20px ${FONT};padding-right:12px">📎</td>
              <td>
                <div style="font:600 14px ${MONO};color:#ffffff">${ADVANCED.file}</div>
                <div style="font:12px ${FONT};color:#8a8885;margin-top:2px">Dilampirkan dalam emel ini · jangan unzip untuk Claude.ai</div>
              </td>
            </tr></table>
          </td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>

  <!-- install -->
  ${card(`
    ${eyebrow("Cara pasang")}
    <h2 style="margin:8px 0 18px;font:700 20px ${FONT};text-transform:uppercase;letter-spacing:-.3px;color:${C.ink}">Claude.ai / Desktop</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${step(1, `Settings → Capabilities → hidupkan <strong>Code execution and file creation</strong>.`)}
      ${step(2, `Customize → Skills → <strong>+</strong> → Create skill → <strong>Upload a skill</strong> → pilih <span style="font:13px ${MONO}">${ADVANCED.file}</span>.`)}
      ${step(3, `Pastikan suis skill <strong>ON</strong>, kemudian buka chat baru.`)}
    </table>
    <h2 style="margin:10px 0 12px;font:700 20px ${FONT};text-transform:uppercase;letter-spacing:-.3px;color:${C.ink}">Claude Code</h2>
    <div style="background:${C.ink};border-radius:12px;padding:14px 16px;font:13px/1.5 ${MONO};color:#ffffff;word-break:break-all"><span style="color:${C.brand}">$</span> unzip ~/Downloads/${ADVANCED.file} -d ~/.claude/skills/</div>
    <p style="margin:12px 0 22px;font:14px/1.5 ${FONT};color:${C.muted}">Kemudian jalankan <span style="font:13px ${MONO};color:${C.ink}">claude</span> dan taip <span style="font:13px ${MONO};color:${C.ink}">/meta-ads-advanced</span>.</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td bgcolor="${C.brand}" style="border-radius:999px">
        <a href="${esc(tutorial)}" style="display:inline-block;padding:14px 24px;font:600 15px ${FONT};color:#ffffff;text-decoration:none;border-radius:999px">Tengok tutorial penuh →</a>
      </td>
    </tr></table>
  `)}

  <!-- first prompts -->
  ${card(`
    ${eyebrow("Cuba prompt ni dulu")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px">
      ${prompt("Audit export.csv ni, target RM25 setiap result.")}
      ${prompt("Tulis 36 variasi ads untuk kedai kek saya, BM rojak.")}
      ${prompt("Banyak WhatsApp masuk tapi tak beli. Kenapa?")}
    </table>
  `, 24)}

  <!-- receipt -->
  ${card(`
    ${eyebrow("Ringkasan pembelian", C.muted)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">
      ${row("Produk", "Meta Ads Advanced")}
      ${row("Jumlah", esc(amount))}
      ${row("Tarikh", esc(date))}
      ${row("ID pembayaran", esc(purchaseId), true)}
    </table>
    <p style="margin:14px 0 0;font:13px/1.5 ${FONT};color:${C.muted}">Lesen: untuk bisnes anda sendiri &amp; client anda sendiri. Tolong jangan jual semula, kongsi atau upload skill ini.</p>
  `, 24)}

  <!-- english -->
  ${card(`
    ${eyebrow("English", C.muted)}
    <p style="margin:10px 0 0;font:14px/1.6 ${FONT};color:${C.ink}">Thanks for buying Meta Ads Advanced! <strong>${ADVANCED.file}</strong> is attached. On Claude.ai, turn on Code execution (Settings → Capabilities), then upload the zip under Customize → Skills. On Claude Code, unzip it into <span style="font:13px ${MONO}">~/.claude/skills/</span>. Full tutorial: <a href="${esc(tutorial)}" style="color:${C.brand}">${esc(tutorial)}</a></p>
  `, 24)}

  <!-- help -->
  <tr><td align="center" style="padding:20px 8px 0">
    <p style="margin:0;font:14px/1.6 ${FONT};color:${C.ink}">Perlu bantuan? Balas emel ini atau
      <a href="${CONTACT.whatsapp}" style="color:${C.brand};font-weight:600;text-decoration:none">WhatsApp kami</a>.</p>
    <p style="margin:14px 0 0;font:12px/1.6 ${FONT};color:${C.muted}">
      <a href="${CONTACT.site}" style="color:${C.muted}">Citrus Arc Studio</a> · Cyberjaya, Malaysia<br>
      Tidak bersekutu dengan atau disokong oleh Meta Platforms, Inc.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`

  return { subject, text, html }
}
