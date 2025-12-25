<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import SignupLayout from '@/components/Layouts/SignupLayout.vue'
import StepDisease from '@/components/Signup/StepDisease.vue'
import StepHabits from '@/components/Signup/StepHabits.vue'
import StepMealCount from '@/components/Signup/StepMealCount.vue'
import StepActivityLevel from '@/components/Signup/StepActivityLevel.vue'
import StepTargetWeight from '@/components/Signup/StepTargetWeight.vue'
import { updateDiet, type UpdateDietRequest } from '@/services/authService'
import { useModalStore } from '@/stores/modalStore'

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
  (e: 'save', payload: { focus: UserType; targetWeight: string }): void
}>()

const modalStore = useModalStore()
const selectedType = ref<UserType | null>(null)
const step = ref<Step>('type')

const diseases = ref<string[]>([])
const habits = ref({ smoking: '', drinking: '' })
const mealCount = ref('')
const activityLevel = ref('')
const targetWeight = ref('')
const isSaving = ref(false)

const totalSteps = computed(() => (selectedType.value === '영양관리' ? 4 : 3))
const currentStepNumber = computed(() => {
  if (selectedType.value === '영양관리') {
    const stepMap: Record<Step, number> = {
      type: 0,
      disease: 1,
      habits: 2,
      mealCount: 3,
      activity: 4,
      activityGoal: 0,
      targetWeight: 0,
    }
    return stepMap[step.value] || 0
  }

  const stepMap: Record<Step, number> = {
    type: 0,
    disease: 0,
    habits: 0,
    mealCount: 1,
    activity: 0,
    activityGoal: 2,
    targetWeight: 3,
  }
  return stepMap[step.value] || 0
})

const progress = computed(() => {
  if (!totalSteps.value) return 0
  return Math.min(100, Math.max(0, (currentStepNumber.value / totalSteps.value) * 100))
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
  if (selectedType.value === '영양관리') {
    step.value = 'activity'
    return
  }
  step.value = 'activityGoal'
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
  step.value = type === '영양관리' ? 'disease' : 'mealCount'
}

const mapFocus = (type: UserType): UpdateDietRequest['focus'] => {
  if (type === '다이어트') return 'DIET'
  if (type === '체중증량') return 'MUSCLE'
  return 'HEALTHY'
}

const mapMealCount = (count: string): UpdateDietRequest['meals'] => {
  if (count === '1') return 'ONE'
  if (count === '2') return 'TWO'
  if (count === '3') return 'THREE'
  return 'ETC'
}

const mapActivityLevel = (level: string): UpdateDietRequest['activityLevel'] => {
  if (level === 'low') return 'LOW'
  if (level === 'medium') return 'MEDIUM'
  if (level === 'high') return 'HIGH'
  return 'VERYHIGH'
}

const mapHabit = (value: string): NonNullable<UpdateDietRequest['isSmoking']> => {
  if (value === 'none') return 'NONE'
  if (value === 'sometime') return 'SOMETIME'
  return 'OFTEN'
}

const handleComplete = async () => {
  if (!selectedType.value) {
    return
  }

  if (isSaving.value) {
    return
  }

  if (!mealCount.value) {
    await modalStore.openAppModal({
      title: '선택 누락',
      content: '식사 횟수를 선택해주세요.',
      type: 'warning',
    })
    return
  }

  if (!activityLevel.value) {
    await modalStore.openAppModal({
      title: '선택 누락',
      content: '활동량을 선택해주세요.',
      type: 'warning',
    })
    return
  }

  let targetWeightValue: number | undefined
  const focus = mapFocus(selectedType.value)
  if (focus !== 'HEALTHY') {
    const parsedTarget = Number(targetWeight.value)
    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      await modalStore.openAppModal({
        title: '입력 오류',
        content: '목표 체중을 올바르게 입력해주세요.',
        type: 'warning',
      })
      return
    }
    targetWeightValue = parsedTarget
  }

  isSaving.value = true
  try {
    const payload = {
      focus,
      meals: mapMealCount(mealCount.value),
      activityLevel: mapActivityLevel(activityLevel.value),
      targetWeight: targetWeightValue,
      isSmoking: focus === 'HEALTHY' ? mapHabit(habits.value.smoking) : undefined,
      isDrinking: focus === 'HEALTHY' ? mapHabit(habits.value.drinking) : undefined,
    }

    const response = await updateDiet(payload)
    if (response.code !== 200) {
      await modalStore.openAppModal({
        title: '수정 실패',
        content: response.message || '목표 수정에 실패했습니다.',
        type: 'error',
      })
      return
    }

    emit('save', {
      focus: selectedType.value,
      targetWeight: targetWeight.value,
    })
  } catch (error) {
    console.error('Diet update failed:', error)
    await modalStore.openAppModal({
      title: '오류 발생',
      content: '목표 수정에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      type: 'error',
    })
  } finally {
    isSaving.value = false
  }
}

const handleStepBack = () => {
  if (step.value === 'disease') {
    step.value = 'type'
    selectedType.value = null
  } else if (step.value === 'activityGoal') {
    step.value = selectedType.value === '영양관리' ? 'type' : 'mealCount'
  } else if (step.value === 'habits') {
    step.value = 'disease'
  } else if (step.value === 'mealCount') {
    step.value = selectedType.value === '영양관리' ? 'habits' : 'type'
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
          <div class="mb-4 text-[40px]">🥗</div>
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
          <div class="mb-4 text-[40px]">🏃</div>
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
          <div class="mb-4 text-[40px]">💪</div>
          <h3 class="mb-2 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">체중증량</h3>
          <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
            근육 성장과 체중 증가
          </p>
        </button>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-white">
    <div class="mx-auto max-w-[960px] px-4 py-8 md:px-8 md:py-12">
      <!-- Back Button -->
      <button
        type="button"
        class="mb-4 flex items-center gap-2 text-[var(--gray-600)] transition-colors hover:text-[var(--gray-900)]"
        @click="handleStepBack"
      >
        <ArrowLeft class="h-5 w-5" />
        <span class="text-[14px]" style="font-weight: 500">뒤로가기</span>
      </button>

      <!-- Progress Bar -->
      <div class="mb-8 w-full">
        <div class="h-[2px] w-full bg-[var(--gray-100)]">
          <div
            class="h-full transition-all duration-300"
            :style="{ width: `${progress}%`, backgroundColor: '#00C73C' }"
          />
        </div>
      </div>

      <SignupLayout
        :current-step="currentStepNumber"
        :total-steps="totalSteps"
        :step-title="''"
        :step-description="''"
        :show-progress="false"
        @back="handleStepBack"
      >
        <Transition name="fade-slide" mode="out-in">
          <StepDisease v-if="step === 'disease'" key="disease" @next="handleDiseaseNext" />

          <StepHabits v-else-if="step === 'habits'" key="habits" @next="handleHabitsNext" />

          <StepMealCount
            v-else-if="step === 'mealCount'"
            key="mealCount"
            @next="handleMealCountNext"
          />

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
    </div>
  </div>
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
