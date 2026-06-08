<template>
  <div class="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-[560px] w-full divide-y divide-slate-100 text-left text-xs text-slate-600">
        <thead class="bg-slate-50 border-b border-slate-200/80 text-slate-800">
          <tr>
            <th class="px-5 py-3.5 font-bold uppercase tracking-wider">Course</th>
            <th class="px-5 py-3.5 font-bold uppercase tracking-wider">Semester</th>
            <th class="px-5 py-3.5 font-bold uppercase tracking-wider">Credits</th>
            <th class="px-5 py-3.5 font-bold uppercase tracking-wider">Grade</th>
            <th class="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr 
            v-for="row in rows" 
            :key="`${row.code}-${row.semester}`" 
            class="transition-colors duration-150 hover:bg-slate-50/50"
          >
            <td class="px-5 py-3.5">
              <div class="font-bold text-slate-900 text-xs tracking-tight">{{ row.code }}</div>
              <div class="text-[10px] text-slate-400 font-medium">{{ row.title }}</div>
            </td>
            <td class="px-5 py-3.5 font-semibold text-slate-500">{{ row.semester }}</td>
            <td class="px-5 py-3.5 font-semibold text-slate-400">{{ row.credits }} units</td>
            <td class="px-5 py-3.5 font-extrabold text-slate-900">{{ row.grade }}</td>
            <td class="px-5 py-3.5">
              <span 
                :class="[
                  'inline-flex rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border',
                  statusStyles[row.status] || 'bg-slate-100 text-slate-600 border-slate-200'
                ]"
              >
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CourseRow {
  code: string
  title: string
  semester: string
  credits: number
  grade: string
  status: string
}

interface Props {
  rows: CourseRow[]
}

defineProps<Props>()

const statusStyles: Record<string, string> = {
  Passed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Failed: 'bg-rose-50 text-rose-700 border-rose-100',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-100',
}
</script>
