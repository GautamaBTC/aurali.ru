# Mobile Burger Menu — Полная документация модуля

## 1) Назначение модуля

`MobileMenu` — единый мобильный навигационный модуль проекта. Он отвечает за:

- мобильный фиксированный хедер;
- кнопку бургер/крестик с анимацией;
- полноэкранное выпадающее меню с видео-фоном;
- мобильную навигацию по якорям секций;
- блокировку скролла страницы при открытом меню;
- анимированный телефон и action-кнопки внизу меню;
- фокус-ловушку, `Escape` и базовую доступность.

Файл реализации: `components/layout/MobileMenu.tsx`.

---

## 2) Где и как подключен

Модуль рендерится глобально в `app/layout.tsx`:

- `MobileMenu` подключен в `<body>` на уровне приложения;
- стоит перед основным контентом (`boot-ui`);
- работает только на мобильном через `md:hidden` в собственных контейнерах.

Это важно для корректного `position: fixed` и управления слоями (`z-index`).

---

## 3) Константы модуля

Внутри `MobileMenu.tsx` используются:

- `MENU_ITEMS`:
  - `services` → `#services`
  - `products` → `#products`
  - `advantages` → `#advantages`
  - `process` → `#process`
  - `reviews` → `#reviews`
  - `contacts` → `#contacts`
- `HEADER_HEIGHT = 72` — смещение при скролле к якорю после закрытия меню.
- `HEADER_PHONE = "+7 (928) 7777-009"` — номер в футере меню.
- `HEADER_PHONE_CHARS` — массив символов номера для покадровой fisheye-анимации.

---

## 4) Состояние и refs

Состояния:

- `isOpen` — открыто/закрыто меню.
- `isBurgerVisible` — отложенное появление бургера (через 3 секунды).
- `activeId` — активная секция для подсветки пункта меню.
- `glitchId` — пункт, на который временно навешан глитч.
- `activePhoneCharIndex` — текущий символ номера в fisheye-волне.
- `menuScale` — масштаб контента меню на низких экранах.

Refs:

- `overlayRef`, `panelRef`, `contentRef`, `footerRef` — контейнеры оверлея/панели.
- `burgerRef`, `lineTopRef`, `lineMidRef`, `lineBotRef` — кнопка и 3 полоски.
- `firstItemRef`, `itemRefs` — управление фокусом и stagger.
- `pendingAnchorRef` — отложенный якорь для скролла после закрытия.
- `closeTlRef` — таймлайн закрытия меню.
- `burgerEntryPlayedRef` — защита от повторного стартового интро бургера.

---

## 5) Скролл-лок и восстановление позиции

Используется хук `useLockScroll(isOpen)` из `hooks/useLockScroll.ts`.

Поведение:

- при открытии:
  - запоминается `window.scrollY` в `body.dataset.scrollY`;
  - `body` переводится в `position: fixed`;
  - скролл блокируется `overflow: hidden`.
- при закрытии:
  - body-стили очищаются;
  - страница возвращается к сохраненному `scrollY`.

Это исключает “подскок” страницы при открытии/закрытии меню.

---

## 6) Появление бургера после загрузки

Логика:

- после `window.load` запускается `setTimeout(3000)`;
- по таймеру `isBurgerVisible = true`;
- до этого кнопка невидима и не кликабельна:
  - `opacity-0`;
  - `pointer-events-none`.

Класс кнопки:

- `fixed right-5 top-0 z-[10001] ... md:hidden`

---

## 7) Анимация иконки бургер ↔ крестик

У иконки 3 линии:

- верхняя: лайм `#ccff00`, ширина `100%`;
- средняя: градиент лайм→циан, ширина `72%`;
- нижняя: циан `#00f0ff`, ширина `50%`.

### Открытие (`isOpen = true`)

GSAP-анимации:

- верхняя: `rotate: 36`, `x/y`-смещение;
- средняя: экстремальный вылет влево:
  - `x = -Math.max(window.innerWidth - 100, 320)`;
  - `opacity: 0`;
  - `scaleX: 0`;
  - быстрый `duration: 0.26`, `ease: power4.in`;
- нижняя: `rotate: -52`, расширение до `width: 38`.

### Закрытие (`isOpen = false`)

