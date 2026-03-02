import { brands } from "@/data/brands";

export function BrandsSection() {
  return (
    <section className="section-padding">
      <div className="container-shell">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">С какими марками работаем</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-400 md:text-lg">
          Европейские, корейские, японские и китайские автомобили. Подбираем решения под конкретную платформу.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
          {brands.map((brand) => (
            <span key={brand.id} className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
