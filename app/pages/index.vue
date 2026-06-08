<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
    <!-- Landing Navigation Header -->
    <header class="border-b border-slate-200/80 bg-white sticky top-0 z-50">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-extrabold text-white text-xs">
            SP
          </div>
          <span class="font-bold text-sm text-slate-900 tracking-tight">Student Portal</span>
        </div>
        <nav class="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-500">
          <a href="#features" class="hover:text-indigo-600 transition">Features</a>
          <a href="#preview" class="hover:text-indigo-600 transition">Workspace Preview</a>
          <a href="#faq" class="hover:text-indigo-600 transition">FAQ</a>
          <button v-if="isInstallable" @click="installApp" class="text-emerald-600 hover:text-emerald-700 transition flex items-center gap-1 font-bold">
            Install App
          </button>
        </nav>
        <div class="flex items-center gap-2.5">
          <template v-if="token">
            <NuxtLink to="/dashboard" class="btn-primary py-1.5 px-3.5">
              Go to Dashboard
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
              Sign In
            </NuxtLink>
            <NuxtLink to="/register" class="btn-primary py-1.5 px-3">
              Register
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Sleek PWA Install Prompt Banner -->
    <div v-if="isInstallable" class="bg-indigo-600 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-3 shadow-inner">
      <span>Install Student Portal on your device for offline calculations and faster loading.</span>
      <button @click="installApp" class="bg-white text-indigo-600 px-3.5 py-1 rounded font-bold hover:bg-indigo-50 transition active:scale-95 text-[11px] shadow-sm shrink-0">
        Install App
      </button>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1">
      <!-- Hero Header Section -->
      <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-6">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          PWA Offline Native Sandbox
        </div>
        <h1 class="mx-auto max-w-2xl text-3xl font-extrabold text-slate-900 tracking-tight sm:text-5xl leading-tight">
          Decisions Driven by <span class="text-indigo-600">Academic Analytics</span>
        </h1>
        <p class="mx-auto max-w-lg text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Monitor your semester GPA, chart progression metrics, and retrieve personalized study recommendations. All powered locally inside your browser storage.
        </p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <NuxtLink v-if="!token" to="/register" class="btn-primary px-5 py-2.5">
            Get Started Free
          </NuxtLink>
          <NuxtLink v-else to="/dashboard" class="btn-primary px-5 py-2.5">
            Open Dashboard
          </NuxtLink>
          <button 
            v-if="isInstallable" 
            @click="installApp" 
            class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Install App
          </button>
          <a href="#preview" class="btn-secondary px-5 py-2.5">
            View Live Mockup
          </a>
        </div>
      </section>

      <!-- Mockup Dashboard Workspace Section -->
      <section id="preview" class="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div class="rounded-xl border border-slate-200/80 bg-white shadow-md overflow-hidden">
          <!-- Mock Header Window -->
          <div class="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="h-3 w-3 rounded-full bg-rose-500"></span>
              <span class="h-3 w-3 rounded-full bg-amber-500"></span>
              <span class="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span class="ml-2 text-[10px] text-slate-500 font-bold tracking-widest uppercase">workspace_preview.env</span>
            </div>
            <div class="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[8px] font-extrabold uppercase text-slate-400">
              Demo Preview
            </div>
          </div>
          
          <!-- Mock Workspace Layout -->
          <div class="p-6 bg-slate-50 grid gap-6 md:grid-cols-[200px_1fr] text-slate-600 text-xs">
            <!-- Sidebar -->
            <div class="hidden md:flex flex-col gap-4 border-r border-slate-200 pr-5">
              <div class="space-y-1.5">
                <p class="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Workspace</p>
                <div class="flex items-center gap-2 p-1.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold">
                  <span class="h-3.5 w-3.5 rounded bg-indigo-600 block shrink-0"></span>
                  Dashboard
                </div>
                <div class="flex items-center gap-2 p-1.5 rounded text-slate-400 font-medium hover:text-slate-600 transition">
                  <span class="h-3.5 w-3.5 rounded bg-slate-200 block shrink-0"></span>
                  Academic Records
                </div>
              </div>
            </div>

            <!-- Content Area -->
            <div class="space-y-6">
              <div class="grid gap-4 sm:grid-cols-2">
                <!-- Mini Stats 1 -->
                <div class="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
                  <p class="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Cumulative GPA</p>
                  <p class="text-xl font-extrabold text-slate-900 tracking-tight">3.82</p>
                  <div class="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                    ▲ Above target threshold
                  </div>
                </div>
                <!-- Mini Stats 2 -->
                <div class="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
                  <p class="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Completed Courses</p>
                  <p class="text-xl font-extrabold text-slate-900 tracking-tight">14 Modules</p>
                  <div class="text-[9px] text-indigo-600 font-bold">
                    100% Passed Index
                  </div>
                </div>
              </div>

              <!-- Mini Table -->
              <div class="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <table class="w-full text-left text-[10px]">
                  <thead class="bg-slate-50 border-b border-slate-100 text-slate-800 font-bold">
                    <tr>
                      <th class="px-4 py-2">Subject</th>
                      <th class="px-4 py-2">Credits</th>
                      <th class="px-4 py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium text-slate-600">
                    <tr>
                      <td class="px-4 py-2 font-bold text-slate-800">Advanced Algorithms</td>
                      <td class="px-4 py-2">4 Units</td>
                      <td class="px-4 py-2 text-indigo-600 font-bold">A</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-bold text-slate-800">Linear Systems</td>
                      <td class="px-4 py-2">3 Units</td>
                      <td class="px-4 py-2 text-indigo-600 font-bold">A-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features and PWA Benefits Section -->
      <section id="features" class="border-t border-b border-slate-200/80 bg-white py-20">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div class="text-center space-y-2.5 pb-16">
            <p class="text-xs text-indigo-600 font-extrabold uppercase tracking-wider">High Density Sandbox Platform</p>
            <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Portal Key Capabilities & Benefits</h2>
            <p class="mx-auto max-w-xl text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Explore the advanced features engineered directly into your browser, delivering high-speed native app performance without server-side friction.
            </p>
          </div>

          <div class="grid gap-12 lg:grid-cols-2">
            <!-- Left: 6 Core Features -->
            <div class="space-y-8">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Core Features</h3>
              
              <div class="grid gap-6 sm:grid-cols-2">
                <!-- Feature 1 -->
                <div class="space-y-2.5">
                  <div class="h-7 w-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    1
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Real-time GPA Calculations</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Calculates term GPA and cumulative CGPA dynamically using course units, weighted percentages, and standardized grade boundaries.
                  </p>
                </div>

                <!-- Feature 2 -->
                <div class="space-y-2.5">
                  <div class="h-7 w-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    2
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Dynamic Study Advising</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                    An algorithmic advice engine evaluates your academic records to suggest target weekly revision hours and failed course preparations.
                  </p>
                </div>

                <!-- Feature 3 -->
                <div class="space-y-2.5">
                  <div class="h-7 w-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    3
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Multi-Student Workspaces</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Create, toggle, and manage isolated profiles for different students to analyze separate transcripts and study progression trends.
                  </p>
                </div>

                <!-- Feature 4 -->
                <div class="space-y-2.5">
                  <div class="h-7 w-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    4
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Progression Chart Visuals</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                    SVG-powered charts map your historical GPA progression trends, grade distribution counts, and percentage marks per semester.
                  </p>
                </div>

                <!-- Feature 5 -->
                <div class="space-y-2.5">
                  <div class="h-7 w-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    5
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Custom Identity Avatars</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Upload and crop custom profile pictures converted to Base64 data strings stored locally inside the profile session database.
                  </p>
                </div>

                <!-- Feature 6 -->
                <div class="space-y-2.5">
                  <div class="h-7 w-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    6
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Global Hotkey Bindings</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Navigate the application rapidly using keyboard hotkeys like Alt+D for dashboard, Alt+S for students, and Alt+P for settings.
                  </p>
                </div>
              </div>
            </div>

            <!-- Right: PWA benefits checklist -->
            <div class="rounded-xl border border-slate-200/80 bg-slate-50 p-6 space-y-6">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200/60 pb-2">PWA Native Integration Benefits</h3>
              
              <div class="space-y-4">
                <div class="flex gap-3">
                  <div class="h-5 w-5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">Offline Autonomous Sandbox</h4>
                    <p class="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium">
                      Never depend on network access. All assets and databases are cached in the browser Service Worker to work perfectly even in full offline environments.
                    </p>
                  </div>
                </div>

                <div class="flex gap-3">
                  <div class="h-5 w-5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">Standalone App Viewport</h4>
                    <p class="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium">
                      Launches in a dedicated app window without browser URL bars or tabs, delivering a clean desktop/mobile app feel.
                    </p>
                  </div>
                </div>

                <div class="flex gap-3">
                  <div class="h-5 w-5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">Zero Server Latency</h4>
                    <p class="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium">
                      Calculations and record updates commit immediately to local sandbox tables. Experience loading speeds of under 50ms without server delays.
                    </p>
                  </div>
                </div>

                <div class="flex gap-3">
                  <div class="h-5 w-5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">100% Data Confidentiality</h4>
                    <p class="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium">
                      No cloud storage, trackers, or databases are used. Your data is stored strictly on your local browser sandboxed storage.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Install Callout -->
              <div v-if="isInstallable" class="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4 text-xs font-semibold text-slate-800 space-y-3">
                <p class="leading-relaxed">This device is compatible! Install the Student Portal app directly to your home screen now.</p>
                <button 
                  @click="installApp" 
                  class="btn-primary py-1.5 px-3.5 text-[10px]"
                >
                  Install App Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Toggleable FAQ Accordion Section -->
      <section id="faq" class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="text-center space-y-2.5 pb-10">
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">Frequently Asked Questions</h2>
          <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Need Help?</p>
        </div>

        <div class="space-y-4">
          <div 
            v-for="(item, index) in faqItems" 
            :key="index" 
            class="rounded-xl border border-slate-200/80 bg-white overflow-hidden transition"
          >
            <button 
              @click="toggleFaq(index)" 
              class="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50/50"
            >
              <span>{{ item.question }}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180 text-indigo-600': activeFaq === index }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              v-show="activeFaq === index" 
              class="px-5 pb-4 text-xs leading-relaxed text-slate-500 font-medium border-t border-slate-100 pt-3.5 bg-slate-50/40"
            >
              {{ item.answer }}
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
        <div class="flex items-center gap-2">
          <div class="h-5 w-5 rounded bg-indigo-600 flex items-center justify-center font-extrabold text-white text-[9px]">
            SP
          </div>
          <span class="font-bold text-slate-700 text-xs">Student Portal</span>
        </div>
        <p>&copy; 2026 Student Performance Portal. All rights reserved.</p>
      </div>
    </footer>

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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false
})

