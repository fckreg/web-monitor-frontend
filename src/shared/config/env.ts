import "server-only";

import { parseServerEnv, type ServerEnv } from "./env-schema";

let cached: ServerEnv | null = null;

// Объект process.env целиком Next не подменяет при сборке, поэтому значения читаются в рантайме.
export function serverEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);

  return cached;
}
