# VIPAuto161 Design + Motion Blueprint

Цель этого файла — дать нейросети, которая будет визуализировать проект, полный справочник по визуальному стеку, контенту, интеракциям и анимациям. Полностью базируется на наличии: Next.js App Router, Tailwind v4, GSAP 3.14.2 и текущем коде.

## 1. Платформа и сборка
- **Next.js 16.1.6 (App Router)** с глобальными страницами `/`, `/privacy`, `/terms`, `robots.ts`, `sitemap.ts` и API `POST /api/lead`.
- **React 19.2.3 + TypeScript (strict)** — все компоненты клиентские, `use client` у секций/эффектов.
- **Tailwind CSS v4** `@import "tailwindcss"` + кастомные CSS-токены в `app/globals.css` (`:root` переменные, `section-padding`, `card-surface`, `glass-card`, `btn-*`, `input-field`, `accent-dot`, `animate-*` классы, `menu-film-grain`).
- **GSAP 3.14.2 + ScrollTrigger** через `hooks/useGSAP`, `useStaggerReveal`, `useGlobalReveal`, `useReveal` и кастомные эффекты (Magnetic, parallax, multimeter). Motion policy централизован в `lib/motion.ts` + `app/layout.tsx` inline-скрипт выставляет `html[data-reduce-motion]` и уважает `?debug-motion=`.
- **Локальные утилиты**: `useActiveSection` для навигации, `useScrollDirection` для сокрытия хедера, `useInView`/`useReducedMotion`/`useMediaQuery` для адаптации и `useLockScroll` для мобильного меню.
- **Шрифты**: `Manrope` для основного текста, `JetBrains Mono` для технических подписей/табуляций; оба подключены через `next/font` и экспонируются CSS-переменными `--font-manrope`/`--font-jetbrains-mono`.
- **Иконки**: `lucide-react` для расширенного набора (Clock, Star, Gauge, Chevron и т.п.).
- **Мониторинг/SEO**: Yandex.Metrika (`NEXT_PUBLIC_YANDEX_METRIKA_ID`), JSON-LD AutoRepair (в `app/layout.tsx`), OpenGraph/Twitter metadata, `robots` и `sitemap` с `siteConfig.siteUrl`.

## 2. Визуальная система
### Палитра
Все ключевые цвета хранятся в `:root` переменных:
- `--bg-primary: #09090b`, `--bg-secondary: #18181b`, `--bg-elevated: #27272a`
- `--text-primary: #f4f4f5`, `--text-secondary: #a1a1aa`, `--line: #3f3f46`
- Акценты: `--accent: #ccff00` и `--accent-2: #00f0ff` с соответствующими glow-версии `rgba(204,255,0,0.35)` и `rgba(0,240,255,0.35)`.
- Дополнительно `globals` задают градиенты для `corner-glow`, `glow-line`, badge pulse и marquee backgrounds.

### Типография и сетка
- `Manrope` действует как основной гарнитур; `JetBrains Mono` используется в контекстах `font-mono`, `lead-form` и цифровых индикациях.
- Классы `ds-h1`, `ds-h2`, `ds-h3`, `ds-body`, `ds-caption` задают базовые размеры.
- `.container-shell` держит контент по центру, `.section-padding` отвечает за вертикальные отступы (растут с брейкпоинтами).
- Карточные поверхности: `.card-surface` (полупрозрачный материал), `.glass-card` (скользящий стеклянный эффект), `glass-card:hover` усиливает glow и border.
- Доп. элементы: `.accent-dot`, `.typewriter-*`, `.tap-none`, `.touch-manipulation`, `.noise-overlay`, `btn-primary`/`btn-secondary`, `input-field`, `.glow-line`, `.corner-glow`, `.menu-film-grain`, `.phone-number`/`.phone-char` анимации.

