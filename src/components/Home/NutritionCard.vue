<script setup lang="ts">
export interface NutritionItem {
  name: string
  current: number
  target: number
}

defineProps<{
  items: NutritionItem[]
}>()

type BarColor = { standard: string; light: string }

const nutrientColors: Record<string, BarColor> = {
  탄수화물: { standard: '#4DA1FA', light: '#D6E8FF' },
  단백질: { standard: '#9F7AEA', light: '#E9D8FD' },
  지방: { standard: '#F6AD55', light: '#FEEBC8' },
}

function getBarColor(item: NutritionItem) {
  const ratio = item.target === 0 ? 0 : item.current / item.target
  if (ratio > 1.15) return '#EF4444'

  const color = nutrientColors[item.name] ?? {
    standard: 'var(--main-300)',
    light: 'var(--gray-200)',
  }
  if (ratio < 0.85) return color.light
  return color.standard
}

function getBarWidth(item: NutritionItem) {
  const ratio = item.target === 0 ? 0 : item.current / item.target
  return `${Math.min(ratio * 100, 100)}%`
}
</script>

<template>
  <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
    <h3 class="mb-5 text-[16px] font-bold text-[var(--gray-900)]">영양소</h3>
    <div class="space-y-6">
      <div v-for="nut in items" :key="nut.name">
        <div class="mb-2 flex justify-between text-[13px]">
          <span class="font-medium text-[var(--gray-600)]">{{ nut.name }}</span>
          <span class="text-[var(--gray-500)]">
            <b class="text-[var(--gray-900)]">{{ nut.current }}</b> / {{ nut.target }}g
          </span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-[var(--gray-100)]">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: getBarWidth(nut), backgroundColor: getBarColor(nut) }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
