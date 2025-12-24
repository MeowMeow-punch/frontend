<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ServerCrash, RotateCcw, Home } from 'lucide-vue-next'

const router = useRouter()

const handleRetry = () => {
  window.location.reload()
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-[var(--gray-50)] px-6 text-center"
  >
    <!-- Icon Area (Updated) -->
    <div class="mb-6 flex items-center justify-center">
      <ServerCrash class="h-24 w-24 text-[var(--gray-300)]" :stroke-width="1.5" />
    </div>

    <!-- Text Area -->
    <h1 class="mb-2 text-2xl font-bold text-[var(--gray-900)]">일시적인 오류가 발생했어요</h1>
    <p class="mb-10 text-[17px] leading-relaxed text-[var(--gray-600)]">
      서버와의 연결이 불안정하거나 문제가 생겼어요.<br />
      잠시 후 다시 시도해 주세요.
    </p>

    <!-- Action Buttons -->
    <div class="flex w-full max-w-xs flex-col gap-3">
      <button
        @click="handleRetry"
        class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--main-500)] text-[17px] font-semibold text-white transition hover:bg-[var(--main-600)] active:scale-95"
      >
        <RotateCcw class="h-5 w-5" />
        <span>다시 시도하기</span>
      </button>

      <button
        @click="router.push('/home')"
        class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--gray-200)] text-[17px] font-semibold text-[var(--gray-700)] transition hover:bg-[var(--gray-300)] active:scale-95"
      >
        <Home class="h-5 w-5" />
        <span>홈으로 가기</span>
      </button>
    </div>
  </div>
</template>
