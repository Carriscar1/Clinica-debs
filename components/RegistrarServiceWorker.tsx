"use client";

import { useEffect } from "react";

export default function RegistrarServiceWorker() {
  useEffect(() => {
    const podeRegistrar =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production";

    if (!podeRegistrar) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Falha silenciosa: sem o service worker o app funciona normal,
      // só perde o suporte a instalação/uso offline mais completo.
    });
  }, []);

  return null;
}
