import { ref } from 'vue'
import type { MealDraft, MealTime } from '@/types/diet'

const selectedDate = ref<Date>(new Date())
const draftMeal = ref<MealDraft | null>(null)
const draftSearch = ref<{ keyword: string; time?: MealTime } | null>(null)

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

export function useDietStore() {
  return {
    selectedDate,
    setDraftMeal,
    consumeDraftMeal,
    setDraftSearch,
    consumeDraftSearch,
  }
}
