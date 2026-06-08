<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
    <!-- PWA Enforcement Overlay -->
    <Transition name="fade">
      <div 
        v-if="!isStandalone && !isBypassed" 
        class="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center p-4 overflow-y-auto"
      >
        <!-- Background ambient gradients -->
        <div class="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
        <div class="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none"></div>

        <div class="w-full max-w-lg my-auto bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-center backdrop-blur-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
          
          <!-- Close Button -->
          <button 
            @click="dismissOverlay" 
            class="absolute top-4 right-4 text-slate-500 hover:text-slate-300 focus:outline-none p-1.5 hover:bg-slate-800/60 rounded-full transition cursor-pointer"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Header Branding -->
          <div class="space-y-3">
            <div class="relative mx-auto h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-indigo-500/20">
              SP
              <!-- Mini pulsing indicator -->
              <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </div>
            
            <div class="space-y-1">
              <h2 class="text-xl font-extrabold tracking-tight text-white leading-tight">Student Portal</h2>
              <p class="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Workspace App Enforced</p>
            </div>

            <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              To ensure data sandbox isolation, high-density dashboard layouts, and offline availability, this application must be run as a standalone PWA.
            </p>
          </div>

          <!-- Native Installation Prompt (If supported and deferred prompt is ready) -->
          <div v-if="deferredPrompt" class="bg-indigo-950/40 border border-indigo-500/25 rounded-xl p-5 space-y-4">
            <div class="space-y-1">
              <span class="text-xs font-bold text-indigo-200">Native Installation Available</span>
              <p class="text-[10.5px] text-indigo-300/80">Click the button below to install the application instantly onto your device.</p>
            </div>
            <button 
              @click="triggerPwaInstall"
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-extrabold text-white py-3 px-4 shadow-lg shadow-indigo-600/20 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-200 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Install Workspace App
            </button>
          </div>

          <!-- Step-by-Step Platform Guides -->
          <div class="space-y-3.5 text-left">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800/80 pb-1.5">Manual Installation Instructions</span>
            
            <!-- Platform Tabs Selector -->
            <div class="grid grid-cols-4 gap-1 bg-slate-950/85 rounded-lg p-1 text-[10px] font-bold">
              <button 
                v-for="tab in ['chrome', 'ios', 'macos', 'firefox']" 
                :key="tab"
                @click="activePlatformTab = tab"
                :class="[
                  'py-1.5 rounded transition capitalize text-center',
                  activePlatformTab === tab 
                    ? 'bg-slate-850 text-slate-200' 
                    : 'text-slate-500 hover:text-slate-300'
                ]"
              >
                {{ tab === 'chrome' ? 'Chrome/Edge' : tab === 'ios' ? 'iOS Safari' : tab === 'macos' ? 'macOS Safari' : 'Firefox' }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 text-xs text-slate-300 space-y-2.5 min-h-[96px] leading-relaxed">
              <div v-if="activePlatformTab === 'chrome'" class="space-y-2 animate-in fade-in duration-200">
                <p class="text-[11px] text-slate-400 font-medium">On Chrome / Edge / Brave (Desktop & Android):</p>
                <ul class="list-disc pl-4 space-y-1 text-[11px] text-slate-300 font-semibold">
                  <li>Click the <strong class="text-white">Install</strong> icon in the address bar (top right).</li>
                  <li>Or open the browser menu (<strong class="text-white">⋮</strong>) and click <strong class="text-white">Install Student Performance...</strong> or <strong class="text-white">Add to Home Screen</strong>.</li>
                </ul>
              </div>
              <div v-else-if="activePlatformTab === 'ios'" class="space-y-2 animate-in fade-in duration-200">
                <p class="text-[11px] text-slate-400 font-medium">On iOS Safari (iPhone / iPad):</p>
                <ul class="list-disc pl-4 space-y-1 text-[11px] text-slate-300 font-semibold">
                  <li>Tap the <strong class="text-white">Share</strong> button <span class="inline-flex items-center justify-center bg-slate-800 px-1 py-0.5 rounded text-[9px] text-slate-300">⎋</span> (box with up arrow) in Safari.</li>
                  <li>Scroll down and tap <strong class="text-white">Add to Home Screen</strong>.</li>
                  <li>Confirm the details and click <strong class="text-white">Add</strong> in the top-right corner.</li>
                </ul>
              </div>
              <div v-else-if="activePlatformTab === 'macos'" class="space-y-2 animate-in fade-in duration-200">
                <p class="text-[11px] text-slate-400 font-medium">On macOS Safari (Desktop Dock):</p>
                <ul class="list-disc pl-4 space-y-1 text-[11px] text-slate-300 font-semibold">
                  <li>Click <strong class="text-white">File</strong> in the Safari top menu bar.</li>
                  <li>Choose <strong class="text-white">Add to Dock...</strong> from the dropdown list.</li>
                  <li>Verify the name and click <strong class="text-white">Add</strong> to pin the workspace.</li>
                </ul>
              </div>
              <div v-else-if="activePlatformTab === 'firefox'" class="space-y-2 animate-in fade-in duration-200">
                <p class="text-[11px] text-slate-400 font-medium">On Mozilla Firefox:</p>
                <ul class="list-disc pl-4 space-y-1 text-[11px] text-slate-300 font-semibold">
                  <li>Firefox does not support desktop PWA installation by default.</li>
                  <li>We recommend using a Chromium-based browser (Chrome, Edge, Brave, Opera) to install.</li>
                  <li>Or use Firefox Mobile on Android: tap the menu and choose <strong class="text-white">Install</strong>.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Diagnostics Checks -->
          <div class="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-[10.5px] text-slate-400 space-y-2">
            <span class="font-bold text-slate-300 uppercase tracking-wider block text-left mb-1">Workspace Integrity Check</span>
            <div class="flex items-center justify-between">
              <span>Display Viewport Mode:</span>
              <span class="text-rose-400 font-bold">Web Browser (Restricted)</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Service Worker Engine:</span>
              <span class="text-emerald-400 font-bold">Active & Cache Ready</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Local Sandbox Isolation:</span>
              <span class="text-emerald-400 font-bold">Secured (LocalStorage)</span>
            </div>
          </div>

          <!-- Continue to web option -->
          <div class="pt-2 border-t border-slate-800/60 mt-4">
            <button 
              @click="dismissOverlay"
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 active:scale-95 text-xs font-bold text-slate-400 hover:text-slate-200 py-2.5 px-4 transition duration-150 cursor-pointer"
            >
              Dismiss & Continue to Web Portal
            </button>
          </div>

          <!-- Footer Bypass Options -->
          <div class="pt-2 text-center flex flex-col gap-2">
            <span class="text-[10px] text-slate-500 font-semibold">
              Once installed, launch the app from your device launcher or desktop shortcut.
            </span>
            <button 
              @click="handleBypass"
              class="text-[9px] font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest self-center"
            >
              Developer Bypass Mode
            </button>
          </div>

        </div>
      </div>
    </Transition>
    <!-- Mobile Navigation Bar -->
    <header class="md:hidden mobile-header fixed top-0 left-0 right-0 h-14 bg-slate-900 text-white z-50 px-4 flex items-center justify-between border-b border-slate-800">
      <div class="flex items-center gap-2">
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-extrabold text-white text-xs">
          SP
        </div>
        <span class="font-bold text-sm tracking-tight">Student Portal</span>
      </div>
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen" 
        class="p-1.5 rounded border border-slate-800 text-slate-300 hover:text-white transition focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Sidebar Navigation (Desktop) / Slide-out Menu (Mobile) -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-40 bg-slate-950 text-slate-200 flex flex-col justify-between border-r border-slate-900 transition-transform duration-200 md:translate-x-0 md:w-64 mobile-sidebar',
        isMobileMenuOpen ? 'translate-x-0 w-full' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col flex-1 px-4 py-6 overflow-y-auto gap-6">
        <!-- Logo and App Title -->
        <div class="hidden md:flex items-center gap-2.5 pb-2">
          <div class="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            SP
          </div>
          <div>
            <h1 class="text-sm font-bold tracking-tight text-white">
              Student Performance
            </h1>
            <p class="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Academic Analytics</p>
          </div>
        </div>

        <!-- Menu Links -->
        <nav class="flex flex-col gap-1">
          <p class="text-[9px] uppercase tracking-wider text-slate-600 font-bold px-2.5 mb-1.5">Navigation</p>
          <NuxtLink 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            @click="isMobileMenuOpen = false"
            active-class="bg-indigo-600 text-white font-semibold"
            class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs transition-colors duration-150"
          >
            <!-- Static SVG Icons -->
            <svg v-if="item.label === 'Dashboard'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg v-else-if="item.label === 'GPA Analysis'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <svg v-else-if="item.label === 'Recommendations'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <svg v-else-if="item.label === 'Add Course'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else-if="item.label === 'Students'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <svg v-else-if="item.label === 'Settings'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else-if="item.label === 'Admin Panel'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Logged-in User Profile Card -->
      <div class="p-4 border-t border-slate-900 bg-slate-950">
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2.5">
            <div v-if="avatarDataUrl" class="h-8 w-8 rounded bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
              <img :src="avatarDataUrl" alt="Avatar" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-8 w-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
              {{ userInitial }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Account</p>
              <p class="text-xs font-semibold text-slate-200 truncate">{{ user?.username || 'Student' }}</p>
            </div>
          </div>
          <button 
            @click="handleLogout" 
            class="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-900 bg-slate-900/40 py-2 text-xs font-bold text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-950/30 transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </aside>

    <!-- Backdrop for Mobile Sidebar -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false" 
      class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 md:hidden"
    ></div>

    <!-- Main Content Container -->
    <div class="flex-1 flex flex-col min-w-0">
      <main class="main-content flex-1 px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-24 md:p-8 md:ml-64 max-w-6xl w-full mx-auto">
        <slot />
      </main>
    </div>

    <!-- Bespoke Context Menu -->
    <ContextMenu 
      :show="showMenu"
      :x="menuX"
      :y="menuY"
      :context-student-id="contextStudentId"
      :context-route="contextRoute"
      :is-installable="isInstallable"
      @close="showMenu = false"
      @action="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()
const isMobileMenuOpen = ref(false)

import { useRoute } from 'vue-router'

const route = useRoute()
const deferredPrompt = useState<any>('pwa-deferred-prompt')
const isInstallable = useState<boolean>('pwa-is-installable', () => false)

// Standalone mode checks
const isStandalone = ref(false)
const isBypassed = ref(false)
const activePlatformTab = ref('chrome')

const checkStandalone = () => {
  if (typeof window !== 'undefined') {
    isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true
  }
}

const detectPlatform = () => {
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      activePlatformTab.value = 'ios'
    } else if (ua.includes('macintosh') && !ua.includes('chrome') && !ua.includes('firefox')) {
      activePlatformTab.value = 'macos'
    } else if (ua.includes('firefox')) {
      activePlatformTab.value = 'firefox'
    } else {
      activePlatformTab.value = 'chrome'
    }
  }
}

