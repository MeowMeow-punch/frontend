<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', diseases: string[]): void
}>()

const diseaseOptions = ['당뇨', '고혈압', '고지혈증', '갑상선 질환', '없음']
const diseases = ref<string[]>([])

const isValid = computed(() => diseases.value.length > 0)

const toggleDisease = (disease: string) => {
  if (disease === '없음') {
    diseases.value = ['없음']
    return
  }

  const filtered = diseases.value.filter((item) => item !== '없음')
  diseases.value = filtered.includes(disease)
    ? filtered.filter((item) => item !== disease)
    : [...filtered, disease]
}

const handleSubmit = () => {
  if (isValid.value) {
    emit('next', diseases.value)
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
        관리가 필요한<br />
        질환이 있나요?
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        맞춤형 식단 추천을 위해 필요해요
      </p>
    </div>

    <div class="space-y-2.5">
      <button
        v-for="disease in diseaseOptions"
        :key="disease"
        type="button"
        @click="toggleDisease(disease)"
        :class="[
          'w-full rounded-xl border-2 px-5 py-4 text-left text-[15px] transition-all active:scale-[0.98]',
          diseases.includes(disease)
            ? 'text-white'
            : 'text-[var(--gray-900)] hover:bg-[var(--gray-50)]',
        ]"
        :style="{
          fontWeight: 600,
          borderColor: diseases.includes(disease) ? '#00C73C' : 'var(--gray-300)',
          backgroundColor: diseases.includes(disease) ? '#00C73C' : undefined,
        }"
      >
        {{ disease }}
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
