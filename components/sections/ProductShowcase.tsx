"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MutableRefObject, type RefObject } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { SectionBadge } from "@/components/ui/SectionBadge";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  specs: string[];
  price: string;
  badge?: string;
  colorTemp: string;
  lumens: string;
  image: string;
  gradient: [string, string];
};

const PRODUCTS: Product[] = [
  {
    id: "viper-zoom-terminator",
    name: "Viper Zoom Terminator",
    subtitle: "Bi-LED линзы",
    specs: ["100W комплект", "5500K", "Быстрый розжиг"],
    price: "Цена по запросу",
    badge: "Viper",
    colorTemp: "5500K",
    lumens: "100W",
    image: "/images/products/viper-zoom-terminator-100w-5500k-kit.png",
    gradient: ["#3b82f6", "#8b5cf6"],
  },
  {
    id: "viper-achilles",
    name: "Viper Achilles 3.0",
    subtitle: "Bi-LED линза",
    specs: ["Версия 3.0", "Комплект с переходниками", "Для установки в оптику"],
    price: "Цена по запросу",
    badge: "Bi-LED",
    colorTemp: "3.0\"",
    lumens: "Bi-LED",
    image: "/images/products/viper-achilles-3-0-bi-led-lens-kit.png",
    gradient: ["#06b6d4", "#3b82f6"],
  },
  {
    id: "viper-bi-led-3-0",
    name: "Viper Bi-LED 3.0",
    subtitle: "Проекторный комплект",
    specs: ["3.0 дюйма", "Пара линз", "Комплект для ретрофита"],
    price: "Цена по запросу",
    colorTemp: "3.0\"",
    lumens: "Комплект",
    image: "/images/products/viper-bi-led-3-0-projector-kit.png",
    gradient: ["#8b5cf6", "#ec4899"],
  },
  {
    id: "aozoom-black-warrior",
    name: "Aozoom Black Warrior",
    subtitle: "Bi-LED модуль",
    specs: ["Aozoom серия", "Пара модулей", "Линзованный свет"],
    price: "Цена по запросу",
    badge: "Aozoom",
    colorTemp: "Bi-LED",
    lumens: "Пара",
    image: "/images/products/aozoom-black-warrior-bi-led-lens-kit.png",
    gradient: ["#f59e0b", "#ef4444"],
  },
  {
    id: "aozoom-bi-led-pair",
    name: "Aozoom Bi-LED Pair",
    subtitle: "Комплект линз",
    specs: ["Пара модулей", "Чёткая светотеневая граница", "Для ретрофита фар"],
    price: "Цена по запросу",
    colorTemp: "Bi-LED",
    lumens: "2 шт",
    image: "/images/products/aozoom-bi-led-lens-pair.png",
    gradient: ["#10b981", "#06b6d4"],
  },
  {
    id: "viper-north-warrior",
    name: "Viper North Warrior",
    subtitle: "Bi-LED линзы",
    specs: ["5500K", "Три чипа", "Встроенный драйвер"],
    price: "Цена по запросу",
    badge: "Новинка",
    colorTemp: "5500K",
    lumens: "3 chip",
    image: "/images/products/viper-north-warrior-5500k-kit.png",
    gradient: ["#7c3aed", "#f97316"],
  },
  {
    id: "viper-z15-truck",
    name: "Viper Zoom Z-15 Truck",
    subtitle: "Грузовой свет",
    specs: ["24V", "5000K", "CANBUS"],
    price: "Цена по запросу",
    badge: "Truck",
    colorTemp: "5000K",
    lumens: "24V",
    image: "/images/products/viper-zoom-z15-truck-24v-5000k-box.png",
    gradient: ["#fb7185", "#f97316"],
  },
  {
    id: "viper-optimus-prime",
    name: "Viper Optimus Prime",
    subtitle: "Bi-LED lens",
    specs: ["24V", "3.0 дюйма", "Для рефлекторной и штатной оптики"],
    price: "Цена по запросу",
    colorTemp: "24V",
    lumens: "3.0\"",
    image: "/images/products/viper-optimus-prime-24v-3-0-box.png",
    gradient: ["#38bdf8", "#a855f7"],
  },
  {
    id: "prosvet-s5",
    name: "PROsvet S5",
    subtitle: "LED лампа",
    specs: ["Комплект лампы", "Для авто и мото", "Серия S5"],
    price: "Цена по запросу",
    badge: "LED",
    colorTemp: "S5",
    lumens: "LED",
    image: "/images/products/prosvet-s5-led-lamp-kit.png",
    gradient: ["#2563eb", "#60a5fa"],
  },
  {
    id: "prosvet-s10",
    name: "PROsvet S10",
    subtitle: "Светодиодная лампа",
    specs: ["Серия S10", "Усиленное охлаждение", "Для авто, грузовиков и мото"],
    price: "Цена по запросу",
    colorTemp: "S10",
    lumens: "LED",
    image: "/images/products/prosvet-s10-led-lamp-kit.png",
    gradient: ["#64748b", "#f59e0b"],
  },
  {
    id: "prosvet-drive-light-h7",
    name: "PROsvet Drive Light H7",
    subtitle: "LED комплект",
    specs: ["Цоколь H7", "140W комплект", "13000LM на упаковке"],
    price: "Цена по запросу",
    badge: "H7",
    colorTemp: "140W",
    lumens: "13000LM",
    image: "/images/products/prosvet-drive-light-h7-s10-kit.png",
    gradient: ["#8b5cf6", "#f97316"],
  },
  {
    id: "prosvet-s6",
    name: "PROsvet S6",
    subtitle: "LED лампа",
    specs: ["Серия S6", "Гибкий радиатор", "Для авто и мото"],
    price: "Цена по запросу",
    colorTemp: "S6",
    lumens: "LED",
    image: "/images/products/prosvet-s6-led-lamp-kit.png",
    gradient: ["#0ea5e9", "#3b82f6"],
  },
  {
    id: "prosvet-s9",
    name: "PROsvet S9",
    subtitle: "Светодиодная лампа",
    specs: ["Серия S9", "Компактный корпус", "Установка в штатный цоколь"],
    price: "Цена по запросу",
    colorTemp: "S9",
    lumens: "LED",
    image: "/images/products/prosvet-s9-led-lamp-kit.png",
    gradient: ["#f59e0b", "#ef4444"],
  },
];

