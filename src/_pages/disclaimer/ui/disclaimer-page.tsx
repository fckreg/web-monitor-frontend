import type { Metadata } from "next";
import { Suspense } from "react";

import { routes } from "@/shared/config";
import { absoluteUrl, JsonLd, pageMetadata, resolveSiteUrl, webPageJsonLd } from "@/shared/seo";

const TITLE = "Правовая информация";
const DESCRIPTION =
  "Чем являются проверки «На связи» и чего они не означают. Это не официальный статус сайтов.";

const SECTIONS = [
  {
    title: "Что мы проверяем",
    text: "Сервис сам отправляет запросы и записывает, пришёл ли ответ и сколько это заняло. Цифры на страницах — доля таких запросов, а не обещанная доступность чужого сервиса.",
  },
  {
    title: "Чего результат не означает",
    text: "Полученный ответ не доказывает, что сайт открывается у каждого. Отсутствие ответа не доказывает, что сайт не работает: так бывает из-за сети, таймаута, сертификата, блокировки нашего адреса или настроек самого сайта. Проверка может опоздать, пропустить час или ошибиться.",
  },
  {
    title: "Как это нельзя использовать",
    text: "Эти страницы не основание для вывода, что сайт лежит или работает, для публикации об этом, для претензии к владельцу сайта и для решения, которое нельзя принять без собственной проверки.",
  },
  {
    title: "Пределы ответственности",
    text: "В той мере, в какой это допускает закон, мы не отвечаем за решения и последствия, если результаты приняли за официальный статус сайта, а также за неполноту, задержку и ошибку проверки. Ответственность, которую закон не позволяет ограничить, сохраняется.",
  },
] as const;

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: routes.disclaimer,
  });
}

// Текст статичен и целиком попадает в оболочку; JSON-LD зависит от адреса сайта и догружается.
export function DisclaimerPage() {
  return (
    <article className="max-w-2xl pt-6 pb-12">
      <Suspense fallback={null}>
        <DisclaimerJsonLd />
      </Suspense>
      <h1 className="type-page-title">{TITLE}</h1>
      <p className="type-note mt-4">
        «На связи» показывает результат автоматических запросов с нашего сервера. Это не официальный
        статус сайтов и не сообщение их владельцев.
      </p>
      <div className="mt-10 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="type-section-title mb-2">{section.title}</h2>
            <p className="type-note">{section.text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

async function DisclaimerJsonLd() {
  const site = await resolveSiteUrl();

  return (
    <JsonLd
      data={webPageJsonLd({
        url: absoluteUrl(site, routes.disclaimer),
        name: TITLE,
        description: DESCRIPTION,
        siteUrl: absoluteUrl(site, routes.home),
      })}
    />
  );
}
