// Service Worker minimalista, com um único objetivo: satisfazer o
// critério de instalabilidade do Chrome/Android (que exige um SW com
// um "fetch handler" registrado). Ele NÃO intercepta páginas, dados
// do Supabase, nem nada além dos 3 ícones/manifest abaixo — a versão
// anterior tentava fazer mais que isso e acabou quebrando a navegação.

const CACHE_NAME = "consultorio-cache-v2";
const ASSETS_ESSENCIAIS = ["/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const ehAssetEssencial = ASSETS_ESSENCIAIS.includes(url.pathname);

  // Qualquer coisa que não seja um desses 3 arquivos segue 100% normal,
  // sem interceptação nenhuma — páginas, login, pacientes, tudo direto
  // pela rede como se o Service Worker nem existisse.
  if (event.request.method !== "GET" || !ehAssetEssencial) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then(
        (resposta) =>
          resposta ||
          fetch(event.request).then((rede) => {
            cache.put(event.request, rede.clone());
            return rede;
          })
      )
    )
  );
});
