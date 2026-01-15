---
name: nitro-testing
description: Best practices for testing Nitro API endpoints. Use when the user asks to "write tests", "test API", "add test coverage", or discusses testing patterns for server routes.
---

# Nitro API Testing Patterns

## Test Structure

```ts
import { describe, it, expect, beforeEach } from 'bun:test'

describe('Resource API', () => {
  beforeEach(async () => {
    await cleanDatabase()
  })

  describe('GET /api/resource', () => {
    it('returns list', async () => {
      const response = await fetch('http://localhost:3000/api/resource')
      expect(response.status).toBe(200)
    })
  })

  describe('POST /api/resource', () => {
    it('creates item', async () => {
      const response = await fetch('http://localhost:3000/api/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }),
      })
      expect(response.status).toBe(200)
    })

    it('validates input', async () => {
      const response = await fetch('http://localhost:3000/api/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }),
      })
      expect(response.status).toBe(400)
    })
  })
})
```

## Test Setup

```ts
// test/setup.ts
export async function cleanDatabase() {
  // Delete tables in reverse dependency order
}

export async function createTestUser(overrides = {}) {
  const [user] = await testDb.insert(users).values({
    name: 'Test',
    email: `test-${Date.now()}@example.com`,
    ...overrides,
  }).returning()
  return user
}
```

## Coverage Checklist
- [ ] Happy path (200)
- [ ] Validation errors (400)
- [ ] Not found (404)
- [ ] Auth required (401)
- [ ] Database state verified

## Commands
- `bun test` - Run tests
- `bun test --watch` - Watch mode
- `bun test --coverage` - With coverage
