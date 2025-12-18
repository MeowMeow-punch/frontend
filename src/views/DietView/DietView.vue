<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Flame,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  Utensils,
  X,
} from 'lucide-vue-next'
import ImageWithFallback from '@/components/Diet/ImageWithFallback.vue'
import WeekCalendar from '@/components/Diet/WeekCalendar.vue'
import { useDietStore } from '@/composables/useDietStore'
import { getMealLabel, getMealTime } from '@/utils/diet/dietUtils'
import type { MealData } from '@/types/diet'

const router = useRouter()
const { selectedDate, mealsForSelectedDate, deleteMeal, getMealById } = useDietStore()

const selectedMealId = ref<number | null>(null)
const showNutrientDetail = ref(false)
const activeCafeteriaTab = ref<'breakfast' | 'lunch' | 'dinner' | 'night'>('lunch')

const selectedMeal = computed(() =>
  selectedMealId.value ? getMealById(selectedMealId.value) : null,
)

const totalCalories = computed(() =>
  mealsForSelectedDate.value.reduce((sum, meal) => sum + meal.nutrition.calories, 0),
)
const targetCalories = 2400
const caloriePercentage = computed(() => (totalCalories.value / targetCalories) * 100)
const calorieBarWidth = computed(() => `${Math.min(100, caloriePercentage.value)}%`)

const macroNutrients = computed(() => {
  const totals = mealsForSelectedDate.value.reduce(
    (acc, meal) => ({
      carbs: acc.carbs + meal.nutrition.carbs,
      protein: acc.protein + meal.nutrition.protein,
      fat: acc.fat + meal.nutrition.fat,
    }),
    { carbs: 0, protein: 0, fat: 0 },
  )
  return {
    carbs: { current: totals.carbs, target: 140, unit: 'g' },
    protein: { current: totals.protein, target: 120, unit: 'g' },
    fat: { current: totals.fat, target: 70, unit: 'g' },
  }
})

const microNutrients = [
  { name: '비타민 A', current: 650, target: 700, unit: 'µg RAE' },
  { name: '나트륨', current: 2100, target: 2000, unit: 'mg', isWarning: true },
  { name: '비타민 C', current: 85, target: 100, unit: 'mg' },
  { name: '칼슘', current: 450, target: 700, unit: 'mg', isLow: true },
  { name: '비타민 D', current: 8, target: 10, unit: 'µg' },
  { name: '철분', current: 12, target: 14, unit: 'mg' },
  { name: '당류', current: 35, target: 50, unit: 'g' },
  { name: '식이섬유', current: 18, target: 25, unit: 'g' },
]

const cafeteriaMenus = {
  breakfast: {
    time: '07:20~09:00',
    menu: '소고기 미역국 & 쌀밥',
    sub: '계란후라이, 김치, 김',
    kcal: 450,
    exists: true,
  },
  lunch: {
    time: '11:30~13:30',
    main: {
      menu: '한우 사골 곰탕 & 깍두기',
      sub: '잡곡밥, 시금치나물, 연근조림',
      kcal: 750,
    },
    extraCount: 3,
    exists: true,
  },
  dinner: {
    time: '17:30~19:00',
    menu: '닭갈비 덮밥 & 콩나물국',
    sub: '백김치, 마카로니 샐러드',
    kcal: 820,
    exists: true,
  },
  night: {
    time: '20:00~22:00',
    menu: null,
    exists: false,
  },
} as const

function onSelectDate(date: Date) {
  selectedDate.value = date
}

function openMeal(meal: MealData) {
  selectedMealId.value = meal.id
}

function closeMeal() {
  selectedMealId.value = null
}

function goToRecord() {
  router.push('/diet/record')
}

function goToEdit(mealId: number) {
  closeMeal()
  router.push({ path: '/diet/record', query: { id: String(mealId) } })
}

