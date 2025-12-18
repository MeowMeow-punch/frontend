export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodItem {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  image: string | null
  category: string
}

export interface SelectedFood extends FoodItem {
  quantity: number
}

export interface MealData {
  id: number
  time: MealTime
  foods: SelectedFood[]
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  timestamp: string
}

export interface MealDraft {
  time: MealTime
  foods: SelectedFood[]
}
