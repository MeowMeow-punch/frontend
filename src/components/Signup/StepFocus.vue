<script setup lang="ts">
import { ref } from 'vue'

type FocusType = 'nutrition' | 'diet' | 'bulkup' | null

const emit = defineEmits<{
  (e: 'next', focus: FocusType): void
}>()

const focusOptions = [
  { value: 'nutrition' as const, emoji: '🥗', label: '영양 관리', desc: '균형 잡힌 영양소 섭취' },
  { value: 'diet' as const, emoji: '🏃', label: '다이어트', desc: '건강한 체중 감량' },
  { value: 'bulkup' as const, emoji: '💪', label: '체중 증량', desc: '근육과 체중 증가' },
]

const focusType = ref<FocusType>(null)

const handleSubmit = () => {
  if (focusType.value) {
    emit('next', focusType.value)
  }
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1
        class="mb-3 text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        어떤 목표를<br />
        가지고 계신가요?
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        목표에 맞는 맞춤 식단을 제공해드려요
      </p>
    </div>

    <div class="space-y-3">
      <button
        v-for="option in focusOptions"
        :key="option.value"
        type="button"
        @click="focusType = option.value"
        :class="[
          'w-full rounded-xl border-2 px-5 py-5 text-left transition-all active:scale-[0.98]',
          focusType === option.value ? 'bg-[var(--gray-50)]' : 'hover:bg-[var(--gray-50)]',
        ]"
        :style="{
          borderColor: focusType === option.value ? '#00C73C' : 'var(--gray-300)',
        }"
      >
        <div class="flex items-center gap-3">
          <span class="text-3xl">{{ option.emoji }}</span>
          <div class="flex-1">
            <div class="mb-1 text-[16px] text-[var(--gray-900)]" style="font-weight: 600">
              {{ option.label }}
            </div>
            <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
              {{ option.desc }}
            </p>
          </div>
        </div>
      </button>
    </div>

    <button
      type="button"
      :disabled="!focusType"
      @click="handleSubmit"
      :class="[
        'h-[56px] w-full rounded-xl text-[16px] transition-all',
        focusType
          ? 'text-white active:scale-[0.98]'
          : 'cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]',
      ]"
      :style="{
        fontWeight: 600,
        backgroundColor: focusType ? '#00C73C' : undefined,
      }"
    >
      다음
    </button>
  </div>
</template>
