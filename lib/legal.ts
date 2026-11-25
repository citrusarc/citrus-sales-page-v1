// Legal pages for the Meta Ads skill site (BM default, EN). Same company
// details as citrusarc.studio (citrus-arc-studio/config/site.ts).
// Blocks: a string is a paragraph, a string[] is a bullet list.
// [text](url) inside a string becomes a link.

import type { Lang } from "@/lib/dict"
import { ADVANCED, CONTACT } from "@/lib/product"

export const COMPANY = {
  name: "Citrus Arc Studio",
  registration: "202503267271 (003780123-A)",
  place: "Selangor, Malaysia",
} as const

export const LEGAL_UPDATED = "2026-11-25"

export type LegalSection = { id: string; heading: string; blocks: (string | string[])[] }
export type LegalDoc = { title: string; description: string; intro: string; sections: LegalSection[] }

const P = `RM${ADVANCED.priceRM}`
const mail = `[${CONTACT.email}](mailto:${CONTACT.email})`
const wa = `[WhatsApp](${CONTACT.whatsapp})`

const termsBm: LegalDoc = {
  title: "Terma & Syarat",
  description: "Terma penggunaan laman ini dan pembelian skill Meta Ads untuk Claude, termasuk lesen dan polisi bayaran balik.",
  intro: "Terma ini meliputi penggunaan laman ini dan pembelian skill Meta Ads Basic dan Advanced untuk Claude. Sila baca sebelum membeli.",
  sections: [
    {
      id: "tentang",
      heading: "Tentang terma ini",
      blocks: [
        `Laman ini dikendalikan oleh ${COMPANY.name} (SSM ${COMPANY.registration}), sebuah perniagaan di ${COMPANY.place}. Dengan menggunakan laman ini atau membeli produk kami, anda bersetuju dengan terma ini.`,
      ],
    },
    {
      id: "produk",
      heading: "Produk",
      blocks: [
        "Kami menjual skill untuk Claude (produk AI oleh Anthropic) dalam bentuk fail digital (.zip):",
        [
          "Meta Ads Basic — percuma untuk dimuat turun.",
          `Meta Ads Advanced — ${P}, bayaran sekali. Harga dalam Ringgit Malaysia (MYR).`,
        ],
        "Skill memberi panduan dan draf. Ia tidak log masuk, menyiarkan atau mengubah akaun iklan anda.",
      ],
    },
    {
      id: "bayaran",
      heading: "Bayaran",
      blocks: [
        "Bayaran diproses oleh CHIP (FPX, kad dan e-wallet). Kami tidak menerima atau menyimpan butiran kad atau akaun bank anda.",
        "Pembelian dianggap selesai apabila CHIP mengesahkan bayaran telah berjaya.",
      ],
    },
    {
      id: "penghantaran",
      heading: "Penghantaran",
      blocks: [
        "Selepas bayaran berjaya, anda boleh memuat turun fail terus dari halaman terima kasih, dan kami menghantar fail yang sama ke emel yang anda berikan.",
        `Jika anda tidak menerima fail dalam masa 24 jam, hubungi kami di ${mail} atau ${wa} dengan emel yang anda guna semasa bayar.`,
      ],
    },
    {
      id: "lesen",
      heading: "Lesen",
      blocks: [
        "Meta Ads Advanced dilesenkan kepada pembeli. Anda boleh:",
        ["menggunakan dan mengubah suai skill untuk bisnes anda sendiri", "menggunakannya untuk kerja client anda sendiri"],
        "Anda tidak boleh menjual semula, berkongsi, memuat naik atau memberikan skill ini atau salinan yang diubah suai kepada orang lain.",
        "Meta Ads Basic bebas dikongsi.",
      ],
    },
    {
      id: "bayaran-balik",
      heading: "Polisi bayaran balik",
      blocks: [
        "Oleh kerana Meta Ads Advanced ialah produk digital yang dihantar serta-merta dan tidak boleh dipulangkan, semua jualan adalah muktamad. Kami akan membuat bayaran balik penuh jika:",
        [
          "anda dicaj tetapi tidak menerima fail, dan kami tidak dapat menghantarnya dalam masa 3 hari bekerja selepas anda menghubungi kami",
          "anda dicaj lebih dari sekali untuk pembelian yang sama",
          "fail rosak atau tidak boleh dipasang, dan kami tidak dapat membaikinya atau menggantikannya dalam masa 7 hari",
        ],
        `Buat permohonan dalam masa 14 hari selepas pembelian melalui ${mail} atau ${wa}, bersama emel yang anda guna semasa bayar. Bayaran balik dibuat ke kaedah bayaran asal melalui CHIP, biasanya dalam 7–14 hari bekerja.`,
        "Polisi ini tidak menjejaskan hak anda di bawah Akta Perlindungan Pengguna 1999.",
      ],
    },
    {
      id: "tiada-jaminan",
      heading: "Tiada jaminan keputusan",
      blocks: [
        "Skill memberi panduan am tentang iklan Facebook dan Instagram. Ia bukan nasihat undang-undang atau kewangan, dan kami tidak menjamin sebarang keputusan iklan atau jualan. Keputusan bergantung pada produk, tawaran, harga, kreatif dan pasaran anda.",
        "Kebolehan menggunakan skill bergantung pada Claude. Ciri dan plan Claude ditentukan oleh Anthropic dan mungkin berubah.",
        "Kami tidak bersekutu dengan atau disokong oleh Meta Platforms, Inc. atau Anthropic. Facebook, Instagram, WhatsApp dan Meta ialah tanda dagangan Meta Platforms, Inc.",
      ],
    },
    {
      id: "liabiliti",
      heading: "Had liabiliti",
      blocks: [
        "Setakat yang dibenarkan undang-undang, liabiliti kami bagi apa-apa tuntutan berkaitan pembelian terhad kepada jumlah yang anda bayar untuk produk tersebut. Tiada apa dalam terma ini mengehadkan liabiliti yang tidak boleh dihadkan di bawah undang-undang Malaysia.",
      ],
    },
    {
      id: "privasi",
      heading: "Privasi",
      blocks: ["Cara kami mengendalikan data peribadi diterangkan dalam [Polisi Privasi](/privasi) kami."],
    },
    {
      id: "perubahan",
      heading: "Perubahan dan undang-undang",
      blocks: [
        "Kami mungkin mengemas kini terma ini dari semasa ke semasa; tarikh di atas menunjukkan bila kali terakhir ia berubah. Pembelian tertakluk kepada terma yang berkuat kuasa pada masa pembelian.",
        "Terma ini ditadbir oleh undang-undang Malaysia.",
      ],
    },
    {
      id: "hubungi",
      heading: "Hubungi kami",
      blocks: [`Ada soalan? Emel ${mail} atau ${wa}.`],
    },
  ],
}

