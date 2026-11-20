import Image from "next/image"
import { Check, Plus, Star } from "lucide-react"
import type { Dict } from "@/content"
import { photos } from "@/lib/photos"
import { cn } from "@/lib/utils"
import { Reveal } from "./motion"
import { SectionHead } from "./sections"

export function Reviews({ t }: { t: Dict["reviews"] }) {
  return (
    <section aria-labelledby="reviews-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <SectionHead id="reviews-title" eyebrow={t.eyebrow} title={t.title} />
        <Reveal className="flex items-center gap-5">
          <span className="text-6xl font-extrabold tracking-tight">{t.rating}</span>
          <span>
            <span className="flex gap-0.5 text-ember" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </span>
            <span className="mt-1.5 block max-w-[18ch] text-sm text-sand/60">{t.ratingLabel}</span>
          </span>
        </Reveal>
      </div>
      <ul className="mt-16 grid gap-5 lg:grid-cols-3">
        {t.items.map((r, i) => (
          <Reveal
            as="li"
            key={r.name}
            delay={i * 0.1}
            className="flex flex-col justify-between rounded-[var(--radius)] bg-forest/80 p-8 ring-1 ring-border backdrop-blur"
          >
            <blockquote className="text-lg leading-relaxed text-sand/85">“{r.text}”</blockquote>
            <div className="mt-8 flex items-center gap-4">
              <Image src={photos[r.photo]} alt="" width={52} height={52} className="size-13 rounded-full object-cover" />
              <div>
                <p className="font-bold">{r.name}</p>
                <p className="text-sm text-sand/55">{r.meta}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export function Pricing({ t }: { t: Dict["pricing"] }) {
  return (
    <section id="prices" aria-labelledby="prices-title" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHead id="prices-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <ul className="mt-16 grid gap-5 lg:grid-cols-3">
        {t.plans.map((plan, i) => (
          <Reveal
            as="li"
            key={plan.name}
            delay={i * 0.1}
            className={cn(
              "relative flex flex-col rounded-[var(--radius)] p-8 ring-1 backdrop-blur",
              plan.featured ? "bg-sand text-night ring-sand" : "bg-forest/80 ring-border",
            )}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-ember px-3 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-night">
                {t.popular}
              </span>
            )}
            <h3 className="text-title font-extrabold">{plan.name}</h3>
            <p className={cn("mt-1 text-sm", plan.featured ? "text-night/60" : "text-sand/55")}>{plan.nights}</p>
            <p className="mt-8 text-4xl font-extrabold tracking-tight">{plan.price}</p>
            <p className={cn("mt-1 text-sm", plan.featured ? "text-night/60" : "text-sand/55")}>{plan.note}</p>
            <ul className="mt-8 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-3 text-[0.95rem]">
                  <Check className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-night" : "text-ember")} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#book"
              className={cn(
                "mt-10 rounded-full px-6 py-4 text-center text-sm font-bold uppercase tracking-widest transition",
                plan.featured ? "bg-night text-sand hover:bg-pine" : "bg-sand/10 hover:bg-ember hover:text-night",
              )}
            >
              {t.cta}
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export function Faq({ t }: { t: Dict["faq"] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHead id="faq-title" eyebrow={t.eyebrow} title={t.title} />
      <div className="mt-14 divide-y divide-border border-y border-border">
        {t.items.map((item) => (
          <details key={item.q} className="group py-2">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold sm:text-xl">
              {item.q}
              <Plus className="size-5 shrink-0 text-ember transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="max-w-3xl pb-6 text-sand/70">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
