<script setup lang="ts">
import { useRouter } from 'vue-router'
import { TriangleAlert, ArrowLeft, Home } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-[var(--gray-50)] px-6 text-center"
  >
    <!-- Icon Area (Updated) -->
    <div class="mb-6 flex items-center justify-center">
      <TriangleAlert class="h-24 w-24 text-[var(--gray-300)]" :stroke-width="1.5" />
    </div>

    <!-- Text Area -->
    <h1 class="mb-2 text-2xl font-bold text-[var(--gray-900)]">페이지를 찾을 수 없어요</h1>
    <p class="mb-10 text-[17px] leading-relaxed text-[var(--gray-600)]">
      주소가 올바르지 않거나 알 수 없는 오류로<br />
      페이지가 변경 혹은 삭제되었을 수 있어요.
    </p>

    <!-- Action Buttons -->
    <div class="flex w-full max-w-xs flex-col gap-3">
      <button
        @click="router.back()"
        class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--gray-900)] text-[17px] font-semibold text-white transition hover:bg-[var(--gray-800)] active:scale-95"
      >
        <ArrowLeft class="h-5 w-5" />
        <span>이전 화면으로</span>
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

<style scoped>
/* Mobile optimized spacing if needed */
@media (max-height: 700px) {
  .min-h-screen {
    padding-bottom: 80px;
  }
}
</style>
