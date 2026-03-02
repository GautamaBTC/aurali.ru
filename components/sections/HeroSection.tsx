import { Magnetic } from "@/components/effects/Magnetic";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { siteConfig } from "@/lib/siteConfig";

export function HeroSection() {
  return (
    <section id="top" className="section-padding pt-24 md:pt-28">
      <div className="container-shell">
        <div className="card-surface relative overflow-hidden bg-[rgba(5,10,20,0.62)] p-6 md:p-8">
          <div className="pointer-events-none absolute right-3 top-3 z-[1] hidden items-center gap-2 rounded-full border border-[var(--accent-2)]/30 bg-[rgba(5,10,20,0.55)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-2)] backdrop-blur md:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
            LIVE FEED
          </div>

          <div className="relative grid gap-6 md:gap-8 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]/75">
                <span className="accent-dot" />
                Шахты • с 2016 года • рейтинг {siteConfig.rating}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {siteConfig.brand}: {siteConfig.specialization}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                Премиальный центр автоэлектрики. Диагностика, StarLine, автосвет, кодирование блоков и сложные
                электрические случаи.
              </p>
              <div className="mt-4 inline-flex items-center rounded-full border border-[var(--accent-2)]/25 bg-[var(--accent-2)]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)]">
                Официальный дилер StarLine
              </div>
              <p className="mt-4 text-sm leading-normal text-[var(--text-secondary)]/75">
                <TypeWriter words={["заряжаем ваш автомобиль", "делаем сложную электрику понятной", "работаем точно и аккуратно"]} />
              </p>
              <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
                <Magnetic>
                  <a
                    href={siteConfig.social.whatsapp}
                    className="rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-[#050A14] shadow-[0_0_24px_rgba(204,255,0,0.28)] transition-all duration-200 hover:bg-[var(--accent)]/90 hover:shadow-[0_0_36px_rgba(204,255,0,0.35)]"
                  >
                    Записаться в WhatsApp
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={siteConfig.social.telegram}
                    className="rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-6 py-3 font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-2)]/45 hover:bg-[var(--bg-elevated)]"
                  >
                    Написать в Telegram
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
