<template>
  <div class="relative w-full h-[280px] font-sans" ref="chartContainer" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <!-- SVG Canvas -->
    <svg :viewBox="`0 0 ${width} ${height}`" width="100%" height="100%" class="overflow-visible select-none">
      <defs>
        <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Background Gridlines (Horizontal) -->
      <g stroke="#f8fafc" stroke-width="1.5">
        <line v-for="gridY in gridLines" :key="gridY" :x1="paddingLeft" :y1="gridY" :x2="width - paddingRight" :y2="gridY" />
      </g>

      <!-- Y Axis Labels -->
      <g fill="#94a3b8" class="text-[9px] font-bold" text-anchor="end">
        <text v-for="label in yLabels" :key="label.val" :x="paddingLeft - 8" :y="label.y + 3">
          {{ label.val.toFixed(2) }}
        </text>
      </g>

      <!-- Area Under Curve -->
      <path v-if="points.length" :d="areaPath" fill="url(#gpaGradient)" />

      <!-- Spline Line -->
      <path v-if="points.length" :d="linePath" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Data Nodes (Dots) -->
      <g>
        <circle 
          v-for="(pt, idx) in points" 
          :key="idx" 
          :cx="pt.x" 
          :cy="pt.y" 
          :r="hoverIndex === idx ? 5 : 3.5" 
          :fill="hoverIndex === idx ? '#1d4ed8' : '#3b82f6'" 
          stroke="#ffffff" 
          stroke-width="1.5" 
          class="transition-all duration-100"
        />
      </g>

      <!-- X Axis Labels -->
      <g fill="#94a3b8" class="text-[9px] font-bold" text-anchor="middle">
        <text v-for="(pt, idx) in points" :key="idx" :x="pt.x" :y="height - paddingBottom + 16">
          {{ data[idx]?.term }}
        </text>
      </g>
    </svg>

    <!-- Custom HTML Hover Tooltip -->
    <div 
      v-if="hoverIndex !== null && data[hoverIndex]"
      :style="{ left: `${tooltipX}px`, top: `${tooltipY}px` }"
      class="absolute transform -translate-x-1/2 -translate-y-full mt-[-6px] pointer-events-none z-10 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md border border-slate-800 transition-all duration-75 flex flex-col gap-0.5"
    >
      <span class="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold">{{ data[hoverIndex].term }}</span>
      <span class="text-xs font-extrabold text-blue-400">{{ data[hoverIndex].gpa.toFixed(2) }} GPA</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface DataItem {
  term: string
  gpa: number
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

const minGpa = 2.5
const maxGpa = 4.0

const points = computed(() => {
  if (!props.data.length) return []
  
  const chartWidth = width.value - paddingLeft - paddingRight
  const chartHeight = height.value - paddingTop - paddingBottom
  
  return props.data.map((item, idx) => {
    const x = paddingLeft + (idx / (props.data.length - 1)) * chartWidth
    const clampedGpa = Math.max(minGpa, Math.min(maxGpa, item.gpa))
    const gpaPercent = (clampedGpa - minGpa) / (maxGpa - minGpa)
    const y = height.value - paddingBottom - gpaPercent * chartHeight
    return { x, y }
  })
})

const gridLines = computed(() => {
  const chartHeight = height.value - paddingTop - paddingBottom
  const lines = []
  for (let i = 0; i <= 3; i++) {
    lines.push(paddingTop + (i / 3) * chartHeight)
  }
  return lines
})

const yLabels = computed(() => {
  const chartHeight = height.value - paddingTop - paddingBottom
  return [
    { val: 4.0, y: paddingTop },
    { val: 3.5, y: paddingTop + (1 / 3) * chartHeight },
    { val: 3.0, y: paddingTop + (2 / 3) * chartHeight },
    { val: 2.5, y: height.value - paddingBottom }
  ]
})

const linePath = computed(() => {
  if (points.value.length < 2) return ''
  return points.value.reduce((path, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`
    const prevPt = points.value[idx - 1]
    const cpX1 = prevPt.x + (pt.x - prevPt.x) / 2
    const cpY1 = prevPt.y
    const cpX2 = prevPt.x + (pt.x - prevPt.x) / 2
    const cpY2 = pt.y
    return `${path} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`
  }, '')
})

const areaPath = computed(() => {
  if (points.value.length < 2) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  const basePath = linePath.value
  return `${basePath} L ${last.x} ${height.value - paddingBottom} L ${first.x} ${height.value - paddingBottom} Z`
})

const handleMouseMove = (event: MouseEvent) => {
  if (!chartContainer.value || !points.value.length) return
  
  const rect = chartContainer.value.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const chartWidth = width.value - paddingLeft - paddingRight
  
  const relativeX = mouseX - paddingLeft
  const percentX = relativeX / chartWidth
  let idx = Math.round(percentX * (props.data.length - 1))
  idx = Math.max(0, Math.min(props.data.length - 1, idx))
  
  hoverIndex.value = idx
  
  const pt = points.value[idx]
  const scaleX = rect.width / width.value
  const scaleY = rect.height / height.value
  
  tooltipX.value = pt.x * scaleX
  tooltipY.value = pt.y * scaleY
}

const handleMouseLeave = () => {
  hoverIndex.value = null
}
</script>
