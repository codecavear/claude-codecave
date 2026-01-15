---
description: Create a new Drizzle table with proper conventions (UUID, timestamps, indexes)
argument-hint: <table-name> [columns...]
allowed-tools: [Write, Read, Edit, Glob]
---

# New Drizzle Table Command

Creates a Drizzle table following codecave conventions:
- UUID primary key
- createdAt/updatedAt timestamps
- Proper indexes on foreign keys
- Relations defined

## Arguments
$ARGUMENTS

Format: `<table-name> [columns...]`
- table-name: Name without prefix (e.g., "posts", "comments")
- columns: Optional column definitions (e.g., "title:text", "userId:uuid:fk:users")

## Instructions

1. Read the existing schema file at `server/database/schema.ts`

2. Determine the project prefix from existing tables (e.g., `fit_`, `misp_`)

3. Create the table definition:

```ts
export const {tableName} = pgTable('{prefix}_{table_name}', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Add columns from arguments
  // For text: name: text('name').notNull(),
  // For FK: userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
}, (table) => [
  // Add indexes for foreign keys
  // index('{prefix}_{table}_user_idx').on(table.userId),
])
```

4. Create relations if foreign keys exist:

```ts
export const {tableName}Relations = relations({tableName}, ({ one, many }) => ({
  // For FK columns:
  user: one(users, {
    fields: [{tableName}.userId],
    references: [users.id],
  }),
}))
```

5. Update the parent table's relations if needed:

```ts
// Add to usersRelations:
{tableName}: many({tableName}),
```

6. Generate migration:
```bash
bun run db:generate
```

## Column Type Reference

| Syntax | Drizzle |
|--------|---------|
| `name:text` | `text('name').notNull()` |
| `name:text?` | `text('name')` (nullable) |
| `count:integer` | `integer('count').notNull()` |
| `isActive:boolean` | `boolean('is_active').default(true).notNull()` |
| `userId:uuid:fk:users` | `uuid('user_id').references(() => users.id)` |
| `status:enum:draft,published` | Use text with check constraint |
