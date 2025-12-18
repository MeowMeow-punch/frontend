import type { MealTime } from '@/types/diet'

export function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function getMealLabel(time: MealTime) {
  switch (time) {
    case 'breakfast':
      return '아침'
    case 'lunch':
      return '점심'
    case 'dinner':
      return '저녁'
    case 'snack':
      return '간식'
  }
}

export function getMealTime(time: MealTime) {
  switch (time) {
    case 'breakfast':
      return '08:30'
    case 'lunch':
      return '12:30'
    case 'dinner':
      return '19:00'
    case 'snack':
      return '15:30'
  }
}
