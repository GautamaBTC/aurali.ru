import { advantages } from "@/data/advantages";

export function AdvantagesSection() {
  return (
    <section id="advantages" className="section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Почему выбирают VIPАвто</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
          {advantages.map((advantage) => (
            <article key={advantage.id} className="card-surface rounded-xl p-6 md:p-8">
              <h3 className="text-2xl font-semibold leading-snug md:text-3xl">{advantage.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">{advantage.description}</p>
              {advantage.stat ? <p className="mt-4 font-mono text-base text-blue-400 md:text-lg">{advantage.stat}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
