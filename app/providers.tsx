import { ReactNode } from "react";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: ReactNode }) {
  return <NextUIProvider className="h-full">{children}</NextUIProvider>;
}
