import type { Metadata } from "next";
import { LegalBottomHomeButton } from "@/components/legal/LegalBottomHomeButton";
import { LegalTopBar } from "@/components/legal/LegalTopBar";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Политика конфиденциальности - ВИПАВТО",
  description: "Порядок обработки персональных данных клиентов ВИПАВТО.",
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  ["1. Общие положения", "Настоящая политика определяет порядок обработки персональных данных пользователей сайта ВИПАВТО."],
  ["2. Какие данные собираются", "Имя, номер телефона, содержание обращения, технические данные cookies и статистика аналитических систем."],
  ["3. Цели обработки", "Обратная связь, запись на диагностику и обслуживание, информирование о статусе заявки."],
  ["4. Правовые основания", "Обработка выполняется на основании согласия пользователя и требований действующего законодательства РФ."],
  ["5. Хранение и защита", "Данные хранятся в защищенной инфраструктуре и используются только для заявленных целей."],
  ["6. Передача третьим лицам", "Передача допускается только в пределах, необходимых для исполнения заявки и требований закона."],
  ["7. Cookies и аналитика", "Сайт использует cookies и сервисы аналитики для улучшения качества обслуживания."],
  ["8. Права субъекта данных", "Пользователь вправе запросить уточнение, обновление или удаление персональных данных."],
  [
    "9. Контактная информация",
    `Оператор: ИП, ОГРНИП ${siteConfig.ogrnip}, ИНН ${siteConfig.inn}, ОКПО ${siteConfig.okpo}. Дата регистрации: ${siteConfig.registrationDate}. Адрес: ${siteConfig.address}. Email: ${siteConfig.email}.`,
  ],
  ["10. Изменения политики", "Политика может обновляться. Актуальная версия всегда размещается на данной странице."],
] as const;

export default function PrivacyPage() {
  return (
    <main className="section-padding pt-24">
      <div className="container-shell">
        <LegalTopBar trail="Главная / Политика конфиденциальности" />
        <article className="card-surface mt-4 max-w-3xl p-6 md:p-8">
          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">Политика конфиденциальности</h1>
          <div className="mt-6 space-y-6 md:space-y-8">
            {sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="break-words text-xl font-semibold leading-snug sm:text-2xl md:text-3xl">{title}</h2>
                <p className="mt-2 text-base leading-relaxed text-zinc-400 md:text-lg">{body}</p>
              </section>
            ))}
          </div>
        </article>
        <LegalBottomHomeButton />
      </div>
    </main>
  );
}
