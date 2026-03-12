type BrandWordmarkProps = {
  className?: string;
};

export function BrandWordmark({ className = "" }: BrandWordmarkProps) {
  return (
    <span className={`brand-wordmark ${className}`.trim()} aria-label="ВИПАВТО">
      <span className="brand-wordmark__vip">ВИП</span>
      <span className="brand-wordmark__auto">АВТО</span>
    </span>
  );
}
