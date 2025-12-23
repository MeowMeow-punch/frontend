<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Minus, Plus, Search, Utensils, X } from 'lucide-vue-next'
import ImageWithFallback from '@/components/Diet/ImageWithFallback.vue'
import { useDietStore } from '@/composables/useDietStore'
import {
  createDiet,
  getDietDetail,
  getFoodList,
  mapFoodItem,
  resolveDietImageUrl,
  searchFoods,
  updateDiet,
  type DietMealType,
} from '@/services/dietService'
import type { FoodItem, MealTime, SelectedFood } from '@/types/diet'

const router = useRouter()
const route = useRoute()

const { selectedDate, consumeDraftMeal, consumeDraftSearch } = useDietStore()

const mealTimes: Array<{ id: MealTime; label: string; time: string; icon: string }> = [
  { id: 'breakfast', label: '아침', time: '07:00-10:00', icon: '☀️' },
  { id: 'lunch', label: '점심', time: '12:00-14:00', icon: '🌤️' },
  { id: 'dinner', label: '저녁', time: '18:00-21:00', icon: '🌙' },
  { id: 'snack', label: '간식', time: '언제든', icon: '🍪' },
]

const FOOD_PAGE_SIZE = 9

const categories = ['전체', '주식', '단백질', '채소', '유제품', '과일', '기타']

const foods = ref<FoodItem[]>([])

const MEAL_TIME_TO_API: Record<MealTime, DietMealType> = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH',
  dinner: 'DINNER',
  snack: 'SNACK',
}

const API_TO_MEAL_TIME: Record<DietMealType, MealTime> = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const normalizeApiTime = (value: string) => {
  const parts = value.split(':').slice(0, 2)
  return parts.length === 2 ? `${parts[0]}:${parts[1]}` : value
}

const normalizeFoodName = (value: string) => value.trim().toLowerCase()

const searchQuery = ref('')
const activeCategory = ref('전체')
const selectedMealTime = ref<MealTime>('lunch')
const selectedFoods = ref<SelectedFood[]>([])
const editingMealId = ref<number | null>(null)
const editingDate = ref<string | null>(null)
const editingTime = ref<string | null>(null)
const isMealLoading = ref(false)
const isSaving = ref(false)
const pendingAutoSelectName = ref<string | null>(null)

let foodRequestId = 0
let searchTimeout: number | null = null

const isEditing = computed(() => editingMealId.value !== null)

const mapDetailFoods = (
  foods: Array<{
    foodId: number
    name: string
    quantity: number
    calorie: number
    nutrients: { carbs: number; protein: number; fat: number }
    thumbnailUrl?: string | null
  }>,
): SelectedFood[] =>
  foods.map((food) => ({
    id: food.foodId,
    name: food.name,
    calories: food.calorie,
    protein: food.nutrients?.protein ?? 0,
    carbs: food.nutrients?.carbs ?? 0,
    fat: food.nutrients?.fat ?? 0,
    servingSize: `${food.quantity} serving`,
    image: resolveDietImageUrl(food.thumbnailUrl),
    category: '기타',
    quantity: food.quantity,
  }))

