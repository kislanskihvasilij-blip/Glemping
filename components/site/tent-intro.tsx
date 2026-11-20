"use client"

import { animate, m, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import { ArrowDown, ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"
import type { Dict } from "@/content"
import { photos } from "@/lib/photos"

// Вход шатра в процентах экрана: вершина (50,10), основание 10…90 по ширине.
const DOOR = "polygon(50% 0, 100% 100%, 0 100%)"
const LEFT_FLAP = "polygon(50% 0, 50% 100%, 0 100%)"
const RIGHT_FLAP = "polygon(50% 0, 100% 100%, 50% 100%)"

/**
 * Интро: камера внутри шатра. Молния расстёгивается, полы расходятся,
 * камера пролетает сквозь вход к горам и шатрам ATLAS.
 */
export function TentIntro({ t, ctaHref }: { t: Dict["intro"]; ctaHref: string }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })

  // Автоматическое «расстёгивание» молнии при загрузке
  const zip = useMotionValue(0)
  useEffect(() => {
    const controls = animate(zip, 1, { duration: 1.5, delay: 0.35, ease: [0.65, 0, 0.35, 1] })
    return () => controls.stop()
  }, [zip])

  const pullTop = useTransform(zip, [0, 1], ["10%", "93%"])
  const gap = useTransform(zip, [0.6, 1], [0, 1])
  const leftX = useTransform(gap, (g) => `${-g * 0.6}vw`)
  const rightX = useTransform(gap, (g) => `${g * 0.6}vw`)

  const flapScale = useTransform(p, [0, 0.38], [1, 0.07])
  const flapShade = useTransform(p, [0, 0.38], [0, 0.55])
  const frameScale = useTransform(p, [0.22, 0.86], [1, 9])
  const frameOpacity = useTransform(p, [0.72, 0.86], [1, 0])
  const sceneScale = useTransform(p, [0, 0.86], [1.12, 1.55])
  const arriveOpacity = useTransform(p, [0.6, 0.84], [0, 1])
  const arriveScale = useTransform(p, [0.6, 1], [1.28, 1])
  const titleOpacity = useTransform(p, [0, 0.12], [1, 0])
  const titleY = useTransform(p, [0, 0.12], [0, -40])
  const outroOpacity = useTransform(p, [0.8, 0.92], [0, 1])
  const outroY = useTransform(p, [0.8, 0.92], [40, 0])
  const outroEvents = useTransform(p, (v) => (v > 0.84 ? "auto" : "none"))

  if (reduce) {
    return (
      <section ref={ref} className="relative grid h-svh place-items-center overflow-hidden">
        <Image src={photos.tentSunset} alt="" fill preload sizes="100vw" placeholder="blur" className="object-cover" />
        <div className="absolute inset-0 bg-night/45" />
        <Outro t={t} ctaHref={ctaHref} withTitle />
      </section>
    )
  }

  return (
    <section ref={ref} aria-label={t.eyebrow} className="relative h-[330svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        {/* Мир снаружи: горы над облаками, затем — шатры на закате */}
        <m.div style={{ scale: sceneScale }} className="absolute inset-0 will-change-transform">
          <Image src={photos.clouds} alt="" fill preload sizes="100vw" placeholder="blur" className="object-cover" />
        </m.div>
        <m.div style={{ opacity: arriveOpacity, scale: arriveScale }} className="absolute inset-0 will-change-transform">
          <Image src={photos.tentSunset} alt="" fill sizes="100vw" placeholder="blur" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/50 via-night/10 to-night/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgb(10_13_11/0.55),transparent)]" />
        </m.div>

        {/* Шатёр изнутри: стены с вырезом входа и две полы */}
        <m.div
          style={{ scale: frameScale, opacity: frameOpacity, transformOrigin: "50% 74%" }}
          className="pointer-events-none absolute inset-0 will-change-transform"
        >
          <TentWalls />
          <div className="absolute left-[10%] top-[10%] h-[90%] w-[80%]" style={{ clipPath: DOOR }}>
            <m.div
              style={{ scaleX: flapScale, x: leftX, clipPath: LEFT_FLAP, transformOrigin: "0% 100%" }}
              className="canvas-fabric absolute inset-0"
            >
              <m.div style={{ opacity: flapShade }} className="absolute inset-0 bg-[#2a1d10]" />
            </m.div>
            <m.div
              style={{ scaleX: flapScale, x: rightX, clipPath: RIGHT_FLAP, transformOrigin: "100% 100%" }}
              className="canvas-fabric absolute inset-0"
            >
              <m.div style={{ opacity: flapShade }} className="absolute inset-0 bg-[#2a1d10]" />
            </m.div>
            {/* Молния */}
            <m.div style={{ opacity: titleOpacity }} className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2">
              <div className="h-full w-full bg-[repeating-linear-gradient(180deg,#5b4326_0_3px,transparent_3px_6px)]" />
              <m.div
                style={{ top: pullTop }}
                className="absolute left-1/2 h-7 w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#c8ccc9] to-[#6d726f] shadow-md"
              />
            </m.div>
          </div>
        </m.div>

        {/* Заголовок на ткани */}
        <m.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-x-0 top-[54%] z-10 flex flex-col items-center px-6 text-center text-[#2e2112] sm:top-[50%]"
        >
          <p className="max-w-[58vw] text-eyebrow font-bold uppercase leading-relaxed">{t.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.045em] mix-blend-multiply">
            {t.title[0]}
            <br />
            {t.title[1]}
          </h1>
        </m.div>
        <m.div
          style={{ opacity: titleOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-eyebrow font-bold uppercase text-[#2e2112]"
        >
          <span>{t.hint}</span>
          <ArrowDown className="size-4 animate-bounce" aria-hidden="true" />
        </m.div>

        <m.div style={{ opacity: outroOpacity, y: outroY, pointerEvents: outroEvents }} className="absolute inset-0 z-10 grid place-items-center">
          <Outro t={t} ctaHref={ctaHref} />
        </m.div>
      </div>
    </section>
  )
}

function TentWalls() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="lantern" cx="0.22" cy="0.18" r="0.9">
          <stop offset="0" stopColor="#7a5a32" />
          <stop offset="0.45" stopColor="#3b2d1c" />
          <stop offset="1" stopColor="#120e09" />
        </radialGradient>
        <pattern id="weave" width="1.2" height="1.2" patternUnits="userSpaceOnUse">
          <path d="M0 0.6h1.2" stroke="#000" strokeOpacity="0.12" strokeWidth="0.15" />
        </pattern>
      </defs>
      <path d="M0 0H100V100H0Z M50 10 90 100H10Z" fill="url(#lantern)" fillRule="evenodd" />
      <path d="M0 0H100V100H0Z M50 10 90 100H10Z" fill="url(#weave)" fillRule="evenodd" />
      {/* Швы и кант входа */}
      <path d="M50 10 10 100M50 10 90 100" stroke="#1a120a" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
      <path d="M50 10 6 100M50 10 94 100" stroke="#d9b98a" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
      <path d="M50 10 50 0M50 10 0 38M50 10 100 38" stroke="#000" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function Outro({ t, ctaHref, withTitle }: { t: Dict["intro"]; ctaHref: string; withTitle?: boolean }) {
  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
      <p className="text-eyebrow font-semibold uppercase text-ember">{t.tag}</p>
      {withTitle ? (
        <h1 className="mt-6 text-display font-extrabold">
          {t.title[0]} {t.title[1]}
        </h1>
      ) : (
        <p className="mt-6 text-heading font-extrabold">
          {t.title[0]} {t.title[1]}
        </p>
      )}
      <p className="mt-6 max-w-xl text-lg text-sand/90 [text-shadow:0_1px_18px_rgb(0_0_0/0.6)]">{t.lead}</p>
      <a
        href={ctaHref}
        className="group mt-9 inline-flex items-center gap-3 rounded-full bg-sand px-7 py-4 text-sm font-bold uppercase tracking-widest text-night transition hover:bg-ember"
      >
        {t.cta}
        <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </a>
    </div>
  )
}