### Отступы и адаптив
- `section-padding` — 4rem на мобильных, 6rem на md и 8rem на lg.
- Карточки, формы и секции используют `rounded` от `rounded-xl` до `rounded-3xl`, `gap` и `grid` для сетки.
- Кнопки и формы имеют `transition` 200–400мс, `focus-visible` обводку и `sr-only` skip link.

## 3. Система анимаций
### 3.1 Инфраструктура
- `useGlobalReveal` (вызывается в `app/page.tsx`) отслеживает `.reveal-section`/`.reveal-item` через `ScrollTrigger.batch`, делает `gsap.set(autoAlpha:0,y:40)` и раскрывает по входу `start: top 85%`. В `prefers-reduced-motion` сразу дергает `is-revealed`/`is-in-view`.
- `useReveal`/`useStaggerReveal` строят IntersectionObserver+GSAP. `useStaggerReveal` добавляет `reveal-item` класс, анимацию `from` и `to` с длительностью и stagger. Все компоненты передают `shouldReduceMotionInBrowser()`.
- `lib/motion.ts` парсит `?debug-motion=` и `prefers-reduced-motion`, API может вернуть `force-motion`/`force-reduced`.

### 3.2 Hero и “высокие” эффекты
- **HeroSection** (`#top`): видеофон (`public/uploads/videos/hader.mp4`, poster `images/hero-poster.svg`) под `md` breakpoint; overlay градиента + `LIVE FEED` badge с `animate-badge-pulse`.
- `useStaggerReveal` анимирует `.hero-reveal` (по Y 30px, stagger 0.08, duration 0.45). `TypeWriter` показывает слова "Диагностика", "StarLine", "Автосвет", "Ремонт проводки" с `typing=72ms`, `deleting=38ms`, задержкой 1500ms между словами, cursor blinking @ keyframes.
- `Magnetic` on CTA кнопках (`сила=14`, только на `pointer: fine`) использует `gsap.quickTo` для `x/y` и возвращает на `pointerleave`.
- `LIVE FEED` badge и `accent dot` используют glow/gradient classes, а `hero video` воспроизводится только если `prefers-reduced-motion` false.
- `ParticleField` (внутри hero) рисует 10 частиц на мобильных, 24 на десктопе, красными точками `rgba(215,23,23,0.45)` с `requestAnimationFrame`.
- `ReverseParallaxBackground` и `GlowParticles` добавляют глубокие слои из градиентов/канвасов, двигающихся при скролле.

