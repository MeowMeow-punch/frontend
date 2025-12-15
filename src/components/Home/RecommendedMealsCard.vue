<script setup lang="ts">
export interface RecommendedFood {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  category: string
  image: string
  quantity: number
}

export interface RecommendedMeal {
  id: number
  name: string
  time: string
  timeLabel: string
  calories: number
  protein: number
  foods: RecommendedFood[]
}

const props = defineProps<{
  meals: RecommendedMeal[]
}>()

const emit = defineEmits<{
  (e: 'select', meal: RecommendedMeal): void
}>()
</script>

<template>
  <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
    <div class="mb-5">
      <h2 class="text-[17px] font-bold text-[var(--gray-900)]">오늘의 추천 식단</h2>
    </div>

    <div class="space-y-4">
      <div
        v-for="meal in meals"
        :key="meal.id"
        class="flex cursor-pointer items-center gap-4"
        @click="emit('select', meal)"
      >
        <div
          class="grid h-20 w-20 shrink-0 grid-cols-2 gap-px overflow-hidden rounded-xl bg-[var(--gray-200)]"
        >
          <div
            v-for="(food, i) in meal.foods.slice(0, 4)"
            :key="`${meal.id}-${food.id}-${i}`"
            :class="meal.foods.length === 1 ? 'col-span-2 row-span-2' : ''"
            class="relative h-full w-full"
          >
            <img
              :src="food.image"
              :alt="food.name"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div class="min-w-0 flex-1 py-1">
          <div class="mb-1 flex items-center gap-2">
            <span class="rounded-md bg-[#E5F9EB] px-2 py-0.5 text-[11px] font-bold text-[#00C73C]">
              {{ meal.timeLabel }}
            </span>
            <span class="text-[12px] text-[var(--gray-500)]"> {{ meal.calories }} kcal </span>
          </div>

          <h3 class="mb-1 truncate text-[15px] font-semibold text-[var(--gray-900)]">
            {{ meal.name }}
          </h3>

          <p class="truncate text-[13px] text-[var(--gray-500)]">
            {{ meal.foods.map((f) => f.name).join(', ') }}
          </p>
        </div>

        <button
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--gray-200)] bg-[var(--gray-50)] text-[var(--gray-400)] transition-colors hover:bg-[var(--gray-100)] hover:text-[var(--gray-600)]"
          type="button"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>