const handleBypass = () => {
  if (confirm('Enable developer bypass mode? This is only intended for local testing on environments that do not support PWA installation.')) {
    localStorage.setItem('student-portal-pwa-bypass', 'true')
    isBypassed.value = true
  }
}

const dismissOverlay = () => {
  localStorage.setItem('student-portal-pwa-bypass', 'true')
  isBypassed.value = true
}

const triggerPwaInstall = () => {
  const promptEvent = deferredPrompt.value
  if (promptEvent) {
    promptEvent.prompt()
    promptEvent.userChoice.then(({ outcome }: any) => {
      console.log(`User response to enforcer PWA install: ${outcome}`)
      deferredPrompt.value = null
      isInstallable.value = false
    })
  } else {
    alert('PWA installation trigger is not available on this browser/environment. If you are using iOS Safari or Firefox, please use the browser settings menu to "Add to Home Screen".')
  }
}

const userInitial = computed(() => {
  if (!user.value?.username) return 'U'
  return user.value.username.charAt(0).toUpperCase()
})

const handleLogout = () => {
  isMobileMenuOpen.value = false
  logout()
}

// Avatar loading logic
const avatarDataUrl = ref<string | null>(null)
const loadAvatar = () => {
  if (typeof window !== 'undefined' && user.value?.email) {
    avatarDataUrl.value = localStorage.getItem(`student-portal-avatar-${user.value.email}`)
  } else {
    avatarDataUrl.value = null
  }
}

