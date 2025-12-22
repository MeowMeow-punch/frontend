export type FocusType = 'nutrition' | 'diet' | 'bulkup' | null

export type SignupTerms = {
  service: boolean
  privacy: boolean
  marketing: boolean
}

export type SignupUserInfo = {
  height: string
  weight: string
  age: string
  gender: string
}

export type SignupHabits = {
  smoking: string
  drinking: string
}

export type SignupAffiliation = {
  type: 'individual' | 'group'
  selected: { id: number; name: string } | null
}

export type SignupResult = {
  nickname: string
  terms: SignupTerms
  userInfo: SignupUserInfo
  allergies: string[]
  affiliation: SignupAffiliation
  focusType: FocusType
  diseases: string[]
  habits: SignupHabits
  mealCount: string
  activityLevel: string
  targetWeight: string
}
