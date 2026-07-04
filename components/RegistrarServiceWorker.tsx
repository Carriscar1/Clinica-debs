"use client";

import { useEffect } from "react";

/**
 * Registra o Service Worker minimalista de public/sw.js — necessário
 * pro Android/Chrome mostrar o botão de instalação na tela inicial.
 * A versão anterior tentava fazer cache agressivo de tudo e acabou
 * quebrando a navegação; essa nova versão só cuida de 3 arquivos
 * estáticos (ícones/manifest) e não intercepta mais nada.
 */
export default function RegistrarServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Falha silenciosa: sem o service worker o app funciona normal,
      // só perde o botão de instalação automática no Android.
    });
  }, []);

  return null;
}
