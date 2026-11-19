# web-monitor-frontend

Публичный и приватный UI монитора доступности сайтов. Next.js (App Router) + FSD в `src/`.

## Стек и подходы

| Область       | Стек                                                      |
| ------------- | --------------------------------------------------------- |
| UI            | React 19, Next.js 16 (App Router), React Compiler         |
| Язык          | TypeScript                                                |
| Стили         | Tailwind CSS 4, локальный UI-кит в `shared/ui`            |
| Данные        | Zod-схемы ответов API, Recharts для графиков              |
| Наблюдаемость | Sentry (`@sentry/nextjs`)                                 |
| Качество      | ESLint, Prettier, Steiger (FSD), Vitest, Playwright + axe |
| Хуки          | Lefthook: eslint / prettier / steiger на pre-commit       |
| Пакеты        | pnpm                                                      |

Подходы:

- **FSD** — слои в `src/`, границы проверяет Steiger; `app/` только тонкие route-файлы.
- **Server Components по умолчанию** — публичные экраны собирают данные на сервере; клиентские острова точечно (`"use client"`).
- **Кеш Next** — `cacheComponents`, `"use cache"` и `cacheLife` для публичного статуса; тяжёлые блоки под `Suspense` со скелетонами.
- **BFF-прокси** — браузер ходит в `/api/*`, Next проксирует в бэкенд по whitelist; SSR читает `BACKEND_URL` напрямую.
- **Сессия** — cookie + middleware/layout; вход через логин/пароль и TOTP (или recovery).
- **Безопасность** — CSP и security headers в `next.config`; `output: "standalone"` для деплоя.
- **SEO** — metadata, JSON-LD, OG-картинки.

## Как устроен UI

Два контура:

- **Публичный** — `/` (доска статусов), `/status/[slug]` (карточка сайта), `/disclaimer`. Без логина, данные с бэкенда через server-side fetch.
- **Приватный** — `/targets`, `/dashboard`. Cookie-сессия; middleware быстро отсекает гостей, layout проверяет сессию на бэкенде. Логин — `/login` (учётка + TOTP / recovery).

Мутации с браузера идут на `/api/*`: Next проксирует в бэкенд по whitelist маршрутов (same-origin для POST/PATCH/DELETE). SSR читает API напрямую по `BACKEND_URL`.

## Слои в `src/`

| Слой       | Роль                                            |
| ---------- | ----------------------------------------------- |
| `_app`     | layout’ы, proxy API, глобальные стили           |
| `_pages`   | сборка экранов                                  |
| `widgets`  | доска статусов, таблицы, графики uptime/latency |
| `features` | логин, CRUD групп/целей, toggle, logout         |
| `entities` | target, group, check, session                   |
| `shared`   | конфиг, API-хелперы, UI-кит, SEO                |

`app/` — тонкие route-файлы Next, логика в `src/`.
