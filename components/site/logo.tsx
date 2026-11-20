import { cn } from "@/lib/utils"

/** Знак ATLAS: A-образный шатёр с распахнутым входом, за которым — вершина и путеводная звезда. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path d="M24 4 44.5 42.5h-41L24 4Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M24 4 16.5 42.5M24 4l7.5 38.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m17.6 42.5 4.6-8.6 2.4 3.4 2.2-3.9 4.6 9.1h-13.8Z" fill="var(--ember)" />
      <path d="m24 18.5 1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1 1-2.4Z" fill="var(--ember)" />
    </svg>
  )
}

export function Logo({ className, subtitle = "glamping" }: { className?: string; subtitle?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.15rem] font-extrabold tracking-[0.28em]">ATLAS</span>
        <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.42em] opacity-70">{subtitle}</span>
      </span>
    </span>
  )
}
