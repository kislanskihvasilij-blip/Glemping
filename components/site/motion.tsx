"use client"

import { LazyMotion, MotionConfig, domAnimation, m, useScroll, useTransform } from "motion/react"
import Image, { type StaticImageData } from "next/image"
import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

/** LazyMotion держит бандл анимаций маленьким: грузим только domAnimation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  as = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: "div" | "li"
}) {
  const Tag = as === "li" ? m.li : m.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

/** Фото, которое медленнее страницы — эффект глубины при прокрутке. */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "100vw",
  strength = 12,
}: {
  src: StaticImageData
  alt: string
  className?: string
  sizes?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div style={{ y }} className="absolute -inset-y-[15%] inset-x-0">
        <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" className="object-cover" />
      </m.div>
    </div>
  )
}
