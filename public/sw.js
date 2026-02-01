/* eslint-disable no-restricted-globals */

// Cambia versión cuando quieras invalidar caché
const VERSION = "v4.0.0";

const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

// Rutas mínimas que siempre estarán disponibles offline
const PRECACHE_URLS = ["/offline"];

/* ===========================
   INSTALL
=========================== */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

/* ===========================
   ACTIVATE
=========================== */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

/* ===========================
   FETCH
=========================== */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ✅ NO cachear ni interceptar métodos que no sean GET
  // (Cache.put no soporta POST y revienta: "Request method 'POST' is unsupported")
  if (req.method !== "GET") return;

  // Solo peticiones del mismo dominio
  if (url.origin !== self.location.origin) return;

  // Helper: cache.put solo si respuesta OK
  const safePut = async (cacheName, request, response) => {
    try {
      if (!response || !response.ok) return;
      const cache = await caches.open(cacheName);
      await cache.put(request, response);
    } catch {
      // Silenciar errores de cache (no deben romper la app)
    }
  };

  // HTML / navegación: network-first + fallback offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Ojo: cache.put necesita un Response clonable
          safePut(RUNTIME_CACHE, req, res.clone());
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || (await caches.match("/offline"));
        }),
    );
    return;
  }

  // JS / CSS / _next/static → cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css")
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          safePut(STATIC_CACHE, req, res.clone());
          return res;
        });
      }),
    );
    return;
  }

  // Imágenes → stale-while-revalidate
  if (req.destination === "image") {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            safePut(RUNTIME_CACHE, req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  // Todo lo demás → network-first suave
  event.respondWith(
    fetch(req)
      .then((res) => {
        safePut(RUNTIME_CACHE, req, res.clone());
        return res;
      })
      .catch(() => caches.match(req)),
  );
});
