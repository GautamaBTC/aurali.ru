import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function NotFound() {
  return (
    <main className="section-padding pt-24">
      <div className="container-shell">
        <article className="card-surface max-w-2xl p-8">
          <p className="text-sm uppercase tracking-widest text-zinc-500">404</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">Цепь разорвана, страница не найдена</h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">
            Возможно, ссылка устарела или адрес введен с ошибкой. Вернитесь на главную или свяжитесь с нами.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
            <Link href="/" className="btn-primary">
              На главную
            </Link>
            <a href={`tel:${siteConfig.phones[0].replace(/[^\d+]/g, "")}`} className="btn-secondary">
              {siteConfig.phones[0]}
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}


