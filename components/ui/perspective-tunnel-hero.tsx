"use client";

// Адаптация компонента PerspectiveTunnelHero (21st.dev):
// - движение по туннелю привязано к обычной прокрутке страницы (sticky-сцена),
//   а не к перехвату колеса — страница не «застревает» и работает на тачскринах;
// - картинки и тексты приходят пропсами, фото через next/image (AVIF/WebP);
// - LazyMotion (`m`) вместо полного `motion` — меньше JS.
import { m, useTransform, useReducedMotion, useMotionValue, useScroll, useSpring, type MotionValue } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

export interface TunnelImage {
    src: StaticImageData;
    title: string;
}

interface TunnelCardData {
    item: TunnelImage;
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
    index: number;
}

const buildCards = (images: TunnelImage[]): TunnelCardData[] =>
    images.map((item, i) => {
        const goldenAngle = i * 137.5 * (Math.PI / 180);
        return {
            item,
            angleCos: Math.cos(goldenAngle),
            angleSin: Math.sin(goldenAngle),
            radiusFactorX: 0.28 + (i % 3) * 0.08,
            radiusFactorY: 0.26 + (i % 2) * 0.09,
            rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
            index: i,
        };
    });

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

interface TunnelCardProps {
    card: TunnelCardData;
    progress: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    total: number;
    stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
    const staggerSpan = 0.55;
    const start = (card.index / total) * (1 - staggerSpan);
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    const farZ = stage.isMobile ? -1200 : -1700;
    const nearZ = stage.isMobile ? 350 : 500;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

    const cardWidth = stage.isMobile
        ? Math.max(130, Math.min(180, stage.width * 0.38))
        : Math.max(180, Math.min(270, stage.width * 0.18));

    const baseX = card.angleCos * (stage.width * card.radiusFactorX);
    const baseY = card.angleSin * (stage.height * card.radiusFactorY);
    const panStrength = stage.isMobile ? 20 : 45;

    const transform = useTransform([z, pointer.x, pointer.y], ([currZ, px, py]: number[]) => {
        const offsetX = baseX - px * panStrength;
        const offsetY = baseY - py * panStrength;
        return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    });

    return (
        <m.div
            style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
            className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] select-none will-change-transform"
        >
            <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-pine shadow-2xl shadow-black/90 ring-1 ring-white/15 transition-all duration-500 hover:shadow-ember/25 hover:ring-ember/70">
                <Image
                    src={card.item.src}
                    alt={card.item.title}
                    fill
                    sizes="(max-width: 768px) 180px, 270px"
                    quality={60}
                    placeholder="blur"
                    draggable={false}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 sm:p-5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/95 drop-shadow-md sm:text-sm">
                        {card.item.title}
                    </span>
                </div>
            </div>
        </m.div>
    );
}

export interface PerspectiveTunnelHeroProps {
    images: TunnelImage[];
    eyebrow: string;
    titleLines: [string, string];
    lead: string;
    hint: string;
    id?: string;
}

export default function PerspectiveTunnelHero({ images, eyebrow, titleLines, lead, hint, id }: PerspectiveTunnelHeroProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();
    const [cards] = useState(() => buildCards(images));

    const [stage, setStage] = useState<StageDimensions>({ width: 1440, height: 900, isMobile: false });

    useEffect(() => {
        const updateDimensions = () =>
            setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Прогресс полёта = прокрутка через секцию высотой 400svh
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.0001 });

    const pointer = useCameraParallax(!reduce);

    const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.6, 1, 1, 0]);
    const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

    return (
        <section ref={sectionRef} id={id} aria-label={`${titleLines[0]} ${titleLines[1]}`} className="relative h-[400svh] bg-night">
            <div
                className="sticky top-0 flex h-svh w-full select-none items-center justify-center overflow-hidden text-sand"
                style={{ perspective: stage.isMobile ? "900px" : "1200px", transformStyle: "preserve-3d" }}
            >
                {/* Звёздная сетка и свечение */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(244_238_227/0.18)_1px,transparent_1px)] [background-size:28px_28px] opacity-60 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,138,61,0.16)_0%,transparent_72%)]" />

                {/* Кольца глубины */}
                <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-ember/15" />
                <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-white/10" />

                <m.div
                    style={{ scale: titleScale, opacity: titleOpacity }}
                    className="pointer-events-none z-0 flex max-w-xl flex-col items-center px-6 text-center"
                >
                    <p className="mb-4 text-eyebrow font-semibold uppercase text-ember">{eyebrow}</p>
                    <h2 className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-5xl font-extrabold leading-[0.9] tracking-tighter text-transparent sm:text-7xl md:text-8xl">
                        {titleLines[0]}
                        <br />
                        {titleLines[1]}
                    </h2>
                    <p className="mt-5 max-w-[38ch] text-sm font-light text-sand/70 sm:text-base">{lead}</p>
                </m.div>

                <m.div
                    style={{ opacity: promptOpacity }}
                    className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-eyebrow font-semibold uppercase text-sand/60"
                >
                    <span>{hint}</span>
                    <div className="h-6 w-px bg-gradient-to-b from-ember to-transparent" />
                </m.div>

                <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                    {cards.map((card) => (
                        <TunnelCard
                            key={card.index}
                            card={card}
                            progress={smoothProgress}
                            pointer={pointer}
                            total={cards.length}
                            stage={stage}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
