import { apiFetch } from '@/services/apiClient'
import type { FoodItem } from '@/types/diet'

export type DietMealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'

type DietMacroStatus = 'GOOD' | 'LACK' | 'OVER'

type DietSummaryStat = {
  current: number
  goal: number
  status?: DietMacroStatus
}

type DietRecommendation = {
  recommendationId: number
  name: string
  mealType: DietMealType
  thumbnailUrls: string[]
  calorie: number
  nutrients?: {
    carbs: number
    protein: number
    fat: number
  } | null
  sourceType?: 'WELSTORY' | 'FOOD_DB' | string | null
}

export type DietMainData = {
  summaryInfo: {
    calorie: {
      current: number
      goal: number
    }
    carbs: DietSummaryStat
    protein: DietSummaryStat
    fat: DietSummaryStat
  }
  aiFeedbackInfo: {
    message: string
    timestamp: string
  }
  recommendedDietsInfo: DietRecommendation[]
}

export type DietSummaryInfo = DietMainData['summaryInfo']

export type DietMainResponse = {
  code: number
  message: string
  data: DietMainData
}

type DietFoodNutrients = {
  carbs: number
  protein: number
  fat: number
}

type DietFoodItemResponse = {
  foodId: number
  name: string
  amount: number
  calorie: number
  nutrients?: DietFoodNutrients | null
  thumbnailUrl?: string | null
}

type FoodPageInfo = {
  nextCursor: string | null
  hasNext: boolean
}

type FoodListData = {
  foods: DietFoodItemResponse[]
  pageInfo: FoodPageInfo
}

type FoodSearchData = FoodListData & {
  searchNum: number
}

export type FoodListResponse = {
  code: number
  message: string
  data: FoodListData
}

export type FoodSearchResponse = {
  code: number
  message: string
  data: FoodSearchData
}

export type TodayDietInfo = {
  myDietId: number
  name: string
  mealType: DietMealType
  calorie: number
  time: string
  nutrients: DietFoodNutrients
  thumbnailUrls: string[]
}

export type TodayRestaurantMenuInfo = {
  name: string
  calorie: number
  subName: string
  othersNum: number
}

export type RestaurantMenuItem = {
  name: string
  restaurantName: string
  calorie: number
  subName: string
  nutrients: DietFoodNutrients
  thumbnailUrls: string[]
}

export type NutritionDetail = {
  current: number
  goal: number
  unit: string
}

export type NutritionInfo = {
  sugar: NutritionDetail
  dietaryFiber: NutritionDetail
  vitaminA: NutritionDetail
  vitaminC: NutritionDetail
  vitaminD: NutritionDetail
  calcium: NutritionDetail
  iron: NutritionDetail
  sodium: NutritionDetail
}

type DietDailyData = {
  selectedDate: string
  summaryInfo: DietSummaryInfo
  aiFeedbackInfo?: {
    message: string
    timestamp: string
  } | null
  todayDietInfo?: TodayDietInfo[]
  todayRestaurantMenu?: Record<string, TodayRestaurantMenuInfo>
}

export type DietDailyResponse = {
  code: number
  message: string
  data: DietDailyData
}

type DietDetailFood = {
  foodId: number
  name: string
  amount: number
  quantity: number
  calorie: number
  nutrients: DietFoodNutrients
  thumbnailUrl?: string | null
}

export type DietDetailInfo = {
  myDietId: number
  title: string
  mealType: DietMealType
  time: string
  date: string
  isEditable: boolean
  calorie: number
  nutrients: DietFoodNutrients
  foods: DietDetailFood[]
  thumbnailUrls?: string[]
}

export type DietDetailResponse = {
  code: number
  message: string
  data: {
    dietInfo: DietDetailInfo
  }
}

export type DietRequestPayload = {
  date: string
  mealType: DietMealType
  time: string
  foods: Array<{
    foodId: number
    quantity: number
  }>
}

const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? ''

const normalizeBase = (base: string) => (base.endsWith('/') ? base.slice(0, -1) : base)
const normalizePath = (path: string) => (path.startsWith('/') ? path.slice(1) : path)

export const resolveDietImageUrl = (path?: string | null) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) {
    if (/^http:\/\/samsungwelstory\.com/i.test(path)) {
      return path.replace(/^http:\/\//i, 'https://')
    }
    return path
  }
  if (!IMAGE_BASE_URL) return path
  return `${normalizeBase(IMAGE_BASE_URL)}/${normalizePath(path)}`
}

const DEFAULT_FOOD_CATEGORY = '기타'

const mapFoodNutrients = (nutrients?: DietFoodNutrients | null) => ({
  carbs: nutrients?.carbs ?? 0,
  protein: nutrients?.protein ?? 0,
  fat: nutrients?.fat ?? 0,
})

