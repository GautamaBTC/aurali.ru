type LegalTopBarProps = {
  trail: string;
};

export function LegalTopBar({ trail }: LegalTopBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm text-zinc-500">{trail}</p>
    </div>
  );
}
