<template>
  <div class="space-y-6 pb-10">
    <!-- Header Hero Card -->
    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="grid gap-4 sm:grid-cols-[1.4fr_0.9fr] sm:items-center">
        <div>
          <p class="text-[9px] uppercase tracking-wider text-indigo-600 font-extrabold">Academic Input</p>
          <h1 class="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">Submit Course Results</h1>
          <p class="mt-2.5 text-xs leading-relaxed text-slate-500 font-semibold">
            Enter academic scores to calculate terms, update transcript items, and generate new study suggestions.
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 border border-slate-200 p-4 text-slate-950 flex flex-col gap-1 w-full sm:w-64 justify-self-end">
          <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Submission Guidelines</p>
          <p class="text-[10px] text-slate-500 font-medium leading-relaxed">
            Verify course codes are typed consistently (e.g. CSC101) to prevent duplicate record entries.
          </p>
        </div>
      </div>
    </section>

    <!-- Submission Form Panel -->
    <section class="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Student Selection Dropdown -->
            <div class="space-y-1 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <label for="studentId" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student Profile</label>
              <select
                id="studentId"
                v-model="studentId"
                required
                class="mt-2 form-select-custom animate-none"
              >
                <option value="">Choose student option</option>
                <option v-for="student in students" :key="student.id" :value="String(student.id)">
                  {{ student.name }}
                </option>
              </select>
            </div>

            <!-- Semester Text Field -->
            <div class="space-y-1 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <label for="semester" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Semester Term</label>
              <input
                id="semester"
                type="text"
                required
                v-model="semester"
                placeholder="E.g. Fall 2025"
                class="mt-2 form-input-custom"
              />
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <!-- Course Code -->
            <div class="space-y-1 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <label for="courseCode" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Course Code</label>
              <input
                id="courseCode"
                type="text"
                required
                v-model="courseCode"
                placeholder="E.g. CSC101"
                class="mt-2 form-input-custom"
              />
            </div>

            <!-- Units Credit Weight -->
            <div class="space-y-1 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <label for="units" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Units Credit</label>
              <input
                id="units"
                type="number"
                min="1"
                required
                v-model.number="units"
                class="mt-2 form-input-custom"
              />
            </div>

            <!-- Score -->
            <div class="space-y-1 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <label for="score" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score (0-100)</label>
              <input
                id="score"
                type="number"
                min="0"
                max="100"
                required
                v-model.number="score"
                class="mt-2 form-input-custom"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="submitLoading"
              class="btn-primary w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              <svg v-if="submitLoading" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submit Course Grade
            </button>
          </div>
        </form>

        <div v-if="message" :class="[
          'rounded-lg border p-4 text-[11px] font-semibold leading-normal transition-all duration-150',
          isSuccess ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-600'
        ]">
          {{ message }}
        </div>
      </div>

      <!-- Guidelines Card -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <p class="text-[9px] uppercase tracking-wider text-indigo-600 font-extrabold">Submission Guidelines</p>
        <ul class="space-y-3 text-xs leading-relaxed text-slate-500 font-medium">
          <li class="flex items-start gap-1.5">
            <span class="text-indigo-600 font-extrabold shrink-0">•</span>
            <span>Verify the chosen student profile prior to executing the submit script.</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-indigo-600 font-extrabold shrink-0">•</span>
            <span>Use semester labels consistently (e.g. "Fall 2025") for proper time graphing.</span>
          </li>
          <li class="flex items-start gap-1.5">
            <span class="text-indigo-600 font-extrabold shrink-0">•</span>
            <span>Check input point ranges to protect standard grade indexing calculations.</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Student } from '~/types'
import { useApi } from '~/composables/useApi'

const api = useApi()
const route = useRoute()

const students = ref<Student[]>([])
const studentId = ref('')
const courseCode = ref('')
const units = ref(3)
const score = ref(0)
const semester = ref('Fall 2025')
const message = ref<string | null>(null)
const isSuccess = ref(false)
const submitLoading = ref(false)

const loadStudents = async () => {
  try {
    const data = await api<Student[]>('/students')
    students.value = data
    
    const queryStudentId = route.query.studentId as string
    if (queryStudentId) {
      studentId.value = queryStudentId
    } else if (data && data.length && data[0]) {
      studentId.value = String(data[0].id)
    }
  } catch (err) {
    message.value = 'Unable to fetch student list to select.'
    isSuccess.value = false
  }
}

onMounted(() => {
  loadStudents()
})

const handleSubmit = async () => {
  message.value = null
  if (!studentId.value || !courseCode.value) {
    message.value = 'Please choose a student and add a course code.'
    isSuccess.value = false
    return
  }

  try {
    submitLoading.value = true
    await api(`/students/${studentId.value}/grades`, {
      method: 'POST',
      body: { 
        courseCode: courseCode.value, 
        units: units.value, 
        score: score.value, 
        semester: semester.value 
      }
    })
    
    isSuccess.value = true
    message.value = 'Academic record submitted successfully.'
    
    courseCode.value = ''
    units.value = 3
    score.value = 0
    semester.value = 'Fall 2025'
  } catch (err) {
    isSuccess.value = false
    message.value = 'Unable to submit academic record to the database.'
  } finally {
    submitLoading.value = false
  }
}
</script>
