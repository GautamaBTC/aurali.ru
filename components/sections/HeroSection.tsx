import { Magnetic } from "@/components/effects/Magnetic";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { siteConfig } from "@/lib/siteConfig";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-visible py-8 min-h-[100svh] h-auto flex items-center md:py-16 md:min-h-[80vh]"
      style={{ touchAction: "auto" }}
    >
      <div className="container-shell">
        <div className="card-surface relative overflow-hidden bg-[rgba(5,10,20,0.62)] p-6 md:p-8">
          <div className="pointer-events-none absolute right-4 top-4 z-[1] hidden items-center gap-2 rounded-full border border-[var(--accent-2)]/30 bg-[rgba(5,10,20,0.55)] px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)] backdrop-blur md:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
            LIVE FEED
          </div>

          <div className="relative grid gap-6 md:gap-8 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                <span className="accent-dot" />
                Шахты • с 2009 года • рейтинг {siteConfig.rating}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {siteConfig.brand}: {siteConfig.specialization}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                Один из старейших сервисов автоэлектрики в Шахтах.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                Премиальный центр автоэлектрики. Диагностика, StarLine, автосвет и сложные электрические случаи.
              </p>
              <div className="mt-4 inline-flex max-w-full items-center rounded-full border border-[var(--accent-2)]/25 bg-[var(--accent-2)]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)]">
                Официальный дилер StarLine
              </div>
              <p className="mt-4 text-sm leading-normal text-zinc-500">
                <TypeWriter words={["Диагностика", "StarLine", "Автосвет", "Ремонт проводки"]} />
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
                <Magnetic>
                  <a
                    href={siteConfig.social.whatsapp}
                    className="touch-manipulation inline-flex w-full items-center justify-center rounded-lg bg-[var(--accent)] px-6 py-3 text-center font-medium text-[#0b0b0b] shadow-[0_0_24px_rgba(204,255,0,0.28)] transition-all duration-200 hover:bg-[var(--accent)]/90 hover:text-[#0b0b0b] hover:shadow-[0_0_36px_rgba(204,255,0,0.35)] sm:w-auto"
                    style={{ color: "#0b0b0b", WebkitTextFillColor: "#0b0b0b" }}
                  >
                    Записаться в WhatsApp
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={siteConfig.social.telegram}
                    className="touch-manipulation inline-flex w-full items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-6 py-3 text-center font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-2)]/45 hover:bg-[var(--bg-elevated)] sm:w-auto"
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
