import { services } from "@/data/services";

export function ServicesSection() {
  return (
    <section id="services" className="section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Основные услуги</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {services.map((service) => (
            <article key={service.id} className="card-surface rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 md:gap-4">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]/75">{service.leadTime}</p>
                {service.popular ? <span className="rounded-full bg-[var(--accent-2)]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--accent-2)]">Популярно</span> : null}
              </div>
              <h3 className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{service.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{service.description}</p>
              <p className="mt-4 font-mono text-base text-[var(--accent-2)] md:text-lg">{service.price}</p>
              <ul className="mt-4 flex flex-wrap gap-3 md:gap-4">
                {service.features.map((feature) => (
                  <li key={feature} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