const loadMealDetail = async (dietId: number) => {
  isMealLoading.value = true
  try {
    console.info('[DietRecord] diet detail request', { dietId })
    const response = await getDietDetail(dietId)
    const detail = response?.dietInfo
    if (!detail) {
      console.warn('[DietRecord] diet detail missing', { dietId })
      return
    }

    editingMealId.value = detail.myDietId
    editingDate.value = detail.date
    editingTime.value = normalizeApiTime(detail.time)
    selectedMealTime.value = API_TO_MEAL_TIME[detail.mealType] ?? 'lunch'
    selectedFoods.value = mapDetailFoods(detail.foods ?? [])
    console.info('[DietRecord] diet detail mapped', {
      dietId,
      foods: selectedFoods.value.length,
      mealType: selectedMealTime.value,
      date: editingDate.value,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Diet detail load failed.'
    console.warn('[DietRecord] diet detail error', { dietId, message })
  } finally {
    isMealLoading.value = false
  }
}

const loadFoods = async (keyword: string) => {
  const requestId = ++foodRequestId
  const trimmedKeyword = keyword.trim()

  try {
    const data = trimmedKeyword
      ? await searchFoods({ keyword: trimmedKeyword, size: FOOD_PAGE_SIZE })
      : await getFoodList({ size: FOOD_PAGE_SIZE })

    if (requestId !== foodRequestId) return
    foods.value = (data.foods ?? []).map(mapFoodItem)

    if (pendingAutoSelectName.value) {
      if (!trimmedKeyword) {
        pendingAutoSelectName.value = null
        return
      }

      const target = normalizeFoodName(pendingAutoSelectName.value)
      const exactMatch = foods.value.find((food) => normalizeFoodName(food.name) === target)
      const partialMatch = foods.value.find((food) => normalizeFoodName(food.name).includes(target))
      const match = exactMatch ?? partialMatch

      if (match) {
        addFood(match)
        console.info('[DietRecord] auto select food', {
          keyword: trimmedKeyword,
          foodId: match.id,
          name: match.name,
        })
      } else {
        console.info('[DietRecord] auto select food not found', { keyword: trimmedKeyword })
      }

      pendingAutoSelectName.value = null
    }
  } catch (error) {
    if (requestId !== foodRequestId) return
    foods.value = []
    const message = error instanceof Error ? error.message : 'Food fetch failed.'
    console.warn('[DietRecord] food fetch failed', { message, keyword: trimmedKeyword })
    pendingAutoSelectName.value = null
  }
}

const scheduleFoodLoad = (keyword: string) => {
  if (searchTimeout !== null) {
    window.clearTimeout(searchTimeout)
  }
  searchTimeout = window.setTimeout(() => {
    void loadFoods(keyword)
  }, 300)
}

watch(searchQuery, (next) => {
  scheduleFoodLoad(next)
})

function initFromRoute() {
  const idRaw = route.query.id
  if (typeof idRaw === 'string' && idRaw.trim() !== '') {
    const id = Number(idRaw)
    if (Number.isFinite(id)) {
      void loadMealDetail(id)
      return
    }
  }

  const draftSearch = consumeDraftSearch()
  if (draftSearch) {
    pendingAutoSelectName.value = draftSearch.keyword
    searchQuery.value = draftSearch.keyword
    if (draftSearch.time) {
      selectedMealTime.value = draftSearch.time
    }
    return
  }

  const draft = consumeDraftMeal()
  if (draft) {
    selectedMealTime.value = draft.time
    selectedFoods.value = draft.foods.map((f) => ({ ...f }))
  }
}

initFromRoute()

onMounted(() => {
  void loadFoods(searchQuery.value)
})

const filteredFoods = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return foods.value.filter((food) => {
    const matchCategory = activeCategory.value === '전체' || food.category === activeCategory.value
    const matchQuery =
      query === '' ||
      food.name.toLowerCase().includes(query) ||
      food.category.toLowerCase().includes(query)
    return matchCategory && matchQuery
  })
})

const totalNutrition = computed(() => {
  return selectedFoods.value.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories * food.quantity,
      protein: acc.protein + food.protein * food.quantity,
      carbs: acc.carbs + food.carbs * food.quantity,
      fat: acc.fat + food.fat * food.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
})

const totalKcal = computed(() => Math.round(totalNutrition.value.calories))

function addFood(food: FoodItem) {
  const existing = selectedFoods.value.find((f) => f.id === food.id)
  if (existing) {
    selectedFoods.value = selectedFoods.value.map((f) =>
      f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f,
    )
    return
  }
  selectedFoods.value = [...selectedFoods.value, { ...food, quantity: 1 }]
}

function removeFood(foodId: number) {
  selectedFoods.value = selectedFoods.value.filter((f) => f.id !== foodId)
}

function updateQuantity(foodId: number, delta: number) {
  selectedFoods.value = selectedFoods.value.map((food) => {
    if (food.id !== foodId) return food
    const nextQty = Math.max(1, food.quantity + delta)
    return { ...food, quantity: nextQty }
  })
}

const buildDietPayload = () => {
  const date = editingDate.value ?? formatDate(selectedDate.value)
  const time = editingTime.value ?? formatTime(new Date())
  return {
    date,
    time,
    mealType: MEAL_TIME_TO_API[selectedMealTime.value],
    foods: selectedFoods.value.map((food) => ({
      foodId: food.id,
      quantity: food.quantity,
    })),
  }
}

async function confirmSave() {
  if (selectedFoods.value.length === 0 || isSaving.value) return
  const payload = buildDietPayload()
  isSaving.value = true
  try {
    if (editingMealId.value) {
      console.info('[DietRecord] diet update request', {
        dietId: editingMealId.value,
        foods: payload.foods.length,
      })
      const response = await updateDiet(editingMealId.value, payload)
      console.info('[DietRecord] diet update response', response)
    } else {
      console.info('[DietRecord] diet create request', { foods: payload.foods.length })
      const response = await createDiet(payload)
      console.info('[DietRecord] diet create response', response)
    }
    router.push('/diet')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Diet save failed.'
    console.warn('[DietRecord] diet save error', { message })
    const duplicateHint =
      message.includes('중복') ||
      message.includes('이미') ||
      message.toLowerCase().includes('duplicate')
    alert(
      duplicateHint
        ? '해당 끼니는 하루에 1개만 저장됩니다.'
        : '식단 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
    )
  } finally {
    isSaving.value = false
  }
}

