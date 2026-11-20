import type { PhotoKey } from "@/lib/photos"

export type IconKey =
  | "flame"
  | "bath"
  | "droplets"
  | "sun"
  | "coffee"
  | "sparkles"
  | "shield"
  | "clock"
  | "calendar"

type Section = { eyebrow: string; title: string; lead?: string }

export interface Dict {
  meta: { title: string; description: string; keywords: string[]; ogAlt: string }
  a11y: { skip: string; menu: string; close: string; lang: string }
  nav: { links: { href: string; label: string }[]; cta: string }
  intro: { eyebrow: string; title: [string, string]; lead: string; hint: string; tag: string; cta: string }
  tunnel: Section & { lead: string; titleLines: [string, string]; hint: string; cards: { photo: PhotoKey; title: string }[] }
  stats: { value: string; label: string }[]
  worlds: Section & {
    from: string
    perNight: string
    cta: string
    items: { id: string; photo: PhotoKey; name: string; region: string; season: string; text: string; price: string }[]
  }
  lodge: Section & {
    photo: PhotoKey
    specs: { value: string; label: string }[]
    features: { icon: IconKey; title: string; text: string }[]
  }
  experiences: Section & { items: { photo: PhotoKey; title: string; text: string }[] }
  quote: { text: string; author: string }
  day: Section & { items: { time: string; title: string; text: string }[] }
  reviews: Section & {
    rating: string
    ratingLabel: string
    items: { photo: PhotoKey; name: string; meta: string; text: string }[]
  }
  pricing: Section & {
    popular: string
    cta: string
    plans: { name: string; nights: string; price: string; note: string; features: string[]; featured?: boolean }[]
  }
  faq: Section & { items: { q: string; a: string }[] }
  book: Section & {
    world: string
    anyWorld: string
    checkin: string
    checkout: string
    guests: string
    name: string
    contact: string
    contactHint: string
    submit: string
    or: string
    telegram: string
    sent: string
    mailSubject: string
    guarantees: { icon: IconKey; text: string }[]
  }
  footer: { tagline: string; rights: string; made: string }
  travel: { altitude: string; unit: string; leg: string }
}
