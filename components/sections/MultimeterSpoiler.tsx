"use client";

import { useState } from "react";
import { ChevronDown, Gauge } from "lucide-react";
import Multimeter from "@/components/multimeter/Multimeter";

export function MultimeterSpoiler() {
  const [open, setOpen] = useState(false);
  const title = "Интерактивный мультиметр";
  const description =
    "Показать/скрыть демо-стенд диагностики";

  return (
    <section className="section-padding pt-8 md:pt-10">
      <div className="container-shell">
        <div className="card-surface overflow-hidden rounded-2xl">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.02] md:px-6 md:py-5"
            aria-expanded={open}
            aria-controls="multimeter-spoiler-content"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-2)]/35 bg-[var(--accent-2)]/10 text-[var(--accent-2)]">
                <Gauge className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-wide text-[var(--text-primary)] md:text-base">{title}</p>
                <p className="text-xs text-[var(--text-secondary)] md:text-sm">{description}</p>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-[var(--accent)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open ? (
            <div id="multimeter-spoiler-content" className="border-t border-[var(--line)]/70 px-2 pb-2 pt-3 md:px-3 md:pb-3">
              <Multimeter autoAnimate animationInterval={3200} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

