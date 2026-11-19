import * as Sentry from "@sentry/nextjs";

import { sentryInitOptions } from "./sentry.options";

Sentry.init({
  ...sentryInitOptions(),
  includeLocalVariables: false,
});
