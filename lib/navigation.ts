export type MenuItem = {
  id: string;
  href: string;
  label: string;
};

export const HEADER_BASE_HEIGHT = 72;

export const MENU_ITEMS: readonly MenuItem[] = [
  { id: "services", href: "/#services", label: "Услуги" },
  { id: "products", href: "/#products", label: "Каталог" },
  { id: "gallery", href: "/#gallery", label: "Галерея" },
  { id: "advantages", href: "/#advantages", label: "Преимущества" },
  { id: "process", href: "/#process", label: "Как мы работаем" },
  { id: "reviews", href: "/#reviews", label: "Отзывы" },
  { id: "contacts", href: "/#contacts", label: "Контакты" },
] as const;

function getCssHeaderHeight(): number {
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue("--header-h").trim();
  const parsed = Number.parseFloat(raw.replace("px", ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : HEADER_BASE_HEIGHT;
}

export function getCurrentHeaderOffset(): number {
  if (typeof document === "undefined") return HEADER_BASE_HEIGHT;

  const headers = Array.from(document.querySelectorAll<HTMLElement>("[data-site-header]"));
  const visibleHeights = headers
    .filter((node) => {
      const styles = window.getComputedStyle(node);
      return styles.display !== "none" && styles.visibility !== "hidden";
    })
    .map((node) => node.getBoundingClientRect().height)
    .filter((height) => height > 0);

  if (visibleHeights.length) {
    return Math.max(...visibleHeights);
  }

  return getCssHeaderHeight();
}

export function scrollToSection(id: string): void {
  if (typeof window === "undefined") return;

  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const target = document.getElementById(id);
  if (!target) {
    console.warn(`Section #${id} not found`);
    return;
  }

  const offset = getCurrentHeaderOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  
  // Небольшая задержка для плавности
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  });
}
