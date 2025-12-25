<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modalStore'
import { AlertCircle, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-vue-next'
import { onUnmounted, watch } from 'vue'

const store = useModalStore()
const { isVisible, options } = storeToRefs(store)

const handleConfirm = () => {
  store.confirmAction()
}

const handleCancel = () => {
  store.cancelAction()
}

// 모달이 열려있을 때 스크롤 방지
watch(isVisible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      @click.self="options.type === 'confirm' ? null : handleConfirm()"
    >
      <div
        class="modal-content w-full max-w-[340px] scale-100 transform overflow-hidden rounded-[24px] bg-white p-6 shadow-2xl transition-all"
      >
        <!-- Icon (Optional based on type) -->
        <div
          v-if="options.type !== 'alert' && options.type !== 'confirm'"
          class="mb-4 flex justify-center"
        >
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full"
            :class="{
              'bg-blue-50 text-blue-500': options.type === 'info',
              'bg-green-50 text-green-500': options.type === 'success',
              'bg-red-50 text-red-500': options.type === 'error',
              'bg-orange-50 text-orange-500': options.type === 'warning',
            }"
          >
            <CheckCircle2 v-if="options.type === 'success'" class="h-8 w-8" stroke-width="2.5" />
            <AlertCircle v-else-if="options.type === 'error'" class="h-8 w-8" stroke-width="2.5" />
            <AlertTriangle
              v-else-if="options.type === 'warning'"
              class="h-8 w-8"
              stroke-width="2.5"
            />
            <HelpCircle v-else class="h-8 w-8" stroke-width="2.5" />
          </div>
        </div>

        <!-- Text Content -->
        <div class="text-center">
          <h3 class="mb-2 text-[20px] font-bold leading-snug text-gray-900">
            {{ options.title }}
          </h3>
          <p class="mb-8 whitespace-pre-line text-[16px] leading-relaxed text-gray-600">
            {{ options.content }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button
            v-if="options.type === 'confirm' || options.cancelText"
            @click="handleCancel"
            class="h-[52px] flex-1 rounded-xl bg-gray-100 text-[16px] font-semibold text-gray-700 transition hover:bg-gray-200 active:scale-95"
          >
            {{ options.cancelText || '취소' }}
          </button>

          <button
            @click="handleConfirm"
            class="h-[52px] flex-1 rounded-xl text-[16px] font-semibold text-white transition active:scale-95"
            :class="{
              'bg-[var(--main-500)] hover:bg-[var(--main-600)]': options.type !== 'error',
              'bg-red-500 hover:bg-red-600': options.type === 'error',
            }"
          >
            {{ options.confirmText || '확인' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content {
  animation: modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-fade-leave-active .modal-content {
  animation: modal-pop 0.2s reverse ease-in;
}

@keyframes modal-pop {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
