type SectionBadgeProps = {
  title: string;
  className?: string;
};

export function SectionBadge({ title, className = "" }: SectionBadgeProps) {
  return (
    <div
      className={[
        "reveal-item mx-auto inline-flex items-center justify-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-4 py-1.5 text-center text-xs font-medium uppercase tracking-widest text-[var(--accent-2)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-badge-pulse" />
      {title}
    </div>
  );
}