function useCardOffset() {
  const [offset, setOffset] = useState(260);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 380) setOffset(140);
      else if (w <= 640) setOffset(180);
      else if (w <= 1024) setOffset(220);
      else setOffset(260);
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return offset;
}

function useMobileActiveSlide(
  containerRef: RefObject<HTMLDivElement | null>,
  slideRefs: MutableRefObject<Array<HTMLDivElement | null>>,
  enabled: boolean,
  onActiveChange: (index: number) => void,
) {
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!slides.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.slide);
          if (!Number.isNaN(index)) onActiveChange(index);
        });
      },
      {
        root: container,
        threshold: 0.6,
      },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [containerRef, enabled, onActiveChange, slideRefs]);
}

function ProductCard({
  product,
  isActive,
  mobile,
  position,
  offset,
  index,
  total,
  onSelect,
  setMobileRef,
}: {
  product: Product;
  isActive: boolean;
  mobile: boolean;
  position: number;
  offset: number;
  index: number;
  total: number;
  onSelect: () => void;
  setMobileRef?: (el: HTMLDivElement | null) => void;
}) {
  const absPos = Math.abs(position);

  const desktopStyle: CSSProperties = {
    transform: `translate(-50%, -50%) translateX(${position * offset}px) scale(${isActive ? 1 : 1 - absPos * 0.12}) rotateY(${position * -4}deg)`,
    opacity: absPos > 2 ? 0 : 1 - absPos * 0.25,
    filter: isActive ? "none" : `blur(${absPos * 1.5}px)`,
    pointerEvents: absPos > 1 ? "none" : "auto",
  };

  const content = (
    <>
      <div
        className="absolute left-4 right-4 top-0 h-px rounded-full opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${product.gradient[0]}, ${product.gradient[1]}, transparent)` }}
      />

      {product.badge ? (
        <span
          className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white opacity-100"
          style={{ background: `linear-gradient(135deg, ${product.gradient[0]}cc, ${product.gradient[1]}cc)` }}
        >
          {product.badge}
        </span>
      ) : null}

      <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-white/[0.03]">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${mobile ? "opacity-20" : isActive ? "opacity-35" : "opacity-10"}`}
          style={{ background: `radial-gradient(ellipse at center, ${product.gradient[0]}38, transparent 72%)` }}
        />
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="relative z-10 object-contain p-4 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 320px, 380px"
        />
      </div>

      <div className="space-y-3">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/45">{product.subtitle}</p>
          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">{product.name}</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/75">{product.colorTemp}</span>
          <span className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/75">{product.lumens}</span>
        </div>

        <ul className="space-y-1.5 overflow-hidden text-xs opacity-100">
          {product.specs.map((spec) => (
            <li key={spec} className="flex items-center gap-2 text-white/55">
              <span className="h-1 w-1 flex-shrink-0 rounded-full" style={{ background: product.gradient[0] }} />
              {spec}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-white/10 pt-2">
          <span className="text-base font-bold text-white sm:text-lg">{product.price}</span>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-100" style={{ color: product.gradient[0] }}>
            Подробнее
          </span>
        </div>
      </div>
    </>
  );

  if (mobile) {
    return (
      <div
        ref={setMobileRef}
        data-slide={index}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} из ${total}: ${product.name}`}
        className="product-slide snap-center shrink-0"
      >
        <article className="group relative w-[85vw] max-w-[420px] rounded-3xl border border-white/10 bg-zinc-900/70 p-6 text-left sm:p-8">
          {content}
        </article>
      </div>
    );
  }

  return (
    <div role="group" aria-roledescription="slide" aria-label={`${index + 1} из ${total}: ${product.name}`}>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`${product.name} ${product.price}`}
        className={`group product-card absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-6 text-left outline-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[320px] sm:p-8 lg:w-[380px] ${
          isActive ? "z-30" : position === 1 || position === -1 ? "z-20" : "z-10"
        }`}
        style={desktopStyle}
      >
        {content}
      </button>
    </div>
  );
}

function Dots({
  total,
  active,
  products,
  onSelect,
}: {
  total: number;
  active: number;
  products: Product[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Показать ${products[i]?.name ?? `слайд ${i + 1}`}`}
          className={`relative h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            i === active ? "w-8" : "w-2 bg-white/25 hover:bg-white/45"
          }`}
        >
          {i === active ? (
            <span className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(90deg, ${products[i].gradient[0]}, ${products[i].gradient[1]})` }} />
          ) : null}
        </button>
      ))}
    </div>
  );
}

function NavArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Предыдущий" : "Следующий"}
      className={`absolute top-1/2 z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/55 transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:text-white md:flex md:h-12 md:w-12 ${
        direction === "left" ? "left-4 lg:-left-6" : "right-4 lg:-right-6"
      }`}
    >
      {direction === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  );
}

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const mobileSlideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)", true);
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const desktopOffset = useCardOffset();
  const [activeIndex, setActiveIndex] = useState(0);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.FADE_UP,
    threshold: 0.15,
  });
  const staggerFrom = useMemo(() => ({ y: 30, autoAlpha: 0 }), []);
  const staggerTo = useMemo(() => ({ y: 0, autoAlpha: 1 }), []);

  useStaggerReveal(sectionRef, {
    childSelector: ".product-showcase-reveal",
    from: staggerFrom,
    to: staggerTo,
    stagger: 0.08,
    duration: 0.45,
    observe: false,
    revealed: isSectionRevealed,
  });

  useMobileActiveSlide(mobileTrackRef, mobileSlideRefs, isMobile, setActiveIndex);

  const goTo = useCallback(
    (index: number) => {
      const len = PRODUCTS.length;
      const normalized = ((index % len) + len) % len;
      setActiveIndex(normalized);

      if (isMobile) {
        const el = mobileSlideRefs.current[normalized];
        if (el) {
          el.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }
    },
    [isMobile, prefersReduced],
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (isMobile || prefersReduced) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      return;
    }

    autoplayRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % PRODUCTS.length);
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isMobile, prefersReduced]);

  const glow = useMemo(() => PRODUCTS[activeIndex]?.gradient[0] ?? "#3b82f6", [activeIndex]);

  return (
    <section ref={sectionRef} id="products" className="section-padding reveal-section relative overflow-hidden" aria-label="LED продукция">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className={`absolute left-1/2 top-1/2 h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000 ${isMobile ? "opacity-[0.03] blur-[80px]" : "opacity-[0.09] blur-[120px]"}`}
          style={{ background: `radial-gradient(ellipse, ${glow}, transparent 70%)` }}
        />
      </div>

      <div className="container-shell relative z-10">
        <div className="mb-12 text-center md:mb-16">
          <SectionBadge title="Каталог" className="product-showcase-reveal" />
          <h2 className="product-showcase-reveal reveal-item mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">LED продукция</h2>
          <p className="product-showcase-reveal reveal-item mx-auto mt-3 max-w-xl text-sm text-white/45 md:text-base">
            Би-LED линзы, грузовые модули и LED-лампы из актуального ассортимента. Все изображения в каталоге привязаны к реальным товарам из папки проекта.
          </p>
        </div>

        <div
          className="product-showcase-reveal reveal-item relative hidden select-none md:block"
          role="region"
          aria-roledescription="carousel"
          aria-label="LED лампы"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
          style={{ height: "clamp(470px, 54vw, 560px)" }}
        >
          {PRODUCTS.map((product, i) => {
            let position = i - activeIndex;
            const half = Math.floor(PRODUCTS.length / 2);
            if (position > half) position -= PRODUCTS.length;
            if (position < -half) position += PRODUCTS.length;

            return (
              <ProductCard
                key={product.id}
                product={product}
                isActive={i === activeIndex}
                mobile={false}
                position={position}
                offset={desktopOffset}
                index={i}
                total={PRODUCTS.length}
                onSelect={() => goTo(i)}
              />
            );
          })}

          <NavArrow direction="left" onClick={prev} />
          <NavArrow direction="right" onClick={next} />
        </div>

        <div
          ref={mobileTrackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="LED лампы"
          className="product-showcase-reveal reveal-item -mx-6 flex gap-4 overflow-x-auto px-6 pb-2 pt-1 md:hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
          style={{
            scrollSnapType: prefersReduced ? "none" : "x mandatory",
            scrollBehavior: prefersReduced ? "auto" : "smooth",
            scrollPaddingInline: "24px",
          }}
        >
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              isActive={i === activeIndex}
              mobile
              position={0}
              offset={0}
              index={i}
              total={PRODUCTS.length}
              onSelect={() => goTo(i)}
              setMobileRef={(el) => {
                mobileSlideRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        <div className="product-showcase-reveal reveal-item">
          <Dots total={PRODUCTS.length} active={activeIndex} products={PRODUCTS} onSelect={goTo} />
        </div>

        <div className="product-showcase-reveal reveal-item mt-4 text-center">
          <span className="font-mono text-xs tabular-nums text-white/35">
            {String(activeIndex + 1).padStart(2, "0")} <span className="mx-1.5 text-white/15">/</span> {String(PRODUCTS.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}



