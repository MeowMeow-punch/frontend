<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', allergies: string[]): void
}>()

const allergyOptions = ['땅콩', '새우', '우유', '계란', '밀가루', '대두', '생선', '견과류']
const allergies = ref<string[]>([])

const toggleAllergy = (allergy: string) => {
  allergies.value = allergies.value.includes(allergy)
    ? allergies.value.filter((item) => item !== allergy)
    : [...allergies.value, allergy]
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1
        class="mb-3 text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        알러지가 있나요?
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        해당하는 항목을 모두 선택해주세요
      </p>
    </div>

    <div class="grid grid-cols-4 gap-2.5">
      <button
        v-for="allergy in allergyOptions"
        :key="allergy"
        type="button"
        @click="toggleAllergy(allergy)"
        :class="[
          'rounded-xl border-2 py-3 text-[14px] transition-all active:scale-95',
          allergies.includes(allergy)
            ? 'text-white'
            : 'border-[var(--gray-300)] text-[var(--gray-700)] hover:bg-[var(--gray-50)]',
        ]"
        :style="{
          fontWeight: 600,
          borderColor: allergies.includes(allergy) ? '#00C73C' : undefined,
          backgroundColor: allergies.includes(allergy) ? '#00C73C' : undefined,
        }"
      >
        {{ allergy }}
      </button>
    </div>

    <button
      type="button"
      @click="emit('next', allergies)"
      class="h-[56px] w-full rounded-xl text-[16px] text-white transition-all active:scale-[0.98]"
      :style="{ fontWeight: 600, backgroundColor: '#00C73C' }"
    >
      {{ allergies.length > 0 ? `${allergies.length}개 선택 완료` : '건너뛰기' }}
    </button>
  </div>
</template>
