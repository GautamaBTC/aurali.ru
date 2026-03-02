import { processSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <section id="process" className="section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Как мы работаем</h2>
        <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {processSteps.map((step) => (
            <li key={step.id} className="card-surface relative rounded-xl p-6 md:p-8">
              <p className="font-mono text-sm leading-normal text-[var(--text-secondary)]/75">Шаг {step.id}</p>
              <h3 className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{step.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

