<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', affiliation: string): void
}>()

const affiliations = [
  'SSAFY 12기',
  '삼성전자',
  'SK하이닉스',
  'LG전자',
  '네이버',
  '카카오',
  'LINE',
  '쿠팡',
  '배달의민족',
  '토스',
]

const searchQuery = ref('')
const selectedAffiliation = ref('')

const filteredAffiliations = computed(() =>
  affiliations.filter((affiliation) =>
    affiliation.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)

const handleSubmit = () => {
  if (selectedAffiliation.value) {
    emit('next', selectedAffiliation.value)
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
        소속을 검색해주세요
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        소속명을 입력하면 검색 결과가 나타나요
      </p>
    </div>

    <div>
      <div class="relative">
        <span class="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--gray-400)]"
          >🔍</span
        >
        <input
          v-model="searchQuery"
          placeholder="소속명 검색"
          autofocus
          class="w-full border-b-2 border-[var(--gray-300)] bg-transparent px-0 py-3 pl-8 text-[18px] transition-colors placeholder:text-[var(--gray-400)] focus:border-[var(--gray-900)] focus:outline-none"
          style="font-weight: 400"
        />
      </div>

      <div v-if="searchQuery" class="mt-6 space-y-2">
        <template v-if="filteredAffiliations.length">
          <button
            v-for="affiliation in filteredAffiliations"
            :key="affiliation"
            type="button"
            @click="selectedAffiliation = affiliation"
            :class="[
              'w-full rounded-xl border-2 px-4 py-4 text-left text-[15px] transition-all active:scale-[0.98]',
              selectedAffiliation === affiliation
                ? 'bg-[var(--gray-50)] text-[var(--gray-900)]'
                : 'bg-[var(--gray-50)] text-[var(--gray-900)] hover:bg-[var(--gray-100)]',
            ]"
            :style="{
              fontWeight: 600,
              borderColor: selectedAffiliation === affiliation ? '#00C73C' : 'var(--gray-300)',
            }"
          >
            {{ affiliation }}
          </button>
        </template>
        <div
          v-else
          class="py-8 text-center text-[14px] text-[var(--gray-400)]"
          style="font-weight: 400"
        >
          검색 결과가 없습니다
        </div>
      </div>
    </div>

    <button
      type="button"
      :disabled="!selectedAffiliation"
      @click="handleSubmit"
      :class="[
        'h-[56px] w-full rounded-xl text-[16px] transition-all',
        selectedAffiliation
          ? 'text-white active:scale-[0.98]'
          : 'cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]',
      ]"
      :style="{
        fontWeight: 600,
        backgroundColor: selectedAffiliation ? '#00C73C' : undefined,
      }"
    >
      다음
    </button>
  </div>
</template>