### 3.3 Секционные анимации
1. **Stats (`#stats`)**: `REVEAL_PRESETS.FADE_UP` + `useStaggerReveal` с `scale:0.8`. Компоненты `StatCard` в `components/stats/StatCard.tsx` плавно увеличиваются при hover (GSAP `y:-4`). `useCountUp` запускает Tween 2.8s `power2.out`, добавляет `shimmer-text` на 3s и плавно обновляет `tabular-nums`.
2. **Comparison (`#compare`)**: секция появляется через `CLIP_BOTTOM` preset, карточки `.comparison-garage`/`.comparison-vip` “съезжают” из сторон (`x±120`). `ComparisonItem` (иконки Lucide) появляется с `stagger:0.08` и `animate-float-slow`/`animate-pulse-ring` в центре `vs`.
3. **Product Showcase / Multimeter**: `ProductShowcase` строит 3D-карусель (`on desktop: translate(-50%, -50%) translateX(position * offset) scale(...) rotateY(...) opacity blur`). Offset управляется `useCardOffset` (380–260px, 220/180/140). Автоплей каждые 5s, отключается на мобильных или reduced-motion. Мобильный трек использует `scroll-snap` и `IntersectionObserver` (`useMobileActiveSlide`). Точки (`Dots`) и стрелки (`NavArrow`) реализованы с `transition-500ms`, градиентными вставками. `MultimeterSpoiler` раскрывает `Multimeter` со скролл-триггером (каркас GSAP `ScrollTrigger`, `[data-panel]` `opacity`/`y`). `Multimeter` имитирует прибор: `useMultimeter` (автоконфигурация, сценарии `SCENARIOS`, GSAP tween, bargraph segments, `CustomEvent` `lcdupdate`, `useOscilloscope`, `MeterHistory`, `MeterComputed`, `MeterFooter`), `useVisibility` следит за вьюпортом, `shouldReduceMotionInBrowser()` отключает GSAP.
4. **Services `#services`**: FAQ-аккордеон с sticky-headers. `ServiceRow` использует `useStickyState`+`ResizeObserver` для `maxHeight`, градиентной линии слева, `transform`/`color` изменений. При разворачивании появляются пункты (feature list) с `delay: 100ms` и `call-to-action` кнопка с `translateY`. `scrollToContacts()` плавно скроллит (десктоп offset 72).
5. **Partner Brands**: `CipherAccordion` (компонент `AccordionItem`). `ScanCell` создаёт scan-line (`animate-cipher-scan`), corner marks и signal bars. `ImageScanContent` меняет `opacity/scale`. `Accordion` имеет `MorphIcon` (плюс/минус), `SignalBars` (5 полос с stagger). При открытии активируется `background`/`boxShadow`, `SignalBars` постепенно проявляются.
6. **Brands (`#brands`)**: две строки `MarqueeRow` (`animate-brands-marquee`, `animate-brands-marquee-reverse`, пауза на hover), список фильтров (`BRAND_GROUPS`), расширение (`isExpanded` toggles grid). Brand cards используют CSS-переходы `transform, opacity, box-shadow`, а `.brand-grid-card__glow`/`line` усиливают невидимые детали.
7. **Advantages, Process, Reviews, Contact**: все используют `useReveal` + `useStaggerReveal` с разными preset (Clip, Fade, Blur). `Advantages` делится на карточки с `rotateY`, `Process` строит линию `data-process-line`, `Reviews` карточки `rotateX`. `Contact` разбит на две колонки (`contact-info-col`, `contact-form-col`). Форма `LeadForm` (name, phone, select, textarea) отображает `formState` сообщения success/error.

### 3.4 Поддержка UI
- **Desktop Header** `components/layout/DesktopHeader.tsx` скрывается при скролле вниз (state `useScrollDirection`) и выдвигается вниз/обратно (CSS `translate-y`). Активные ссылки подсвечиваются цветом и светящимся кружком. `scrollToId` делает smooth-scroll с offset 72.
- **Mobile Menu**: `components/layout/MobileMenu.tsx` — GSAP таймлайн для открытия/закрытия, burger animation (`buildBurgerTimeline`), фокусный треп (tab trap), `aria-hidden`/`inert` на `.boot-ui`, `useLockScroll`. Каждый пункт анимируется `back.out`, текущая секция определяется `IntersectionObserver`.
- **Sticky Mobile Actions** `StickyMobileActions` появляется при `window.scrollY > 260`, плавно поднимается с `transform: translateY(64px)` и `opacity`, содержит кнопки `call` и `book` с тенью.
- **ScrollProgress**: `gsap.ScrollTrigger` масштабирует `scaleX(progress)` на баре `top:0` (desktop only).
- **ScrollToTop**: кнопка появляется после 400px, стрелка растёт (`arrow-float`), при hover появляются `particle` элементы с `particle-float`, `ping-slow` окрестности.
- **Parallax & Particles**: `ParallaxImage` (GSAP scroll-trigger `yPercent`), `ReverseParallaxBackground`, `GlowParticles` (desktop only), `ParallaxParticles` (абстрактные twinkle dots). `ParallaxBackground` вставляется только на мобильных (вечное статическое градиентное покрытие).

### 3.5 Адаптивная политика и `prefers-reduced-motion`
- Все эффекты проверяют `shouldReduceMotionInBrowser` и `useReducedMotion`. Если reduce = true, то GSAP либо не запускает анимацию, либо сразу выставляет классы `is-revealed/is-in-view` и `gsap.set(..., {clearProps: "all"})`.
- CSS `@media (prefers-reduced-motion: reduce)` обнуляет `animation-duration`, `scroll-behavior`, `transition-duration`.
- Query `?debug-motion=1|true|on` принудительно включает анимации, `?debug-motion=0|false|off` выключает.