watch(user, () => {
  loadAvatar()
})

// Bespoke Context Menu state
const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const contextStudentId = ref<string | null>(null)
const contextRoute = ref<string | null>(null)

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  
  let target = e.target as HTMLElement | null
  let studentId: string | null = null
  let routeVal: string | null = null

  while (target) {
    if (target.dataset?.contextStudentId) {
      studentId = target.dataset.contextStudentId
    }
    if (target.tagName === 'A' && target.getAttribute('href')) {
      routeVal = target.getAttribute('href')
    }
    target = target.parentElement
  }

  contextStudentId.value = studentId
  contextRoute.value = routeVal
  menuX.value = e.clientX
  menuY.value = e.clientY
  showMenu.value = true
}

const handleAction = ({ action, data }: { action: string, data?: any }) => {
  if (action === 'navigate') {
    navigateTo(data)
  } else if (action === 'view-student') {
    navigateTo(`/students/${contextStudentId.value}`)
  } else if (action === 'add-grade') {
    navigateTo(`/academic-record?studentId=${contextStudentId.value}`)
  } else if (action === 'go-route') {
    if (contextRoute.value) navigateTo(contextRoute.value)
  } else if (action === 'install') {
    const promptEvent = deferredPrompt.value
    if (promptEvent) {
      promptEvent.prompt()
      promptEvent.userChoice.then(({ outcome }: any) => {
        console.log(`User response to context menu install: ${outcome}`)
        deferredPrompt.value = null
        isInstallable.value = false
      })
    }
  } else if (action === 'reload') {
    window.location.reload()
  } else if (action === 'logout') {
    handleLogout()
  }
}

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (e.altKey) {
    const key = e.key.toLowerCase()
    if (key === 'd') {
      e.preventDefault()
      navigateTo('/dashboard')
    } else if (key === 's') {
      e.preventDefault()
      navigateTo('/students')
    } else if (key === 'p') {
      e.preventDefault()
      navigateTo('/settings')
    } else if (key === 'a') {
      e.preventDefault()
      navigateTo('/admin')
    } else if (key === 'q') {
      e.preventDefault()
      handleLogout()
    }
  }
}