function confirmDelete(mealId: number) {
  const ok = window.confirm('이 식단 기록을 삭제할까요?')
  if (!ok) return
  deleteMeal(mealId)
  closeMeal()
}
</script>

<template>
  <div class="min-h-screen bg-white font-sans">
    <div
      class="mx-auto max-w-6xl px-4 py-5 pb-16 md:px-8 md:py-8 md:pb-24 lg:px-12 lg:py-12 lg:pb-32"
    >
      <div class="mb-6">
        <WeekCalendar :selected-date="selectedDate" @select="onSelectDate" />
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div class="min-w-0 space-y-5 lg:space-y-6">
          <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p class="mb-1 text-[13px] font-medium text-[var(--gray-600)]">오늘의 영양소</p>
                <p
                  class="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--gray-900)]"
                >
                  {{ totalCalories.toLocaleString() }}
                  <span class="ml-1 text-[16px] font-normal tracking-normal text-[var(--gray-500)]">
                    / {{ targetCalories.toLocaleString() }}kcal
                  </span>
                </p>
              </div>
              <div class="text-right">
                <p class="mb-1 text-[13px] font-medium text-[var(--gray-600)]">달성률</p>
                <p class="text-[22px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">
                  {{ caloriePercentage.toFixed(0) }}%
                </p>
              </div>
            </div>

            <div class="mb-8 h-2 overflow-hidden rounded-full bg-[var(--gray-200)]">
              <div
                class="h-full rounded-full bg-[#00C73C] transition-all duration-300"
                :style="{ width: calorieBarWidth }"
              />
            </div>

            <div class="mb-2 grid grid-cols-3 gap-4">
              <div class="text-center">
                <p class="mb-1 text-[13px] text-[var(--gray-500)]">탄수화물</p>
                <p class="text-[18px] font-bold tracking-tight text-[var(--gray-900)]">
                  {{ macroNutrients.carbs.current
                  }}<span class="text-[14px] font-normal text-[var(--gray-500)]"
                    >/{{ macroNutrients.carbs.target }}g</span
                  >
                </p>
              </div>
              <div class="border-l border-[var(--gray-200)] text-center">
                <p class="mb-1 text-[13px] text-[var(--gray-500)]">단백질</p>
                <p class="text-[18px] font-bold tracking-tight text-[var(--gray-900)]">
                  {{ macroNutrients.protein.current
                  }}<span class="text-[14px] font-normal text-[var(--gray-500)]"
                    >/{{ macroNutrients.protein.target }}g</span
                  >
                </p>
              </div>
              <div class="border-l border-[var(--gray-200)] text-center">
                <p class="mb-1 text-[13px] text-[var(--gray-500)]">지방</p>
                <p class="text-[18px] font-bold tracking-tight text-[var(--gray-900)]">
                  {{ macroNutrients.fat.current
                  }}<span class="text-[14px] font-normal text-[var(--gray-500)]"
                    >/{{ macroNutrients.fat.target }}g</span
                  >
                </p>
              </div>
            </div>

            <button
              type="button"
              class="mt-6 flex h-10 w-full items-center justify-center gap-1 rounded-xl text-[14px] font-medium text-[var(--gray-600)] transition-all hover:bg-[var(--gray-50)] hover:text-[var(--gray-900)]"
              @click="showNutrientDetail = !showNutrientDetail"
            >
              영양소 더보기
              <ChevronUp v-if="showNutrientDetail" class="h-4 w-4" />
              <ChevronDown v-else class="h-4 w-4" />
            </button>

            <div v-if="showNutrientDetail" class="mt-3 border-t border-[var(--gray-100)] pt-3">
              <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div
                  v-for="item in microNutrients"
                  :key="item.name"
                  class="rounded-xl border border-[var(--gray-100)] bg-[var(--gray-50)] p-3"
                >
                  <div class="mb-1 flex items-start justify-between">
                    <span class="text-[12px] font-medium text-[var(--gray-500)]">{{
                      item.name
                    }}</span>
                    <AlertCircle v-if="item.isWarning" class="h-3.5 w-3.5 text-[#FF3B30]" />
                    <TrendingUp
                      v-else-if="item.isLow"
                      class="h-3.5 w-3.5 rotate-180 text-[#FF9500]"
                    />
                  </div>
                  <div class="flex items-baseline gap-0.5">
                    <span
                      class="text-[15px] font-bold tracking-tight"
                      :class="item.isWarning ? 'text-[#FF3B30]' : 'text-[var(--gray-900)]'"
                    >
                      {{ item.current.toLocaleString() }}
                    </span>
                    <span class="text-[11px] text-[var(--gray-500)]">
                      / {{ item.target.toLocaleString() }}{{ item.unit }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-[17px] font-bold tracking-[-0.01em] text-[var(--gray-900)]">
                오늘 먹은 음식
              </h2>
              <span
                class="rounded-lg bg-[var(--gray-50)] px-2.5 py-1 text-[13px] font-medium text-[var(--gray-500)]"
              >
                {{ mealsForSelectedDate.length }}끼 기록
              </span>
            </div>

            <div class="space-y-3">
              <div
                v-for="meal in mealsForSelectedDate"
                :key="meal.id"
                class="group flex cursor-pointer items-center gap-4 rounded-2xl border border-[var(--gray-200)] bg-white p-4 transition-all hover:border-[#00C73C] hover:shadow-sm active:scale-[0.99]"
                @click="openMeal(meal)"
              >
                <div
                  class="relative grid h-20 w-20 shrink-0 grid-cols-2 gap-px overflow-hidden rounded-xl bg-[var(--gray-100)]"
                >
                  <div
                    v-for="(food, idx) in meal.foods.slice(0, 4)"
                    :key="`${meal.id}-${food.id}-${idx}`"
                    class="relative h-full w-full"
                    :class="meal.foods.length === 1 ? 'col-span-2 row-span-2' : ''"
                  >
                    <ImageWithFallback
                      :src="food.image"
                      :alt="food.name"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    v-if="meal.foods.length > 1 && meal.foods.length < 4"
                    class="col-span-1 h-full w-full bg-[var(--gray-50)]"
                  />
                </div>

                <div class="min-w-0 flex-1 py-1">
                  <div class="mb-1.5 flex items-center gap-2">
                    <span
                      class="rounded bg-[#E5F9EB] px-2 py-0.5 text-[12px] font-semibold text-[#00C73C]"
                    >
                      {{ getMealLabel(meal.time) }}
                    </span>
                    <span class="text-[12px] text-[var(--gray-500)]">{{
                      getMealTime(meal.time)
                    }}</span>
                  </div>
                  <h3
                    class="mb-1.5 truncate text-[16px] font-bold tracking-tight text-[var(--gray-900)] transition-colors group-hover:text-[#00C73C]"
                  >
                    {{ meal.foods.map((f) => f.name).join(', ') }}
                  </h3>
                  <div class="flex items-center gap-3 text-[13px] text-[var(--gray-500)]">
                    <span class="font-medium text-[var(--gray-700)]"
                      >{{ meal.nutrition.calories }} kcal</span
                    >
                    <span class="h-3 w-0.5 bg-[var(--gray-300)]" />
                    <span class="truncate"
                      >탄 {{ meal.nutrition.carbs }} · 단 {{ meal.nutrition.protein }} · 지
                      {{ meal.nutrition.fat }}</span
                    >
                  </div>
                </div>

                <ChevronRight
                  class="h-5 w-5 text-[var(--gray-300)] transition-colors group-hover:text-[#00C73C]"
                />
              </div>

              <div
                v-if="mealsForSelectedDate.length === 0"
                class="rounded-2xl border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] py-16 text-center"
              >
                <div
                  class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gray-100)]"
                >
                  <CheckCircle2 class="h-6 w-6 text-[var(--gray-400)]" />
                </div>
                <p class="mb-1 text-[15px] font-medium text-[var(--gray-600)]">
                  아직 기록된 식단이 없습니다
                </p>
                <p class="text-[13px] text-[var(--gray-400)]">오늘 첫 끼니를 기록해보세요!</p>
              </div>
            </div>
          </div>
        </div>

        <div class="min-w-0 space-y-5 lg:space-y-6">
          <button
            type="button"
            class="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#00C73C] text-[16px] font-bold text-white shadow-md shadow-[#00C73C]/20 transition-all hover:bg-[#00B035] active:scale-[0.98]"
            @click="goToRecord"
          >
            <Plus class="h-5 w-5" />
            식단 기록하기
          </button>

          <div
            class="relative overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-[#F9FAFB] p-6"
          >
            <div
              class="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#00C73C]/5"
            />
            <div class="relative z-10 mb-4 flex items-center gap-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gray-900)] shadow-md shadow-black/10"
              >
                <Bot class="h-5 w-5 text-white" />
              </div>
              <h3 class="text-[16px] font-bold tracking-tight text-[var(--gray-900)]">
                오늘의 영양 분석 리포트
              </h3>
            </div>
            <div class="relative z-10 space-y-3">
              <div class="rounded-xl border border-[var(--gray-100)] bg-white p-3 shadow-sm">
                <p class="text-[14px] leading-relaxed text-[var(--gray-800)]">
                  <span class="font-bold text-[#00C73C]">나트륨 섭취</span>가 평소보다 높아요
                </p>
                <p class="mt-1 text-[13px] text-[var(--gray-500)]">
                  국물 요리 섭취를 조금 줄여보세요.
                </p>
              </div>
              <div class="rounded-xl border border-[var(--gray-100)] bg-white p-3 shadow-sm">
                <p class="text-[14px] leading-relaxed text-[var(--gray-800)]">
                  단백질은 <span class="font-bold text-[#00C73C]">목표량의 87%</span>를 채웠어요!
                </p>
                <p class="mt-1 text-[13px] text-[var(--gray-500)]">
                  저녁에 계란이나 두부를 곁들이면 완벽해요.
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
            <div class="mb-5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Utensils class="h-5 w-5 text-[var(--main-300)]" />
                <h2 class="text-[17px] font-bold tracking-tight text-[var(--gray-900)]">
                  오늘의 사내 식단
                </h2>
              </div>
            </div>

            <div class="mb-4 grid grid-cols-4 gap-1 rounded-xl bg-[var(--gray-50)] p-1">
              <button
                type="button"
                class="rounded-lg py-2 text-[13px] transition-all"
                :class="
                  activeCafeteriaTab === 'breakfast'
                    ? 'bg-white text-[#00C73C] shadow-sm'
                    : 'text-[var(--gray-600)] hover:bg-white/60'
                "
                @click="activeCafeteriaTab = 'breakfast'"
              >
                아침
              </button>
              <button
                type="button"
                class="rounded-lg py-2 text-[13px] transition-all"
                :class="
                  activeCafeteriaTab === 'lunch'
                    ? 'bg-white text-[#00C73C] shadow-sm'
                    : 'text-[var(--gray-600)] hover:bg-white/60'
                "
                @click="activeCafeteriaTab = 'lunch'"
              >
                점심
              </button>
              <button
                type="button"
                class="rounded-lg py-2 text-[13px] transition-all"
                :class="
                  activeCafeteriaTab === 'dinner'
                    ? 'bg-white text-[#00C73C] shadow-sm'
                    : 'text-[var(--gray-600)] hover:bg-white/60'
                "
                @click="activeCafeteriaTab = 'dinner'"
              >
                저녁
              </button>
              <button
                type="button"
                class="rounded-lg py-2 text-[13px] transition-all"
                :class="
                  activeCafeteriaTab === 'night'
                    ? 'bg-white text-[#00C73C] shadow-sm'
                    : 'text-[var(--gray-600)] hover:bg-white/60'
                "
                @click="activeCafeteriaTab = 'night'"
              >
                야식
              </button>
            </div>

            <div v-if="activeCafeteriaTab === 'breakfast'">
              <div v-if="cafeteriaMenus.breakfast.exists" class="space-y-3">
                <div class="rounded-xl border border-[var(--gray-100)] bg-[var(--gray-50)] p-4">
                  <div class="mb-2 flex items-start justify-between">
                    <span class="text-[12px] text-[var(--gray-500)]">{{
                      cafeteriaMenus.breakfast.time
                    }}</span>
                    <span class="text-[12px] font-medium text-[var(--gray-900)]"
                      >{{ cafeteriaMenus.breakfast.kcal }} kcal</span
                    >
                  </div>
                  <h3 class="mb-1 text-[16px] font-bold tracking-tight text-[var(--gray-900)]">
                    {{ cafeteriaMenus.breakfast.menu }}
                  </h3>
                  <p class="line-clamp-1 text-[13px] text-[var(--gray-600)]">
                    {{ cafeteriaMenus.breakfast.sub }}
                  </p>
                </div>
              </div>
              <div v-else class="py-8 text-center text-sm text-[var(--gray-500)]">
                운영하지 않습니다.
              </div>
            </div>

            <div v-else-if="activeCafeteriaTab === 'lunch'">
              <div v-if="cafeteriaMenus.lunch.exists" class="space-y-3">
                <div class="rounded-xl border border-[var(--gray-100)] bg-[var(--gray-50)] p-4">
                  <div class="mb-2 flex items-start justify-between">
                    <span class="text-[12px] text-[var(--gray-500)]">{{
                      cafeteriaMenus.lunch.time
                    }}</span>
                    <span class="text-[12px] font-medium text-[var(--gray-900)]"
                      >{{ cafeteriaMenus.lunch.main.kcal }} kcal</span
                    >
                  </div>
                  <h3 class="mb-1 text-[16px] font-bold tracking-tight text-[var(--gray-900)]">
                    {{ cafeteriaMenus.lunch.main.menu }}
                  </h3>
                  <p class="line-clamp-1 text-[13px] text-[var(--gray-600)]">
                    {{ cafeteriaMenus.lunch.main.sub }}
                  </p>
                  <div
                    v-if="cafeteriaMenus.lunch.extraCount > 0"
                    class="mt-3 flex items-center justify-center border-t border-[var(--gray-200)] pt-3"
                  >
                    <span class="text-[13px] font-medium text-[var(--gray-500)]">
                      + {{ cafeteriaMenus.lunch.extraCount }}개의 메뉴가 더 있어요
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="py-8 text-center text-sm text-[var(--gray-500)]">
                운영하지 않습니다.
              </div>
            </div>

            <div v-else-if="activeCafeteriaTab === 'dinner'">
              <div v-if="cafeteriaMenus.dinner.exists" class="space-y-3">
                <div class="rounded-xl border border-[var(--gray-100)] bg-[var(--gray-50)] p-4">
                  <div class="mb-2 flex items-start justify-between">
                    <span class="text-[12px] text-[var(--gray-500)]">{{
                      cafeteriaMenus.dinner.time
                    }}</span>
                    <span class="text-[12px] font-medium text-[var(--gray-900)]"
                      >{{ cafeteriaMenus.dinner.kcal }} kcal</span
                    >
                  </div>
                  <h3 class="mb-1 text-[16px] font-bold tracking-tight text-[var(--gray-900)]">
                    {{ cafeteriaMenus.dinner.menu }}
                  </h3>
                  <p class="line-clamp-1 text-[13px] text-[var(--gray-600)]">
                    {{ cafeteriaMenus.dinner.sub }}
                  </p>
                </div>
              </div>
              <div v-else class="py-8 text-center text-sm text-[var(--gray-500)]">
                운영하지 않습니다.
              </div>
            </div>

            <div v-else>
              <div
                v-if="cafeteriaMenus.night.exists"
                class="rounded-xl border border-[var(--gray-100)] bg-[var(--gray-50)] p-4"
              >
                <p class="text-[13px] text-[var(--gray-500)]">운영 중</p>
              </div>
              <div
                v-else
                class="rounded-xl border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] py-8 text-center"
              >
                <p class="text-[13px] text-[var(--gray-500)]">오늘은 운영하지 않습니다</p>
              </div>
            </div>

            <button
              type="button"
              class="mt-4 flex h-10 w-full items-center justify-center text-[13px] text-[var(--gray-600)] transition-colors hover:bg-[var(--gray-50)] hover:text-[#00C73C]"
              @click="router.push('/diet/cafeteria')"
            >
              전체 메뉴 보기 <ChevronRight class="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="diet-fade">
        <div v-if="selectedMeal" class="fixed inset-0 z-50 bg-black/40" @click.self="closeMeal">
          <div class="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-6">
            <div
              class="w-full max-w-[480px] overflow-hidden rounded-t-[32px] bg-white shadow-xl md:rounded-[32px]"
            >
              <div class="flex items-center justify-between px-6 py-4">
                <div class="text-[15px] font-bold text-[var(--gray-900)]">식단 상세</div>
                <button
                  type="button"
                  class="flex h-9 w-9 items-center justify-center rounded-full text-[var(--gray-500)] hover:bg-[var(--gray-100)]"
                  @click="closeMeal"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>

              <div class="max-h-[85vh] overflow-y-auto px-6 pb-6">
                <div class="space-y-6 px-1">
                  <div
                    class="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-[var(--gray-100)] shadow-sm"
                  >
                    <div class="grid h-full grid-cols-2 gap-0.5">
                      <div
                        v-for="(food, i) in selectedMeal.foods.slice(0, 4)"
                        :key="`${selectedMeal.id}-${food.id}-${i}`"
                        class="relative h-full"
                        :class="selectedMeal.foods.length === 1 ? 'col-span-2 row-span-2' : ''"
                      >
                        <ImageWithFallback
                          :src="food.image"
                          :alt="food.name"
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        v-for="i in Math.max(0, 4 - selectedMeal.foods.length)"
                        :key="`empty-${selectedMeal.id}-${i}`"
                        class="bg-[var(--gray-50)]"
                      />
                    </div>
                    <div class="absolute left-4 top-4">
                      <span
                        class="rounded-full bg-white/90 px-3 py-1.5 text-[14px] font-bold text-[#00C73C] shadow-sm backdrop-blur-md"
                      >
                        {{ getMealLabel(selectedMeal.time) }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div class="mb-2 flex items-center justify-between">
                      <span
                        class="flex items-center gap-1.5 text-[15px] font-medium text-[var(--gray-500)]"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-[var(--gray-300)]" />
                        {{ getMealTime(selectedMeal.time) }}
                      </span>
                    </div>
                    <h2
                      class="mb-1 text-[24px] font-bold leading-tight tracking-[-0.01em] text-[var(--gray-900)]"
                    >
                      {{ selectedMeal.foods.map((f) => f.name).join(', ') }}
                    </h2>
                    <p class="mb-6 text-[15px] text-[var(--gray-500)]">
                      총 {{ selectedMeal.foods.length }}개 음식
                    </p>

                    <div class="mb-4 grid grid-cols-2 gap-3">
                      <div
                        class="flex h-32 flex-col justify-between rounded-[20px] border border-[var(--gray-100)] bg-[var(--gray-50)] p-5"
                      >
                        <div class="mb-2 flex items-center gap-2">
                          <div class="rounded-xl bg-white p-2 shadow-sm">
                            <Flame class="h-5 w-5 text-[#FF3B30]" />
                          </div>
                          <span class="text-[15px] font-bold text-[var(--gray-700)]">에너지</span>
                        </div>
                        <p class="text-[24px] font-bold tracking-tight text-[var(--gray-900)]">
                          {{ selectedMeal.nutrition.calories }}
                          <span class="text-[16px] font-medium text-[var(--gray-500)]">kcal</span>
                        </p>
                      </div>

                      <div
                        class="flex h-32 flex-col justify-center space-y-3 rounded-[20px] border border-[var(--gray-100)] bg-[var(--gray-50)] p-5"
                      >
                        <div class="flex items-center justify-between text-[15px]">
                          <span class="font-medium text-[var(--gray-500)]">탄수화물</span>
                          <span class="text-[16px] font-bold text-[var(--gray-900)]"
                            >{{ selectedMeal.nutrition.carbs }}g</span
                          >
                        </div>
                        <div class="flex items-center justify-between text-[15px]">
                          <span class="font-medium text-[var(--gray-500)]">단백질</span>
                          <span class="text-[16px] font-bold text-[var(--gray-900)]"
                            >{{ selectedMeal.nutrition.protein }}g</span
                          >
                        </div>
                        <div class="flex items-center justify-between text-[15px]">
                          <span class="font-medium text-[var(--gray-500)]">지방</span>
                          <span class="text-[16px] font-bold text-[var(--gray-900)]"
                            >{{ selectedMeal.nutrition.fat }}g</span
                          >
                        </div>
                      </div>
                    </div>

                    <div class="mt-6 space-y-3">
                      <h3 class="mb-3 text-[16px] font-bold text-[var(--gray-900)]">포함된 음식</h3>
                      <div
                        v-for="(food, i) in selectedMeal.foods"
                        :key="`${selectedMeal.id}-${food.id}-list-${i}`"
                        class="flex items-center gap-4 rounded-2xl border border-[var(--gray-100)] bg-[var(--gray-50)] p-3"
                      >
                        <div class="h-12 w-12 overflow-hidden rounded-xl bg-white">
                          <ImageWithFallback
                            :src="food.image"
                            :alt="food.name"
                            class="h-full w-full object-cover"
                          />
                        </div>
                        <div class="min-w-0 flex-1">
                          <div class="flex justify-between">
                            <span class="truncate text-[15px] font-medium text-[var(--gray-900)]">{{
                              food.name
                            }}</span>
                            <span class="ml-2 whitespace-nowrap text-[14px] text-[var(--gray-500)]"
                              >{{ food.calories * food.quantity }} kcal</span
                            >
                          </div>
                          <div class="mt-0.5 text-[13px] text-[var(--gray-500)]">
                            {{ food.quantity }}개 · {{ food.servingSize }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-3 pt-4">
                    <button
                      type="button"
                      class="flex h-[56px] flex-1 items-center justify-center rounded-[20px] bg-[#00C73C] text-[17px] font-bold text-white shadow-md shadow-[#00C73C]/20 transition-all hover:bg-[#00B035] active:scale-[0.98]"
                      @click="goToEdit(selectedMeal.id)"
                    >
                      <Pencil class="mr-2 h-5 w-5" />
                      수정하기
                    </button>
                    <button
                      type="button"
                      class="flex h-[56px] w-[56px] items-center justify-center rounded-[20px] border border-[var(--gray-200)] bg-[var(--gray-50)] text-[var(--gray-400)] transition-colors hover:border-[#FF3B30] hover:bg-[#FFF5F5] hover:text-[#FF3B30]"
                      @click="confirmDelete(selectedMeal.id)"
                    >
                      <Trash2 class="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.diet-fade-enter-active,
.diet-fade-leave-active {
  transition: opacity 150ms ease;
}

.diet-fade-enter-from,
.diet-fade-leave-to {
  opacity: 0;
}
</style>
