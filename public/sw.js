const CACHE_NAME = "consultorio-cache-v1";
const ASSETS_ESSENCIAIS = ["/manifest.json", "/icon-192.png", "/icon-512.png"];

// Instala e guarda só o essencial (ícones/manifest) — não guarda páginas
// nem código do app aqui, pra nunca "prender" o usuário numa versão antiga.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_ESSENCIAIS))
  );
});

// Ao ativar, apaga caches de versões anteriores do service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Nunca intercepta chamadas pro Supabase — login, pacientes e qualquer
  // dado precisa sempre vir direto da rede, nunca de um cache antigo.
  if (request.url.includes("supabase.co")) return;

  // Cache só lida com GET; POST/PUT/DELETE sempre vão direto pra rede
  if (request.method !== "GET") return;

  // Network-first: tenta a rede primeiro (sempre a versão mais nova).
  // Só usa o cache como reserva se o celular estiver offline.
  event.respondWith(
    fetch(request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
        return resposta;
      })
      .catch(() => caches.match(request))
  );
});
