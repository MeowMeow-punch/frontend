<script setup lang="ts">
const emit = defineEmits<{
  (e: 'next', count: string): void
}>()

const mealOptions = [
  { value: '1', label: '하루 1끼' },
  { value: '2', label: '하루 2끼' },
  { value: '3', label: '하루 3끼' },
  { value: '4+', label: '하루 4끼 이상' },
]
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1
        class="mb-3 text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        하루에 몇 끼<br />
        드시나요?
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        식사 패턴 파악을 위해 필요해요
      </p>
    </div>

    <div class="space-y-2.5">
      <button
        v-for="option in mealOptions"
        :key="option.value"
        type="button"
        @click="emit('next', option.value)"
        class="w-full rounded-xl border-2 border-[var(--gray-300)] px-5 py-4 text-left text-[15px] text-[var(--gray-900)] transition-all hover:bg-[var(--gray-50)] active:scale-[0.98]"
        style="font-weight: 600"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
