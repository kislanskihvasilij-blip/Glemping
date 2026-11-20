import { notFound } from "next/navigation"
import { getDict, hasLocale } from "@/content"
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero"
import { Booking } from "@/components/site/booking"
import { Footer } from "@/components/site/footer"
import { MotionProvider } from "@/components/site/motion"
import { Nav } from "@/components/site/nav"
import { Faq, Pricing, Reviews } from "@/components/site/offer"
import { Day, Experiences, Lodge, Quote, Stats, Worlds } from "@/components/site/sections"
import { TentIntro } from "@/components/site/tent-intro"
import { TravelLayer } from "@/components/site/travel-backdrop"
import { photos } from "@/lib/photos"
import { CONTACTS, SITE_URL } from "@/lib/site"

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = getDict(lang)

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Campground",
      "@id": `${SITE_URL}/#atlas`,
      name: "ATLAS Glamping",
      description: t.meta.description,
      url: `${SITE_URL}/${lang}`,
      image: `${SITE_URL}/og.jpg`,
      logo: `${SITE_URL}/icon.svg`,
      email: CONTACTS.email,
      telephone: CONTACTS.phone,
      priceRange: t.pricing.plans.map((p) => p.price).join(" – "),
      inLanguage: lang,
      amenityFeature: t.lodge.features.map((f) => ({ "@type": "LocationFeatureSpecification", name: f.title, value: true })),
      containsPlace: t.worlds.items.map((w) => ({ "@type": "Accommodation", name: w.name, description: w.text, address: w.region })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ]

  return (
    <MotionProvider>
      <script
        type="application/ld+json"
        // JSON из своих же словарей; экранируем «<», чтобы строка не могла закрыть тег
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav t={t.nav} a11y={t.a11y} lang={lang} />
      <main id="main">
        <TentIntro t={t.intro} ctaHref="#worlds" />
        <PerspectiveTunnelHero
          images={t.tunnel.cards.map((c) => ({ src: photos[c.photo], title: c.title }))}
          eyebrow={t.tunnel.eyebrow}
          titleLines={t.tunnel.titleLines}
          lead={t.tunnel.lead}
          hint={t.tunnel.hint}
        />
        <TravelLayer t={t.travel}>
          <Stats items={t.stats} />
          <Worlds t={t.worlds} />
          <Lodge t={t.lodge} />
          <Quote t={t.quote} />
          <Experiences t={t.experiences} />
          <Day t={t.day} />
          <Reviews t={t.reviews} />
          <Pricing t={t.pricing} />
          <Faq t={t.faq} />
        </TravelLayer>
        <Booking t={t.book} worlds={t.worlds.items} />
      </main>
      <Footer t={t.footer} nav={t.nav} lang={lang} />
    </MotionProvider>
  )
}
