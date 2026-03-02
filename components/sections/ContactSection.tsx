import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/lib/siteConfig";

export function ContactSection() {
  return (
    <section id="contacts" className="section-padding">
      <div className="container-shell">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <article className="card-surface rounded-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Контакты и запись</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{siteConfig.address}</p>
            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{siteConfig.schedule}</p>
            <ul className="mt-6 space-y-3 md:space-y-4 text-base md:text-lg">
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-[var(--text-primary)]/90 transition-colors duration-200 hover:text-[var(--text-primary)]">
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
              <a href={siteConfig.social.telegram} className="rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]">
                Telegram
              </a>
              <a href={siteConfig.social.whatsapp} className="rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]">
                WhatsApp
              </a>
              <a href={siteConfig.yandexMaps} className="rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/70 px-4 py-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]">
                Яндекс Карты
              </a>
            </div>
          </article>
          <article className="card-surface rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">Оставьте заявку</h3>
            <p className="mt-4 text-sm leading-normal text-[var(--text-secondary)]/75">
              Ответим в рабочее время и согласуем удобную дату визита.
            </p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

