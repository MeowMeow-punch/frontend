<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{
  nickname: string
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

let timerId: number | undefined

onMounted(() => {
  timerId = window.setTimeout(() => emit('complete'), 2000)
})

onBeforeUnmount(() => {
  if (timerId) {
    clearTimeout(timerId)
  }
})
</script>

<template>
  <div class="space-y-10 py-20 text-center">
    <div>
      <div class="mb-10 text-7xl">🎉</div>
      <h1
        class="mb-4 text-[32px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        환영합니다,<br />{{ props.nickname }}님!
      </h1>
      <p class="text-[16px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        <span style="font-weight: 700">픽<span style="color: #00c73c">잇</span></span
        >과 함께<br />
        건강한 식단 관리를 시작해보세요
      </p>
    </div>

    <div class="mt-8 flex justify-center gap-1.5">
      <div class="h-2 w-2 animate-bounce rounded-full" style="background-color: #00c73c" />
      <div
        class="h-2 w-2 animate-bounce rounded-full"
        style="background-color: #00c73c; animation-delay: 150ms"
      />
      <div
        class="h-2 w-2 animate-bounce rounded-full"
        style="background-color: #00c73c; animation-delay: 300ms"
      />
    </div>
  </div>
</template>
