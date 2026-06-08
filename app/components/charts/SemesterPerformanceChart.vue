<template>
  <div class="relative w-full h-[280px] font-sans" ref="chartContainer" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <!-- SVG Canvas -->
    <svg :viewBox="`0 0 ${width} ${height}`" width="100%" height="100%" class="overflow-visible select-none">
      <!-- Background Gridlines (Horizontal) -->
      <g stroke="#f8fafc" stroke-width="1.5">
        <line v-for="gridY in gridLines" :key="gridY" :x1="paddingLeft" :y1="gridY" :x2="width - paddingRight" :y2="gridY" />
      </g>

      <!-- Y Axis Labels -->
      <g fill="#94a3b8" class="text-[9px] font-bold" text-anchor="end">
        <text v-for="label in yLabels" :key="label.val" :x="paddingLeft - 8" :y="label.y + 3">
          {{ label.val }}%
        </text>
      </g>

      <!-- Dynamic Bar Rectangles -->
      <g>
        <rect 
          v-for="(bar, idx) in bars" 
          :key="idx"
          :x="bar.x"
          :y="bar.y"
          :width="bar.w"
          :height="bar.h"
          rx="4"
          ry="4"
          :fill="hoverIndex === idx ? '#2563eb' : '#3b82f6'"
          class="transition-all duration-100 cursor-pointer"
        />
        <!-- Flatten bottom corners -->
        <rect 
          v-for="(bar, idx) in bars" 
          :key="`bottom-${idx}`"
          :x="bar.x"
          :y="height - paddingBottom - 4"
          :width="bar.w"
          height="4"
          :fill="hoverIndex === idx ? '#2563eb' : '#3b82f6'"
          class="transition-all duration-100 cursor-pointer"
        />
      </g>

      <!-- X Axis Labels -->
      <g fill="#94a3b8" class="text-[9px] font-bold" text-anchor="middle">
        <text v-for="(bar, idx) in bars" :key="idx" :x="bar.centerX" :y="height - paddingBottom + 16">
          {{ data[idx]?.semester }}
        </text>
      </g>
    </svg>

    <!-- Custom HTML Hover Tooltip -->
    <div 
      v-if="hoverIndex !== null && data[hoverIndex]"
      :style="{ left: `${tooltipX}px`, top: `${tooltipY}px` }"
      class="absolute transform -translate-x-1/2 -translate-y-full mt-[-6px] pointer-events-none z-10 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md border border-slate-800 transition-all duration-75 flex flex-col gap-0.5"
    >
      <span class="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold">{{ data[hoverIndex]?.semester }}</span>
      <span class="text-xs font-extrabold text-blue-400">{{ data[hoverIndex]?.performance }}% Mark</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface DataItem {
  semester: string
  performance: number
}

const props = withDefaults(
  defineProps<{
    data: DataItem[]
  }>(),
  {
    data: () => []
  }
)

const chartContainer = ref<HTMLElement | null>(null)
const width = ref(600)
const height = ref(280)

const paddingLeft = 40
const paddingRight = 15
const paddingTop = 15
const paddingBottom = 30

const hoverIndex = ref<number | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const handleResize = () => {
  if (chartContainer.value) {
    width.value = chartContainer.value.clientWidth
    height.value = chartContainer.value.clientHeight
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const bars = computed(() => {
  if (!props.data.length) return []
  
  const chartWidth = width.value - paddingLeft - paddingRight
  const chartHeight = height.value - paddingTop - paddingBottom
  const barCount = props.data.length
  
  const totalBarWidthSpace = chartWidth * 0.5
  const barWidth = Math.min(36, totalBarWidthSpace / barCount)
  const remainingGapSpace = chartWidth - barWidth * barCount
  const gap = remainingGapSpace / (barCount + 1)
  
  return props.data.map((item, idx) => {
    const x = paddingLeft + gap + idx * (barWidth + gap)
    const clampedPerf = Math.max(0, Math.min(100, item.performance))
    const barHeight = (clampedPerf / 100) * chartHeight
    const y = height.value - paddingBottom - barHeight
    
    return {
      x,
      y,
      w: barWidth,
      h: Math.max(2, barHeight),
      centerX: x + barWidth / 2
    }
  })
})

const gridLines = computed(() => {
  const chartHeight = height.value - paddingTop - paddingBottom
  return [
    paddingTop,
    paddingTop + 0.25 * chartHeight,
    paddingTop + 0.5 * chartHeight,
    paddingTop + 0.75 * chartHeight,
    height.value - paddingBottom
  ]
})

const yLabels = computed(() => {
  const chartHeight = height.value - paddingTop - paddingBottom
  return [
    { val: 100, y: paddingTop },
    { val: 75, y: paddingTop + 0.25 * chartHeight },
    { val: 50, y: paddingTop + 0.5 * chartHeight },
    { val: 25, y: paddingTop + 0.75 * chartHeight },
    { val: 0, y: height.value - paddingBottom }
  ]
})

const handleMouseMove = (event: MouseEvent) => {
  if (!chartContainer.value || !bars.value.length) return
  
  const rect = chartContainer.value.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  
  const scaleX = rect.width / width.value
  const scaleY = rect.height / height.value
  
  let closestIndex = 0
  let minDistance = Infinity
  
  bars.value.forEach((bar, idx) => {
    const barCenterXClient = bar.centerX * scaleX
    const dist = Math.abs(mouseX - barCenterXClient)
    if (dist < minDistance) {
      minDistance = dist
      closestIndex = idx
    }
  })
  
  hoverIndex.value = closestIndex
  const matchedBar = bars.value[closestIndex]
  if (matchedBar) {
    tooltipX.value = matchedBar.centerX * scaleX
    tooltipY.value = matchedBar.y * scaleY
  }
}

const handleMouseLeave = () => {
  hoverIndex.value = null
}
</script>
