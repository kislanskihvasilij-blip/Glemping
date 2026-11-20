import Image from "next/image"
import { ArrowUpRight, Bath, CalendarCheck, Clock, Coffee, Droplets, Flame, ShieldCheck, Sparkles, Sun } from "lucide-react"
import type { Dict, IconKey } from "@/content"
import { photos } from "@/lib/photos"
import { cn } from "@/lib/utils"
import { ParallaxImage, Reveal } from "./motion"

export const ICONS: Record<IconKey, typeof Flame> = {
  flame: Flame,
  bath: Bath,
  droplets: Droplets,
  sun: Sun,
  coffee: Coffee,
  sparkles: Sparkles,
  shield: ShieldCheck,
  clock: Clock,
  calendar: CalendarCheck,
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  className,
  id,
}: {
  eyebrow: string
  title: string
  lead?: string
  className?: string
  id?: string
}) {
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      <p className="text-eyebrow font-semibold uppercase text-ember">{eyebrow}</p>
      <h2 id={id} className="mt-5 text-heading font-extrabold text-balance">
        {title}
      </h2>
      {lead && <p className="mt-6 max-w-2xl text-lg text-sand/70 text-pretty">{lead}</p>}
    </Reveal>
  )
}

export function Stats({ items }: { items: Dict["stats"] }) {
  return (
    <section aria-label="ATLAS" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <dl className="grid grid-cols-2 gap-y-12 border-y border-border py-12 lg:grid-cols-4">
        {items.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="px-4 lg:border-l lg:border-border lg:first:border-l-0">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block text-5xl font-extrabold tracking-tight sm:text-6xl">{s.value}</span>
              <span className="mt-3 block max-w-[22ch] text-sm text-sand/60">{s.label}</span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

export function Worlds({ t }: { t: Dict["worlds"] }) {
  return (
    <section id="worlds" aria-labelledby="worlds-title" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHead id="worlds-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {t.items.map((w, i) => (
          <Reveal as="li" key={w.id} delay={(i % 3) * 0.08} className={cn("h-full", i === 0 && "md:col-span-2 lg:row-span-2")}>
              <a
                href={`#book-${w.id}`}
                className={cn(
                  "group relative flex h-full min-h-[440px] flex-col justify-end overflow-hidden rounded-[var(--radius)] ring-1 ring-border",
                  i === 0 && "min-h-[560px] lg:min-h-full",
                )}
              >
                <Image
                  src={photos[w.photo]}
                  alt={`${w.name} — ${w.region}`}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
                  placeholder="blur"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-night/50 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-widest backdrop-blur-md">
                  {w.season}
                </span>
                <div className="relative p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sand/60">{w.region}</p>
                  <h3 className="mt-2 text-title font-extrabold">{w.name}</h3>
                  <p className="mt-3 max-w-md text-sm text-sand/75">{w.text}</p>
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/15 pt-5">
                    <p className="text-sm text-sand/60">
                      {t.from} <span className="text-xl font-bold text-sand">{w.price}</span> {t.perNight}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ember">
                      {t.cta}
                      <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </a>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export function Lodge({ t }: { t: Dict["lodge"] }) {
  return (
    <section id="lodge" aria-labelledby="lodge-title" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ParallaxImage src={photos[t.photo]} alt={t.title} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/5] rounded-[var(--radius)]" />
        </div>
        <div>
          <SectionHead id="lodge-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] bg-border ring-1 ring-border">
            {t.specs.map((s) => (
              <div key={s.label} className="bg-forest/90 p-6 backdrop-blur">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-3xl font-extrabold tracking-tight sm:text-4xl">{s.value}</span>
                  <span className="mt-2 block text-sm text-sand/60">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-12 space-y-7">
            {t.features.map((f, i) => {
              const Icon = ICONS[f.icon]
              return (
                <Reveal as="li" key={f.title} delay={i * 0.05} className="flex gap-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ember/12 text-ember ring-1 ring-ember/30">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{f.title}</h3>
                      <p className="mt-1 text-sand/65">{f.text}</p>
                    </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Experiences({ t }: { t: Dict["experiences"] }) {
  return (
    <section id="experiences" aria-labelledby="exp-title" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHead id="exp-title" eyebrow={t.eyebrow} title={t.title} />
      <ul className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map((e, i) => (
          <Reveal as="li" key={e.title} delay={(i % 3) * 0.1} className={cn("group", i % 3 === 1 && "lg:mt-16")}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)]">
                <Image
                  src={photos[e.photo]}
                  alt={e.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-title font-bold">{e.title}</h3>
              <p className="mt-2 text-sand/65">{e.text}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export function Quote({ t }: { t: Dict["quote"] }) {
  return (
    <section aria-label={t.author} className="relative isolate my-24 grid min-h-[90svh] place-items-center overflow-hidden">
      <ParallaxImage src={photos.mistyHills} alt="" className="absolute inset-0 -z-10" strength={18} />
      <div className="absolute inset-0 -z-10 bg-night/45" />
      <Reveal className="mx-auto max-w-5xl px-6 text-center">
        <blockquote>
          <p className="text-heading font-extrabold text-balance">«{t.text}»</p>
          <footer className="mt-8 text-eyebrow font-semibold uppercase text-sand/70">— {t.author}</footer>
        </blockquote>
      </Reveal>
    </section>
  )
}

export function Day({ t }: { t: Dict["day"] }) {
  return (
    <section aria-labelledby="day-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHead id="day-title" eyebrow={t.eyebrow} title={t.title} />
          <ParallaxImage src={photos.morningMug} alt="" sizes="(min-width: 1024px) 45vw, 100vw" className="mt-10 aspect-[5/4] rounded-[var(--radius)]" />
        </div>
        <ol className="relative border-l border-border pl-8 sm:pl-12">
          {t.items.map((d, i) => (
            <Reveal as="li" key={d.time} delay={i * 0.04} className="relative pb-14 last:pb-0">
                <span className="absolute -left-[calc(2rem+5px)] top-2 size-2.5 rounded-full bg-ember shadow-[0_0_0_6px_rgb(255_138_61/0.15)] sm:-left-[calc(3rem+5px)]" />
                <p className="font-mono text-sm tracking-widest text-ember">{d.time}</p>
                <h3 className="mt-2 text-title font-bold">{d.title}</h3>
                <p className="mt-2 text-sand/65">{d.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
