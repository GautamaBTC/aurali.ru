import { BrandWordmark } from "@/components/ui/BrandWordmark";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 pb-28 pt-16 md:py-24">
      <div className="container-shell">
        <div className="grid gap-6 text-sm leading-normal text-zinc-400 md:grid-cols-2 md:gap-8">
          <div className="space-y-3 md:space-y-4">
            <p className="text-sm font-medium text-zinc-100">
              <BrandWordmark />
            </p>
            <p>{siteConfig.specialization}</p>
            <p>{siteConfig.address}</p>
            <p>Email: {siteConfig.email}</p>
          </div>
          <div className="space-y-3 md:space-y-4 md:text-right">
            <p>ОГРНИП: {siteConfig.ogrnip}</p>
            <p>ИНН: {siteConfig.inn}</p>
            <p>ОКПО: {siteConfig.okpo}</p>
            <p>{siteConfig.schedule}</p>
            <div className="flex gap-3 md:justify-end md:gap-4">
              <a href="/privacy" className="transition-colors duration-200 hover:text-zinc-100">
                Политика
              </a>
              <a href="/terms" className="transition-colors duration-200 hover:text-zinc-100">
                Оферта
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800/80 pt-4 text-xs leading-normal text-zinc-500 md:mt-10 md:flex md:items-center md:justify-between">
          <p>
            © {siteConfig.founded}-{year} <BrandWordmark />. Все права защищены.
          </p>
          <p className="mt-2 md:mt-0">ИП {siteConfig.legalBrand}</p>
        </div>
      </div>
    </footer>
  );
}
