<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ServerCrash, RotateCcw, Home } from 'lucide-vue-next'
import ErrorLayout from '@/components/Layout/ErrorLayout.vue'

const router = useRouter()

const handleRetry = () => {
  window.location.reload()
}
</script>

<template>
  <ErrorLayout
    title="일시적인 오류가 발생했어요"
    description="서버와의 연결이 불안정하거나 문제가 생겼어요.&#10;잠시 후 다시 시도해 주세요."
    :icon="ServerCrash"
  >
    <template #actions>
      <button
        @click="handleRetry"
        class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--main-500)] text-[17px] font-semibold text-white transition hover:bg-[var(--main-600)] active:scale-95"
      >
        <RotateCcw class="h-5 w-5" />
        <span>다시 시도하기</span>
      </button>

      <button
        @click="router.push('/')"
        class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--gray-200)] text-[17px] font-semibold text-[var(--gray-700)] transition hover:bg-[var(--gray-300)] active:scale-95"
      >
        <Home class="h-5 w-5" />
        <span>메인으로 가기</span>
      </button>
    </template>
  </ErrorLayout>
</template>