- верхняя и нижняя возвращаются в 0;
- средняя “возвращается” через `fromTo` с задержкой;
- применены упругие easing-функции `back.out(...)`.

---

## 8) Стартовая мульти-анимация полосок

После `isBurgerVisible=true`, один раз:

- верхняя вылетает слева;
- нижняя вылетает справа;
- средняя падает сверху;
- используется `gsap.timeline()`.

Защита от повторов: `burgerEntryPlayedRef`.

---

## 9) Структура оверлея меню

DOM-уровни:

- `overlayRef`: `fixed inset-0 z-[9999]`, initially invisible;
- `panelRef`: диалог (`role="dialog"`, `aria-modal="true"`);
- видео-слой + 3 декоративных слоя:
  - затемняющий градиент;
  - неоновые радиальные пятна;
  - grain-текстура (`menu-film-grain`);
- контент (`contentRef`): колонка с навигацией и футером.

Клик по фону закрывает меню:

- обработчик на `panelRef`;
- закрытие только если `event.target === event.currentTarget`.

---

## 10) Открытие/закрытие меню (таймлайны)

### Открытие

- overlay: `autoAlpha:1`, `pointerEvents:auto`;
- panel: from `y:36, scale:0.985, autoAlpha:0` to visible;
- пункты: from `y:46, autoAlpha:0` c `stagger:0.08`;
- footer: from `y:24` to visible;
- через ~200ms фокус ставится на первый пункт.

### Закрытие

- пункты и footer уходят первыми;
- panel затем скрывается;
- в `onComplete`:
  - overlay скрывается и блокирует pointer-events;
  - фокус возвращается на кнопку бургера;
  - выполняется `runPendingScroll()` к якорю.

---

## 11) Навигация по якорям

Клик по пункту:

- `preventDefault()`;
- `closeMenu(item.href)`;
- href сохраняется в `pendingAnchorRef`.

После анимации закрытия:

- ищется target по `id`;
- выполняется `window.scrollTo({ behavior: "smooth" })`;
- учитывается фикс-хедер: `-HEADER_HEIGHT`.

---

## 12) Подсветка активного пункта

`IntersectionObserver` наблюдает секции из `MENU_ITEMS`.

Параметры:

- `rootMargin: "-45% 0px -45% 0px"`;
- `threshold: [0.2, 0.4, 0.7]`.

Самая “видимая” секция обновляет `activeId`, и пункт меню становится ярче.

---

## 13) Глитч-эффект пунктов меню

Когда меню открыто:

- каждые `3–6` секунд выбирается случайный пункт;
- на `~240ms` ему ставится `glitch-active`.

CSS:

- `.menu-item.glitch-active` → `@keyframes menu-glitch`;
- легкие смещения + RGB `text-shadow`.

---

## 14) Телефон и fisheye-анимация

Номер рендерится посимвольно из `HEADER_PHONE_CHARS`.

Каждый не-пробел:

- получает класс `.phone-char digit`;
- в нужный момент добавляется `.fisheye-active`.

Волна:

- длина прохода: `1500ms`;
- шаг считается динамически по числу символов;
- пауза между волнами: `3000ms`;
- последняя цифра тоже участвует.

CSS:

- `.phone-number`, `.phone-char`, `.phone-char.fisheye-active`;
- keyframes: `beautiful-pulse`, `phone-signal-pulse`.

---

## 15) Action-кнопки в футере меню

Внизу меню:

- WhatsApp;
- Telegram;
- Позвонить.

Общее:

- `btn-shine` даёт бегущий блик через `::before`;
- увеличенные hit-areas;
- фирменные цвета рамок/иконок.

---

## 16) Адаптация под малые экраны

Механизм `menuScale`:

- при открытии сравниваются `content.scrollHeight` и `window.innerHeight`;
- если контент выше viewport, применяется `scale(...)`;
- границы: от `0.72` до `1`.

Это позволяет уместить всё без внутреннего скролла меню.

---

## 17) Доступность (a11y)

Реализовано:

- `aria-label`, `aria-expanded`, `aria-controls` у бургера;
- `role="dialog"` + `aria-modal="true"` у панели;
- `Escape` закрывает меню;
- `Tab`-ловушка внутри диалога;
- возврат фокуса на бургер после закрытия;
- фокус первого пункта после открытия.

---