export const mapFoodItem = (item: DietFoodItemResponse): FoodItem => {
  const nutrients = mapFoodNutrients(item.nutrients)
  const imageUrl = resolveDietImageUrl(item.thumbnailUrl)
  const amount = Number.isFinite(item.amount) ? item.amount : 0

  return {
    id: item.foodId,
    name: item.name,
    calories: item.calorie,
    protein: nutrients.protein,
    carbs: nutrients.carbs,
    fat: nutrients.fat,
    servingSize: amount > 0 ? `${amount}g` : '1 serving',
    image: imageUrl || null,
    category: DEFAULT_FOOD_CATEGORY,
  }
}

type FoodListParams = {
  cursor?: string
  size?: number
  category?: string
}

type FoodSearchParams = FoodListParams & {
  keyword: string
}

const buildFoodQuery = (params: FoodListParams) => {
  const query: Record<string, string | number> = {}
  if (params.cursor) {
    query.cursor = params.cursor
  }
  if (params.size !== undefined) {
    query.size = params.size
  }
  if (params.category) {
    query.category = params.category
  }
  return query
}

export const getDietMain = async () => {
  const response = await apiFetch<DietMainResponse>('/diet/main', {
    method: 'GET',
    withAuth: true,
    errorMessage: 'Diet main fetch failed.',
    skipGlobalError: true,
  })

  return response.data
}

export const getFoodList = async (params: FoodListParams = {}) => {
  const response = await apiFetch<FoodListResponse>('/diet/food/list', {
    method: 'GET',
    withAuth: true,
    query: buildFoodQuery(params),
    errorMessage: 'Food list fetch failed.',
  })

  return response.data
}

export const searchFoods = async (params: FoodSearchParams) => {
  const query = buildFoodQuery(params)
  query.keyword = params.keyword

  const response = await apiFetch<FoodSearchResponse>('/diet/food', {
    method: 'GET',
    withAuth: true,
    query,
    errorMessage: 'Food search failed.',
  })

  return response.data
}

export const getDietDaily = async (date: string) => {
  const response = await apiFetch<DietDailyResponse>('/diet', {
    method: 'GET',
    withAuth: true,
    query: { date },
    errorMessage: 'Diet daily fetch failed.',
    skipGlobalError: true,
  })

  return response.data
}

export const getDietDetail = async (dietId: number) => {
  const response = await apiFetch<DietDetailResponse>(`/diet/${dietId}`, {
    method: 'GET',
    withAuth: true,
    errorMessage: 'Diet detail fetch failed.',
  })

  return response.data
}

export const registerRecommendedDiet = async (recommendationId: number) => {
  const response = await apiFetch<{
    code: number
    message: string
    data?: { myDietId: number }
  }>(`/diet/recommendation/${recommendationId}`, {
    method: 'POST',
    withAuth: true,
    errorMessage: 'Recommendation register failed.',
  })

  return response
}

export const createDiet = async (payload: DietRequestPayload) => {
  return apiFetch<{ code: number; message: string }>('/diet', {
    method: 'POST',
    withAuth: true,
    body: payload,
    errorMessage: 'Diet create failed.',
  })
}

export const updateDiet = async (dietId: number, payload: DietRequestPayload) => {
  return apiFetch<{ code: number; message: string }>(`/diet/${dietId}`, {
    method: 'PUT',
    withAuth: true,
    body: payload,
    errorMessage: 'Diet update failed.',
  })
}

export const deleteDiet = async (dietId: number) => {
  return apiFetch<{ code: number; message: string }>(`/diet/${dietId}`, {
    method: 'DELETE',
    withAuth: true,
    errorMessage: 'Diet delete failed.',
  })
}

export const getDietNutrition = async (date: string) => {
  const response = await apiFetch<{
    code: number
    message: string
    data: { nutritionInfo: NutritionInfo }
  }>('/diet/nutrient', {
    method: 'GET',
    withAuth: true,
    query: { date },
    errorMessage: 'Diet nutrient fetch failed.',
  })

  return response.data
}

export type RestaurantDietRegisterPayload = {
  restaurantName: string
  menuName: string
  date: string
  mealType: DietMealType
}

export const registerRestaurantDiet = async (payload: RestaurantDietRegisterPayload) => {
  return apiFetch<{
    code: number
    message: string
    data: { myDietId: number }
  }>('/diet/restaurant/register', {
    method: 'POST',
    withAuth: true,
    body: payload,
    errorMessage: 'Restaurant diet register failed.',
  })
}

export const getRestaurantMenu = async (date: string) => {
  const response = await apiFetch<{
    code: number
    message: string
    data: Record<string, RestaurantMenuItem[]>
  }>('/diet/restaurant/menu', {
    method: 'GET',
    withAuth: true,
    query: { date },
    errorMessage: 'Restaurant menu fetch failed.',
  })

  return response.data
}
