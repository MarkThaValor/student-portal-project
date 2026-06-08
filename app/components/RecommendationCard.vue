<template>
  <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-[9px] uppercase tracking-wider text-indigo-600 font-extrabold">Action Suggested</p>
        <h3 class="mt-1 text-sm font-bold text-slate-900 tracking-tight leading-snug">{{ title }}</h3>
      </div>
      <span class="rounded bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-700 shrink-0">
        Priority
      </span>
    </div>
    <p class="mt-2 text-xs leading-relaxed text-slate-500 font-medium">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script>
