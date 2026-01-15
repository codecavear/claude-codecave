---
name: drizzle-postgres
description: Best practices for Drizzle ORM with PostgreSQL. Use when the user asks to "create a table", "add a column", "write a query", "design schema", or discusses database operations.
---

# Drizzle PostgreSQL Patterns

## Schema Conventions

### Table Structure
```ts
export const tableName = pgTable('prefix_table_name', {
  // Always UUID primary key
  id: uuid('id').defaultRandom().primaryKey(),

  // Always include timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Foreign keys with cascade
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
}, (table) => [
  // Always index foreign keys
  index('tablename_user_idx').on(table.userId),
])
```

### Naming Rules
- Table prefix: `{project}_` (e.g., `fit_users`)
- Snake_case for table/column names
- Plural table names

## Query Patterns

### Select with Relations
```ts
const result = await db.query.posts.findMany({
  with: { author: true },
  where: eq(posts.status, 'published'),
  orderBy: [desc(posts.createdAt)],
})
```

### Insert with Return
```ts
const [newItem] = await db.insert(items).values(data).returning()
```

### Transaction
```ts
await db.transaction(async (tx) => {
  // Multiple operations
})
```

## Commands
- `bun run db:generate` - Generate migrations
- `bun run db:migrate` - Run migrations
- `bun run db:push` - Push schema (dev)
- `bun run db:studio` - Drizzle Studio
