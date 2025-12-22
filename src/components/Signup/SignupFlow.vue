<script setup lang="ts">
import { computed, ref } from 'vue'
import SignupLayout from '@/components/Layouts/SignupLayout.vue'
import StepActivityLevel from './StepActivityLevel.vue'
import StepAffiliation from './StepAffiliation.vue'
import StepAffiliationSearch from './StepAffiliationSearch.vue'
import StepAllergies from './StepAllergies.vue'
import StepBasicInfo from './StepBasicInfo.vue'
import StepDisease from './StepDisease.vue'
import StepFocus from './StepFocus.vue'
import StepHabits from './StepHabits.vue'
import StepMealCount from './StepMealCount.vue'
import StepNickname from './StepNickname.vue'
import StepTargetWeight from './StepTargetWeight.vue'
import StepTerms from './StepTerms.vue'
import StepWelcome from './StepWelcome.vue'
import type { FocusType, SignupResult } from '@/types/signup'

type SignupStep =
  | 'nickname'
  | 'terms'
  | 'info'
  | 'allergies'
  | 'affiliation'
  | 'affiliationSearch'
  | 'focus'
  | 'disease'
  | 'habits'
  | 'mealCount'
  | 'activity'
  | 'activityGoal'
  | 'targetWeight'
  | 'welcome'

const emit = defineEmits<{
  (e: 'complete', payload: SignupResult): void
  (e: 'exit'): void
}>()

const step = ref<SignupStep>('nickname')
const focusType = ref<FocusType>(null)

const nickname = ref('')
const termsAccepted = ref({
  service: false,
  privacy: false,
  marketing: false,
})
const userInfo = ref({
  height: '',
  weight: '',
  age: '',
  gender: '',
})
const allergies = ref<string[]>([])
const affiliationType = ref<'individual' | 'group'>('individual')
const selectedAffiliation = ref<{ id: number; name: string } | null>(null)
const diseases = ref<string[]>([])
const habits = ref({ smoking: '', drinking: '' })
const mealCount = ref('')
const activityLevel = ref('')
const targetWeight = ref('')

const stepOrder = computed<SignupStep[]>(() => {
  const order: SignupStep[] = ['nickname', 'terms', 'info', 'allergies', 'affiliation']

  if (affiliationType.value === 'group') {
    order.push('affiliationSearch')
  }

  order.push('focus')

  if (focusType.value === 'nutrition') {
    order.push('disease', 'habits', 'mealCount', 'activity')
  } else if (focusType.value === 'diet' || focusType.value === 'bulkup') {
    order.push('mealCount', 'activityGoal', 'targetWeight')
  }

  order.push('welcome')

  return order
})

const totalSteps = computed(() => stepOrder.value.length)
const currentStepNumber = computed(() => stepOrder.value.indexOf(step.value) + 1)
const showProgress = computed(() => step.value !== 'welcome')

const stepInfoMap: Record<SignupStep, { title: string; description: string }> = {
  nickname: { title: '닉네임', description: '어떻게 불러드릴까요?' },
  terms: { title: '약관 동의', description: '서비스 이용을 위해 필요해요' },
  info: { title: '기본 정보', description: '신체 정보를 알려주세요' },
  allergies: { title: '알러지', description: '피해야 할 음식이 있나요?' },
  affiliation: { title: '소속', description: '개인 또는 그룹으로 관리해요' },
  affiliationSearch: { title: '소속 검색', description: '함께할 그룹을 찾아요' },
  focus: { title: '목표 설정', description: '어떤 목표를 가지고 계신가요?' },
  disease: { title: '질환 정보', description: '관리가 필요한 질환이 있나요?' },
  habits: { title: '생활 습관', description: '흡연과 음주 습관을 알려주세요' },
  mealCount: { title: '식사 횟수', description: '하루에 몇 끼 드시나요?' },
  activity: { title: '활동량', description: '평소 활동량을 알려주세요' },
  activityGoal: { title: '활동량', description: '평소 활동량을 알려주세요' },
  targetWeight: { title: '목표 체중', description: '달성하고 싶은 체중을 입력해요' },
  welcome: { title: '완료', description: '회원가입이 완료되었어요!' },
}

const stepInfo = computed(() => stepInfoMap[step.value])

const handleNicknameNext = (value: string) => {
  nickname.value = value
  step.value = 'terms'
}

const handleTermsNext = (termsValue: typeof termsAccepted.value) => {
  termsAccepted.value = termsValue
  step.value = 'info'
}

const handleInfoNext = (info: typeof userInfo.value) => {
  userInfo.value = info
  step.value = 'allergies'
}

