import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function NotFound() {
  return (
    <main className="section-padding pt-24">
      <div className="container-shell">
        <article className="card-surface max-w-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-[var(--text-secondary)]">404</p>
          <h1 className="mt-3 text-3xl font-bold">Цепь разорвана — страница не найдена</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Возможно, ссылка устарела или адрес введен с ошибкой. Вернитесь на главную или свяжитесь с нами.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[#050A14]">
              На главную
            </Link>
            <a href={`tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`} className="rounded-xl border border-white/20 px-5 py-3 font-semibold">
              {siteConfig.phones[0]}
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}


