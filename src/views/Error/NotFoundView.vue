<script setup lang="ts">
import { useRouter } from 'vue-router'
import { TriangleAlert, ArrowLeft, Home } from 'lucide-vue-next'
import ErrorLayout from '@/components/Layout/ErrorLayout.vue'

const router = useRouter()
</script>

<template>
  <ErrorLayout
    title="페이지를 찾을 수 없어요"
    description="주소가 올바르지 않거나 알 수 없는 오류로&#10;페이지가 변경 혹은 삭제되었을 수 있어요."
    :icon="TriangleAlert"
  >
    <template #actions>
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
    </template>
  </ErrorLayout>
</template>

<style scoped>
/* Mobile optimized spacing if needed */
@media (max-height: 700px) {
  .min-h-screen {
    padding-bottom: 80px;
  }
}
</style>
