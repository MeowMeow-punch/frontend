<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="rounded-2xl bg-[var(--gray-50)] p-5">
    <div class="flex items-start gap-3">
      <div
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--gray-900)]"
      >
        <span class="text-sm text-white">AI</span>
      </div>
      <div>
        <p class="mb-1 text-[14px] font-bold text-[var(--gray-900)]">AI 분석</p>
        <p class="text-[13px] text-[var(--gray-700)]">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>
