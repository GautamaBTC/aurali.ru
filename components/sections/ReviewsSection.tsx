"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";
import { REVEAL_PRESETS } from "@/lib/revealPresets";
import { reviews } from "@/data/reviews";
import { siteConfig } from "@/lib/siteConfig";
import { SectionBadge } from "@/components/ui/SectionBadge";

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
        <div className="mb-8 text-center md:mb-12">
          <div>
            <SectionBadge title="Отзывы" className="mb-4 md:mb-6" />
            <h2 className="reveal-item text-3xl font-bold leading-tight tracking-tight md:text-4xl">Отзывы клиентов</h2>
          </div>
          <div className="mt-4 text-sm leading-normal text-zinc-500">
            <p>
              {"Яндекс Карты:"} {siteConfig.rating} ({siteConfig.ratingVotes} {"оценок"})
            </p>
            <p>
              {"2GIS:"} {siteConfig.twoGisRating}
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {reviews.filter((review) => review.id !== "r5").map((review) => (
            <article key={review.id} className="review-card reveal-item card-surface rounded-xl p-6 md:p-8">
              <p className="text-sm leading-normal text-zinc-500">
                <span className="text-[#f5c542]">{`${"★".repeat(review.rating)}`}</span> <span className="ml-1">{review.car}</span>
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
                {review.service} {"•"} {review.date}
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">{review.text}</p>
              <p className="mt-4 text-sm font-medium leading-normal text-zinc-100">{review.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

