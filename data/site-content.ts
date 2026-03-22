export interface StatItem {
  id: string
  value: string
  label: string
}

export interface NavItem {
  label: string
  href: string
}

export interface ServiceCategory {
  id: 'barrel' | 'massage' | 'face' | 'wraps'
  title: string
}

export interface ServiceItem {
  id: string
  categoryId: ServiceCategory['id']
  title: string
  durationMin: number
  priceRub: number
  shortText: string
  effect: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface ContactInfo {
  city: string
  region: string
  address: string
  phoneDisplay: string
  phoneDigits: string
  email: string
  whatsappUrl: string
  mapsUrl: string
  openingHours: string
}

export interface SiteContent {
  brand: string
  domain: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  firstVisitOffer: string
  nav: NavItem[]
  stats: StatItem[]
  categories: ServiceCategory[]
  services: ServiceItem[]
  faq: FaqItem[]
  touristBlockTitle: string
  touristBlockText: string
  finalCtaTitle: string
  finalCtaText: string
  contact: ContactInfo
}

export const siteContent: SiteContent = {
  brand: 'ЛИаура',
  domain: 'aurali.ru',
  heroTitle: 'Восстановление, которое возвращает вас к себе',
  heroSubtitle: 'ЛИаура · персональные SPA-ритуалы в Шахтах',
  heroDescription:
    'Индивидуальные ритуалы массажа и SPA без конвейера: один мастер, один гость и точно выстроенное время для отдыха, расслабления и возвращения к себе.',
  firstVisitOffer: 'Первый визит — 15%',
  nav: [
    { label: 'Главная', href: '#top' },
    { label: 'Почему мы', href: '#trust' },
    { label: 'Услуги', href: '#services' },
    { label: 'Обо мне', href: '#master' },
    { label: 'Запись', href: '#booking' },
    { label: 'Первый визит', href: '#offer' },
    { label: 'Отзывы', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Для гостей города', href: '#tourist' },
    { label: 'Контакты', href: '#contacts' },
    { label: 'Записаться', href: '#final-cta' },
  ],
  stats: [
    { id: 'sessions', value: '500+', label: 'Проведенных процедур' },
    { id: 'rating', value: '4.9/5', label: 'Средняя оценка гостей' },
    { id: 'returns', value: '43%', label: 'Возвращаются в течение месяца' },
  ],
  categories: [
    { id: 'barrel', title: 'Кедровая бочка' },
    { id: 'massage', title: 'Массаж' },
    { id: 'face', title: 'Уход за лицом' },
    { id: 'wraps', title: 'SPA-обёртывания' },
  ],
  services: [
    {
      id: 'barrel-lux',
      categoryId: 'barrel',
      title: 'Кедровая бочка «Люкс»',
      durationMin: 60,
      priceRub: 2400,
      shortText: '40 минут в облаке кедрового пара и глубокое расслабление.',
      effect: 'Снимает усталость и возвращает легкость в теле.',
    },
    {
      id: 'barrel-lite',
      categoryId: 'barrel',
      title: 'Кедровая бочка «Лайт»',
      durationMin: 30,
      priceRub: 1000,
      shortText: 'Быстрый ритуал восстановления, когда нужно перезапуститься за один сеанс.',
      effect: 'Мягко прогревает и снимает дневное напряжение.',
    },
    {
      id: 'thai-oil',
      categoryId: 'massage',
      title: 'Тайский массаж на горячем масле',
      durationMin: 60,
      priceRub: 3400,
      shortText: 'Пластичный глубокий ритм с теплым маслом и акцентом на спину и плечи.',
      effect: 'Разгружает мышечные зажимы и выравнивает дыхание.',
    },
    {
      id: 'anticell',
      categoryId: 'massage',
      title: 'Моделирующий антицеллюлитный массаж',
      durationMin: 45,
      priceRub: 2600,
      shortText: 'Интенсивная проработка зон, где нужна плотность и тонус.',
      effect: 'Подтягивает силуэт и ускоряет микроциркуляцию.',
    },
    {
      id: 'brazil',
      categoryId: 'massage',
      title: 'Бразильская попка',
      durationMin: 45,
      priceRub: 2600,
      shortText: 'Фокусная техника для ягодиц и бедер с визуальным лифтинг-эффектом.',
      effect: 'Дает упругость и четкий контур.',
    },
    {
      id: 'stone',
      categoryId: 'massage',
      title: 'Стоунтерапия',
      durationMin: 60,
      priceRub: 3000,
      shortText: 'Сочетание тепла камней и медленного ритма для глубокого расслабления.',
      effect: 'Снижает стресс и успокаивает нервную систему.',
    },
    {
      id: 'thai-face',
      categoryId: 'face',
      title: 'Тайский массаж лица',
      durationMin: 45,
      priceRub: 3000,
      shortText: 'Микс проработки мышц и лимфодренажа для свежего, открытого лица.',
      effect: 'Уменьшает отечность и улучшает тонус кожи.',
    },
    {
      id: 'face-classic',
      categoryId: 'face',
      title: 'Массаж лица',
      durationMin: 30,
      priceRub: 1600,
      shortText: 'Короткий уходовый формат, когда нужно быстро вернуть лицу свежесть.',
      effect: 'Освежает цвет лица и расслабляет мимику.',
    },
    {
      id: 'sea-power',
      categoryId: 'wraps',
      title: '«Сила Водорослей»',
      durationMin: 60,
      priceRub: 4000,
      shortText: 'Детокс-обёртывание на водорослях с мягким тепловым эффектом.',
      effect: 'Снимает отечность и улучшает качество кожи.',
    },
    {
      id: 'choco',
      categoryId: 'wraps',
      title: '«Всё будет в шоколаде»',
      durationMin: 60,
      priceRub: 3000,
      shortText: 'Шоколадный ритуал с ароматом, который переключает тело в режим отдыха.',
      effect: 'Питает кожу и снижает уровень стресса.',
    },
    {
      id: 'elegance',
      categoryId: 'wraps',
      title: '«Сама Изысканность»',
      durationMin: 60,
      priceRub: 3000,
      shortText: 'Деликатный SPA-уход для ровного тона кожи и ощущения легкости.',
      effect: 'Выравнивает текстуру кожи и расслабляет тело.',
    },
    {
      id: 'berry',
      categoryId: 'wraps',
      title: '«Ягодно-вкусная»',
      durationMin: 60,
      priceRub: 3000,
      shortText: 'Ягодное обёртывание с насыщенным ароматом и уходовым действием.',
      effect: 'Смягчает кожу и дает заметный ухоженный вид.',
    },
  ],
  faq: [
    {
      id: 'bring',
      question: 'Нужно ли что-то брать с собой?',
      answer: 'Нет. Мы предоставляем все необходимое: полотенца, халат, тапочки и чай после процедуры.',
    },
    {
      id: 'without-booking',
      question: 'Можно прийти без записи?',
      answer: 'Работаем по предварительной записи, чтобы все внимание мастера принадлежало только вам.',
    },
    {
      id: 'contra',
      question: 'Есть ли противопоказания?',
      answer:
        'Перед первым визитом проводим короткую консультацию. Основные ограничения: температура, острые воспаления, кожные обострения.',
    },
    {
      id: 'payment',
      question: 'Как можно оплатить?',
      answer: 'Наличные, банковская карта или перевод по СБП.',
    },
    {
      id: 'gift',
      question: 'Есть ли подарочные сертификаты?',
      answer: 'Да, доступны сертификаты номиналом 3000, 5000, 7000 и 10000 ₽ со сроком действия 6 месяцев.',
    },
    {
      id: 'where',
      question: 'Где находится студия?',
      answer: 'Шахты, Ростовская область. Точный адрес и маршрут отправим после записи в WhatsApp.',
    },
  ],
  touristBlockTitle: 'После дороги и дел — дайте телу выдохнуть',
  touristBlockText:
    'Если вы в Шахтах проездом или после насыщенного дня, запланируйте ритуал заранее: к вашему приходу пространство уже будет подготовлено.',
  finalCtaTitle: 'Позвольте себе остановиться',
  finalCtaText:
    'Запишитесь на первый ритуал через WhatsApp и почувствуйте, как тело возвращает себе тишину и ресурс.',
  contact: {
    city: 'Шахты',
    region: 'Ростовская область',
    address: 'г. Шахты, пер. Новочеркасский, 44Б',
    phoneDisplay: '8 (921) 523-25-45',
    phoneDigits: '79215232545',
    email: 'hello@aurali.ru',
    whatsappUrl: 'https://wa.me/79215232545',
    mapsUrl: 'https://yandex.ru/maps/?text=%D0%A8%D0%B0%D1%85%D1%82%D1%8B%2C%20%D0%BF%D0%B5%D1%80.%20%D0%9D%D0%BE%D0%B2%D0%BE%D1%87%D0%B5%D1%80%D0%BA%D0%B0%D1%81%D1%81%D0%BA%D0%B8%D0%B9%2C%2044%D0%91&z=16',
    openingHours: 'Ежедневно, 10:00-21:00',
  },
}


