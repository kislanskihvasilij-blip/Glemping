"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { Dict, Locale } from "@/content"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"

export function Nav({ t, a11y, lang }: { t: Dict["nav"]; a11y: Dict["a11y"]; lang: Locale }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const other = lang === "ru" ? "en" : "ru"

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
        scrolled || open ? "border-b border-border bg-night/70 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href={`/${lang}`} className="text-sand">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm font-semibold text-sand/75">
            {t.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition hover:text-sand">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={`/${other}`}
            hrefLang={other}
            aria-label={`${a11y.lang}: ${other.toUpperCase()}`}
            className="rounded-full px-3 py-2 text-xs font-bold uppercase tracking-widest text-sand/75 ring-1 ring-border transition hover:text-sand hover:ring-sand/40"
          >
            {other}
          </Link>
          <a
            href="#book"
            className="hidden rounded-full bg-sand px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-night transition hover:bg-ember sm:block"
          >
            {t.cta}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? a11y.close : a11y.menu}
            className="grid size-10 place-items-center rounded-full ring-1 ring-border lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="h-[calc(100svh-4.5rem)] overflow-y-auto px-5 pb-10 pt-6 lg:hidden">
          <ul className="space-y-1">
            {t.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-3xl font-extrabold tracking-tight">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#book"
            onClick={() => setOpen(false)}
            className="mt-10 block rounded-full bg-ember px-6 py-4 text-center text-sm font-bold uppercase tracking-widest text-night"
          >
            {t.cta}
          </a>
        </nav>
      )}
    </header>
  )
}