const termsEn: LegalDoc = {
  title: "Terms & Conditions",
  description: "Terms for using this site and buying the Meta Ads skills for Claude, including the licence and refund policy.",
  intro: "These terms cover your use of this site and purchases of the Meta Ads Basic and Advanced skills for Claude. Please read them before you buy.",
  sections: [
    {
      id: "tentang",
      heading: "About these terms",
      blocks: [
        `This site is run by ${COMPANY.name} (SSM ${COMPANY.registration}), a business based in ${COMPANY.place}. By using the site or buying our products, you agree to these terms.`,
      ],
    },
    {
      id: "produk",
      heading: "Products",
      blocks: [
        "We sell skills for Claude (an AI product by Anthropic) as digital files (.zip):",
        ["Meta Ads Basic — free to download.", `Meta Ads Advanced — ${P}, one-time payment. Prices are in Malaysian Ringgit (MYR).`],
        "The skills give guidance and drafts. They never log in to, publish to or change your ad account.",
      ],
    },
    {
      id: "bayaran",
      heading: "Payment",
      blocks: [
        "Payments are processed by CHIP (FPX, cards and e-wallets). We never receive or store your card or bank details.",
        "A purchase is complete once CHIP confirms the payment succeeded.",
      ],
    },
    {
      id: "penghantaran",
      heading: "Delivery",
      blocks: [
        "After a successful payment you can download the file straight from the thank-you page, and we email the same file to the address you gave.",
        `If you haven't received the file within 24 hours, contact us at ${mail} or on ${wa} with the email you paid with.`,
      ],
    },
    {
      id: "lesen",
      heading: "Licence",
      blocks: [
        "Meta Ads Advanced is licensed to the buyer. You may:",
        ["use and adapt the skill for your own business", "use it for work for your own clients"],
        "You may not resell, share, upload or give away the skill or any changed copy of it.",
        "Meta Ads Basic is free to share.",
      ],
    },
    {
      id: "bayaran-balik",
      heading: "Refund policy",
      blocks: [
        "Because Meta Ads Advanced is a digital product that is delivered instantly and can't be returned, all sales are final. We give a full refund if:",
        [
          "you were charged but didn't receive the file, and we can't deliver it within 3 working days of you contacting us",
          "you were charged more than once for the same purchase",
          "the file is broken or won't install, and we can't fix or replace it within 7 days",
        ],
        `Ask within 14 days of purchase at ${mail} or on ${wa}, with the email you paid with. Refunds go back to the original payment method through CHIP, usually within 7–14 working days.`,
        "This policy doesn't affect your rights under the Consumer Protection Act 1999.",
      ],
    },
    {
      id: "tiada-jaminan",
      heading: "No guaranteed results",
      blocks: [
        "The skills give general guidance on Facebook and Instagram ads. They are not legal or financial advice, and we don't guarantee any ad or sales result. Results depend on your product, offer, price, creative and market.",
        "Using the skills depends on Claude. Claude's features and plans are set by Anthropic and may change.",
        "We are not affiliated with or endorsed by Meta Platforms, Inc. or Anthropic. Facebook, Instagram, WhatsApp and Meta are trademarks of Meta Platforms, Inc.",
      ],
    },
    {
      id: "liabiliti",
      heading: "Limitation of liability",
      blocks: [
        "As far as the law allows, our liability for any claim about a purchase is limited to the amount you paid for that product. Nothing in these terms limits any liability that can't be limited under Malaysian law.",
      ],
    },
    {
      id: "privasi",
      heading: "Privacy",
      blocks: ["How we handle personal data is set out in our [Privacy Policy](/privasi)."],
    },
    {
      id: "perubahan",
      heading: "Changes and governing law",
      blocks: [
        "We may update these terms from time to time; the date at the top shows when they last changed. A purchase is governed by the terms in force when it was made.",
        "These terms are governed by the laws of Malaysia.",
      ],
    },
    {
      id: "hubungi",
      heading: "Contact us",
      blocks: [`Questions? Email ${mail} or message us on ${wa}.`],
    },
  ],
}

