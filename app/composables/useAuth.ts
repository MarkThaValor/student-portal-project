import type { AuthStudent, AuthResponse } from '~/types'

export const useAuth = () => {
  const user = useState<AuthStudent | null>('auth-user', () => null)
  const token = useCookie<string | null>('student-token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  })
  const loading = useState<boolean>('auth-loading', () => false)
  const api = useApi()

  const fetchUser = async () => {
    if (!token.value) {
      user.value = null
      return
    }
    try {
      loading.value = true
      const response = await api<{ student: AuthStudent }>('/auth/me')
      user.value = response.student
    } catch (error) {
      console.error('Failed to fetch user:', error)
      token.value = null
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      const response = await api<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      token.value = response.token
      user.value = response.student
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, username: string, password: string) => {
    try {
      loading.value = true
      const response = await api<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: { email, username, password }
      })
      token.value = response.token
      user.value = response.student
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return {
    user,
    token,
    loading,
    fetchUser,
    login,
    register,
    logout,
    isAuthenticated: computed(() => !!token.value && !!user.value)
  }
}
