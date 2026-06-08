<template>
  <div class="space-y-8 pb-10">
    <div>
      <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Preferences & Security</p>
      <h1 class="text-xl font-extrabold text-slate-900 tracking-tight mt-1">System Settings</h1>
      <p class="text-xs text-slate-500 font-medium">Manage your personal profile, credentials, and mock database storage settings.</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Left side: Account & Profile -->
      <div class="space-y-6">
        <!-- Profile Settings Card -->
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">User Profile & Avatar</h2>
          
          <div class="flex items-center gap-4">
            <div class="relative group">
              <div v-if="avatarDataUrl" class="h-16 w-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                <img :src="avatarDataUrl" alt="User Avatar" class="h-full w-full object-cover" />
              </div>
              <div v-else class="h-16 w-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-2xl">
                {{ userInitial }}
              </div>
            </div>

            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-2">
                <label 
                  for="avatar-upload" 
                  class="cursor-pointer inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  Upload Photo
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleAvatarUpload" 
                />
                <button 
                  v-if="avatarDataUrl" 
                  @click="removeAvatar" 
                  class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                >
                  Remove
                </button>
              </div>
              <p class="text-[10px] text-slate-400 font-medium">Supports JPG or PNG. Max size 500KB.</p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 pt-2">
            <div class="space-y-1">
              <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Username</p>
              <p class="text-xs font-bold text-slate-800">{{ user?.username || 'N/A' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Email Address</p>
              <p class="text-xs font-bold text-slate-800">{{ user?.email || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Change Password Card -->
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Change Password</h2>

          <form @submit.prevent="handlePasswordChange" class="space-y-3">
            <div class="space-y-1">
              <label for="current-pass" class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
              <input 
                id="current-pass" 
                type="password" 
                v-model="currentPassword" 
                required 
                placeholder="••••••••" 
                class="form-input-custom" 
              />
            </div>

            <div class="space-y-1">
              <label for="new-pass" class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
              <input 
                id="new-pass" 
                type="password" 
                v-model="newPassword" 
                required 
                placeholder="••••••••" 
                class="form-input-custom" 
              />
            </div>

            <div class="space-y-1">
              <label for="confirm-pass" class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
              <input 
                id="confirm-pass" 
                type="password" 
                v-model="confirmPassword" 
                required 
                placeholder="••••••••" 
                class="form-input-custom" 
              />
            </div>

            <div v-if="passError" class="rounded-lg bg-rose-50 border border-rose-100 p-3 text-[11px] font-semibold text-rose-600">
              {{ passError }}
            </div>

            <div v-if="passSuccess" class="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-[11px] font-semibold text-emerald-600">
              {{ passSuccess }}
            </div>

            <button type="submit" :disabled="passLoading" class="btn-primary w-full mt-2">
              {{ passLoading ? 'Updating...' : 'Update Password' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Right side: Database / Storage controls -->
      <div class="space-y-6">
        <div class="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Mock Database Management</h2>
          <p class="text-xs text-slate-400 leading-relaxed font-semibold">
            All records in this portal are kept completely client-side in your local browser storage. You can seed preset student records for testing or purge all local schemas.
          </p>

          <!-- Status Indicator Grid -->
          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Registered Students</p>
              <p class="text-xl font-extrabold text-slate-800 tracking-tight mt-1">{{ studentsCount }}</p>
            </div>
            <div>
              <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">System Credentials</p>
              <p class="text-xl font-extrabold text-slate-800 tracking-tight mt-1">{{ usersCount }}</p>
            </div>
          </div>

          <div class="space-y-2.5 pt-2">
            <button 
              @click="loadSampleData" 
              :disabled="dbLoading" 
              class="w-full btn-secondary flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Load Demo Sample Records
            </button>
            
            <button 
              @click="confirmClearDatabase" 
              :disabled="dbLoading" 
              class="w-full btn-danger flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Local Database Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

const { user, logout } = useAuth()
const api = useApi()

const avatarDataUrl = ref<string | null>(null)
const studentsCount = ref(0)
const usersCount = ref(0)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const passLoading = ref(false)
const passError = ref<string | null>(null)
const passSuccess = ref<string | null>(null)

const dbLoading = ref(false)

const userInitial = computed(() => {
  if (!user.value?.username) return 'U'
  return user.value.username.charAt(0).toUpperCase()
})

const fetchDatabaseStatus = async () => {
  try {
    const status = await api<{ studentsCount: number, usersCount: number }>('/database/status')
    studentsCount.value = status.studentsCount
    usersCount.value = status.usersCount
  } catch (err) {
    console.error('Failed to load database status:', err)
  }
}

const loadAvatar = () => {
  if (typeof window !== 'undefined' && user.value?.email) {
    avatarDataUrl.value = localStorage.getItem(`student-portal-avatar-${user.value.email}`)
  }
}

onMounted(() => {
  loadAvatar()
  fetchDatabaseStatus()
})

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 512 * 1024) {
    alert('Maximum photo size is 500KB.')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result as string
    avatarDataUrl.value = dataUrl
    if (typeof window !== 'undefined' && user.value?.email) {
      localStorage.setItem(`student-portal-avatar-${user.value.email}`, dataUrl)
      // trigger event so other components (like sidebar) update
      window.dispatchEvent(new Event('avatar-changed'))
    }
  }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  avatarDataUrl.value = null
  if (typeof window !== 'undefined' && user.value?.email) {
    localStorage.removeItem(`student-portal-avatar-${user.value.email}`)
    window.dispatchEvent(new Event('avatar-changed'))
  }
}

const handlePasswordChange = async () => {
  passError.value = null
  passSuccess.value = null

  if (newPassword.value !== confirmPassword.value) {
    passError.value = 'Confirm password does not match new password.'
    return
  }

  try {
    passLoading.value = true
    await api('/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }
    })
    passSuccess.value = 'Password changed successfully.'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: any) {
    passError.value = err.message || 'Failed to change password.'
  } finally {
    passLoading.value = false
  }
}

const loadSampleData = async () => {
  try {
    dbLoading.value = true
    await api('/database/seed', { method: 'POST' })
    await fetchDatabaseStatus()
    alert('Sample records seeded successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to load sample database.')
  } finally {
    dbLoading.value = false
  }
}

const confirmClearDatabase = async () => {
  if (confirm('Are you sure you want to purge all local storage database content? This action will clear all student data and register details, and log you out.')) {
    try {
      dbLoading.value = true
      await api('/database/clear', { method: 'POST' })
      if (typeof window !== 'undefined' && user.value?.email) {
        localStorage.removeItem(`student-portal-avatar-${user.value.email}`)
      }
      logout()
    } catch (err) {
      console.error(err)
      alert('Failed to clear database.')
    } finally {
      dbLoading.value = false
    }
  }
}
</script>
