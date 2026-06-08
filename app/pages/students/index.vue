<template>
  <div class="space-y-6 pb-10">
    <!-- Header Hero Card -->
    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="grid gap-4 sm:grid-cols-[1.4fr_0.9fr] sm:items-center">
        <div>
          <p class="text-[9px] uppercase tracking-wider text-indigo-600 font-extrabold">Student Registry</p>
          <h1 class="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">Active Students Directory</h1>
          <p class="mt-2.5 text-xs leading-relaxed text-slate-500 font-semibold">
            Manage registrations, view complete profiles, and inspect course mark averages.
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 border border-slate-200 p-4 text-slate-950 flex flex-col gap-1 w-full sm:w-64 justify-self-end">
          <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Profiles Registered</p>
          <p class="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {{ students.length }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content split -->
    <section class="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <!-- Left: Student Cards Directory -->
      <div class="space-y-4">
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold px-1">Active Directories</p>
        
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-2.5 bg-white border border-slate-200/80 rounded-xl shadow-sm">
          <svg class="animate-spin h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span class="text-xs text-slate-400 font-medium">Loading lists...</span>
        </div>

        <div v-else-if="error" class="rounded-lg bg-rose-50 border border-rose-100 p-4 text-xs font-semibold text-rose-600 leading-normal shadow-sm">
          {{ error }}
        </div>

        <div v-else-if="!students.length" class="rounded-xl border border-slate-200/80 bg-slate-50/50 p-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          No records found.
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2">
          <div 
            v-for="student in students" 
            :key="student.id" 
            :data-context-student-id="student.id"
            class="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-slate-300 flex flex-col justify-between gap-4"
          >
            <div class="space-y-2">
              <div class="flex items-center gap-2.5">
                <div class="h-8 w-8 rounded bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-indigo-600 text-xs">
                  {{ student.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="text-xs font-bold text-slate-900 tracking-tight leading-tight">{{ student.name }}</h3>
                  <p class="text-[9px] font-bold text-slate-400">#{{ student.id }}</p>
                </div>
              </div>
              
              <div class="space-y-0.5 text-[11px] text-slate-500 font-semibold pl-0.5">
                <p v-if="student.email" class="truncate"><span class="text-slate-400">Email:</span> {{ student.email }}</p>
                <p v-if="student.matricNo"><span class="text-slate-400">Matric:</span> {{ student.matricNo }}</p>
              </div>
            </div>

            <NuxtLink 
              :to="`/students/${student.id}`" 
              class="w-full btn-secondary py-1.5 text-[11px] font-bold flex items-center justify-center gap-1"
            >
              View profile
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right: Register New Student Form -->
      <div class="space-y-4">
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold px-1">Register New Profile</p>
        
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Create Student Record</h3>
            <p class="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
              Add a student profile to register courses.
            </p>
          </div>

          <form class="space-y-3.5" @submit.prevent="handleCreateStudent">
            <div class="space-y-1">
              <label for="newStudentName" class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                id="newStudentName" 
                type="text" 
                required 
                v-model="newName" 
                placeholder="Jane Doe"
                class="form-input-custom" 
              />
            </div>

            <div class="space-y-1">
              <label for="newStudentEmail" class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input 
                id="newStudentEmail" 
                type="email" 
                v-model="newEmail" 
                placeholder="student@university.edu"
                class="form-input-custom" 
              />
            </div>

            <div class="space-y-1">
              <label for="newStudentMatric" class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Matric Number</label>
              <input 
                id="newStudentMatric" 
                type="text" 
                v-model="newMatricNo" 
                placeholder="E.g. MAT12345"
                class="form-input-custom" 
              />
            </div>

            <button 
              type="submit" 
              :disabled="createLoading" 
              class="w-full btn-primary py-2 flex items-center justify-center gap-1.5"
            >
              <svg v-if="createLoading" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Add Student Record
            </button>
          </form>

          <div v-if="successMessage" class="rounded bg-emerald-50 border border-emerald-100 p-3 text-[10px] font-semibold text-emerald-700 leading-normal">
            {{ successMessage }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Student } from '~/types'
import { useApi } from '~/composables/useApi'

const api = useApi()

const students = ref<Student[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const newName = ref('')
const newEmail = ref('')
const newMatricNo = ref('')
const createLoading = ref(false)
const successMessage = ref<string | null>(null)

const loadStudents = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await api<Student[]>('/students')
    students.value = data
  } catch (err) {
    error.value = 'Failed to fetch student directory from server. Offline display only.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStudents()
})

const handleCreateStudent = async () => {
  successMessage.value = null
  if (!newName.value) return

  try {
    createLoading.value = true
    await api('/students', {
      method: 'POST',
      body: {
        name: newName.value,
        email: newEmail.value || undefined,
        matricNo: newMatricNo.value || undefined
      }
    })
    
    successMessage.value = 'Student record registered successfully.'
    newName.value = ''
    newEmail.value = ''
    newMatricNo.value = ''
    await loadStudents()
  } catch (err) {
    successMessage.value = 'Unable to register student profile.'
  } finally {
    createLoading.value = false
  }
}
</script>
