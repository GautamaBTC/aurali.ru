"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { reviews } from "@/data/reviews";
import { siteConfig } from "@/lib/siteConfig";

export function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isSectionRevealed = useReveal(sectionRef, {
    ...REVEAL_PRESETS.BLUR_UP,
    from: { y: 90, autoAlpha: 0, filter: "blur(8px)" },
    to: { y: 0, autoAlpha: 1, filter: "blur(0px)" },
    duration: 0.75,
    threshold: 0.15,
  });

  useStaggerReveal(sectionRef, {
    childSelector: ".review-card",
    from: { rotateX: 10, y: 36, autoAlpha: 0, transformPerspective: 900 },
    to: { rotateX: 0, y: 0, autoAlpha: 1 },
    stagger: 0.1,
    duration: 0.55,
    observe: false,
    revealed: isSectionRevealed,
  });

  return (
    <section ref={sectionRef} id="reviews" className="reveal-section section-padding">
      <div className="container-shell">
        <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">Отзывы клиентов</h2>
          <p className="text-sm leading-normal text-[var(--text-secondary)]/75">
            {"Яндекс Карты:"} {siteConfig.rating} ({siteConfig.ratingVotes} {"оценок"})
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {reviews.map((review) => (
            <article key={review.id} className="review-card card-surface rounded-xl p-6 md:p-8">
              <p className="text-sm leading-normal text-[var(--text-secondary)]/75">
                {"★".repeat(review.rating)} <span className="ml-1">{review.car}</span>
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]/75">
                {review.service} {"•"} {review.date}
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">{review.text}</p>
              <p className="mt-4 text-sm font-medium leading-normal text-[var(--text-primary)]/90">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