## 18) Слои и z-index

Критичные уровни:

- мобильный хедер: `z-[1200]`;
- бургер-кнопка: `z-[10001]` (выше оверлея);
- оверлей меню: `z-[9999]`;
- контент меню: `relative z-10`;
- фоновые слои оверлея: pointer-events none.

---

## 19) Связанные стили (globals.css)

Классы, напрямую влияющие на модуль:

- `tap-none`
- `touch-manipulation`
- `menu-item`
- `menu-item.glitch-active`
- `menu-film-grain`
- `phone-number`
- `phone-char`
- `phone-char-space`
- `phone-char.fisheye-active`
- `menu-phone`
- `btn-shine`
- `vip-logo-monolith`
- `logo-text`
- `logo-region`
- `region-code`
- `region-flag`

Также есть media-правки для очень низких экранов (`max-height:500px`) и узких (`max-width:380px`).

---

## 20) Производительность

Что уже сделано:

- минимизированы тяжелые эффекты вне меню;
- fixed-сцена меню изолирована;
- при закрытом состоянии оверлей без pointer-events;
- анимации ограничены локально.

Рекомендации:

- не добавлять `ScrollTrigger` внутрь MobileMenu;
- не ставить глобальный `scroll-behavior:smooth` на `html` для мобильных;
- избегать тяжелых фильтров на родителях fixed-слоев.

---

## 21) Инварианты модуля (не ломать)

- бургер и меню работают только на `md:hidden`;
- `useLockScroll` обязателен при `isOpen`;
- закрытие пункта меню должно вести к скроллу только после завершения close-анимации;
- последняя цифра номера должна участвовать в fisheye;
- бургер должен оставаться выше оверлея по `z-index`.

---

## 22) Карта файлов модуля

- Основной компонент:
  - `components/layout/MobileMenu.tsx`
- Блокировка скролла:
  - `hooks/useLockScroll.ts`
- Глобальные стили меню:
  - `app/globals.css`
- Подключение в app shell:
  - `app/layout.tsx`

---

## 23) Быстрый QA-чеклист

- Бургер появляется через 3 секунды после загрузки.
- Анимация бургер→крестик корректная, средняя линия улетает влево.
- Меню открывается/закрывается без артефактов.
- Скролл страницы блокируется при открытом меню.
- `Escape` закрывает меню.
- `Tab` не выходит из диалога.
- Переход по пункту скроллит к нужной секции с учетом высоты хедера.
- Глитч у пунктов появляется периодически и не постоянно.
- Телефон анимируется волной по всем символам (включая последнюю цифру).
- Все элементы влезают на низких экранах без внутреннего скролла.

---

## 24) Данные для полного code review (то, что вы просили)

Ниже собраны именно те артефакты, которые нужны для 100% технического аудита.

### 24.1) Реальные версии зависимостей (`package.json`)

- `react`: `19.2.3`
- `react-dom`: `19.2.3`
- `next`: `16.1.6` (App Router)
- `gsap`: `^3.14.2`
- `typescript`: `^5`

Источник: `package.json`.

### 24.2) Ядро `MobileMenu.tsx` (реальная логика)

Файл: `components/layout/MobileMenu.tsx`

Ключевые блоки для анализа:

1. Стейт/рефы и блокировка скролла:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [isBurgerVisible, setIsBurgerVisible] = useState(false);
const [activeId, setActiveId] = useState<string>("services");
const [glitchId, setGlitchId] = useState<string | null>(null);
const [activePhoneCharIndex, setActivePhoneCharIndex] = useState<number>(-1);
const [menuScale, setMenuScale] = useState(1);

const pendingAnchorRef = useRef<string | null>(null);
const closeTlRef = useRef<gsap.core.Timeline | null>(null);

