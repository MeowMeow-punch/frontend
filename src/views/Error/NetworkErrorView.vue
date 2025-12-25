<script setup lang="ts">
import { WifiOff, RotateCcw } from 'lucide-vue-next'
import ErrorLayout from '@/components/Layout/ErrorLayout.vue'

const handleRetry = () => {
  window.location.reload()
}
</script>

<template>
  <ErrorLayout
    title="인터넷 연결을 확인해주세요"
    description="네트워크 상태가 불안정하여 페이지를 불러올 수 없어요.&#10;연결 상태를 확인 후 다시 시도해 주세요."
    :icon="WifiOff"
  >
    <template #actions>
      <button
        @click="handleRetry"
        class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--main-500)] text-[17px] font-semibold text-white transition hover:bg-[var(--main-600)] active:scale-95"
      >
        <RotateCcw class="h-5 w-5" />
        <span>다시 시도하기</span>
      </button>
    </template>
  </ErrorLayout>
</template>
