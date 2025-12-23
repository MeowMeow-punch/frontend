<script setup lang="ts">
defineProps<{
  calorie: string
  achievement: string
  streak: string
}>()
</script>

<template>
  <div class="rounded-2xl border border-[var(--gray-200)] bg-[#F9FAFB] p-6">
    <div class="mb-4">
      <h3 class="text-[14px] font-medium text-[var(--gray-500)]">이번 주 평균</h3>
      <p class="mt-1 text-[12px] text-[var(--gray-400)]">월요일~일요일 기준</p>
    </div>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-[14px] text-[var(--gray-700)]">칼로리</span>
        <span class="text-[16px] font-bold text-[var(--gray-900)]">{{ calorie }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-[14px] text-[var(--gray-700)]">달성률</span>
        <span class="text-[16px] font-bold text-[var(--main-300)]">{{ achievement }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-[14px] text-[var(--gray-700)]">연속일</span>
        <span class="text-[16px] font-bold text-[var(--gray-900)]">{{ streak }}</span>
      </div>
    </div>
  </div>
</template>