function goBack() {
  router.push('/diet')
}
</script>

<template>
  <div class="min-h-screen bg-[#F2F4F6] pb-20 font-sans md:pb-0">
    <div class="sticky top-0 z-30 border-b border-[var(--gray-200)] bg-white">
      <div class="mx-auto max-w-6xl px-4 md:px-8">
        <div class="flex h-16 items-center">
          <button
            type="button"
            class="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--gray-600)] transition-colors hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]"
            @click="goBack"
          >
            <ArrowLeft class="h-5 w-5" />
          </button>
          <h1 class="ml-2 text-[17px] font-bold text-[var(--gray-900)]">
            {{ isEditing ? '식단 수정' : '새로운 식단 기록' }}
          </h1>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <div class="space-y-6">
          <div class="rounded-[24px] border border-[var(--gray-100)] bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-[18px] font-bold text-[var(--gray-900)]">언제 드셨나요?</h2>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="time in mealTimes"
                :key="time.id"
                type="button"
                class="flex flex-col items-center justify-center rounded-[16px] py-4 transition-all duration-200"
                :class="
                  selectedMealTime === time.id
                    ? 'bg-[#E5F9EB] text-[#00C73C] ring-1 ring-[#00C73C]'
                    : 'bg-[var(--gray-50)] text-[var(--gray-500)] hover:bg-[var(--gray-100)]'
                "
                @click="selectedMealTime = time.id"
              >
                <span class="mb-1 text-2xl">{{ time.icon }}</span>
                <span class="text-[14px] font-bold">{{ time.label }}</span>
              </button>
            </div>
          </div>

          <div
            class="min-h-[500px] rounded-[24px] border border-[var(--gray-100)] bg-white p-6 shadow-sm"
          >
            <div class="sticky top-0 z-10 space-y-4 bg-white pb-4">
              <h2 class="text-[18px] font-bold text-[var(--gray-900)]">무엇을 드셨나요?</h2>

              <div class="relative">
                <Search
                  class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--gray-400)]"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="음식 이름 검색 (예: 닭가슴살, 바나나)"
                  class="h-[52px] w-full rounded-[16px] border-none bg-[var(--gray-50)] pl-11 pr-10 text-[16px] outline-none focus:bg-white focus:ring-2 focus:ring-[#00C73C]"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--gray-400)] hover:text-[var(--gray-600)]"
                  @click="searchQuery = ''"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>

              <div class="hide-scrollbar flex gap-2 overflow-x-auto pb-2">
                <button
                  v-for="cat in categories"
                  :key="cat"
                  type="button"
                  class="whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium transition-colors"
                  :class="
                    activeCategory === cat
                      ? 'bg-[var(--gray-900)] text-white'
                      : 'bg-[var(--gray-50)] text-[var(--gray-600)] hover:bg-[var(--gray-100)]'
                  "
                  @click="activeCategory = cat"
                >
                  {{ cat }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="food in filteredFoods"
                :key="food.id"
                class="group cursor-pointer rounded-[20px] border p-3 transition-all hover:shadow-md"
                :class="
                  selectedFoods.some((f) => f.id === food.id)
                    ? 'border-[#00C73C] bg-[#F7FEFA]'
                    : 'border-[var(--gray-100)] bg-white hover:border-[var(--gray-300)]'
                "
                @click="addFood(food)"
              >
                <div
                  class="relative mb-3 aspect-square overflow-hidden rounded-[16px] bg-[var(--gray-100)]"
                >
                  <ImageWithFallback
                    :src="food.image"
                    :alt="food.name"
                    class="h-full w-full object-cover"
                  />

                  <div
                    v-if="selectedFoods.find((f) => f.id === food.id)"
                    class="absolute inset-0 flex items-center justify-center bg-black/40"
                  >
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-[#00C73C] font-bold text-white"
                    >
                      {{ selectedFoods.find((f) => f.id === food.id)?.quantity }}
                    </div>
                  </div>
                  <div
                    v-else
                    class="absolute bottom-2 right-2 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white text-[var(--gray-900)] opacity-0 shadow-md transition-all group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <Plus class="h-5 w-5" />
                  </div>
                </div>

                <div class="px-1">
                  <h3 class="truncate text-[15px] font-bold text-[var(--gray-900)]">
                    {{ food.name }}
                  </h3>
                  <div class="mt-1 flex items-center gap-2 text-[13px] text-[var(--gray-500)]">
                    <span>{{ food.calories }}kcal</span>
                    <span class="h-2 w-0.5 bg-[var(--gray-300)]" />
                    <span>{{ food.servingSize }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-fit space-y-4 lg:sticky lg:top-24">
          <div class="rounded-[24px] border border-[var(--gray-100)] bg-white p-6 shadow-sm">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-[18px] font-bold text-[var(--gray-900)]">
                식단 구성
                <span class="ml-2 text-[14px] font-normal text-[#00C73C]">
                  {{ selectedFoods.length }}개 선택됨
                </span>
              </h2>
              <button
                v-if="selectedFoods.length > 0"
                type="button"
                class="text-[13px] text-[var(--gray-500)] underline decoration-[var(--gray-300)] hover:text-[#FF3B30]"
                @click="selectedFoods = []"
              >
                전체 삭제
              </button>
            </div>

            <div
              v-if="selectedFoods.length > 0"
              class="custom-scrollbar mb-6 max-h-[400px] space-y-3 overflow-y-auto pr-1"
            >
              <div
                v-for="food in selectedFoods"
                :key="food.id"
                class="flex items-center gap-3 rounded-[16px] bg-[var(--gray-50)] p-3"
              >
                <div class="h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-white">
                  <ImageWithFallback
                    :src="food.image"
                    :alt="food.name"
                    class="h-full w-full object-cover"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between">
                    <h4 class="truncate text-[14px] font-bold text-[var(--gray-900)]">
                      {{ food.name }}
                    </h4>
                    <button
                      type="button"
                      class="text-[var(--gray-400)] hover:text-[#FF3B30]"
                      @click.stop="removeFood(food.id)"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                  <p class="mb-2 text-[12px] text-[var(--gray-500)]">
                    {{ food.calories * food.quantity }}kcal
                  </p>

                  <div class="flex items-center gap-3">
                    <div
                      class="flex items-center gap-2 rounded-lg border border-[var(--gray-100)] bg-white px-2 py-1 shadow-sm"
                    >
                      <button
                        type="button"
                        class="flex h-5 w-5 items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-900)]"
                        @click.stop="updateQuantity(food.id, -1)"
                      >
                        <Minus class="h-3 w-3" />
                      </button>
                      <span class="w-4 text-center text-[13px] font-bold">{{ food.quantity }}</span>
                      <button
                        type="button"
                        class="flex h-5 w-5 items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-900)]"
                        @click.stop="updateQuantity(food.id, 1)"
                      >
                        <Plus class="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="mb-6 flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[var(--gray-200)] bg-[var(--gray-50)] py-12 text-center text-[var(--gray-400)]"
            >
              <Utensils class="mb-2 h-10 w-10 opacity-20" />
              <p class="text-[14px]">음식을 선택해주세요</p>
            </div>

            <div class="space-y-4 border-t border-[var(--gray-100)] pt-4">
              <div class="flex items-center justify-between">
                <span class="font-medium text-[var(--gray-600)]">총 칼로리</span>
                <span class="text-[24px] font-bold text-[var(--gray-900)]">
                  {{ totalKcal }}
                  <span class="text-[16px] font-normal text-[var(--gray-500)]">kcal</span>
                </span>
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div class="rounded-xl bg-[var(--gray-50)] p-3 text-center">
                  <div class="mb-1 text-[12px] text-[var(--gray-500)]">탄수화물</div>
                  <div class="text-[15px] font-bold text-[var(--gray-900)]">
                    {{ Math.round(totalNutrition.carbs) }}g
                  </div>
                </div>
                <div class="rounded-xl bg-[var(--gray-50)] p-3 text-center">
                  <div class="mb-1 text-[12px] text-[var(--gray-500)]">단백질</div>
                  <div class="text-[15px] font-bold text-[var(--gray-900)]">
                    {{ Math.round(totalNutrition.protein) }}g
                  </div>
                </div>
                <div class="rounded-xl bg-[var(--gray-50)] p-3 text-center">
                  <div class="mb-1 text-[12px] text-[var(--gray-500)]">지방</div>
                  <div class="text-[15px] font-bold text-[var(--gray-900)]">
                    {{ Math.round(totalNutrition.fat) }}g
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="flex h-14 w-full items-center justify-center rounded-[16px] bg-[#00C73C] text-[17px] font-bold text-white shadow-lg shadow-[#00C73C]/20 transition-all hover:bg-[#00B035] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="selectedFoods.length === 0 || isSaving"
                @click="confirmSave"
              >
                {{ isSaving ? '저장 중...' : isEditing ? '수정 완료' : '기록하기' }}
              </button>
              <p class="text-center text-[12px] text-[var(--gray-400)]">
                하루에 끼니별 식단은 1개만 저장됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--gray-200);
  border-radius: 20px;
}

.hide-scrollbar {
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
