import type { RegisterRequest } from '@/services/authService'
import type { SignupResult } from '@/types/signup'

const mapGender = (gender: string): RegisterRequest['gender'] =>
  gender === 'female' ? 'FEMALE' : 'MALE'

const mapFocus = (focus: SignupResult['focusType']): RegisterRequest['focus'] => {
  if (focus === 'diet') return 'DIET'
  if (focus === 'bulkup') return 'MUSCLE'
  return 'HEALTHY'
}

const mapMealCount = (count: string): RegisterRequest['meals'] => {
  if (count === '1') return 'ONE'
  if (count === '2') return 'TWO'
  if (count === '3') return 'THREE'
  return 'ETC'
}

const mapActivityLevel = (level: string): RegisterRequest['activity_level'] => {
  if (level === 'sedentary') return 'LOW'
  if (level === 'light') return 'MEDIUM'
  if (level === 'moderate') return 'HIGH'
  if (level === 'active') return 'HIGH'
  return 'VERYHIGH'
}

const mapHabit = (value: string): RegisterRequest['isSmoking'] => {
  if (value === 'none') return 'NONE'
  if (value === 'light') return 'SOMETIME'
  if (value === 'moderate') return 'SOMETIME'
  return 'OFTEN'
}

export const buildRegisterPayload = (payload: SignupResult): RegisterRequest => {
  const focus = mapFocus(payload.focusType)
  const groupId =
    payload.affiliation.type === 'group' ? (payload.affiliation.selected?.id ?? null) : null
  const cleanedDiseases = payload.diseases.includes('없음') ? [] : payload.diseases

  const result: RegisterRequest = {
    nickname: payload.nickname,
    isMarket: payload.terms.marketing,
    gender: mapGender(payload.userInfo.gender),
    height: Number(payload.userInfo.height),
    weight: Number(payload.userInfo.weight),
    age: Number(payload.userInfo.age),
    allergies: payload.allergies,
    Diseases: cleanedDiseases,
    status: payload.affiliation.type === 'group' ? 'GROUP' : 'SINGLE',
    groupId,
    focus,
  }

  if (payload.mealCount) {
    result.meals = mapMealCount(payload.mealCount)
  }

  if (payload.activityLevel) {
    result.activity_level = mapActivityLevel(payload.activityLevel)
  }

  if (focus === 'HEALTHY') {
    result.isSmoking = mapHabit(payload.habits.smoking)
    result.isDrinking = mapHabit(payload.habits.drinking)
  }

  if (focus !== 'HEALTHY' && payload.targetWeight) {
    result.target_weight = Number(payload.targetWeight)
  }

  return result
}
