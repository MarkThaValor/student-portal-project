<template>
  <Transition name="modal-fade">
    <div 
      v-if="show" 
      class="fixed inset-0 z-[999999] bg-slate-950/45 backdrop-blur-[4px] flex items-center justify-center p-4"
      @click.self="$emit('cancel')"
    >
      <div 
        class="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header status indicators -->
        <div class="px-5 pt-5 flex items-start gap-3.5">
          <!-- Icon indicator -->
          <div 
            :class="[
              'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border',
              type === 'danger' ? 'bg-rose-50 border-rose-100 text-rose-600' :
              type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-600' :
              'bg-indigo-50 border-indigo-100 text-indigo-600'
            ]"
          >
            <!-- Danger Icon -->
            <svg v-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <!-- Warning Icon -->
            <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <!-- Info Icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div class="space-y-1">
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider leading-tight">{{ title }}</h3>
            <p class="text-[11px] text-slate-500 font-semibold leading-relaxed">{{ message }}</p>
          </div>
        </div>

        <!-- Footer Actions buttons -->
        <div class="bg-slate-50 px-5 py-3.5 mt-5 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button 
            @click="$emit('cancel')"
            class="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-sm"
          >
            {{ cancelText }}
          </button>
          
          <button 
            @click="$emit('confirm')"
            :class="[
              'rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white transition active:scale-95 shadow-sm',
              type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' :
              type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
              'bg-indigo-600 hover:bg-indigo-700'
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'info' | 'warning' | 'danger'
  }>(),
  {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info'
  }
)

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
