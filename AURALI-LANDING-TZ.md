# ТЗ: Лендинг АУРАЛИ (Шахты)

Дата: 2026-03-22  
Статус: в работе  
Проект: `C:\Users\ideal\Desktop\LiStudio`

## 1. Цель
Собрать премиальный конверсионный лендинг для СПА/массажной студии `АУРАЛИ` с акцентом на:
- атмосферу и бренд
- доверие и понятную ценность
- запись в 1-2 действия
- мобильную стабильность и бесшовные анимации

## 2. Тон и стиль
- Тон: спокойный, уверенный, без шаблонных обещаний
- Формула текстов: ощущение -> метод -> результат
- Визуал: cinematic premium, тонкая типографика, мягкие motion-переходы
- Тексты: только кириллица

## 3. Финальная структура страницы
1. Hero + быстрый CTA
2. Почему АУРАЛИ / доверие
3. Услуги с фильтрами
4. Мастер(а)
5. Результат/эффект
6. Бронирование
7. Акции/сертификаты
8. Отзывы
9. Контакты + карта
10. Финальный CTA + футер

## 4. Маппинг на текущий код
- Hero: `components/sections/hero-section.tsx`
- Header desktop: `components/layout/desktop-header.tsx`
- Header/mobile menu/overlay: `components/layout/mobile-menu.tsx`
- Logo: `components/layout/brand-logo.tsx`
- Trust: `components/sections/trust-section.tsx`
- Services: `components/sections/services-section.tsx`
- Master: `components/sections/master-section.tsx`
- Offer: `components/sections/offer-section.tsx`
- FAQ: `components/sections/faq-section.tsx`
- Contacts: `components/sections/contacts-section.tsx`
- Final CTA: `components/sections/final-cta-section.tsx`
- Page composition: `app/page.tsx`
- Content source: `data/site-content.ts`

## 5. Что добавить в текущей итерации
1. Блок `Бронирование` между `Master` и `Offer`
2. Блок `Отзывы` между `Offer` и `FAQ`
3. Сохранить текущую палитру/видеофон и motion-базу

## 6. Анимационная система
- Единый ease: `cubic-bezier(0.22, 1, 0.36, 1)`
- Hero: staged intro + fade on scroll
- Header: intro + compact on scroll
- Mobile overlay: единый choreography timeline
- Телефон в overlay: бесшовная волна/пульс без швов
- Уважать `prefers-reduced-motion`

## 7. Конверсия
- Sticky WhatsApp на мобилке
- `tel:` и `wa.me` CTA в ключевых секциях
- Минимальная форма записи
- Повтор CTA каждые 2-3 секции

## 8. SEO и локальность
- Ключи: `массаж в Шахтах`, `СПА Шахты`, `массажный салон Шахты`
- Единые NAP-данные
- FAQ 6-8 вопросов
- JSON-LD `DaySpa`

## 9. Критерии приемки
1. Первый экран полностью помещается на мобильных
2. Нет миганий, швов, рывков в header/menu/phone animation
3. Заголовок Hero читается на любом кадре видео
4. CTA всегда видим и понятен
5. Линт и типизация без ошибок

## 10. План внедрения
1. Структура секций и недостающие блоки
2. Финальная редактура текстов под бренд
3. Motion-polish по всем ключевым интеракциям
4. Мобильный QA-проход и финальный тюнинг