## 4. Страницы и контент
_Структура `app/page.tsx`_:
1. **Hero** (`HeroSection`, `id="top"`) — H1 `VIPАвто: Автоэлектрика и автоэлектроника`, subcopy `Один из старейших сервисов...`, CTA в WhatsApp/Telegram, `TypeWriter`, `price` tag, `LIVE FEED` badge.
2. **Stats (`#stats`)** — KPI (10+ лет, 4.6/5, 117+ отзывов, 8+ направлений) из `data/stats.ts` (Clock/Star/Users/LayoutGrid). Cards `StatCard` с count-up, hover float.
3. **Comparison (`#compare`)** — две карточки `ComparisonCard` (`garage` и `vip`). Используются `ComparisonItem` bullet list.
4. **Product Showcase / Multimeter (`#products`)** — LED-продукты (`PRODUCTS` список) + интерактивный мультиметр (`Multimeter`). Карточки включают specs, price placeholder, `colorTemp`, `lumens` и gradient overlay.
5. **Services (`#services`)** — accordion согласно `data/services.ts`: diagnostics, StarLine, LED/Bi-LED, autosound, камеры, GLONASS/GPS, cooling, AC, LLumar, ремонт.
6. **Partner Brands (`#partners`)** — `partnerBrands` (StarLine, LLumar, Philips, AZ, Viper, Incar) с `ScanCell` и тегами.
7. **Advantages (`#advantages`)** — `advantages.ts` (Official StarLine partner, experience, diagnostics, transparent terms).
8. **Process (`#process`)** — 4 шага (`processSteps`), вертикальная линия `data-process-line`.
9. **Brands (`#brands`)** — marquee preview, expandable grid, фильтры по регионам (europe/japan/korea/china/usa/russia).
10. **Reviews (`#reviews`)** — отзывы (rating, service, date, car) + Yandex/2GIS рейтинг `siteConfig.rating` & `twoGisRating`.
11. **Contact (`#contacts`)** — контактные данные + `LeadForm`.
12. **Footer** + `StickyMobileActions` + `ScrollToTop`.

## 5. Поддерживающая логика и API
- `LeadForm` (components/forms/LeadForm.tsx): валидация `name >= 2`, `phone` regex `^\+?\d{11,15}$`, `service` из списка, `message` optional. Стейты `idle/loading/success/error`, ошибки показываются под инпутом красным текстом.
- API `POST /api/lead` (app/api/lead/route.ts): лимит 3 запроса/10 мин (map per IP), валидирует payload и отправляет Telegram сообщение через `formatTelegramMessage`. При отсутствии токена/Failure fallback ссылка на WhatsApp.
- `siteConfig` (lib/siteConfig.ts): brand, legalBrand, address, city, region, schedule, phones, email, socials (Telegram/WhatsApp/VK), Yandex/2GIS ссылки, rating 4.6 (117 отзывов), `inn`, `okpo`, `okved`, `ogrnip`.
- SEO: metadata и JSON-LD `AutoRepair`, `robots.ts` (allow `/`), `sitemap.ts` (/, /privacy, /terms, changeFrequency + priority), canonical via `app/layout`.

## 6. Медиа и активы
- **Hero**: `public/uploads/videos/hader.mp4` и `images/hero-poster.svg`.
- **Продукты**: `public/images/products/*.png` (Viper, Aozoom, PROsvet и др.) + `gradient` цвета (каждый объект `gradient` массив двух hex).
- **Партнёры**: `public/images/partners/{starline,llumar,philips,az,viper,incar}.png`.
- **Логотип**: `public/images/plate-logo.svg` используется в metadata/desktop header.
- **Фоны**: `noise-overlay`, `menu-film-grain`, radial gradients и parallax layers из `ReverseParallaxBackground`.

