<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50">
    <div class="w-full max-w-sm space-y-6">
      <div class="text-center space-y-2">
        <div class="mx-auto h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
          SP
        </div>
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">Sign in to Student Portal</h2>
        <p class="text-xs text-slate-400 font-medium">Enter your credentials to access the analytics workspace</p>
      </div>

      <div class="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-1">
            <label for="email" class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input 
              id="email" 
              type="email" 
              required 
              v-model="email" 
              placeholder="student@example.com"
              class="form-input-custom" 
            />
          </div>

          <div class="space-y-1">
            <label for="password" class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <input 
              id="password" 
              type="password" 
              required 
              v-model="password" 
              placeholder="••••••••"
              class="form-input-custom" 
            />
          </div>

          <div v-if="error" class="rounded-lg bg-rose-50 border border-rose-100 p-3 text-[11px] font-semibold text-rose-600 leading-normal">
            {{ error }}
          </div>

          <button 
            type="submit" 
            :disabled="authLoading" 
            class="w-full btn-primary flex items-center justify-center gap-1.5"
          >
            <svg v-if="authLoading" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ authLoading ? 'Logging in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-5 text-center text-xs">
          <span class="text-slate-400 font-medium">New student? </span>
          <NuxtLink to="/register" class="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
            Register an account
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false
})

const { login, loading: authLoading } = useAuth()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const handleLogin = async () => {
  error.value = null
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.'
    return
  }

  try {
    await login(email.value, password.value)
    navigateTo('/dashboard')
  } catch (err: any) {
    error.value = 'Login failed. Please check your credentials.'
  }
}
</script>
