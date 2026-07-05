"use client";

import { useEffect } from "react";

/**
 * SEGUNDA REMOÇÃO do Service Worker: mesmo a versão minimalista estava
 * fazendo a instalação "de verdade" no Android (que empacota o site
 * como app nativo, gerando um WebAPK) travar pra sempre em
 * "Instalando...". O processo de empacotamento do Android exige
 * requisitos mais rígidos de Service Worker do que os que valem a
 * pena manter aqui — e um "Adicionar à tela inicial" simples que
 * FUNCIONA é muito melhor que um botão bonito que trava.
 *
 * Sem o Service Worker, tanto Android quanto iPhone continuam
 * conseguindo adicionar o app à tela inicial (ícone + abre em tela
 * cheia, sem barra de navegador) através do menu do navegador — só
 * não aparece mais o banner automático de instalação do Chrome.
 *
 * Esse componente também desinstala qualquer Service Worker que já
 * tenha ficado registrado em tentativas anteriores.
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
