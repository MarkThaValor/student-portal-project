<template>
  <div 
    v-if="show"
    ref="menuRef"
    :style="{ top: `${adjustedY}px`, left: `${adjustedX}px` }"
    class="fixed z-[9999] w-52 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg shadow-xl p-1.5 text-xs font-medium focus:outline-none select-none divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-100"
  >
    <!-- Context Specific Actions -->
    <div v-if="contextStudentId || contextRoute" class="pb-1.5 mb-1.5 flex flex-col gap-0.5">
      <p class="text-[9px] uppercase tracking-wider text-slate-500 font-bold px-2 py-1">Item Actions</p>
      
      <button 
        v-if="contextStudentId" 
        @click="triggerAction('view-student')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-indigo-600 hover:text-white transition duration-75"
      >
        <span class="truncate">View Student Profile</span>
        <span class="text-[9px] text-slate-400 font-semibold">⏎</span>
      </button>

      <button 
        v-if="contextStudentId" 
        @click="triggerAction('add-grade')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-indigo-600 hover:text-white transition duration-75"
      >
        <span>Record Grades</span>
        <span class="text-[9px] text-slate-400 font-semibold">+</span>
      </button>

      <button 
        v-if="contextRoute" 
        @click="triggerAction('go-route')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-indigo-600 hover:text-white transition duration-75"
      >
        <span>Navigate to Page</span>
        <span class="text-[9px] text-slate-400 font-semibold">→</span>
      </button>
    </div>

    <!-- General Navigation & Workspace Actions -->
    <div class="py-1 flex flex-col gap-0.5">
      <p class="text-[9px] uppercase tracking-wider text-slate-500 font-bold px-2 py-1">Workspace</p>
      
      <button 
        @click="triggerAction('navigate', '/dashboard')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-slate-800 transition duration-75"
      >
        <span>Dashboard</span>
        <span class="text-[9px] text-slate-500 font-semibold">Alt+D</span>
      </button>

      <button 
        @click="triggerAction('navigate', '/students')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-slate-800 transition duration-75"
      >
        <span>Students Directory</span>
        <span class="text-[9px] text-slate-500 font-semibold">Alt+S</span>
      </button>

      <button 
        @click="triggerAction('navigate', '/settings')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-slate-800 transition duration-75"
      >
        <span>System Settings</span>
        <span class="text-[9px] text-slate-500 font-semibold">Alt+P</span>
      </button>

      <button 
        @click="triggerAction('navigate', '/admin')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-slate-800 transition duration-75"
      >
        <span>Admin Console</span>
        <span class="text-[9px] text-slate-500 font-semibold">Alt+A</span>
      </button>
    </div>

    <!-- System Actions -->
    <div class="pt-1.5 mt-1.5 flex flex-col gap-0.5">
      <button 
        v-if="isInstallable"
        @click="triggerAction('install')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left bg-emerald-950/30 hover:bg-emerald-600 text-emerald-400 hover:text-white transition duration-75 font-bold"
      >
        <span>Install Portal App</span>
        <span class="text-[9px] font-bold">↓</span>
      </button>

      <button 
        @click="triggerAction('reload')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-slate-800 transition duration-75 text-slate-300"
      >
        <span>Refresh Workspace</span>
        <span class="text-[9px] text-slate-500 font-semibold">F5</span>
      </button>
      
      <button 
        @click="triggerAction('logout')" 
        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-rose-950/40 hover:text-rose-400 transition duration-75"
      >
        <span>Sign Out</span>
        <span class="text-[9px] text-rose-500/50 font-semibold">Alt+Q</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  show: boolean
  x: number
  y: number
  contextStudentId: string | null
  contextRoute: string | null
  isInstallable: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'action', payload: { action: string, data?: any }): void
}>()

const menuRef = ref<HTMLElement | null>(null)

const adjustedX = ref(0)
const adjustedY = ref(0)

const calculatePosition = () => {
  if (typeof window === 'undefined') return
  const menuWidth = 208 // w-52 is 13rem = 208px
  const menuHeight = 250 // approximate max height
  
  let newX = props.x
  let newY = props.y
  
  if (props.x + menuWidth > window.innerWidth) {
    newX = window.innerWidth - menuWidth - 10
  }
  if (props.y + menuHeight > window.innerHeight) {
    newY = window.innerHeight - menuHeight - 10
  }
  
  adjustedX.value = Math.max(10, newX)
  adjustedY.value = Math.max(10, newY)
}

watch(() => [props.x, props.y, props.show], () => {
  if (props.show) {
    calculatePosition()
  }
})

const triggerAction = (action: string, data?: any) => {
  emit('action', { action, data })
  emit('close')
}

const handleClickOutside = (e: MouseEvent) => {
  if (props.show && menuRef.value && !menuRef.value.contains(e.target as Node)) {
    emit('close')
  }
}

const handleScrollOrResize = () => {
  if (props.show) {
    emit('close')
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('scroll', handleScrollOrResize, true)
    window.removeEventListener('resize', handleScrollOrResize)
  }
})
</script>