const privacyBm: LegalDoc = {
  title: "Polisi Privasi",
  description: "Data peribadi yang dikumpul laman skill Meta Ads, sebabnya, dengan siapa ia dikongsi dan hak anda di bawah PDPA.",
  intro: "Polisi ini menerangkan data peribadi yang dikumpul oleh laman ini, sebab kami mengumpulnya dan apa yang kami lakukan dengannya. Ia ialah notis kami di bawah Akta Perlindungan Data Peribadi 2010 (PDPA).",
  sections: [
    {
      id: "siapa",
      heading: "Siapa kami",
      blocks: [
        `${COMPANY.name} (SSM ${COMPANY.registration}), ${COMPANY.place}, bertanggungjawab ke atas data peribadi yang diterangkan di sini. Hubungi kami di ${mail}.`,
      ],
    },
    {
      id: "dikumpul",
      heading: "Apa yang kami kumpul",
      blocks: [
        "Apabila anda membeli Meta Ads Advanced:",
        [
          "emel anda (wajib, untuk menghantar fail)",
          "nama anda (pilihan)",
          "rekod pembelian dari CHIP: ID pembayaran, jumlah, tarikh dan status",
        ],
        "Butiran kad atau akaun bank anda dimasukkan terus di halaman CHIP. Kami tidak menerima atau menyimpannya.",
        "Semasa anda melawat laman ini:",
        [
          "pilihan bahasa anda, disimpan dalam browser anda sahaja",
          "kuki untuk mengaitkan pembelian dengan browser anda supaya anda boleh memuat turun fail (30 hari)",
          "kuki untuk mengira muat turun Basic sekali bagi setiap browser (1 tahun). Kiraan itu tidak mengandungi data peribadi.",
          "log pelayan biasa (seperti alamat IP) yang disimpan oleh hos laman web kami",
        ],
        "Kami tidak menggunakan Google Analytics atau kuki pengiklanan di laman ini.",
      ],
    },
    {
      id: "notifikasi",
      heading: "Notifikasi pembelian",
      blocks: [
        "Laman ini memaparkan notifikasi ringkas untuk pembelian sebenar, contohnya \"Ah***d beli Meta Ads Advanced · 2 jam lalu\". Jika anda memberi nama semasa membeli, versi yang disamarkan (beberapa huruf sahaja) mungkin dipaparkan; tanpa nama, ia memaparkan \"Seseorang\". Emel, nama penuh dan butiran bayaran anda tidak pernah dipaparkan.",
        `Mahu nama anda dibuang dari notifikasi? Hubungi ${mail} dan kami akan membuangnya.`,
      ],
    },
    {
      id: "sebab",
      heading: "Kenapa kami mengumpulnya",
      blocks: [
        [
          "untuk memproses bayaran anda dan menghantar fail skill",
          "untuk membantu anda jika ada masalah muat turun atau bayaran, termasuk bayaran balik",
          "untuk menyimpan rekod jualan perniagaan kami",
          "untuk memaparkan kiraan jualan dan muat turun sebenar serta notifikasi pembelian di laman ini",
        ],
        "Kami tidak menghantar emel pemasaran kepada anda tanpa kebenaran anda.",
      ],
    },
    {
      id: "dikongsi",
      heading: "Dengan siapa kami berkongsi",
      blocks: [
        "Kami tidak menjual data peribadi anda. Kami berkongsi data hanya dengan penyedia yang membantu kami menjalankan laman ini:",
        [
          "CHIP, yang memproses bayaran",
          "Mailjet, yang menghantar emel berserta fail skill",
          "Upstash, yang menyimpan rekod pembelian yang telah diemel, kiraan dan notifikasi pembelian",
          "hos laman web kami",
          "Google (Gmail) dan Namecheap, yang mengehos peti emel kami",
        ],
        "Penyedia ini mungkin menyimpan atau memproses data di luar Malaysia. Kami juga mungkin mendedahkan data jika dikehendaki oleh undang-undang.",
      ],
    },
    {
      id: "simpanan",
      heading: "Berapa lama kami menyimpannya",
      blocks: [
        "Rekod pembelian disimpan selama yang diperlukan untuk rekod perniagaan dan cukai. Nama disamarkan untuk notifikasi disimpan 7 hari, dan senarai notifikasi hanya menyimpan 20 pembelian terkini.",
      ],
    },
    {
      id: "hak",
      heading: "Hak anda",
      blocks: [
        `Anda boleh meminta untuk mengakses atau membetulkan data peribadi anda, atau menarik balik kebenaran, dengan menghubungi ${mail}. Kami akan membalas dalam masa 21 hari.`,
      ],
    },
    {
      id: "perubahan",
      heading: "Perubahan polisi",
      blocks: ["Kami mungkin mengemas kini polisi ini; tarikh di atas menunjukkan bila kali terakhir ia berubah."],
    },
  ],
}

