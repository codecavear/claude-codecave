import { writeFile } from 'fs/promises'
import { join, resolve } from 'path'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({ statusCode: 400, message: 'Path required' })
  }

  const body = await readBody<{ content: string }>(event)
  if (!body?.content) {
    throw createError({ statusCode: 400, message: 'Content required' })
  }

  const rootDir = resolve(process.cwd(), '..')
  const filePath = join(rootDir, path)

  try {
    await writeFile(filePath, body.content, 'utf-8')
    return { success: true, path }
  } catch (e) {
    throw createError({ statusCode: 500, message: 'Failed to save file' })
  }
})
