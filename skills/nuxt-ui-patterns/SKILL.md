---
name: nuxt-ui-patterns
description: Best practices for Nuxt UI 4 development. Use when the user asks to "build a form", "create a modal", "add a table", "make a dropdown", or discusses any Nuxt UI component patterns.
---

# Nuxt UI 4 Patterns

## MCP Tools - Always Check First
Before implementing any component, use `mcp__nuxt-ui-remote__get-component` to get accurate documentation.

## Form Pattern
```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const state = reactive({ email: '', password: '' })

async function onSubmit(event: FormSubmitEvent<z.output<typeof schema>>) {
  // event.data is validated
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

## Modal Pattern
- Use `v-model:open` for control
- Use `#body` and `#footer` slots
- Always include cancel button with `variant="outline"`

## Table Pattern
- Define columns with `key` and `label`
- Use `#[key]-cell` slots for custom rendering
- Add actions column with empty label

## Toast Pattern
```ts
const toast = useToast()
toast.add({ title: 'Success', color: 'success' })
toast.add({ title: 'Error', color: 'error' })
```

## Icon Format
Always use `i-lucide-{name}` format for icons.

## Colors
Use semantic colors: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`
