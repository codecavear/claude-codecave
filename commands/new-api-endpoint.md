---
description: Create a new Nitro API endpoint with validation and error handling
argument-hint: <resource-name> [method]
allowed-tools: [Write, Read, Glob]
---

# New API Endpoint Command

Creates a Nitro API endpoint following codecave conventions:
- Zod validation
- Proper error codes
- Session handling
- Drizzle queries

## Arguments
$ARGUMENTS

Format: `<resource-name> [method]`
- resource-name: The resource (e.g., "users", "posts")
- method: HTTP method - get, post, put, delete (default: get)

## Instructions

1. Determine file path based on arguments:
   - `users get` → `server/api/users.get.ts`
   - `users post` → `server/api/users.post.ts`
   - `users/[id] get` → `server/api/users/[id].get.ts`

2. Create endpoint with appropriate template:

### GET List Template
```ts
export default defineEventHandler(async (event) => {
  const items = await useDrizzle().query.{resource}.findMany({
    orderBy: [desc({resource}.createdAt)],
  })
  return items
})
```

### GET Single Template
```ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const item = await useDrizzle().query.{resource}.findFirst({
    where: eq({resource}.id, id),
  })

  if (!item) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  return item
})
```

### POST Template
```ts
import { z } from 'zod'

const schema = z.object({
  // Define fields
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)

  const [item] = await useDrizzle()
    .insert({resource})
    .values(body)
    .returning()

  return item
})
```

### PUT Template
```ts
import { z } from 'zod'

const schema = z.object({
  // Define optional fields
}).partial()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, schema.parse)

  const [item] = await useDrizzle()
    .update({resource})
    .set({ ...body, updatedAt: new Date() })
    .where(eq({resource}.id, id))
    .returning()

  if (!item) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  return item
})
```

### DELETE Template
```ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const [deleted] = await useDrizzle()
    .delete({resource})
    .where(eq({resource}.id, id))
    .returning()

  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  return { success: true }
})
```

3. Add required imports at top of file
