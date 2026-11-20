"use client"

import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react"
import { useRef, useState, type ReactNode } from "react"
import type { Dict } from "@/content"

// Маршрут по семи мирам: широта, долгота, высота
const STOPS = [
  { lat: 43.35, lon: 42.44, alt: 2340 },
  { lat: 69.16, lon: 35.14, alt: 30 },
  { lat: 31.1, lon: -4.01, alt: 700 },
  { lat: 62.0, lon: 33.5, alt: 120 },
  { lat: 46.69, lon: 12.08, alt: 1496 },
  { lat: -8.34, lon: 115.09, alt: 10 },
  { lat: 50.0, lon: 87.7, alt: 2100 },
]
const STEPS = STOPS.map((_, i) => i / (STOPS.length - 1))
const ROUTE =
  "M60 120 C 240 60, 320 260, 470 220 S 760 80, 900 220 S 820 480, 620 470 S 220 420, 150 600 S 360 880, 560 820 S 900 700, 940 900"

const fmt = (v: number, pos: string, neg: string) => {
  const abs = Math.abs(v)
  const deg = Math.floor(abs)
  const min = Math.round((abs - deg) * 60)
  return `${v >= 0 ? pos : neg} ${deg}°${String(min).padStart(2, "0")}′`
}

/** Фон «путешествия»: топографическая карта, маршрут рисуется прокруткой, HUD с координатами. */
export function TravelLayer({ t, children }: { t: Dict["travel"]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24 })

  const lat = useTransform(progress, STEPS, STOPS.map((s) => s.lat))
  const lon = useTransform(progress, STEPS, STOPS.map((s) => s.lon))
  const alt = useTransform(progress, STEPS, STOPS.map((s) => s.alt))
  const coords = useTransform([lat, lon], ([a, b]: number[]) => `${fmt(a, "N", "S")} · ${fmt(b, "E", "W")}`)
  const altText = useTransform(alt, (a) => `${t.altitude} ${Math.round(a)} ${t.unit}`)
  const topoY = useTransform(progress, [0, 1], ["0%", "-30%"])

  const markerRef = useRef<SVGGElement>(null)
  const [leg, setLeg] = useState(1)
  // Маркер двигаем напрямую в DOM — без ререндера на каждый кадр
  useMotionValueEvent(progress, "change", (v) => {
    const path = pathRef.current
    if (path && markerRef.current) {
      const pt = path.getPointAtLength(path.getTotalLength() * Math.min(1, Math.max(0, v)))
      markerRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`)
    }
    setLeg(Math.min(STOPS.length, Math.round(v * (STOPS.length - 1)) + 1))
  })

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="pointer-events-none sticky top-0 h-svh overflow-hidden">
        <m.div style={{ y: topoY }} className="topo absolute inset-x-0 -top-[10%] h-[160%]" />
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <path d={ROUTE} fill="none" stroke="rgb(244 238 227 / 0.08)" strokeWidth="1.5" strokeDasharray="2 8" />
          <m.path
            ref={pathRef}
            d={ROUTE}
            fill="none"
            stroke="var(--ember)"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            style={{ pathLength: progress }}
          />
          <g ref={markerRef} transform="translate(60 120)">
            <circle r="14" fill="var(--ember)" fillOpacity="0.15" />
            <circle r="4.5" fill="var(--ember)" />
          </g>
        </svg>
        <div className="absolute bottom-5 left-5 hidden font-mono text-[0.7rem] uppercase tracking-[0.2em] text-sand/45 md:block">
          <m.p>{coords}</m.p>
          <m.p className="mt-1">{altText}</m.p>
          <p className="mt-1">
            {t.leg} {String(leg).padStart(2, "0")} / {String(STOPS.length).padStart(2, "0")}
          </p>
        </div>
      </div>
      <div className="relative -mt-[100svh]">{children}</div>
    </div>
  )
}
