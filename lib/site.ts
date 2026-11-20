/** Боевой адрес сайта. Для своего домена задайте NEXT_PUBLIC_SITE_URL в Vercel. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlas-glamping.vercel.app").replace(/\/$/, "")

/** Контакты для брони — замените на реальные перед запуском. */
export const CONTACTS = {
  email: "hello@atlas-glamping.ru",
  telegram: "atlas_glamping",
  phone: "+7 900 000-00-00",
} as const
