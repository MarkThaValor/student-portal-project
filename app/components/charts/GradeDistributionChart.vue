<template>
  <div class="relative w-full h-[200px] flex flex-col items-center justify-center font-sans">
    <!-- Donut SVG -->
    <div class="relative w-[180px] h-[180px]">
      <svg width="180" height="180" viewBox="0 0 180 180" class="overflow-visible select-none transform -rotate-90">
        <!-- Gray Base Background Circle -->
        <circle cx="90" cy="90" r="70" fill="transparent" stroke="#f1f5f9" stroke-width="12" />
        
        <!-- Interactive Donut Segments -->
        <circle 
          v-for="(segment, idx) in segments" 
          :key="idx" 
          cx="90" 
          cy="90" 
          r="70" 
          fill="transparent" 
          :stroke="segment.color" 
          stroke-width="12" 
          :stroke-dasharray="circumference" 
          :stroke-dashoffset="segment.offset" 
          class="transition-all duration-200 cursor-pointer origin-center"
          :style="{ transform: hoverIndex === idx ? 'scale(1.02)' : 'scale(1)' }"
          @mouseenter="hoverIndex = idx"
          @mouseleave="hoverIndex = null"
        />
      </svg>

      <!-- Center Labels Overlay -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span class="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
          {{ hoverIndex !== null && data[hoverIndex] ? `Grade ${data[hoverIndex].grade}` : 'Courses' }}
        </span>
        <span class="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
          {{ hoverIndex !== null && data[hoverIndex] ? data[hoverIndex].count : totalCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DataItem {
  grade: string
  count: number
}

const props = withDefaults(
  defineProps<{
    data: DataItem[]
  }>(),
  {
    data: () => []
  }
)

const hoverIndex = ref<number | null>(null)

const circumference = 2 * Math.PI * 70 // approx 439.82

const colors = ['#3b82f6', '#475569', '#64748b', '#94a3b8', '#cbd5e1']

const totalCount = computed(() => {
  return props.data.reduce((sum, item) => sum + item.count, 0)
})

const segments = computed(() => {
  const tot = totalCount.value
  if (tot === 0) return []

  let accumulatedPercent = 0
  
  return props.data.map((item, idx) => {
    const percent = item.count / tot
    const offset = circumference - percent * circumference
    const startAngle = accumulatedPercent * 360
    accumulatedPercent += percent

    return {
      color: colors[idx % colors.length],
      offset: offset + (startAngle / 360) * circumference,
    }
  })
})
</script>
