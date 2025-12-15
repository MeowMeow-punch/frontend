<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalCalories: number
  targetCalories: number
}>()

const caloriePercentage = computed(() =>
  Math.min(100, Math.round((props.totalCalories / props.targetCalories) * 100)),
)
</script>

<template>
  <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <p class="mb-1 text-[13px] font-medium text-[var(--gray-600)]">오늘의 칼로리</p>
        <p class="text-[28px] font-bold text-[var(--gray-900)]">
          {{ totalCalories.toLocaleString() }}
          <span class="ml-1 text-[16px] font-normal text-[var(--gray-500)]">
            / {{ targetCalories.toLocaleString() }}kcal
          </span>
        </p>
      </div>
      <div class="text-right">
        <p class="mb-1 text-[13px] font-medium text-[var(--gray-600)]">달성률</p>
        <p class="text-[22px] font-bold text-[var(--gray-900)]">{{ caloriePercentage }}%</p>
      </div>
    </div>
    <div class="h-2 overflow-hidden rounded-full bg-[var(--gray-200)]">
      <div class="h-full rounded-full bg-[#00C73C]" :style="{ width: `${caloriePercentage}%` }" />
    </div>
  </div>
</template>
