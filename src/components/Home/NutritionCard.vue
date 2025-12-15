<script setup lang="ts">
export interface NutritionItem {
  name: string
  current: number
  target: number
}

defineProps<{
  items: NutritionItem[]
}>()
</script>

<template>
  <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
    <h3 class="mb-5 text-[16px] font-bold text-[var(--gray-900)]">영양소</h3>
    <div class="space-y-6">
      <div v-for="(nut, i) in items" :key="nut.name">
        <div class="mb-2 flex justify-between text-[13px]">
          <span class="font-medium text-[var(--gray-600)]">{{ nut.name }}</span>
          <span class="text-[var(--gray-500)]">
            <b class="text-[var(--gray-900)]">{{ nut.current }}</b> / {{ nut.target }}g
          </span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-[var(--gray-100)]">
          <div
            :class="[
              'h-full rounded-full',
              i === 0
                ? 'bg-[var(--main-300)]'
                : i === 1
                  ? 'bg-[var(--gray-500)]'
                  : 'bg-[var(--error-300)]',
            ]"
            :style="{ width: `${(nut.current / nut.target) * 100}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
