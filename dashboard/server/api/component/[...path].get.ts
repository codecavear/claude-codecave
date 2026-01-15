import componentsData from '~/data/components.json'

export default defineEventHandler((event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({ statusCode: 400, message: 'Path required' })
  }

  const component = componentsData.find(c => c.path === path)
  if (!component) {
    throw createError({ statusCode: 404, message: 'Component not found' })
  }

  return { path, content: component.content }
})
