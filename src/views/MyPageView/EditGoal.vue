<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, Heart, TrendingDown, TrendingUp } from 'lucide-vue-next'
import SignupLayout from '@/components/Layouts/SignupLayout.vue'
import StepDisease from '@/components/Signup/StepDisease.vue'
import StepHabits from '@/components/Signup/StepHabits.vue'
import StepMealCount from '@/components/Signup/StepMealCount.vue'
import StepActivityLevel from '@/components/Signup/StepActivityLevel.vue'
import StepTargetWeight from '@/components/Signup/StepTargetWeight.vue'

type UserType = '영양관리' | '다이어트' | '체중증량'
type FocusType = 'diet' | 'bulkup'
type Step =
  | 'type'
  | 'disease'
  | 'habits'
  | 'mealCount'
  | 'activity'
  | 'activityGoal'
  | 'targetWeight'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'save'): void
}>()

const selectedType = ref<UserType | null>(null)
const step = ref<Step>('type')

const diseases = ref<string[]>([])
const habits = ref({ smoking: '', drinking: '' })
const mealCount = ref('')
const activityLevel = ref('')
const targetWeight = ref('')

const totalSteps = computed(() => (selectedType.value === '영양관리' ? 5 : 3))
const currentStepNumber = computed(() => {
  const stepMap: Record<Step, number> = {
    type: 0,
    disease: 1,
    habits: 2,
    mealCount: 3,
    activity: 4,
    activityGoal: 1,
    targetWeight: 2,
  }
  return stepMap[step.value] || 0
})

const focusType = computed<FocusType>(() => (selectedType.value === '다이어트' ? 'diet' : 'bulkup'))

const handleDiseaseNext = (data: string[]) => {
  diseases.value = data
  step.value = 'habits'
}

const handleHabitsNext = (data: { smoking: string; drinking: string }) => {
  habits.value = data
  step.value = 'mealCount'
}

const handleMealCountNext = (data: string) => {
  mealCount.value = data
  step.value = 'activity'
}

const handleActivityNext = (data: string) => {
  activityLevel.value = data
  handleComplete()
}

const handleActivityGoalNext = (data: string) => {
  activityLevel.value = data
  step.value = 'targetWeight'
}

const handleTargetWeightNext = (data: string) => {
  targetWeight.value = data
  handleComplete()
}

const handleTypeSelect = (type: UserType) => {
  selectedType.value = type
  step.value = type === '영양관리' ? 'disease' : 'activityGoal'
}

const handleComplete = () => {
  emit('save')
}

const handleStepBack = () => {
  if (step.value === 'disease' || step.value === 'activityGoal') {
    step.value = 'type'
    selectedType.value = null
  } else if (step.value === 'habits') {
    step.value = 'disease'
  } else if (step.value === 'mealCount') {
    step.value = 'habits'
  } else if (step.value === 'activity') {
    step.value = 'mealCount'
  } else if (step.value === 'targetWeight') {
    step.value = 'activityGoal'
  } else {
    emit('back')
  }
}
</script>

<template>
  <div v-if="step === 'type'" class="min-h-screen bg-white">
    <div class="mx-auto max-w-[960px] px-4 py-8 pb-16 md:px-8 md:py-12 md:pb-24">
      <button
        type="button"
        class="mb-6 flex items-center gap-2 text-[var(--gray-600)] transition-colors hover:text-[var(--gray-900)]"
        @click="emit('back')"
      >
        <ArrowLeft class="h-5 w-5" />
        <span class="text-[14px]" style="font-weight: 500">뒤로가기</span>
      </button>

      <div class="mb-8">
        <h1
          class="mb-2 text-[20px] leading-[1.4] tracking-[-0.02em] text-[var(--gray-900)] md:text-[22px]"
          style="font-weight: 700"
        >
          목표 수정
        </h1>
        <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
          새로운 목표를 선택해주세요
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          type="button"
          @click="handleTypeSelect('영양관리')"
          :class="[
            'rounded-2xl border-2 bg-white p-6 text-left transition-all hover:border-[#00C73C]',
            selectedType === '영양관리'
              ? 'border-[#00C73C] ring-2 ring-[#00C73C]/20'
              : 'border-[var(--gray-200)]',
          ]"
        >
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6F9ED]">
            <Heart class="h-7 w-7 text-[#00C73C]" />
          </div>
          <h3 class="mb-2 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">영양관리</h3>
          <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
            건강한 식습관과 균형잡힌 영양소 섭취
          </p>
        </button>

        <button
          type="button"
          @click="handleTypeSelect('다이어트')"
          :class="[
            'rounded-2xl border-2 bg-white p-6 text-left transition-all hover:border-[#00C73C]',
            selectedType === '다이어트'
              ? 'border-[#00C73C] ring-2 ring-[#00C73C]/20'
              : 'border-[var(--gray-200)]',
          ]"
        >
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6F9ED]">
            <TrendingDown class="h-7 w-7 text-[#00C73C]" />
          </div>
          <h3 class="mb-2 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">다이어트</h3>
          <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
            건강한 방법으로 체중 감량
          </p>
        </button>

        <button
          type="button"
          @click="handleTypeSelect('체중증량')"
          :class="[
            'rounded-2xl border-2 bg-white p-6 text-left transition-all hover:border-[#00C73C]',
            selectedType === '체중증량'
              ? 'border-[#00C73C] ring-2 ring-[#00C73C]/20'
              : 'border-[var(--gray-200)]',
          ]"
        >
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6F9ED]">
            <TrendingUp class="h-7 w-7 text-[#00C73C]" />
          </div>
          <h3 class="mb-2 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">체중증량</h3>
          <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
            근육 성장과 체중 증가
          </p>
        </button>
      </div>
    </div>
  </div>

  <SignupLayout
    v-else
    :current-step="currentStepNumber"
    :total-steps="totalSteps"
    :step-title="''"
    :step-description="''"
    @back="handleStepBack"
    @logo="emit('back')"
  >
    <Transition name="fade-slide" mode="out-in">
      <StepDisease v-if="step === 'disease'" key="disease" @next="handleDiseaseNext" />

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
        :current-weight="'73'"
        :focus-type="focusType"
        @next="handleTargetWeightNext"
      />
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
