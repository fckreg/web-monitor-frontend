import Link from "next/link";

import { routes } from "@/shared/config";
import { closedPageMetadata } from "@/shared/seo";
import { PublicFrame } from "@/widgets/public-frame";

export const metadata = closedPageMetadata({
  title: "Страница не найдена",
  description: "Такой страницы на «На связи» нет.",
});

const link = "underline underline-offset-2 hover:text-ink";

export function NotFoundPage() {
  return (
    <PublicFrame>
      <div className="max-w-2xl pt-6 pb-12">
        <h1 className="type-page-title">Страница не найдена</h1>
        <p className="type-note mt-4">
          Такой страницы нет. Откройте список проверок или правовую информацию.
        </p>
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-light">
          <Link href={routes.home} className={link}>
            К проверкам
          </Link>
          <Link href={routes.disclaimer} className={link}>
            Правовая информация
          </Link>
        </p>
      </div>
    </PublicFrame>
  );
}
