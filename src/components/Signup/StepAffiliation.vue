<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', type: 'individual' | 'group'): void
}>()

const affiliationType = ref<'individual' | 'group'>('individual')

const handleSubmit = () => {
  emit('next', affiliationType.value)
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1
        class="mb-3 text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        소속을 선택해주세요
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        그룹으로 선택하면 함께 관리할 수 있어요
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        @click="affiliationType = 'individual'"
        :class="[
          'rounded-xl border-2 py-10 transition-all active:scale-95',
          affiliationType === 'individual' ? 'bg-[var(--gray-50)]' : 'hover:bg-[var(--gray-50)]',
        ]"
        :style="{
          borderColor: affiliationType === 'individual' ? '#00C73C' : 'var(--gray-300)',
        }"
      >
        <div class="space-y-3 text-center">
          <div class="text-5xl">👤</div>
          <div class="text-[16px] text-[var(--gray-900)]" style="font-weight: 600">개인</div>
        </div>
      </button>

      <button
        type="button"
        @click="affiliationType = 'group'"
        :class="[
          'rounded-xl border-2 py-10 transition-all active:scale-95',
          affiliationType === 'group' ? 'bg-[var(--gray-50)]' : 'hover:bg-[var(--gray-50)]',
        ]"
        :style="{
          borderColor: affiliationType === 'group' ? '#00C73C' : 'var(--gray-300)',
        }"
      >
        <div class="space-y-3 text-center">
          <div class="text-5xl">👥</div>
          <div class="text-[16px] text-[var(--gray-900)]" style="font-weight: 600">그룹</div>
        </div>
      </button>
    </div>

    <button
      type="button"
      @click="handleSubmit"
      class="h-[56px] w-full rounded-xl text-[16px] text-white transition-all active:scale-[0.98]"
      :style="{ fontWeight: 600, backgroundColor: '#00C73C' }"
    >
      다음
    </button>
  </div>
</template>
