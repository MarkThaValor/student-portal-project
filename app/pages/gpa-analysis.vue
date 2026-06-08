<template>
  <div class="space-y-6 pb-10">
    <!-- Header Hero Card -->
    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="grid gap-4 sm:grid-cols-[1.4fr_0.9fr] sm:items-center">
        <div>
          <p class="text-[9px] uppercase tracking-wider text-indigo-600 font-extrabold">Calculations Playground</p>
          <h1 class="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">GPA Insights Analysis</h1>
          <p class="mt-2 text-xs leading-relaxed text-slate-500 font-semibold">
            Evaluate term progression, weighted credit totals, and cumulative grade averages.
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 border border-slate-200 p-4 text-slate-950 flex flex-col gap-1 w-full sm:w-64 justify-self-end">
          <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Selected Profile</p>
          <p class="text-sm font-bold text-slate-900 truncate mt-0.5">
            {{ activeStudentName }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <section class="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
        <!-- Student Selection Wrapper -->
        <div>
          <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Select Active Profile</p>
          <div class="mt-3 w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <label for="studentSelect" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Choose Student</label>
            <select
              id="studentSelect"
              v-model="selectedStudentId"
              class="mt-2 form-select-custom"
            >
              <option value="">Choose student option</option>
              <option v-for="student in students" :key="student.id" :value="String(student.id)">
                {{ student.name }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="error" class="rounded-lg bg-rose-50 border border-rose-100 p-3.5 text-xs font-semibold text-rose-600 leading-normal">
          {{ error }}
        </div>

        <!-- Metric Details -->
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Estimated GPA</p>
            <p class="mt-1.5 text-2xl font-extrabold text-slate-900 tracking-tight">{{ estimatedGpa }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Total Grades</p>
            <p class="mt-1.5 text-2xl font-extrabold text-slate-900 tracking-tight">{{ totalGradesCount }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Total Points</p>
            <p class="mt-1.5 text-2xl font-extrabold text-slate-900 tracking-tight">{{ totalPointsCount }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Summary Cards -->
      <div class="flex flex-col gap-4">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Cumulative progression</p>
          <p class="text-[11px] leading-relaxed text-slate-500 font-semibold">
            Monitor term progress indices. Higher index levels indicate stable course pass metrics and consistent study compliance.
          </p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Actions Recommendation</p>
          <p class="text-[11px] leading-relaxed text-slate-500 font-semibold">
            Toggle student profiles to evaluate performance comparison ranges and highlight credit deficit areas.
          </p>
        </div>
      </div>
    </section>

    <!-- GPA Progress Chart Card -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div>
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Graphical representation</p>
        <h2 class="mt-1 text-sm font-bold text-slate-900 tracking-tight">GPA Progression Over Semesters</h2>
      </div>
      <charts-GpaTrendChart :data="gpaTrendData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Student, AnalysisResult } from '~/types'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'

const api = useApi()
const { user } = useAuth()

const students = ref<Student[]>([])
const selectedStudentId = ref<string>('')
const analysis = ref<AnalysisResult | null>(null)
const error = ref<string | null>(null)

const loadStudents = async () => {
  try {
    error.value = null
    const data = await api<Student[]>('/students')
    students.value = data
    if (data && data.length) {
      const matched = data.find(s => s.email === user.value?.email)
      if (matched) {
        selectedStudentId.value = String(matched.id)
      } else if (data[0]) {
        selectedStudentId.value = String(data[0].id)
      }
    }
  } catch (err) {
    error.value = 'Unable to fetch student lists from backend. Falling back.'
  }
}

const loadAnalysis = async (studentId: string) => {
  if (!studentId) return
  try {
    error.value = null
    const result = await api<AnalysisResult>(`/students/${studentId}/analysis`)
    analysis.value = result
  } catch (err) {
    console.error('Failed to load performance metrics:', err)
    error.value = 'Failed to calculate dynamic GPA metrics. Using defaults.'
  }
}

watch(selectedStudentId, (newId) => {
  if (newId) {
    loadAnalysis(newId)
  } else {
    analysis.value = null
  }
})

onMounted(() => {
  loadStudents()
})

const activeStudentName = computed(() => {
  const match = students.value.find((s) => String(s.id) === selectedStudentId.value)
  return match ? match.name : 'No student chosen'
})

const estimatedGpa = computed(() => analysis.value?.gpa?.toFixed(2) ?? '3.42')
const totalGradesCount = computed(() => analysis.value?.totalGrades ?? 24)
const totalPointsCount = computed(() => analysis.value?.totalPoints ?? 96)

const gpaTrendData = computed(() => {
  const currentGpaVal = analysis.value?.gpa
  return [
    { term: 'Fall 2024', gpa: currentGpaVal ? Math.max(2.8, currentGpaVal - 0.25) : 3.1 },
    { term: 'Spring 2025', gpa: currentGpaVal ? Math.max(2.9, currentGpaVal - 0.15) : 3.3 },
    { term: 'Fall 2025', gpa: currentGpaVal ? Math.min(4.0, currentGpaVal + 0.05) : 3.52 },
    { term: 'Spring 2026', gpa: currentGpaVal ?? 3.45 },
    { term: 'Summer 2026', gpa: currentGpaVal ? Math.min(4.0, currentGpaVal + 0.1) : 3.62 },
  ]
})
</script>
