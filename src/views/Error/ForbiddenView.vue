<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-vue-next'
import ErrorLayout from '@/components/Layout/ErrorLayout.vue'

const router = useRouter()
</script>

<template>
  <ErrorLayout
    title="접근할 수 없는 페이지예요"
    description="이 페이지를 볼 수 있는 권한이 없거나&#10;비공개된 페이지입니다."
    :icon="ShieldAlert"
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
