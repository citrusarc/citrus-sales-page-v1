// Server-side only. Same Mailjet setup as citrus-class-v1.

export type EmailMessage = {
  to: { email: string; name?: string }
  subject: string
  text: string
  html: string
  replyTo?: string
  /** content is already base64. */
  attachments?: { filename: string; contentType: string; base64: string }[]
}

export const emailConfigured = () =>
  Boolean(process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET)

/** Sends one email through Mailjet's Send API v3.1. Throws on failure. */
export async function sendEmail(message: EmailMessage) {
  const key = process.env.MAILJET_API_KEY
  const secret = process.env.MAILJET_API_SECRET
  if (!key || !secret) throw new Error("Mailjet isn't set up")

  const res = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    signal: AbortSignal.timeout(15_000),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_FROM || "noreply@citrusarc.studio",
            Name: process.env.MAIL_FROM_NAME || "Citrus Arc Studio",
          },
          To: [{ Email: message.to.email, Name: message.to.name }],
          ...(message.replyTo ? { ReplyTo: { Email: message.replyTo } } : {}),
          Subject: message.subject,
          TextPart: message.text,
          HTMLPart: message.html,
          Attachments: message.attachments?.map((f) => ({
            Filename: f.filename,
            ContentType: f.contentType,
            Base64Content: f.base64,
          })),
        },
      ],
    }),
  })
  if (!res.ok) throw new Error(`Mailjet send failed (${res.status}): ${await res.text()}`)
}
