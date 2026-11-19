import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/entities/session";
import { routes } from "@/shared/config";

// Быстрый отказ без похода в бэкенд. Действительность сессии проверяет приватный layout.
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const login = new URL(routes.login, request.url);

  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/targets/:path*", "/dashboard/:path*"],
};
