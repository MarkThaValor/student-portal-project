<template>
  <div 
    :class="[
      'rounded-xl border p-5 bg-white shadow-sm transition-all duration-200 hover:shadow-md',
      accentStyles[accent]
    ]"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{{ title }}</p>
        <p class="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">{{ value }}</p>
      </div>
      <div class="rounded bg-slate-50 border border-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
        {{ title.split(' ')[0] }}
      </div>
    </div>
    <p class="mt-3 text-[11px] leading-relaxed text-slate-400 font-semibold">{{ detail }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  detail: string
  accent: 'indigo' | 'cyan' | 'slate' | 'rose'
}

defineProps<Props>()

const accentStyles = {
  indigo: 'border-slate-200/80 border-t-indigo-500 border-t-2',
  cyan: 'border-slate-200/80 border-t-cyan-500 border-t-2',
  slate: 'border-slate-200/80 border-t-slate-500 border-t-2',
  rose: 'border-slate-200/80 border-t-rose-500 border-t-2',
}
</script>
