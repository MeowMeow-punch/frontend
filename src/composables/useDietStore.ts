import { computed, ref, watch } from 'vue'
import type { MealData, MealDraft, MealTime, SelectedFood } from '@/types/diet'
import { isSameDay } from '@/utils/diet/dietUtils'

const STORAGE_KEY = 'diet_meals_v1'

function computeNutrition(foods: SelectedFood[]) {
  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories * food.quantity,
      protein: acc.protein + food.protein * food.quantity,
      carbs: acc.carbs + food.carbs * food.quantity,
      fat: acc.fat + food.fat * food.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
  }
}

function safeParseMeals(value: string | null): MealData[] | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) return null
    return parsed as MealData[]
  } catch {
    return null
  }
}

function getDefaultMeals(): MealData[] {
  const timestamp = new Date().toISOString()
  return [
    {
      id: 1,
      time: 'breakfast',
      foods: [
        {
          id: 6,
          name: '그릭 요거트',
          calories: 97,
          protein: 10,
          carbs: 4,
          fat: 5,
          servingSize: '1컵 (170g)',
          image:
            'https://images.unsplash.com/photo-1641494587136-eec74f1944ae?auto=format&fit=crop&w=600&q=80',
          category: '유제품',
          quantity: 1,
        },
        {
          id: 9,
          name: '방울토마토',
          calories: 16,
          protein: 0.9,
          carbs: 3.9,
          fat: 0.2,
          servingSize: '100g',
          image:
            'https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=600&q=80',
          category: '채소',
          quantity: 1,
        },
      ],
      nutrition: {
        calories: 113,
        protein: 11,
        carbs: 8,
        fat: 5,
      },
      timestamp,
    },
    {
      id: 2,
      time: 'lunch',
      foods: [
        {
          id: 1,
          name: '현미밥',
          calories: 330,
          protein: 7,
          carbs: 69,
          fat: 3,
          servingSize: '1공기 (210g)',
          image:
            'https://images.unsplash.com/photo-1612429409929-b3825744f208?auto=format&fit=crop&w=600&q=80',
          category: '주식',
          quantity: 1,
        },
        {
          id: 2,
          name: '닭가슴살',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          servingSize: '100g',
          image:
            'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
          category: '단백질',
          quantity: 1,
        },
        {
          id: 8,
          name: '계란',
          calories: 155,
          protein: 13,
          carbs: 1,
          fat: 11,
          servingSize: '2개 (100g)',
          image:
            'https://images.unsplash.com/photo-1587486937223-cc96d410b7b0?auto=format&fit=crop&w=600&q=80',
          category: '단백질',
          quantity: 1,
        },
      ],
      nutrition: {
        calories: 650,
        protein: 51,
        carbs: 70,
        fat: 17,
      },
      timestamp,
    },
  ]
}

function getInitialMeals(): MealData[] {
  try {
    return safeParseMeals(localStorage.getItem(STORAGE_KEY)) ?? getDefaultMeals()
  } catch {
    return getDefaultMeals()
  }
}

const selectedDate = ref<Date>(new Date())
const meals = ref<MealData[]>(getInitialMeals())
const draftMeal = ref<MealDraft | null>(null)

watch(
  meals,
  (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  },
  { deep: true },
)

const mealsForSelectedDate = computed(() => {
  const date = selectedDate.value
  return meals.value.filter((meal) => isSameDay(new Date(meal.timestamp), date))
})

function upsertMeal(payload: {
  id?: number
  time: MealTime
  foods: SelectedFood[]
  timestamp: string
}) {
  const nutrition = computeNutrition(payload.foods)
  if (payload.id) {
    meals.value = meals.value.map((meal) =>
      meal.id === payload.id
        ? {
            ...meal,
            time: payload.time,
            foods: payload.foods,
            nutrition,
            timestamp: payload.timestamp,
          }
        : meal,
    )
    return payload.id
  }

  const id = Date.now()
  meals.value = [
    ...meals.value,
    {
      id,
      time: payload.time,
      foods: payload.foods,
      nutrition,
      timestamp: payload.timestamp,
    },
  ]
  return id
}

function deleteMeal(id: number) {
  meals.value = meals.value.filter((meal) => meal.id !== id)
}

function getMealById(id: number) {
  return meals.value.find((meal) => meal.id === id) ?? null
}

function setDraftMeal(next: MealDraft | null) {
  draftMeal.value = next
}

function consumeDraftMeal() {
  const next = draftMeal.value
  draftMeal.value = null
  return next
}

export function useDietStore() {
  return {
    selectedDate,
    meals,
    mealsForSelectedDate,
    upsertMeal,
    deleteMeal,
    getMealById,
    setDraftMeal,
    consumeDraftMeal,
  }
}
