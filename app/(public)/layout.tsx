import type { ReactNode } from "react";

import { PublicFrame } from "@/widgets/public-frame";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicFrame>{children}</PublicFrame>;
}