const privacyEn: LegalDoc = {
  title: "Privacy Policy",
  description: "What personal data the Meta Ads skill site collects, why, who it is shared with, and your rights under the PDPA.",
  intro: "This policy explains what personal data this site collects, why we collect it, and what we do with it. It is our notice under Malaysia's Personal Data Protection Act 2010 (PDPA).",
  sections: [
    {
      id: "siapa",
      heading: "Who we are",
      blocks: [
        `${COMPANY.name} (SSM ${COMPANY.registration}), ${COMPANY.place}, is responsible for the personal data described here. Reach us at ${mail}.`,
      ],
    },
    {
      id: "dikumpul",
      heading: "What we collect",
      blocks: [
        "When you buy Meta Ads Advanced:",
        ["your email (required, to send you the file)", "your name (optional)", "the purchase record from CHIP: payment ID, amount, date and status"],
        "Your card or bank details are entered directly on CHIP's page. We never receive or store them.",
        "When you visit the site:",
        [
          "your language choice, stored only in your browser",
          "a cookie that links a purchase to your browser so you can download the file (30 days)",
          "a cookie that counts a Basic download once per browser (1 year). The count holds no personal data.",
          "standard server logs (such as IP addresses) kept by our website host",
        ],
        "We don't use Google Analytics or advertising cookies on this site.",
      ],
    },
    {
      id: "notifikasi",
      heading: "Purchase notifications",
      blocks: [
        "This site shows short notifications for real purchases, such as \"Ah***d bought Meta Ads Advanced · 2 hours ago\". If you give a name when buying, a masked version (only a few letters) may be shown; without a name, it shows \"Someone\". Your email, full name and payment details are never shown.",
        `Want your name removed from notifications? Contact ${mail} and we'll remove it.`,
      ],
    },
    {
      id: "sebab",
      heading: "Why we collect it",
      blocks: [
        [
          "to process your payment and send you the skill file",
          "to help you with download or payment problems, including refunds",
          "to keep our business sales records",
          "to show real sales and download counts and purchase notifications on this site",
        ],
        "We don't send you marketing emails without your permission.",
      ],
    },
    {
      id: "dikongsi",
      heading: "Who we share it with",
      blocks: [
        "We don't sell your personal data. We share it only with the providers that help us run the site:",
        [
          "CHIP, which processes payments",
          "Mailjet, which sends the email with your skill file",
          "Upstash, which stores which purchases were emailed, the counts and purchase notifications",
          "our website host",
          "Google (Gmail) and Namecheap, which host our inboxes",
        ],
        "These providers may store or process data outside Malaysia. We may also disclose data where the law requires it.",
      ],
    },
    {
      id: "simpanan",
      heading: "How long we keep it",
      blocks: [
        "Purchase records are kept for as long as we need them for business and tax records. Masked names for notifications are kept for 7 days, and the notification list only keeps the 20 most recent purchases.",
      ],
    },
    {
      id: "hak",
      heading: "Your rights",
      blocks: [`You can ask to access or correct your personal data, or withdraw consent, by contacting ${mail}. We'll reply within 21 days.`],
    },
    {
      id: "perubahan",
      heading: "Changes to this policy",
      blocks: ["We may update this policy; the date at the top shows when it last changed."],
    },
  ],
}

export const LEGAL: Record<"terms" | "privacy", Record<Lang, LegalDoc>> = {
  terms: { bm: termsBm, en: termsEn },
  privacy: { bm: privacyBm, en: privacyEn },
}
