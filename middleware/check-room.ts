export default defineNuxtRouteMiddleware((to) => {
  if (!to.query.room) {
    return navigateTo('/')
  }
})