useLockScroll(isOpen);
```

2. Отложенное появление бургера:

```tsx
useEffect(() => {
  let timeoutId: number | undefined;
  const showBurger = () => {
    timeoutId = window.setTimeout(() => setIsBurgerVisible(true), 3000);
  };

  if (document.readyState === "complete") {
    showBurger();
  } else {
    window.addEventListener("load", showBurger, { once: true });
  }

  return () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    window.removeEventListener("load", showBurger);
  };
}, []);
```

3. Якорный скролл после закрытия меню:

```tsx
const runPendingScroll = useCallback(() => {
  const pending = pendingAnchorRef.current;
  if (!pending) return;
  pendingAnchorRef.current = null;

  const id = pending.replace("#", "");
  const node = document.getElementById(id);
  if (!node) return;

  const y = node.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
  window.scrollTo({ top: y, behavior: "smooth" });
}, []);
```

4. Фокус-ловушка (Tab/Escape):

```tsx
const trapFocus = useCallback((event: KeyboardEvent) => {
  if (event.key !== "Tab" || !isOpen || !panelRef.current) return;
  const focusable = panelRef.current.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}, [isOpen]);
```

5. IntersectionObserver подсветки активного пункта:

```tsx
useEffect(() => {
  const sections = MENU_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActiveId(visible.target.id);
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0.2, 0.4, 0.7] },
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}, []);
```

6. Глитч-таймер:

```tsx
useEffect(() => {
  if (!isOpen) return;
  let timerId: number | undefined;

  const tick = () => {
    const randomItem = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
    if (randomItem) {
      setGlitchId(randomItem.id);
      window.setTimeout(() => setGlitchId((prev) => (prev === randomItem.id ? null : prev)), 240);
    }
    timerId = window.setTimeout(tick, 3000 + Math.random() * 3000);
  };

  timerId = window.setTimeout(tick, 1200);
  return () => {
    if (timerId) window.clearTimeout(timerId);
  };
}, [isOpen]);
```

7. Fisheye-волна телефона (1500ms / 3000ms):

```tsx
useEffect(() => {
  let frameTimer: number | undefined;
  let cycleTimer: number | undefined;
  let cancelled = false;

  const activeIndices = HEADER_PHONE_CHARS.map((char, index) => ({ char, index })).filter((item) => item.char !== " ");
  const waveDuration = 1500;
  const step = Math.max(60, Math.floor(waveDuration / Math.max(activeIndices.length, 1)));

  const runWave = () => {
    let index = 0;
    frameTimer = window.setInterval(() => {
      if (cancelled) return;
      setActivePhoneCharIndex(activeIndices[index]?.index ?? -1);
      index += 1;
      if (index >= activeIndices.length) {
        if (frameTimer) window.clearInterval(frameTimer);
        setActivePhoneCharIndex(-1);
        cycleTimer = window.setTimeout(runWave, 3000);
      }
    }, step);
  };

  runWave();
  return () => {
    cancelled = true;
    if (frameTimer) window.clearInterval(frameTimer);
    if (cycleTimer) window.clearTimeout(cycleTimer);
  };
}, []);
```

8. GSAP открытие/закрытие панели:

```tsx
useEffect(() => {
  const overlay = overlayRef.current;
  const panel = panelRef.current;
  const footer = footerRef.current;
  const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
  if (!overlay || !panel || !footer || !items.length) return;

  closeTlRef.current?.kill();
  gsap.killTweensOf([overlay, panel, footer, ...items]);

  if (isOpen) {
    gsap.set(overlay, { autoAlpha: 1, visibility: "visible", pointerEvents: "auto" });
    gsap.set(panel, { y: 36, scale: 0.985, autoAlpha: 0 });
    gsap.set(items, { y: 46, autoAlpha: 0 });
    gsap.set(footer, { autoAlpha: 0, y: 24 });
    // ...
    return;
  }

  const closeTl = gsap.timeline({
    onComplete: () => {
      gsap.set(overlay, { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" });
      burgerRef.current?.focus();
      runPendingScroll();
    },
  });
  // ...
  closeTlRef.current = closeTl;
}, [isOpen, runPendingScroll]);
```

9. Масштабирование контента меню под малые экраны:

```tsx
useEffect(() => {
  if (!isOpen) return;

  const recalcScale = () => {
    const content = contentRef.current;
    if (!content) return;
    const viewportHeight = window.innerHeight;
    const contentHeight = content.scrollHeight;
    if (contentHeight <= viewportHeight) {
      setMenuScale(1);
      return;
    }
    const ratio = viewportHeight / contentHeight;
    setMenuScale(Math.max(0.72, Math.min(1, ratio * 0.99)));
  };

  const raf = window.requestAnimationFrame(recalcScale);
  window.addEventListener("resize", recalcScale);
  return () => {
    window.cancelAnimationFrame(raf);
    window.removeEventListener("resize", recalcScale);
  };
}, [isOpen]);
```

### 24.3) `useLockScroll.ts` (реализация целиком)

Файл: `hooks/useLockScroll.ts`

```ts
"use client";

import { useEffect } from "react";

export function useLockScroll(locked: boolean): void {
  useEffect(() => {
    const body = document.body;

    if (locked) {
      const scrollY = window.scrollY;
      body.dataset.scrollY = String(scrollY);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      return () => {
        const restoreY = Number.parseInt(body.dataset.scrollY ?? "0", 10);
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.overflow = "";
        delete body.dataset.scrollY;
        window.scrollTo(0, restoreY);
      };
    }

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";
    delete body.dataset.scrollY;
    return undefined;
  }, [locked]);
}
```

### 24.4) CSS-анимации и классы меню из `globals.css`

Файл: `app/globals.css`

```css
@keyframes menu-glitch {
  0%, 88%, 100% {
    transform: translate3d(0, 0, 0);
    text-shadow: none;
    opacity: 1;
  }
  90% {
    transform: translate3d(-1px, 1px, 0);
    text-shadow: 1px 0 #ccff00, -1px 0 #00f0ff;
    opacity: 0.96;
  }
  93% {
    transform: translate3d(1px, -1px, 0);
    text-shadow: -1px 0 #ccff00, 1px 0 #00f0ff;
    opacity: 0.92;
  }
  96% {
    transform: translate3d(0, 0, 0);
    text-shadow: none;
    opacity: 1;
  }
}

.menu-item {
  display: inline-block;
  will-change: transform, opacity, text-shadow;
}

.menu-item.glitch-active {
  animation: menu-glitch 260ms linear 1;
}

.menu-film-grain {
  background-image: url("data:image/svg+xml,...");
  background-size: 180px 180px;
  mix-blend-mode: soft-light;
  animation: grain-shift 0.45s steps(4) infinite;
}

@keyframes grain-shift {
  to {
    background-position: 100% 100%;
  }
}

.phone-number {
  will-change: transform, opacity, text-shadow, filter;
  animation: phone-signal-pulse 2.8s ease-in-out infinite;
}

.phone-char.fisheye-active {
  animation: beautiful-pulse 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes phone-signal-pulse {
  0%, 100% {
    filter: saturate(1);
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.35), 0 0 18px rgba(204, 255, 0, 0.12);
  }
  50% {
    filter: saturate(1.14);
    text-shadow: 0 0 12px rgba(204, 255, 0, 0.45), 0 0 24px rgba(0, 240, 255, 0.28);
  }
}

@keyframes beautiful-pulse {
  0% {
    transform: scale(1) translateY(0);
    text-shadow: none;
    filter: blur(0);
  }
  50% {
    transform: scale(1.4) translateY(-2px);
    text-shadow: 0 0 15px rgba(224, 17, 95, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
    filter: blur(0.3px) brightness(1.25);
  }
  100% {
    transform: scale(1) translateY(0);
    text-shadow: none;
    filter: blur(0);
  }
}

.btn-shine::before {
  animation: btn-shine-run 3.8s ease-in-out infinite;
}

@keyframes btn-shine-run {
  0% { left: -120%; }
  28% { left: 170%; }
  100% { left: 170%; }
}
```

### 24.5) A11y-реализация диалога (текущее состояние)

Реализовано:

- `role="dialog"`, `aria-modal="true"`, `aria-label`;
- `Escape` закрывает;
- ручная Tab-ловушка;
- фокус возвращается на бургер.

Не реализовано на текущий момент:

- `inert`/`aria-hidden` для основного контента страницы при открытом меню.

### 24.6) Что нужно для финального hardening-рефакторинга

Если цель — production hardening без регрессий, следующий шаг:

1. Останавливать fisheye-таймер, когда меню закрыто.  
2. Добавить cleanup для всех вложенных `setTimeout` в глитч-цикле.  
3. Добавить cleanup GSAP timeline/tweens в эффектах (`return () => ...kill()`).  
4. Добавить `inert` + `aria-hidden` на `main`/`boot-ui` при `isOpen`.  
5. Опционально: запускать `IntersectionObserver` только когда меню открыто.