const { token, logout } = useAuth()
const deferredPrompt = useState<any>('pwa-deferred-prompt')
const isInstallable = useState<boolean>('pwa-is-installable')

const installApp = async () => {
  const promptEvent = deferredPrompt.value
  if (!promptEvent) return
  
  promptEvent.prompt()
  const { outcome } = await promptEvent.userChoice
  console.log(`User response to PWA install: ${outcome}`)
  
  deferredPrompt.value = null
  isInstallable.value = false
}

// Context Menu State
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
    installApp()
  } else if (action === 'reload') {
    window.location.reload()
  } else if (action === 'logout') {
    logout()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('contextmenu', handleContextMenu)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('contextmenu', handleContextMenu)
  }
})

const activeFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  if (activeFaq.value === index) {
    activeFaq.value = null
  } else {
    activeFaq.value = index
  }
}

const faqItems = [
  {
    question: "Is my academic data sent to any backend servers?",
    answer: "No. All transcript records, registered user accounts, avatars, and settings data are stored locally in your browser using localStorage. Your data does not leave your machine."
  },
  {
    question: "How do I populate sample data for demo purposes?",
    answer: "After creating your account and logging in, navigate to System Settings (available in the side navigation panel) and select 'Load Demo Sample Records'. This will seed the database with demo entries instantly."
  },
  {
    question: "Can I use this portal on my mobile phone?",
    answer: "Yes, this application is a compliant Progressive Web App (PWA). You can select 'Add to Home Screen' from Chrome, Safari, or edge browser to load the app with offline navigation support and standalone viewport layouts."
  },
  {
    question: "How do I wipe all local storage data?",
    answer: "Go to System Settings and click the 'Clear Local Database Data' button. This will wipe out all user credentials, academic transcript grades, custom avatars, and log you out immediately."
  }
]
</script>
