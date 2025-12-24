import { ref } from 'vue'
import type { MealDraft, MealTime } from '@/types/diet'

const selectedDate = ref<Date>(new Date())
const draftMeal = ref<MealDraft | null>(null)
const draftSearch = ref<{ keyword: string; time?: MealTime } | null>(null)
const cafeteriaMealIds = ref<Set<number>>(new Set())

function setDraftMeal(next: MealDraft | null) {
  draftMeal.value = next
}

function consumeDraftMeal() {
  const next = draftMeal.value
  draftMeal.value = null
  return next
}

function setDraftSearch(next: { keyword: string; time?: MealTime } | null) {
  draftSearch.value = next
}

function consumeDraftSearch() {
  const next = draftSearch.value
  draftSearch.value = null
  return next
}

function markCafeteriaMeal(mealId: number) {
  const next = new Set(cafeteriaMealIds.value)
  next.add(mealId)
  cafeteriaMealIds.value = next
}

export function useDietStore() {
  return {
    selectedDate,
    setDraftMeal,
    consumeDraftMeal,
    setDraftSearch,
    consumeDraftSearch,
    cafeteriaMealIds,
    markCafeteriaMeal,
  }
}
