<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { searchGroups } from '@/services/authService'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'inline'
  }>(),
  { variant: 'default' },
)

const emit = defineEmits<{
  (e: 'next', affiliation: { id: number; name: string }): void
}>()

type GroupOption = { groupId: number; groupName: string }

const searchQuery = ref('')
const results = ref<GroupOption[]>([])
const selectedGroupId = ref<number | null>(null)
const selectedGroupName = ref('')
const isLoading = ref(false)
const error = ref('')
let debounceId: number | undefined

const trimmedQuery = computed(() => searchQuery.value.trim())
const hasQuery = computed(() => Boolean(trimmedQuery.value))
const isQueryTooShort = computed(() => hasQuery.value && trimmedQuery.value.length < 2)
const helperMessage = computed(() =>
  isQueryTooShort.value ? '검색어는 최소 2글자 이상이어야 합니다' : '',
)
const isInline = computed(() => props.variant === 'inline')
const containerClass = computed(() => (isInline.value ? 'space-y-6' : 'space-y-12'))
const inputClass = computed(() =>
  [
    'w-full border-b-2 border-[var(--gray-300)] bg-transparent px-0 transition-colors placeholder:text-[var(--gray-400)] focus:border-[var(--gray-900)] focus:outline-none',
    isInline.value ? 'py-2 pl-7 text-[14px]' : 'py-3 pl-8 text-[18px]',
  ].join(' '),
)
const resultButtonClass = computed(() =>
  [
    'w-full rounded-xl border-2 text-left transition-all active:scale-[0.98]',
    isInline.value ? 'px-4 py-3 text-[14px]' : 'px-4 py-4 text-[15px]',
  ].join(' '),
)
const submitButtonClass = computed(() =>
  [
    'w-full rounded-xl text-[16px] transition-all',
    isInline.value ? 'h-[44px] text-[14px]' : 'h-[56px] text-[16px]',
  ].join(' '),
)

const handleSelect = (affiliation: GroupOption) => {
  selectedGroupId.value = affiliation.groupId
  selectedGroupName.value = affiliation.groupName
}

const handleSubmit = () => {
  if (selectedGroupId.value !== null) {
    emit('next', { id: selectedGroupId.value, name: selectedGroupName.value })
  }
}

watch(searchQuery, (value) => {
  const query = value.trim()

  if (debounceId) {
    clearTimeout(debounceId)
    debounceId = undefined
  }

  error.value = ''
  selectedGroupId.value = null
  selectedGroupName.value = ''

  if (!query) {
    results.value = []
    return
  }

  if (query.length < 2) {
    results.value = []
    return
  }

  debounceId = window.setTimeout(async () => {
    isLoading.value = true
    try {
      console.info('[Signup] group search query', query)
      results.value = await searchGroups(query)
      console.info('[Signup] group search results', results.value)
    } catch (err) {
      console.error('Group search failed:', err)
      error.value = '검색에 실패했습니다. 잠시 후 다시 시도해주세요'
      results.value = []
    } finally {
      isLoading.value = false
    }
  }, 300)
})
</script>

<template>
  <div :class="containerClass">
    <div v-if="!isInline">
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
    <div v-else>
      <p class="text-[13px] text-[var(--gray-600)]" style="font-weight: 400">
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
          :class="inputClass"
          style="font-weight: 400"
        />
      </div>

      <div v-if="hasQuery" class="mt-6 space-y-2">
        <div
          v-if="helperMessage"
          class="py-4 text-center text-[14px] text-[var(--gray-500)]"
          style="font-weight: 400"
        >
          {{ helperMessage }}
        </div>
        <div
          v-else-if="isLoading"
          class="py-6 text-center text-[14px] text-[var(--gray-400)]"
          style="font-weight: 400"
        >
          검색 중...
        </div>
        <div
          v-else-if="error"
          class="py-6 text-center text-[14px] text-[var(--error-300)]"
          style="font-weight: 400"
        >
          {{ error }}
        </div>
        <template v-else-if="results.length">
          <button
            v-for="affiliation in results"
            :key="affiliation.groupId"
            type="button"
            @click="handleSelect(affiliation)"
            :class="[
              resultButtonClass,
              selectedGroupId === affiliation.groupId
                ? 'bg-[var(--gray-50)] text-[var(--gray-900)]'
                : 'bg-[var(--gray-50)] text-[var(--gray-900)] hover:bg-[var(--gray-100)]',
            ]"
            :style="{
              fontWeight: 600,
              borderColor: selectedGroupId === affiliation.groupId ? '#00C73C' : 'var(--gray-300)',
            }"
          >
            {{ affiliation.groupName }}
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
      :disabled="selectedGroupId === null"
      @click="handleSubmit"
      :class="[
        submitButtonClass,
        selectedGroupId !== null
          ? 'text-white active:scale-[0.98]'
          : 'cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]',
      ]"
      :style="{
        fontWeight: 600,
        backgroundColor: selectedGroupId !== null ? '#00C73C' : undefined,
      }"
    >
      다음
    </button>
  </div>
</template>
