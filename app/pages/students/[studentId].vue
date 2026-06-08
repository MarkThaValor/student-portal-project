<template>
  <div class="space-y-8 pb-10">
    <!-- Breadcrumb back link -->
    <div class="flex items-center gap-2">
      <NuxtLink 
        to="/students" 
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Directory
      </NuxtLink>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
      <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Loading Profile...</span>
    </div>

    <!-- Error Alert -->
    <div v-else-if="error" class="rounded-lg bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-600 leading-relaxed shadow-sm">
      {{ error }}
    </div>

    <template v-else-if="studentProfile">
      <!-- Profile Header Hero -->
      <section class="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg">
              {{ studentProfile.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-[9px] uppercase tracking-wider text-indigo-600 font-bold">Student Record</p>
              <h1 class="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">{{ studentProfile.name }}</h1>
              <p class="text-xs text-slate-400 font-medium">System Reference ID: #{{ studentProfile.id }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-1.5 text-xs text-slate-500 font-medium border-l sm:border-l border-slate-200/80 pl-0 sm:pl-5 sm:border-t-0 border-t pt-4 sm:pt-0">
            <p v-if="studentProfile.email" class="truncate"><span class="font-bold text-slate-400">Email:</span> {{ studentProfile.email }}</p>
            <p v-if="studentProfile.matricNo"><span class="font-bold text-slate-400">Matric No:</span> {{ studentProfile.matricNo }}</p>
          </div>
        </div>
      </section>

      <!-- Main Layout Details Split -->
      <section class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <!-- Transcript Grades List -->
        <div class="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
          <div>
            <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Academic Transcript</p>
            <h2 class="mt-1 text-lg font-bold text-slate-900 tracking-tight">Completed Grades Overview</h2>
          </div>

          <div v-if="!studentProfile.grades.length" class="rounded-lg bg-slate-50/50 border border-slate-200/40 p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            No academic records filed for this student yet.
          </div>

          <div v-else class="overflow-hidden rounded-lg border border-slate-200/80 bg-white">
            <div class="overflow-x-auto">
              <table class="min-w-[480px] w-full divide-y divide-slate-100 text-left text-xs text-slate-600">
                <thead class="bg-slate-50 border-b border-slate-200/80 text-slate-800">
                  <tr>
                    <th class="px-5 py-3.5 font-bold uppercase tracking-wider">Course/Subject</th>
                    <th class="px-5 py-3.5 font-bold uppercase tracking-wider">Semester</th>
                    <th class="px-5 py-3.5 font-bold uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr v-for="(grade, index) in studentProfile.grades" :key="index" class="hover:bg-slate-50/50 transition duration-150">
                    <td class="px-5 py-3.5 font-bold text-slate-900">{{ grade.courseCode || grade.subject }}</td>
                    <td class="px-5 py-3.5 font-semibold text-slate-500">{{ grade.semester || 'N/A' }}</td>
                    <td class="px-5 py-3.5 font-extrabold text-indigo-600">{{ grade.score }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Suggestions and Recommendations Box -->
        <div class="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div class="space-y-1">
            <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Personalized Advice</p>
            <h2 class="text-lg font-bold text-slate-900 tracking-tight">Active Recommendations</h2>
          </div>

          <div v-if="!studentProfile.recommendations?.length" class="rounded-lg bg-slate-50/50 border border-slate-200/40 p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-wider flex-1 flex items-center justify-center">
            No recommendations generated. Keep records updated.
          </div>

          <div v-else class="space-y-3 flex-1">
            <div 
              v-for="(rec, index) in studentProfile.recommendations" 
              :key="index" 
              class="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 text-xs font-semibold text-slate-600 leading-relaxed"
            >
              {{ rec }}
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { StudentProfileType } from '~/types'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const api = useApi()

const studentId = route.params.studentId as string
const studentProfile = ref<StudentProfileType | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchProfile = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await api<{ student: any, analysis?: { recommendations?: any } }>(`/students/${studentId}`)
    
    // Process response format to match StudentProfileType
    const payload = response as any
    studentProfile.value = {
      id: payload.student.id,
      name: payload.student.name,
      email: payload.student.email,
      matricNo: payload.student.matricNo,
      grades: payload.student.grades || [],
      recommendations: payload.analysis?.recommendations || []
    }
  } catch (err) {
    console.error('Failed to load profile:', err)
    error.value = 'Failed to fetch the student profile from backend.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (studentId) {
    fetchProfile()
  }
})
</script>
