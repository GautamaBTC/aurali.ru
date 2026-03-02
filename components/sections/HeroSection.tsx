import { Magnetic } from "@/components/effects/Magnetic";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { siteConfig } from "@/lib/siteConfig";

export function HeroSection() {
  return (
    <section id="top" className="section-padding pt-24 md:pt-28">
      <div className="container-shell">
        <div className="card-surface relative overflow-hidden p-6 md:p-8">
          <div className="relative grid gap-6 md:gap-8 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                <span className="accent-dot" />
                Шахты • с 2016 года • рейтинг {siteConfig.rating}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {siteConfig.brand}: {siteConfig.specialization}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                Премиальный центр автоэлектрики. Диагностика, StarLine, автосвет, кодирование блоков и сложные
                электрические случаи.
              </p>
              <div className="mt-4 inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-blue-400">
                Официальный дилер StarLine
              </div>
              <p className="mt-4 text-sm leading-normal text-zinc-500">
                <TypeWriter words={["заряжаем ваш автомобиль", "делаем сложную электрику понятной", "работаем точно и аккуратно"]} />
              </p>
              <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
                <Magnetic>
                  <a
                    href={siteConfig.social.whatsapp}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-blue-500"
                  >
                    Записаться в WhatsApp
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={siteConfig.social.telegram}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-6 py-3 font-medium text-zinc-100 transition-all duration-200 hover:bg-zinc-700"
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