## 7. Поведение UI и UX-ноты
- **Skip link** ведёт к `main-content`.
- **Prefer-reduced-motion** управляется через `lib/motion.ts` и inline-скрипт (из layout); CSS `@media (prefers-reduced-motion: reduce)` нивелирует все анимации.
- **Nav**: десктопный header прячется при прокрутке вниз, подсвечивает активную секцию. Mobile menu анимируется через GSAP (burger, overlay, focus trap, inert + aria-hidden).
- **Quick actions**: фиксированные CTA снизу для звонка/записи появляются после scrollY > 260 и используют gradient/shadow + pulse.
- **Scroll feedback**: Progress bar `scaleX`, `ScrollToTop` с arrow float и particle trail.
- **Параллакс**: `ParallaxBackground` для мобилок, `ParallaxImage` (scroll-trigger `yPercent`), `ReverseParallaxBackground`, `GlowParticles` и `ParticleField` создают глубину.

## 8. Последовательность секций (на всякий случай)
1. Hero / #top
2. Stats / #stats
3. Comparison / #compare
4. ProductCarousel & Multimeter / #products
5. Services / #services
6. Partner Brands / #partners
7. Advantages / #advantages
8. Process / #process
9. Brands / #brands
10. Reviews / #reviews
11. Contact / #contacts
12. Footer + StickyMobileActions + ScrollToTop

## 9. Рекомендации для визуализатора
- Пользуйся CSS-переменными из `globals.css` (фон, акценты, glow).
- Разделяй компоненты по `container-shell` → `section-padding` → `card-surface`
- Анимации запускаются через `ScrollTrigger`/`IntersectionObserver` и должны быть отключены при `html[data-reduce-motion="true"]`.
- Hero: видео + `TypeWriter` + `Magnetic` кнопки.
- Stats: count-up `StatCard` + shimmer.
- Comparison: Card-based, clip reveal + floating `vs`.
- Product: 3D stack + mobile carousel + dots/nav.
- Services: Sticky accordion, gradient left line, animated feature list.
- Partner: `ScanCell` с scan-line + tags.
- Brands: marquee preview + expand button + filter pills.
- Reviews + Contact: две колонки, `LeadForm` с валидированием и API.
- Mobile menu: GSAP burger, animated phone number + CTA кнопки (WhatsApp/Telegram).

## 10. Ключевые данные
- Контакты: `info@vipauto161.ru`, телефоны `+7 (928) 197-77-00`, `+7 (928) 777-70-09`, `+7 (928) 121-01-61`, адрес `Ростовская обл., г. Шахты, пер. Новочеркасский, 44Б`, график `Пн-Пт 10:00-20:00`, соцсети Telegram/WhatsApp/VK.
- Услуги: diagnostics, StarLine, LED/Bi-LED, autosound, камеры, GLONASS/GPS, cooling, klima, LLumar, ремонт (11 направлений).
- Партнёры: StarLine, LLumar, Philips, AZ, Viper, Incar.
- Бренды: BMW, Mercedes, Audi, Toyota, Lexus, Hyundai, Kia, Volkswagen + множество других (разделены на группы europe/japan/korea/china/usa/russia).
- Отзывы: 4 записи (rating, service, date, car) + рейтинги Yandex 4.6 (117 оценок) и 2GIS 4.7.

## 11. Дополнительно
- `app/layout.tsx` добавляет JSON-LD, Yandex.Metrika, `scripts` управления motion, подключает `ParallaxBackground`, `DesktopHeader`, `MobileMenuWrapper`.
- `LeadForm` управляет состояниями `idle/loading/success/error` и показывает внутрь `form` (noValidate).
- API возвращает `fallback` на WhatsApp в случае ошибки Telegram.
- `prefers-reduced-motion` override доступен через `?debug-motion=0/false/off`.