onMounted(() => {
  loadAvatar()
  checkStandalone()
  detectPlatform()
  
  if (typeof window !== 'undefined') {
    if (route.query.bypass === 'true' || localStorage.getItem('student-portal-pwa-bypass') === 'true') {
      isBypassed.value = true
    }

    window.addEventListener('avatar-changed', loadAvatar)
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleGlobalKeydown)

    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      isStandalone.value = e.matches
    })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('avatar-changed', loadAvatar)
    window.removeEventListener('contextmenu', handleContextMenu)
    window.removeEventListener('keydown', handleGlobalKeydown)
  }
})

// Minimal icons
const HomeIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
}

const ChartIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
}

const LightbulbIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  `
}

const DocumentAddIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
}

const UserGroupIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  `
}

const SettingsIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
}

const ShieldIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  `
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/gpa-analysis', label: 'GPA Analysis', icon: ChartIcon },
  { path: '/recommendations', label: 'Recommendations', icon: LightbulbIcon },
  { path: '/academic-record', label: 'Add Course', icon: DocumentAddIcon },
  { path: '/students', label: 'Students', icon: UserGroupIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
  { path: '/admin', label: 'Admin Panel', icon: ShieldIcon },
]
</script>

<style scoped>
.router-link-exact-active {
  @apply bg-indigo-600 text-white font-semibold;
}

@media (max-width: 767px) {
  .main-content {
    padding-top: calc(6rem + env(safe-area-inset-top)) !important;
  }
  .mobile-header {
    padding-top: env(safe-area-inset-top) !important;
    height: calc(3.5rem + env(safe-area-inset-top)) !important;
  }
  .mobile-sidebar {
    padding-top: calc(3.5rem + env(safe-area-inset-top)) !important;
  }
}
</style>
