import type { Metadata } from "next";
import { LegalBottomHomeButton } from "@/components/legal/LegalBottomHomeButton";
import { LegalTopBar } from "@/components/legal/LegalTopBar";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Публичная оферта - VIPАвто",
  description: "Публичная оферта на оказание услуг автоэлектрики и автоэлектроники.",
  alternates: {
    canonical: "/terms",
  },
};

const sections = [
  ["1. Общие положения", "Настоящий документ является публичной офертой на оказание услуг в сфере автоэлектрики и автоэлектроники."],
  ["2. Предмет оферты", "Исполнитель оказывает услуги по диагностике, ремонту и установке оборудования в транспортных средствах."],
  ["3. Порядок заключения", "Акцептом оферты считается обращение клиента через сайт, мессенджер или телефон и подтверждение записи."],
  ["4. Права и обязанности сторон", "Исполнитель обязуется выполнить работы качественно и в согласованные сроки, клиент обязуется предоставить корректные данные автомобиля."],
  ["5. Стоимость и оплата", "Стоимость работ определяется после диагностики и согласуется с клиентом до начала выполнения."],
  ["6. Сроки оказания услуг", "Сроки зависят от сложности работ и наличия комплектующих, фиксируются при согласовании заказа."],
  ["7. Гарантия", "На выполненные работы предоставляется гарантия в соответствии с действующими условиями сервиса."],
  ["8. Ответственность сторон", "Стороны несут ответственность в пределах, предусмотренных законодательством РФ и условиями данной оферты."],
  ["9. Разрешение споров", "Споры решаются путем переговоров, при недостижении соглашения - в установленном законом порядке."],
  ["10. Форс-мажор", "Стороны освобождаются от ответственности за неисполнение обязательств при наступлении обстоятельств непреодолимой силы."],
  ["11. Срок действия", "Оферта действует бессрочно до момента ее изменения или отзыва исполнителем."],
  [
    "12. Реквизиты исполнителя",
    `Исполнитель: VIPАвто, ОГРНИП ${siteConfig.ogrnip}, ИНН ${siteConfig.inn}, ОКПО ${siteConfig.okpo}, ОКВЭД ${siteConfig.okved}, дата регистрации ${siteConfig.registrationDate}, адрес: ${siteConfig.address}.`,
  ],
] as const;

export default function TermsPage() {
  return (
    <main className="section-padding pt-24">
      <div className="container-shell">
        <LegalTopBar trail="Главная / Публичная оферта" />
        <article className="card-surface mt-4 max-w-3xl p-6 md:p-8">
          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">Публичная оферта</h1>
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
