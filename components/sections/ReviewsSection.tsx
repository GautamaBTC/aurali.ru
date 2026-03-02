import { reviews } from "@/data/reviews";
import { siteConfig } from "@/lib/siteConfig";

export function ReviewsSection() {
  return (
    <section id="reviews" className="section-padding">
      <div className="container-shell">
        <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Отзывы клиентов</h2>
          <p className="text-sm leading-normal text-zinc-500">
            Яндекс Карты: {siteConfig.rating} ({siteConfig.ratingVotes} оценок)
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {reviews.map((review) => (
            <article key={review.id} className="card-surface rounded-xl p-6 md:p-8">
              <p className="text-sm leading-normal text-zinc-500">
                {"★".repeat(review.rating)} <span className="ml-1">{review.car}</span>
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
                {review.service} • {review.date}
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">{review.text}</p>
              <p className="mt-4 text-sm font-medium leading-normal text-zinc-300">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