const handleAllergiesNext = (values: string[]) => {
  allergies.value = values
  step.value = 'affiliation'
}

const handleAffiliationNext = (type: 'individual' | 'group') => {
  affiliationType.value = type
  if (type === 'individual') {
    selectedAffiliation.value = null
  }
  step.value = type === 'individual' ? 'focus' : 'affiliationSearch'
}

const handleAffiliationSearchNext = (affiliation: { id: number; name: string }) => {
  selectedAffiliation.value = affiliation
  step.value = 'focus'
}

const handleFocusNext = (focus: FocusType) => {
  focusType.value = focus
  if (focus === 'nutrition') {
    step.value = 'disease'
  } else if (focus === 'diet' || focus === 'bulkup') {
    step.value = 'mealCount'
  }
}

const handleDiseaseNext = (values: string[]) => {
  diseases.value = values
  step.value = 'habits'
}

const handleHabitsNext = (values: typeof habits.value) => {
  habits.value = values
  step.value = 'mealCount'
}

const handleMealCountNext = (count: string) => {
  mealCount.value = count
  if (focusType.value === 'nutrition') {
    step.value = 'activity'
    return
  }
  step.value = 'activityGoal'
}

const handleActivityNext = (level: string) => {
  activityLevel.value = level
  step.value = 'welcome'
}

const handleActivityGoalNext = (level: string) => {
  activityLevel.value = level
  step.value = 'targetWeight'
}

const handleTargetWeightNext = (weight: string) => {
  targetWeight.value = weight
  step.value = 'welcome'
}

const handleWelcomeComplete = () => {
  const payload = {
    nickname: nickname.value,
    terms: { ...termsAccepted.value },
    userInfo: { ...userInfo.value },
    allergies: [...allergies.value],
    affiliation: {
      type: affiliationType.value,
      selected: selectedAffiliation.value,
    },
    focusType: focusType.value,
    diseases: [...diseases.value],
    habits: { ...habits.value },
    mealCount: mealCount.value,
    activityLevel: activityLevel.value,
    targetWeight: targetWeight.value,
  } satisfies SignupResult

  emit('complete', payload)
}

const handleBack = () => {
  const order = stepOrder.value
  const currentIndex = order.indexOf(step.value)
  if (currentIndex > 0) {
    step.value = order[currentIndex - 1]!
    return
  }
  emit('exit')
}
</script>

<template>
  <SignupLayout
    :current-step="currentStepNumber"
    :total-steps="totalSteps"
    :step-title="stepInfo.title"
    :step-description="stepInfo.description"
    :show-progress="showProgress"
    @back="handleBack"
    @logo="emit('exit')"
  >
    <Transition name="fade-slide" mode="out-in">
      <StepNickname v-if="step === 'nickname'" key="nickname" @next="handleNicknameNext" />

      <StepTerms v-else-if="step === 'terms'" key="terms" @next="handleTermsNext" />

      <StepBasicInfo v-else-if="step === 'info'" key="info" @next="handleInfoNext" />

      <StepAllergies v-else-if="step === 'allergies'" key="allergies" @next="handleAllergiesNext" />

      <StepAffiliation
        v-else-if="step === 'affiliation'"
        key="affiliation"
        @next="handleAffiliationNext"
      />

      <StepAffiliationSearch
        v-else-if="step === 'affiliationSearch'"
        key="affiliationSearch"
        @next="handleAffiliationSearchNext"
      />

      <StepFocus v-else-if="step === 'focus'" key="focus" @next="handleFocusNext" />

      <StepDisease v-else-if="step === 'disease'" key="disease" @next="handleDiseaseNext" />

      <StepHabits v-else-if="step === 'habits'" key="habits" @next="handleHabitsNext" />

      <StepMealCount v-else-if="step === 'mealCount'" key="mealCount" @next="handleMealCountNext" />

      <StepActivityLevel
        v-else-if="step === 'activity'"
        key="activity"
        @next="handleActivityNext"
      />

      <StepActivityLevel
        v-else-if="step === 'activityGoal'"
        key="activityGoal"
        @next="handleActivityGoalNext"
      />

      <StepTargetWeight
        v-else-if="step === 'targetWeight'"
        key="targetWeight"
        :current-weight="userInfo.weight"
        :focus-type="focusType as 'diet' | 'bulkup'"
        @next="handleTargetWeightNext"
      />

      <StepWelcome v-else key="welcome" :nickname="nickname" @complete="handleWelcomeComplete" />
    </Transition>
  </SignupLayout>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
