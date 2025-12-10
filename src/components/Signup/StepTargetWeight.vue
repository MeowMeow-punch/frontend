<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  currentWeight: string
  focusType: 'diet' | 'bulkup'
}>()

const emit = defineEmits<{
  (e: 'next', weight: string): void
}>()

const targetWeight = ref('')
const title = computed(() => '목표 체중을\n알려주세요')
const subtitle = computed(() =>
  props.focusType === 'diet'
    ? '건강한 감량 속도로 계획을 세워드려요'
    : '건강한 증량 속도로 계획을 세워드려요',
)

const handleSubmit = () => {
  if (targetWeight.value) {
    emit('next', targetWeight.value)
  }
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1
        class="mb-3 whitespace-pre-line text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        {{ title }}
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        {{ subtitle }}
      </p>
    </div>

    <div class="space-y-8">
      <div class="rounded-xl bg-[var(--gray-50)] p-5 text-center">
        <p class="mb-1 text-[13px] text-[var(--gray-600)]" style="font-weight: 600">현재 체중</p>
        <p class="text-[24px] text-[var(--gray-900)]" style="font-weight: 700">
          {{ currentWeight }} kg
        </p>
      </div>

      <div>
        <label class="mb-3 block text-[13px] text-[var(--gray-600)]" style="font-weight: 600">
          목표 체중
        </label>
        <div class="relative">
          <input
            type="number"
            v-model="targetWeight"
            placeholder="60"
            autofocus
            @keyup.enter="targetWeight && handleSubmit()"
            class="w-full border-b-2 border-[var(--gray-300)] bg-transparent px-0 py-3 pr-12 text-[18px] transition-colors placeholder:text-[var(--gray-400)] focus:border-[var(--gray-900)] focus:outline-none"
            style="font-weight: 400"
          />
          <span
            class="absolute bottom-3 right-0 text-[16px] text-[var(--gray-500)]"
            style="font-weight: 400"
          >
            kg
          </span>
        </div>
      </div>
    </div>

    <button
      type="button"
      :disabled="!targetWeight"
      @click="handleSubmit"
      :class="[
        'h-[56px] w-full rounded-xl text-[16px] transition-all',
        targetWeight
          ? 'text-white active:scale-[0.98]'
          : 'cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]',
      ]"
      :style="{
        fontWeight: 600,
        backgroundColor: targetWeight ? '#00C73C' : undefined,
      }"
    >
      다음
    </button>
  </div>
</template>
