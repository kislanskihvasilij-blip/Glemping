"use client"

import Image from "next/image"
import { Send } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import type { Dict } from "@/content"
import { photos } from "@/lib/photos"
import { CONTACTS } from "@/lib/site"
import { ICONS } from "./sections"
import { Reveal } from "./motion"

const MAX_TEXT = 80
const clean = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .replace(/[\r\n<>]/g, " ")
    .trim()
    .slice(0, MAX_TEXT)

// «Сегодня» берём в момент фокуса — без рассинхрона гидрации на статической странице
const setMinToday = (e: { currentTarget: HTMLInputElement }) => {
  if (!e.currentTarget.min) e.currentTarget.min = new Date().toISOString().slice(0, 10)
}

const field =
  "mt-2 w-full rounded-xl border border-border bg-night/60 px-4 py-3.5 text-sand outline-none transition placeholder:text-sand/30 focus:border-ember"

/**
 * Заявка без сервера: собираем письмо и открываем почтовый клиент.
 * Нет бэкенда — нет точки атаки и хранения персональных данных.
 * shortcut: при росте потока заявок подключить CRM/Telegram-бота через серверный роут с rate limit.
 */
export function Booking({ t, worlds }: { t: Dict["book"]; worlds: Dict["worlds"]["items"] }) {
  const [world, setWorld] = useState("")
  const [checkin, setCheckin] = useState("")
  const [sent, setSent] = useState(false)

  useEffect(() => {
    // Ссылки «Хочу сюда» ведут на #book-<мир>: выбираем мир и прокручиваем к форме
    const pick = () => {
      const id = window.location.hash.replace("#book-", "")
      if (!window.location.hash.startsWith("#book-") || !worlds.some((w) => w.id === id)) return
      setWorld(id)
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })
    }
    pick()
    window.addEventListener("hashchange", pick)
    return () => window.removeEventListener("hashchange", pick)
  }, [worlds])

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const chosen = worlds.find((w) => w.id === data.get("world"))
    const lines = [
      `${t.world}: ${chosen ? chosen.name : t.anyWorld}`,
      `${t.checkin}: ${clean(data.get("checkin"))}`,
      `${t.checkout}: ${clean(data.get("checkout"))}`,
      `${t.guests}: ${clean(data.get("guests"))}`,
      `${t.name}: ${clean(data.get("name"))}`,
      `${t.contact}: ${clean(data.get("contact"))}`,
    ]
    const href = `mailto:${CONTACTS.email}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(lines.join("\n"))}`
    setSent(true)
    window.location.href = href
  }

  return (
    <section id="book" aria-labelledby="book-title" className="relative isolate scroll-mt-16 overflow-hidden py-28">
      <Image src={photos.tentStars} alt="" fill sizes="100vw" placeholder="blur" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night via-night/70 to-night" />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="text-eyebrow font-semibold uppercase text-ember">{t.eyebrow}</p>
          <h2 id="book-title" className="mt-5 text-heading font-extrabold text-balance">
            {t.title}
          </h2>
          <p className="mt-6 max-w-lg text-lg text-sand/75">{t.lead}</p>
          <ul className="mt-10 space-y-4">
            {t.guarantees.map((g) => {
              const Icon = ICONS[g.icon]
              return (
                <li key={g.text} className="flex items-center gap-4 font-semibold">
                  <Icon className="size-5 text-ember" aria-hidden="true" />
                  {g.text}
                </li>
              )
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="rounded-[var(--radius)] bg-forest/85 p-6 ring-1 ring-border backdrop-blur-xl sm:p-9">
            <label className="block text-sm font-semibold text-sand/70">
              {t.world}
              <select name="world" value={world} onChange={(e) => setWorld(e.target.value)} className={field}>
                <option value="">{t.anyWorld}</option>
                {worlds.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.region}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <label className="block text-sm font-semibold text-sand/70">
                {t.checkin}
                <input type="date" name="checkin" required onFocus={setMinToday} onChange={(e) => setCheckin(e.target.value)} className={field} />
              </label>
              <label className="block text-sm font-semibold text-sand/70">
                {t.checkout}
                <input type="date" name="checkout" required min={checkin || undefined} onFocus={setMinToday} className={field} />
              </label>
              <label className="block text-sm font-semibold text-sand/70">
                {t.guests}
                <select name="guests" defaultValue="2" className={field}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mt-5 block text-sm font-semibold text-sand/70">
              {t.name}
              <input name="name" required maxLength={MAX_TEXT} autoComplete="given-name" className={field} />
            </label>
            <label className="mt-5 block text-sm font-semibold text-sand/70">
              {t.contact}
              <input
                name="contact"
                required
                maxLength={MAX_TEXT}
                autoComplete="tel"
                pattern="^[+@\w\s()\-.]{5,}$"
                aria-describedby="contact-hint"
                className={field}
              />
              <span id="contact-hint" className="mt-1.5 block text-xs font-normal text-sand/45">
                {t.contactHint}
              </span>
            </label>
            <button
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-ember px-6 py-4 text-sm font-bold uppercase tracking-widest text-night transition hover:bg-sand"
            >
              {t.submit}
              <Send className="size-4" aria-hidden="true" />
            </button>
            <p role="status" className="mt-3 min-h-5 text-center text-sm text-moss">
              {sent ? t.sent : ""}
            </p>
            <p className="mt-2 text-center text-sm text-sand/55">
              {t.or}{" "}
              <a
                href={`https://t.me/${CONTACTS.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sand underline decoration-ember underline-offset-4 hover:text-ember"
              >
                {t.telegram}
              </a>
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
