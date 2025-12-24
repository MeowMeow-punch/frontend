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

const mapActivityLevel = (level: string): RegisterRequest['activityLevel'] => {
  if (level === 'low' || level === 'sedentary') return 'LOW'
  if (level === 'medium' || level === 'light') return 'MEDIUM'
  if (level === 'high' || level === 'moderate' || level === 'active') return 'HIGH'
  return 'VERYHIGH'
}

const mapHabit = (value: string): RegisterRequest['smokingStatus'] => {
  if (value === 'none') return 'NONE'
  if (value === 'light') return 'SOMETIME'
  if (value === 'moderate') return 'SOMETIME'
  if (value === 'sometime') return 'SOMETIME'
  if (value === 'often') return 'OFTEN'
  return 'OFTEN'
}

export const buildRegisterPayload = (
  payload: SignupResult,
  registerToken: string,
): RegisterRequest => {
  const focus = mapFocus(payload.focusType)
  const groupId =
    payload.affiliation.type === 'group'
      ? (payload.affiliation.selected?.id ?? undefined)
      : undefined
  const cleanedDiseases = payload.diseases.indexOf('없음') !== -1 ? [] : payload.diseases

  const result: RegisterRequest = {
    registerToken,
    nickname: payload.nickname,
    isMarketing: payload.terms.marketing,
    gender: mapGender(payload.userInfo.gender),
    height: Number(payload.userInfo.height),
    weight: Number(payload.userInfo.weight),
    age: Number(payload.userInfo.age),
    allergies: payload.allergies,
    diseases: cleanedDiseases,
    status: payload.affiliation.type === 'group' ? 'GROUP' : 'SINGLE',
    groupId: groupId ? String(groupId) : undefined,
    focus,
    meals: 'THREE', // 기본값 설정 (값이 있으면 아래에서 덮어씌움)
    activityLevel: 'MEDIUM', // 기본값 설정
  }

  if (payload.mealCount) {
    result.meals = mapMealCount(payload.mealCount)
  }

  if (payload.activityLevel) {
    result.activityLevel = mapActivityLevel(payload.activityLevel)
  }

  if (focus === 'HEALTHY') {
    result.smokingStatus = mapHabit(payload.habits.smoking)
    result.drinkingStatus = mapHabit(payload.habits.drinking)
  }

  if (focus !== 'HEALTHY' && payload.targetWeight) {
    result.targetWeight = Number(payload.targetWeight)
  }

  return result
}
