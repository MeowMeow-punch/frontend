<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', habits: { smoking: string; drinking: string }): void
}>()

const smokingOptions = [
  { value: 'none', label: '비흡연' },
  { value: 'light', label: '가끔' },
  { value: 'moderate', label: '보통' },
  { value: 'heavy', label: '자주' },
]

const drinkingOptions = [
  { value: 'none', label: '음주 안함' },
  { value: 'light', label: '가끔 (월 1-2회)' },
  { value: 'moderate', label: '보통 (주 1-2회)' },
  { value: 'heavy', label: '자주 (주 3회 이상)' },
]

const smoking = ref('')
const drinking = ref('')
const currentQuestion = ref<'smoking' | 'drinking'>('smoking')

const handleSmokingNext = (value: string) => {
  smoking.value = value
  currentQuestion.value = 'drinking'
}

const handleDrinkingNext = (value: string) => {
  drinking.value = value
  emit('next', { smoking: smoking.value, drinking: value })
}
</script>

<template>
  <div v-if="currentQuestion === 'smoking'" class="space-y-12">
    <div>
      <h1
        class="mb-3 text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        흡연을 하시나요?
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        건강 상태 파악을 위해 필요해요
      </p>
    </div>

    <div class="space-y-2.5">
      <button
        v-for="option in smokingOptions"
        :key="option.value"
        type="button"
        @click="handleSmokingNext(option.value)"
        class="w-full rounded-xl border-2 border-[var(--gray-300)] px-5 py-4 text-left text-[15px] text-[var(--gray-900)] transition-all hover:bg-[var(--gray-50)] active:scale-[0.98]"
        style="font-weight: 600"
      >
        {{ option.label }}
      </button>
    </div>
  </div>

  <div v-else class="space-y-12">
    <div>
      <h1
        class="mb-3 text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        음주는<br />
        얼마나 하시나요?
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        건강 상태 파악을 위해 필요해요
      </p>
    </div>

    <div class="space-y-2.5">
      <button
        v-for="option in drinkingOptions"
        :key="option.value"
        type="button"
        @click="handleDrinkingNext(option.value)"
        class="w-full rounded-xl border-2 border-[var(--gray-300)] px-5 py-4 text-left text-[15px] text-[var(--gray-900)] transition-all hover:bg-[var(--gray-50)] active:scale-[0.98]"
        style="font-weight: 600"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
