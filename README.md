# Arrow Apps

Arrow Apps es una aplicación web moderna construida con **Next.js (App Router)**, que incluye autenticación, backoffice con control de roles, internacionalización, PWA/offline, rate limiting y persistencia en PostgreSQL.

Este README **refleja el estado real del código**, no el histórico.

---

## 🧱 Stack Tecnológico

- **Next.js** 16.1.1 (App Router)
- **React** 19
- **TypeScript**
- **MUI v7** + Emotion
- **Bootstrap 5.3**
- **NextAuth** (Credentials Provider)
- **next-intl** (i18n con routing por locale)
- **PostgreSQL**
- **Prisma ORM** 7.x + adapter-pg
- **Upstash Redis** (rate limiting)
- **Zod** (validaciones)
- **bcryptjs** (hash de passwords)
- **PWA / Service Worker**
- **ESLint 9**

---

## 📁 Estructura del Proyecto

```
app/
 ├─ api/
 │   ├─ auth/
 │   │   ├─ [...nextauth]/route.ts
 │   │   └─ register/route.ts
 │   └─ account/route.ts
 ├─ [locale]/
 │   ├─ (auth)/        # login / register
 │   ├─ (bo)/          # backoffice (ADMIN)
 │   ├─ (fo)/          # frontoffice
 │   ├─ legal/
 │   ├─ offline/
 │   ├─ layout.tsx
 │   └─ page.tsx
 ├─ lib/
 │   ├─ auth.ts
 │   ├─ prisma.ts
 │   ├─ db.ts
 │   └─ rateLimit.ts
 └─ manifest.ts

prisma/
 ├─ schema.prisma
 ├─ seed.js
 └─ prisma.config.ts

public/
 └─ sw.js
```

---

## 🌍 Internacionalización (i18n)

- Implementado con **next-intl**
- Idiomas soportados: `es`, `en`
- Idioma por defecto: `es`
- Mensajes en `/messages/*.json`
- Routing por locale: `/es`, `/en`
- Timezone fija: `Europe/Madrid`

Configuración:

- `next.config.ts` usa `createNextIntlPlugin`
- `i18n/request.ts` carga mensajes dinámicamente

⚠️ **Nota sobre middleware**  
Existe un archivo `proxy.ts` con lógica de middleware (i18n + auth), pero **NO está activo** porque:

- Next.js exige `middleware.ts`
- Al renombrarlo, Next.js indica que el patrón está “desactualizado”

Actualmente:

- **No hay middleware activo**
- La protección de rutas se hace principalmente en layouts y server components

---

## 🔐 Autenticación y Roles

Implementado con **NextAuth (Credentials Provider)**

### Roles

- `ADMIN`
- `CLIENT`

### Flujo

- Login con email/password
- Passwords hasheadas con bcrypt
- Sesión con JWT
- `role` e `id` se inyectan en token y sesión

### Redirecciones

- Sin sesión → `/[locale]/auth`
- ADMIN → `/[locale]/bo/blogs`
- CLIENT → `/[locale]/under-construction`

---

## 📝 Registro de Usuarios

Endpoint:

```
POST /api/auth/register
```

Características:

- Inserción directa vía **pg Pool** (no Prisma)
- Rate limit: **5 registros/min/IP**
- Rol por defecto: `CLIENT`
- Password hasheada con bcrypt

---

## 🗄️ Base de Datos (Prisma)

### Modelos principales

**User**

- id (cuid)
- email (unique)
- password
- role (`ADMIN | CLIENT`)

**Post**

- slug (unique)
- status (`DRAFT | PUBLISHED`)
- publishedAt
- authorId

### Cliente Prisma

- Usa `adapter-pg` con `Pool`
- Cacheado en `globalThis` en desarrollo

---

## 🌱 Seed

Archivo real:

```
prisma/seed.js
```

Crea o actualiza un usuario ADMIN:

Variables:

- `SEED_ADMIN_EMAIL` (default: admin@local.dev)
- `SEED_ADMIN_PASSWORD` (default: admin1234)

Ejecución:

```
npx prisma db seed
```

---

## 🚦 Rate Limiting (Upstash Redis)

Implementado con `@upstash/redis`

Límites actuales:

- Registro: **5/min**
- Login (NextAuth POST): **20/min**
- Borrado de cuenta: **3/hora**

Identificación por IP (`x-forwarded-for`, `x-real-ip`)

---

## 🧨 Borrado de Cuenta

Endpoint:

```
DELETE /api/account
```

Modo actual: **anonymize**

- Reasigna posts a usuario `deleted@arrow-blog.local`
- Elimina el usuario original

Requiere sesión activa.

---

## 📦 PWA / Offline

- Manifest generado en `app/manifest.ts`
- Service Worker en `public/sw.js`
- Cache strategies:
  - Navegación: network-first
  - Static assets: cache-first
  - Imágenes: stale-while-revalidate
- Página offline dedicada: `/[locale]/offline`
- SW solo se registra en `production`

---

## ⚙️ Variables de Entorno

### Requeridas

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### Opcionales

```
NEXTAUTH_URL=https://...
SEED_ADMIN_EMAIL=...
SEED_ADMIN_PASSWORD=...
```

---

## 🧪 Scripts

```
npm run dev       # desarrollo
npm run build     # build + prisma generate
npm run start     # producción
npm run lint      # eslint
```

---

## ⚠️ Notas Importantes

- El archivo `proxy.ts` **NO actúa como middleware actualmente**
- Para reactivarlo habría que:
  - Migrar la lógica al nuevo formato de middleware compatible con tu versión de Next.js
- README anterior estaba desactualizado respecto a:
  - Auth
  - i18n
  - Prisma
  - Rate limit
  - PWA
  - Estructura FO/BO

---

## ✅ Estado del Proyecto

✔ Funcional  
✔ Arquitectura moderna  
✔ Listo para producción (tras revisar middleware)

---
