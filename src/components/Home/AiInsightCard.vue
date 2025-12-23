<script setup lang="ts">
import { Bot } from 'lucide-vue-next'

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
        <Bot class="h-4 w-4 text-white" />
      </div>
      <div>
        <p class="mb-1 text-[14px] font-bold text-[var(--gray-900)]">식단 추천 AI</p>
        <p class="text-[13px] text-[var(--gray-700)]">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>
