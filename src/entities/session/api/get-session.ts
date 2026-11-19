import "server-only";

import { cookies } from "next/headers";

import { reportServerError } from "@/shared/server";

import { SESSION_COOKIE } from "../model/cookie";
import { type SessionUser, sessionUserSchema } from "../model/schema";
import { sessionFetch } from "./session-fetch";

export async function getSession(): Promise<SessionUser | null> {
  if (!(await cookies()).has(SESSION_COOKIE)) {
    return null;
  }

  try {
    const response = await sessionFetch("/auth/me");

    if (!response.ok) {
      return null;
    }

    return sessionUserSchema.parse(await response.json());
  } catch (error) {
    reportServerError(error);

    return null;
  }
}
