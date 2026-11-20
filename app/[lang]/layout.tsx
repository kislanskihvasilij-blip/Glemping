import type { Metadata, Viewport } from "next"
import { Manrope } from "next/font/google"
import { notFound } from "next/navigation"
import { getDict, hasLocale, locales } from "@/content"
import { SITE_URL } from "@/lib/site"
import "../globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  themeColor: "#0a0d0b",
  colorScheme: "dark",
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const { meta } = getDict(lang)
  const ogImage = { url: "/og.jpg", width: 1200, height: 630, alt: meta.ogAlt }

  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    applicationName: "ATLAS Glamping",
    alternates: {
      canonical: `/${lang}`,
      languages: { ru: "/ru", en: "/en", "x-default": "/ru" },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: "ATLAS Glamping",
      title: meta.title,
      description: meta.description,
      locale: lang === "ru" ? "ru_RU" : "en_US",
      alternateLocale: lang === "ru" ? ["en_US"] : ["ru_RU"],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage.url],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    formatDetection: { telephone: false },
  }
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const { a11y } = getDict(lang)

  return (
    <html lang={lang} className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full bg-night font-sans text-sand">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ember focus:px-5 focus:py-3 focus:font-bold focus:text-night"
        >
          {a11y.skip}
        </a>
        {children}
      </body>
    </html>
  )
}
