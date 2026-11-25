// Malaysian state from the host's geo headers, for download alerts. Only the
// state name is kept, never the IP. Returns null when the host doesn't send
// location (e.g. local dev) or the visitor isn't in Malaysia.
//   Vercel:      x-vercel-ip-country / x-vercel-ip-country-region
//   Cloudflare:  cf-ipcountry / cf-region-code ("Add visitor location headers")

const MY_STATES: Record<string, string> = {
  "01": "Johor",
  "02": "Kedah",
  "03": "Kelantan",
  "04": "Melaka",
  "05": "Negeri Sembilan",
  "06": "Pahang",
  "07": "Pulau Pinang",
  "08": "Perak",
  "09": "Perlis",
  "10": "Selangor",
  "11": "Terengganu",
  "12": "Sabah",
  "13": "Sarawak",
  "14": "Kuala Lumpur",
  "15": "Labuan",
  "16": "Putrajaya",
}

export function malaysianState(h: Headers): string | null {
  const country = (h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? "").toUpperCase()
  if (country !== "MY") return null
  const raw = h.get("x-vercel-ip-country-region") ?? h.get("cf-region-code") ?? ""
  const code = raw.replace(/^MY-/i, "").padStart(2, "0")
  return MY_STATES[code] ?? null
}
