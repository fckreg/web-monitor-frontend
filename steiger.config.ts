import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// Слои FSD app и pages лежат в src/_app и src/_pages.
// Префикс `_` понимает Steiger, а Next.js не принимает эти каталоги за роутер.

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ["**/*.test.ts"],
  },
  {
    rules: {
      "fsd/insignificant-slice": "off",
      "fsd/typo-in-layer-name": "off",
    },
  },
]);
