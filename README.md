# Personal & Pilates (Private)

**Personal & Pilates** es una aplicación web privada para una empresa de pilates: gestión de **clases**, **reservas**, clientes y administración interna. Está construida con **Next.js (App Router)** e incluye autenticación con roles, backoffice, internacionalización, PWA/offline, rate limiting y persistencia en **PostgreSQL**.

> Este repositorio es **privado** y está pensado para uso interno de la empresa.

---

## 🧱 Stack Tecnológico

- **Next.js** 16.1.1 (App Router)
- **React** 19
- **TypeScript**
- **MUI v7** + Emotion
- **Bootstrap 5.3**
- **NextAuth** (Credentials Provider)
- **next-intl** (i18n con routing por locale)
- **PostgreSQL** (ej. Neon)
- **Prisma ORM** 7.x + adapter-pg
- **Upstash Redis** (rate limiting)
- **Zod** (validaciones)
- **bcryptjs** (hash de passwords)
- **PWA / Service Worker**
- **ESLint 9**

---

## 🎯 Funcionalidades principales

### Frontoffice (clientes)
- Acceso por idioma (`/es`, `/en`)
- Visualización de clases
- Gestión de reservas
- PWA con soporte offline

### Backoffice (administración)
- Panel de administración con control por roles
- Gestión de clases y reservas
- Gestión de usuarios
- Acciones protegidas por permisos

---

## 🔐 Autenticación y Roles

Implementado con **NextAuth (Credentials Provider)**

### Roles
- `SUPERADMIN`
- `ADMIN`
- `CLIENT`

### Flujo
- Login con email/password
- Passwords hasheadas con bcrypt
- Sesión con JWT
- `role` e `id` se inyectan en token y sesión

### Redirecciones
- Sin sesión → `/[locale]/auth`
- ADMIN/SUPERADMIN → `/[locale]/bo/classes`
- CLIENT → sección Frontoffice

---

## 📝 Registro de Usuarios

Endpoint:

```
POST /api/auth/register
```

- Rate limit: **5 registros/min/IP**
- Rol por defecto: `CLIENT`
- Password hasheada con bcrypt

---

## 🗄️ Base de Datos

### User
- id (cuid)
- email (unique)
- password
- role
- disabled
- deleted (soft delete)
- deletedAt

### ORM
- Prisma + adapter-pg
- PostgreSQL (Neon recomendado)

---

## 🌱 Seed (Superadmin)

Archivo:

```
prisma/seed.js
```

Crea o actualiza un usuario **SUPERADMIN**.

Variables:

```
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
```

Ejecutar:

```
npx prisma db seed
```

---

## 🧨 Borrado de Cuenta

Endpoint:

```
DELETE /api/account
```

Modo: **soft delete**
- `deleted = true`
- `deletedAt = now()`

---

## 🚦 Rate Limiting

- Registro: **5/min**
- Login: **20/min**
- Borrado de cuenta: **3/hora**

Implementado con **Upstash Redis**.

---

## 🌍 Internacionalización

- Idiomas: `es`, `en`
- Default: `es`
- Routing por locale
- Timezone fija: `Europe/Madrid`

---

## 📦 PWA / Offline

- Manifest en `app/manifest.ts`
- Service Worker en `public/sw.js`
- Página offline dedicada

---

## 📁 Estructura

```
app/
 ├─ api/
 ├─ [locale]/
 │   ├─ (auth)/
 │   ├─ (bo)/
 │   └─ (fo)/
 ├─ lib/
 └─ manifest.ts

prisma/
 ├─ schema.prisma
 ├─ seed.js
```

---

## ⚙️ Variables de Entorno

Requeridas:

```
DATABASE_URL
NEXTAUTH_SECRET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Opcionales:

```
NEXTAUTH_URL
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
```

---

## 🚀 Arranque local

```
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

---

## ✅ Estado

✔ Proyecto privado  
✔ Enfocado a gestión de pilates  
✔ Sin módulo de blog/posts  
✔ Listo para producción
