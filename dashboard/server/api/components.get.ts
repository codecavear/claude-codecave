import componentsData from '~/data/components.json'

export default defineEventHandler(() => {
  // Return components without content for the list view
  return componentsData.map(({ content, ...rest }) => rest)
})
