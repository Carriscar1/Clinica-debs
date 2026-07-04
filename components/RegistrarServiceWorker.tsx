"use client";

import { useEffect } from "react";

/**
 * O Service Worker anterior estava causando erros reais de rede
 * (interceptava a navegação da própria página /home e quebrava com
 * "Failed to convert value to Response"). Como a instalação na tela
 * de início do iPhone NÃO depende de Service Worker — isso é uma
 * peculiaridade só do Android/Chrome, e mesmo lá é só um "bônus" —
 * a decisão mais segura é remover completamente.
 *
 * Esse componente agora ativamente desinstala qualquer Service Worker
 * que já tenha sido registrado em visitas anteriores (importante:
 * simplesmente apagar o arquivo sw.js não desliga o que já está
 * rodando no celular de quem já usou o app antes).
 */
export default function RegistrarServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });

    if ("caches" in window) {
      caches.keys().then((nomes) => nomes.forEach((nome) => caches.delete(nome)));
    }
  }, []);

  return null;
}
