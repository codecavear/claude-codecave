---
description: Create a new Nuxt 4 project with codecave conventions (Drizzle, Google OAuth, Nuxt UI, i18n)
argument-hint: <project-name>
allowed-tools: [Bash, Write, Read, Glob]
---

# New Nuxt Project Command

Creates a new Nuxt 4 project with full-stack conventions:
- Nuxt UI 4
- Drizzle ORM + PostgreSQL
- Google OAuth via nuxt-auth-utils
- i18n (Spanish + English)
- Bun as package manager

## Arguments
$ARGUMENTS

## Instructions

1. Create the project:
```bash
bunx nuxi init $ARGUMENTS
cd $ARGUMENTS
```

2. Install dependencies:
```bash
bun add @nuxt/ui @nuxtjs/i18n nuxt-auth-utils
bun add -d drizzle-orm drizzle-kit postgres zod
```

3. Update `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/i18n', 'nuxt-auth-utils'],
  future: { compatibilityVersion: 4 },
  i18n: {
    locales: [
      { code: 'es', file: 'es.json', name: 'Español' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'es',
    lazy: true,
    langDir: 'locales',
  },
})
```

4. Create database schema at `server/database/schema.ts`

5. Create drizzle config at `drizzle.config.ts`

6. Create `server/utils/drizzle.ts` for database client

7. Add scripts to `package.json`:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

8. Create CLAUDE.md from template

9. Initialize git repository
