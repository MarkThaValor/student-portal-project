<template>
  <div class="space-y-8 pb-10">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Administrative Control</p>
        <h1 class="text-xl font-extrabold text-slate-900 tracking-tight mt-1">Super Admin Console</h1>
        <p class="text-xs text-slate-500 font-medium">Inspect local storage databases, delete user credentials, prune students, and seed test metrics.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="loadAllData" 
          :disabled="globalLoading"
          class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition active:scale-95 shrink-0"
        >
          <svg class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15h-2.12m0 0A8 8 0 1017.5 3.65V9H21" />
          </svg>
          Refresh Console
        </button>
      </div>
    </div>

    <!-- Error/Success Alerts -->
    <div v-if="error" class="rounded-lg bg-rose-50 border border-rose-100 p-4 text-xs font-semibold text-rose-600 shadow-sm">
      {{ error }}
    </div>
    <div v-if="success" class="rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-xs font-semibold text-emerald-600 shadow-sm">
      {{ success }}
    </div>

    <!-- Real-time Database Stats Grid -->
    <section class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Registered Users</p>
        <p class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.usersCount }}</p>
        <p class="text-[10px] text-slate-400 font-medium leading-relaxed">Accounts registered in sandbox</p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Student Records</p>
        <p class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.studentsCount }}</p>
        <p class="text-[10px] text-slate-400 font-medium leading-relaxed">Active academic profile datasets</p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Transcript Grades</p>
        <p class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.gradesCount }}</p>
        <p class="text-[10px] text-slate-400 font-medium leading-relaxed">Total course units logged in DB</p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Storage Utilized</p>
        <p class="text-2xl font-extrabold text-indigo-600 tracking-tight">{{ stats.dbSizeKb }}</p>
        <p class="text-[10px] text-slate-400 font-medium leading-relaxed">Localized localstorage footprint</p>
      </div>
    </section>

    <!-- Main Workspace Tables Grid -->
    <div class="grid gap-6 lg:grid-cols-[1.1fr_1.3fr]">
      <!-- Left Column: User Accounts & Core Database Tools -->
      <div class="space-y-6">
        <!-- Core Database Operations -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Database Operations</h2>
            <p class="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">Bulk administrative tools for testing and deployment settings.</p>
          </div>

          <div class="grid gap-2.5 sm:grid-cols-2">
            <button 
              @click="handleSeedData" 
              :disabled="globalLoading"
              class="btn-secondary py-2 flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Seed Sample Database
            </button>

            <button 
              @click="handleWipeDatabase" 
              :disabled="globalLoading"
              class="btn-danger py-2 flex items-center justify-center gap-1.5 font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Purge Database Wipes
            </button>
          </div>
        </div>

        <!-- Registered User Accounts Table -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Registered Accounts</h2>
            <p class="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">Manage user credentials and purge specific profiles.</p>
          </div>

          <div class="overflow-x-auto rounded-lg border border-slate-100">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-800 font-bold border-b border-slate-100 uppercase text-[9px] tracking-wider">
                <tr>
                  <th class="px-4 py-2.5">Username</th>
                  <th class="px-4 py-2.5">Email</th>
                  <th class="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-600 font-medium">
                <tr v-if="!users.length">
                  <td colspan="3" class="px-4 py-6 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Accounts Found</td>
                </tr>
                <tr v-for="acct in users" :key="acct.email" class="hover:bg-slate-50/50">
                  <td class="px-4 py-3 font-bold text-slate-800">{{ acct.username }}</td>
                  <td class="px-4 py-3">{{ acct.email }}</td>
                  <td class="px-4 py-3 text-right">
                    <button 
                      @click="handleDeleteUser(acct.email)"
                      class="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded text-[10px] font-bold transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Registered Students Profiles & Details -->
      <div class="space-y-6">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Students Profiles</h2>
            <p class="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">Inspect current academic directory profiles and registered course marks.</p>
          </div>

          <div class="overflow-x-auto rounded-lg border border-slate-100">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-800 font-bold border-b border-slate-100 uppercase text-[9px] tracking-wider">
                <tr>
                  <th class="px-4 py-2.5">Student</th>
                  <th class="px-4 py-2.5">Matric No</th>
                  <th class="px-4 py-2.5 text-center">Grades</th>
                  <th class="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-600 font-medium">
                <tr v-if="!students.length">
                  <td colspan="4" class="px-4 py-6 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Profiles Found</td>
                </tr>
                <tr v-for="stu in students" :key="stu.id" class="hover:bg-slate-50/50">
                  <td class="px-4 py-3">
                    <div class="font-bold text-slate-800">{{ stu.name }}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">{{ stu.email || 'No email' }}</div>
                  </td>
                  <td class="px-4 py-3 font-semibold text-slate-700">{{ stu.matricNo || 'N/A' }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-100">
                      {{ (stu.grades || []).length }} courses
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button 
                      @click="handleDeleteStudent(stu.id)"
                      class="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded text-[10px] font-bold transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Sleek Confirmation Modal -->
    <ConfirmModal 
      :show="modalActive"
      :title="modalTitle"
      :message="modalMessage"
      :type="modalType"
      :confirm-text="modalConfirmText"
      @confirm="onModalConfirm"
      @cancel="onModalCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'

const api = useApi()
const { user, logout } = useAuth()

const stats = ref({
  studentsCount: 0,
  usersCount: 0,
  gradesCount: 0,
  dbSizeKb: '0 KB'
})

const users = ref<Array<{ username: string; email: string }>>([])
const students = ref<any[]>([])

const globalLoading = ref(true)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const triggerToast = (msg: string, isError = false) => {
  if (isError) {
    error.value = msg
    success.value = null
  } else {
    success.value = msg
    error.value = null
  }
  setTimeout(() => {
    error.value = null
    success.value = null
  }, 4000)
}

const loadStats = async () => {
  try {
    stats.value = await api('/database/stats')
  } catch (err) {
    console.error('Failed to load admin stats:', err)
  }
}

const loadUsers = async () => {
  try {
    users.value = await api('/database/users')
  } catch (err) {
    console.error('Failed to load admin users:', err)
  }
}

const loadStudents = async () => {
  try {
    students.value = await api('/students')
  } catch (err) {
    console.error('Failed to load admin students:', err)
  }
}

const loadAllData = async () => {
  try {
    globalLoading.value = true
    await Promise.all([loadStats(), loadUsers(), loadStudents()])
  } catch (err) {
    triggerToast('Failed to sync administrative schemas.', true)
  } finally {
    globalLoading.value = false
  }
}

// Custom Modal Confirmation State
const modalActive = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalType = ref<'info' | 'warning' | 'danger'>('info')
const modalConfirmText = ref('Confirm')
let pendingAction: (() => Promise<void>) | null = null

const triggerConfirmation = (title: string, msg: string, type: 'info' | 'warning' | 'danger', confirmText: string, action: () => Promise<void>) => {
  modalTitle.value = title
  modalMessage.value = msg
  modalType.value = type
  modalConfirmText.value = confirmText
  pendingAction = action
  modalActive.value = true
}

const onModalConfirm = async () => {
  modalActive.value = false
  if (pendingAction) {
    await pendingAction()
    pendingAction = null
  }
}

const onModalCancel = () => {
  modalActive.value = false
  pendingAction = null
}

const handleSeedData = () => {
  triggerConfirmation(
    'Seed Demo Records',
    'Load preset demo database entries? Current student profiles will be preserved.',
    'info',
    'Seed Data',
    async () => {
      try {
        globalLoading.value = true
        await api('/database/seed', { method: 'POST' })
        await loadAllData()
        triggerToast('Demo records seeded successfully!')
      } catch (err) {
        triggerToast('Failed to seed database.', true)
      } finally {
        globalLoading.value = false
      }
    }
  )
}

const handleWipeDatabase = () => {
  triggerConfirmation(
    'Wipe Database',
    'WARNING: Wiping the database clears all records (users, students, grades, avatars) and signs you out. Proceed?',
    'danger',
    'Wipe Database',
    async () => {
      try {
        globalLoading.value = true
        await api('/database/clear', { method: 'POST' })
        if (typeof window !== 'undefined' && user.value?.email) {
          localStorage.removeItem(`student-portal-avatar-${user.value.email}`)
        }
        logout()
      } catch (err) {
        triggerToast('Failed to wipe sandbox storage.', true)
        globalLoading.value = false
      }
    }
  )
}

const handleDeleteUser = (email: string) => {
  const isSelf = email === user.value?.email
  const confirmMsg = isSelf 
    ? 'WARNING: You are deleting your current active admin account! You will be immediately logged out. Continue?' 
    : `Delete user account registered under ${email}?`
  const type = isSelf ? 'danger' : 'warning'

  triggerConfirmation(
    'Delete User Account',
    confirmMsg,
    type,
    'Delete User',
    async () => {
      try {
        globalLoading.value = true
        await api(`/database/users/${encodeURIComponent(email)}`, { method: 'DELETE' })
        if (isSelf) {
          logout()
        } else {
          await loadAllData()
          triggerToast('User account pruned successfully.')
        }
      } catch (err) {
        triggerToast('Unable to delete user account.', true)
      } finally {
        globalLoading.value = false
      }
    }
  )
}

const handleDeleteStudent = (id: number) => {
  triggerConfirmation(
    'Delete Student Profile',
    'Purge student profile record? All transcript grades linked to this profile will be permanently deleted.',
    'warning',
    'Delete Profile',
    async () => {
      try {
        globalLoading.value = true
        await api(`/students/${id}`, { method: 'DELETE' })
        await loadAllData()
        triggerToast('Student profile deleted successfully.')
      } catch (err) {
        triggerToast('Unable to delete student profile.', true)
      } finally {
        globalLoading.value = false
      }
    }
  )
}

onMounted(() => {
  loadAllData()
})
</script>
