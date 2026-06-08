<template>
  <div class="space-y-6 pb-10">
    <!-- Header Hero Card -->
    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="grid gap-4 sm:grid-cols-[1.4fr_0.9fr] sm:items-center">
        <div>
          <p class="text-[9px] uppercase tracking-wider text-indigo-600 font-extrabold">Academic Suggestions</p>
          <h1 class="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">Tailored Study Guidance</h1>
          <p class="mt-2.5 text-xs leading-relaxed text-slate-500 font-semibold">
            Review recommendations computed from course scores to boost exam readiness and target weak study habits.
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 border border-slate-200 p-4 text-slate-950 flex flex-col gap-1 w-full sm:w-64 justify-self-end">
          <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Active Focus Segment</p>
          <p class="text-sm font-bold text-slate-900 truncate mt-0.5">
            {{ focusArea }}
          </p>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
        <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-5 space-y-3.5">
          <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Configurations</p>
          
          <div class="space-y-1">
            <label for="studentSelect" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Student</label>
            <select
              id="studentSelect"
              v-model="selectedStudentId"
              class="form-select-custom"
            >
              <option value="">Choose student option</option>
              <option v-for="student in students" :key="student.id" :value="String(student.id)">
                {{ student.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label for="focusSelect" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Choose Focus Area</label>
            <select
              id="focusSelect"
              v-model="focusArea"
              class="form-select-custom"
            >
              <option>Study habits</option>
              <option>Time management</option>
              <option>Exam preparation</option>
            </select>
          </div>
        </div>

        <div v-if="error" class="rounded-lg bg-rose-50 border border-rose-100 p-3.5 text-xs font-semibold text-rose-600 leading-normal">
          {{ error }}
        </div>
      </div>

      <!-- Informative Notes Card -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <p class="text-[9px] uppercase tracking-wider text-indigo-600 font-extrabold">Why Recommendations Matter</p>
        <p class="text-[11px] leading-relaxed text-slate-500 font-semibold">
          Personalized advice highlights subject gaps, provides schedules, and defines next steps to optimize semester point totals.
        </p>
      </div>
    </section>

    <!-- Recommendations Results -->
    <section class="grid gap-4">
      <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold px-1">Active Suggestions</p>
      <template v-if="recommendations.length">
        <RecommendationCard 
          v-for="(rec, index) in recommendations" 
          :key="`${rec}-${index}`" 
          :title="`Recommendation ${index + 1}`" 
          :description="rec" 
        />
      </template>
      <div v-else class="rounded-xl border border-slate-200 bg-slate-50/50 p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        No study recommendations available yet.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Student } from '~/types'
import { useApi } from '~/composables/useApi'

const api = useApi()

const focusArea = ref('Study habits')
const students = ref<Student[]>([])
const selectedStudentId = ref<string>('')
const recommendations = ref<string[]>([])
const error = ref<string | null>(null)

const loadStudents = async () => {
  try {
    error.value = null
    const data = await api<Student[]>('/students')
    students.value = data
    if (data && data.length && data[0]) {
      selectedStudentId.value = String(data[0].id)
    }
  } catch (err) {
    error.value = 'Unable to fetch student list. Falling back.'
  }
}

const loadRecommendations = async (studentId: string) => {
  if (!studentId) return
  try {
    error.value = null
    const data = await api<{ recommendations: string[] }>(`/students/${studentId}/recommendations`)
    recommendations.value = data.recommendations || []
  } catch (err) {
    console.error('Failed to load advice:', err)
    error.value = 'Failed to load study recommendations from database.'
  }
}

watch(selectedStudentId, (newId) => {
  if (newId) {
    loadRecommendations(newId)
  } else {
    recommendations.value = []
  }
})

onMounted(() => {
  loadStudents()
})
</script>
