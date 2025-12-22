<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', level: string): void
}>()

const activityLevels = [
  { value: 'low', label: '낮음', desc: '주로 앉아서 생활' },
  { value: 'medium', label: '보통', desc: '가벼운 운동이나 활동 (주 1-3회)' },
  { value: 'high', label: '높음', desc: '규칙적인 운동 (주 3-5회)' },
  { value: 'veryhigh', label: '매우 높음', desc: '강도 높은 운동 (주 6-7회)' },
]

const activityLevel = ref('')
const isValid = computed(() => !!activityLevel.value)

const handleSubmit = () => {
  if (isValid.value) {
    emit('next', activityLevel.value)
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
        평소 활동량은<br />
        어느 정도인가요?
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        정확한 칼로리 계산을 위해 필요해요
      </p>
    </div>

    <div class="space-y-2.5">
      <button
        v-for="level in activityLevels"
        :key="level.value"
        type="button"
        @click="activityLevel = level.value"
        :class="[
          'w-full rounded-xl border-2 px-5 py-4 text-left transition-all active:scale-[0.98]',
          activityLevel === level.value
            ? 'text-white'
            : 'text-[var(--gray-900)] hover:bg-[var(--gray-50)]',
        ]"
        :style="{
          borderColor: activityLevel === level.value ? '#00C73C' : 'var(--gray-300)',
          backgroundColor: activityLevel === level.value ? '#00C73C' : undefined,
        }"
      >
        <div class="mb-1 text-[15px]" style="font-weight: 600">
          {{ level.label }}
        </div>
        <p
          class="text-[13px]"
          :style="{
            fontWeight: 400,
            color: activityLevel === level.value ? 'rgba(255, 255, 255, 0.8)' : 'var(--gray-600)',
          }"
        >
          {{ level.desc }}
        </p>
      </button>
    </div>

    <button
      type="button"
      :disabled="!isValid"
      @click="handleSubmit"
      :class="[
        'h-[56px] w-full rounded-xl text-[16px] transition-all',
        isValid
          ? 'text-white active:scale-[0.98]'
          : 'cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]',
      ]"
      :style="{
        fontWeight: 600,
        backgroundColor: isValid ? '#00C73C' : undefined,
      }"
    >
      다음
    </button>
  </div>
</template>
