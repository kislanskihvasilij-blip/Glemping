import Link from "next/link"
import type { Dict, Locale } from "@/content"
import { CONTACTS } from "@/lib/site"
import { Logo } from "./logo"

export function Footer({ t, nav, lang }: { t: Dict["footer"]; nav: Dict["nav"]; lang: Locale }) {
  return (
    <footer className="border-t border-border bg-night">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm text-sand/60">{t.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sand/70 transition hover:text-ember">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <address className="space-y-3 not-italic text-sand/70">
          <a href={`tel:${CONTACTS.phone.replace(/[^\d+]/g, "")}`} className="block transition hover:text-ember">
            {CONTACTS.phone}
          </a>
          <a href={`mailto:${CONTACTS.email}`} className="block transition hover:text-ember">
            {CONTACTS.email}
          </a>
          <a
            href={`https://t.me/${CONTACTS.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition hover:text-ember"
          >
            Telegram @{CONTACTS.telegram}
          </a>
          <p className="pt-3">
            <Link href="/ru" hrefLang="ru" aria-current={lang === "ru" ? "page" : undefined} className="font-semibold hover:text-ember">
              RU
            </Link>
            <span className="mx-2 text-sand/30">/</span>
            <Link href="/en" hrefLang="en" aria-current={lang === "en" ? "page" : undefined} className="font-semibold hover:text-ember">
              EN
            </Link>
          </p>
        </address>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-sand/60 sm:px-8">
          © {new Date().getFullYear()} ATLAS Glamping. {t.rights} {t.made}
        </p>
      </div>
    </footer>
  )
}
