<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentStep: number
    totalSteps: number
    stepTitle?: string
    stepDescription?: string
    showProgress?: boolean
  }>(),
  { showProgress: true },
)

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'logo'): void
}>()

const progress = computed(() => {
  if (!props.totalSteps) return 0
  return Math.min(100, Math.max(0, (props.currentStep / props.totalSteps) * 100))
})
</script>

<template>
  <div class="min-h-screen bg-white text-[var(--gray-900)]">
    <div v-if="showProgress" class="fixed left-0 right-0 top-0 z-10 bg-white">
      <div class="relative flex items-center justify-between px-5 py-4">
        <button
          type="button"
          @click="emit('back')"
          class="-ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-[var(--gray-900)] transition-all hover:bg-[var(--gray-50)] active:scale-95"
        >
          <span aria-hidden="true" class="text-2xl leading-none">‹</span>
          <span class="sr-only">뒤로가기</span>
        </button>

        <button
          type="button"
          @click="emit('logo')"
          class="absolute left-1/2 -translate-x-1/2 rounded-lg px-2 py-1 text-[var(--gray-900)] transition-all hover:bg-[var(--gray-50)] active:scale-95"
        >
          <span
            class="text-[22px] tracking-[-0.02em]"
            style="font-family: JalnanGothic; font-weight: normal"
          >
            픽<span style="color: #00c73c">잇</span>
          </span>
        </button>

        <div class="w-10" />
      </div>

      <div class="h-[2px] bg-[var(--gray-100)]">
        <div
          class="h-full transition-all duration-300"
          :style="{ width: `${progress}%`, backgroundColor: '#00C73C' }"
        />
      </div>
    </div>

    <div :class="showProgress ? 'pt-[82px]' : ''">
      <div class="mx-auto max-w-[480px] px-5 py-10">
        <slot />
      </div>
    </div>
  </div>
</template>
