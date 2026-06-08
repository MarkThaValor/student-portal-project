import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, token, fetchUser } = useAuth()

  // If there's a token but no user loaded in state, try to restore session
  if (token.value && !user.value) {
    await fetchUser()
  }

  const publicRoutes = ['/login', '/register', '/']
  const isPublicRoute = publicRoutes.includes(to.path)

  // Redirect to login if user is not authenticated and attempts to access protected page
  if (!token.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Redirect to dashboard if logged-in user attempts to view login/register
  if (token.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dashboard')
  }
})
