export interface MenuItem {
  id: string
  href: string
  label: string
}

export const HEADER_BASE_HEIGHT = 72

export const MENU_ITEMS: readonly MenuItem[] = [
  { id: 'top', href: '/#top', label: 'Главная' },
  { id: 'trust', href: '/#trust', label: 'Почему мы' },
  { id: 'services', href: '/#services', label: 'Услуги' },
  { id: 'master', href: '/#master', label: 'Обо мне' },
  { id: 'booking', href: '/#booking', label: 'Запись' },
  { id: 'offer', href: '/#offer', label: 'Первый визит' },
  { id: 'reviews', href: '/#reviews', label: 'Отзывы' },
  { id: 'faq', href: '/#faq', label: 'FAQ' },
  { id: 'tourist', href: '/#tourist', label: 'Для гостей города' },
  { id: 'contacts', href: '/#contacts', label: 'Контакты' },
  { id: 'final-cta', href: '/#final-cta', label: 'Записаться' },
] as const

function getCssHeaderHeight(): number {
  const root = document.documentElement
  const raw = getComputedStyle(root).getPropertyValue('--header-h').trim()
  const parsed = Number.parseFloat(raw.replace('px', ''))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : HEADER_BASE_HEIGHT
}

export function getCurrentHeaderOffset(): number {
  if (typeof document === 'undefined') {
    return HEADER_BASE_HEIGHT
  }

  const headers = Array.from(document.querySelectorAll<HTMLElement>('[data-site-header]'))
  const visibleHeights = headers
    .filter((node) => {
      const styles = window.getComputedStyle(node)
      return styles.display !== 'none' && styles.visibility !== 'hidden'
    })
    .map((node) => node.getBoundingClientRect().height)
    .filter((height) => height > 0)

  if (visibleHeights.length) {
    return Math.max(...visibleHeights)
  }

  return getCssHeaderHeight()
}

export function scrollToSection(id: string): void {
  if (typeof window === 'undefined') {
    return
  }

  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const target = document.getElementById(id)
  if (!target) {
    return
  }

  const offset = getCurrentHeaderOffset()
  const top = target.getBoundingClientRect().top + window.scrollY - offset

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  })
}
