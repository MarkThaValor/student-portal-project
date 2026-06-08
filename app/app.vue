<template>
  <div>
    <!-- Global Sleek Page Loader -->
    <Transition name="fade">
      <div 
        v-if="pageLoading" 
        class="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[99999] flex flex-col items-center justify-center gap-4 text-white"
      >
        <div class="relative flex items-center justify-center h-16 w-16">
          <!-- Pulsing outer ring -->
          <div class="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping duration-1000"></div>
          <!-- Rotating loader ring -->
          <div class="absolute inset-1.5 rounded-full border-2 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
          <!-- Inner brand logo -->
          <div class="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center font-extrabold text-[10px] tracking-tighter text-white shadow-md">
            SP
          </div>
        </div>
        <div class="flex flex-col items-center gap-1 text-center">
          <span class="text-[10px] font-extrabold tracking-widest text-slate-100 uppercase font-sans">Student Portal</span>
          <span class="text-[8px] font-bold tracking-wider text-slate-500 uppercase font-sans">Loading Workspace...</span>
        </div>
      </div>
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const deferredPrompt = useState<any>('pwa-deferred-prompt', () => null)
const isInstallable = useState<boolean>('pwa-is-installable', () => false)

const pageLoading = ref(true)
const router = useRouter()

// Route transition hook
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    pageLoading.value = true
  }
  next()
})

router.afterEach((to, from) => {
  if (to.path !== from.path) {
    setTimeout(() => {
      pageLoading.value = false
    }, 350)
  }
})

onMounted(() => {
  // Fade out loader on initial load
  setTimeout(() => {
    pageLoading.value = false
  }, 400)

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
      isInstallable.value = false
      console.log('PWA was installed')
    })
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

