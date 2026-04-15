"use client";

import { Toaster } from "sonner";

/** Root-level toast host so student assessment and other routes can use `toast.*`. */
export function AppToaster() {
  return <Toaster theme="dark" richColors closeButton position="top-center" />;
}
