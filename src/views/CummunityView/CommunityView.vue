<script setup lang="ts">
import { computed, ref } from 'vue'
import CommunityDetail from './CommunityDetail.vue'

interface Article {
  id: number
  category: string
  title: string
  author: string
  date: string
  views: number
  likes: number
  thumbnail: string
  summary: string
  readTime: string
}

const categories = [
  { id: 'all', label: '전체' },
  { id: 'diet', label: '다이어트' },
  { id: 'exercise', label: '운동' },
  { id: 'nutrition', label: '영양' },
  { id: 'disease', label: '질병관리' },
]

const expertColumns: Article[] = [
  {
    id: 1,
    category: '영양',
    title: '단백질 섭취, 정말 많이 먹어야 할까?',
    author: '김영양 영양사',
    date: '2024.11.15',
    views: 12450,
    likes: 892,
    thumbnail:
      'https://images.unsplash.com/photo-1642497393790-c5751b818e1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGluZ3JlZGllbnRzfGVufDF8fHx8MTc2MzI4NjA2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    summary:
      '단백질은 근육 성장과 유지에 필수적인 영양소입니다. 하지만 무조건 많이 먹는다고 좋은 건 아닙니다.',
    readTime: '5분',
  },
  {
    id: 2,
    category: '다이어트',
    title: '건강한 다이어트, 이것만은 꼭 지키세요',
    author: '박건강 영양사',
    date: '2024.11.14',
    views: 21030,
    likes: 1560,
    thumbnail:
      'https://images.unsplash.com/photo-1587996580981-bd03dde74843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbnV0cml0aW9ufGVufDF8fHx8MTc2MzI2MjkxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    summary: '급격한 체중 감량은 요요현상을 부르고 건강을 해칩니다. 지속 가능한 건강한 다이어트를 위한 5가지 핵심 원칙.',
    readTime: '7분',
  },
  {
    id: 3,
    category: '운동',
    title: '운동 전후, 무엇을 먹어야 할까?',
    author: '이헬스 트레이너',
    date: '2024.11.13',
    views: 18760,
    likes: 1320,
    thumbnail:
      'https://images.unsplash.com/photo-1666819691716-827f78d892f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMGJvd2x8ZW58MXx8fHwxNzYzMjc3MjgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    summary: '운동 효과를 극대화하려면 적절한 시간에 올바른 영양소를 섭취해야 합니다.',
    readTime: '6분',
  },
  {
    id: 4,
    category: '질병관리',
    title: '당뇨 관리, 식단이 답입니다',
    author: '최의사 내과전문의',
    date: '2024.11.12',
    views: 16540,
    likes: 980,
    thumbnail:
      'https://images.unsplash.com/photo-1740560052706-fd75ee856b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb25pc3QlMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzYzMjU0NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    summary: '당뇨병 관리에서 약물 치료만큼 중요한 것이 식단 관리입니다.',
    readTime: '8분',
  },
]

const selectedCategory = ref('all')
const searchQuery = ref('')
const selectedArticle = ref<Article | null>(null)

const fallbackSrc =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" fill="none"><rect width="240" height="240" rx="16" fill="%23f1f5f9"/><path d="M64 152l32-40 40 48 24-32 32 40" stroke="%23cbd5e1" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="92" cy="92" r="18" fill="%23cbd5e1"/><rect x="32" y="32" width="176" height="176" rx="16" stroke="%23e2e8f0" stroke-width="12" stroke-dasharray="12 12"/></svg>'

const filteredColumns = computed(() => {
  const categoryLabel = categories.find((category) => category.id === selectedCategory.value)?.label
  const query = searchQuery.value.trim().toLowerCase()

  return expertColumns.filter((column) => {
    const matchesCategory = selectedCategory.value === 'all' || column.category === categoryLabel
    const matchesQuery =
      query === '' ||
      column.title.toLowerCase().includes(query) ||
      column.summary.toLowerCase().includes(query)
    return matchesCategory && matchesQuery
  })
})

const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (!target) return
  target.onerror = null
  target.src = fallbackSrc
}

const handleArticleClick = (article: Article) => {
  selectedArticle.value = article
}

const handleBack = () => {
  selectedArticle.value = null
}
</script>

<template>
  <CommunityDetail
    v-if="selectedArticle"
    :article="selectedArticle"
    @back="handleBack"
    @article-click="handleArticleClick"
  />

  <div v-else class="min-h-screen bg-[var(--gray-50)]">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="mb-2 text-3xl">커뮤니티</h1>
        <p class="text-[var(--gray-600)]">전문가들의 건강 칼럼</p>
      </div>

      <div class="mb-4 rounded-2xl border border-[var(--gray-200)] bg-white p-4">
        <div class="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[var(--gray-600)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="7" stroke-width="2" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" stroke-width="2" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="건강 정보를 검색해보세요"
            class="h-11 w-full rounded-xl border-0 bg-transparent pl-10 pr-3 text-[var(--gray-900)] focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="whitespace-nowrap rounded-lg px-4 py-2 transition-colors"
          :class="
            selectedCategory === category.id
              ? 'bg-[var(--main-300)] text-white'
              : 'border border-[var(--gray-200)] bg-white text-[var(--gray-700)] hover:border-[var(--main-300)]'
          "
          @click="selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="column in filteredColumns"
          :key="column.id"
          class="cursor-pointer overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white transition-colors hover:border-[var(--main-300)]"
          @click="handleArticleClick(column)"
        >
          <div class="flex gap-4 p-5">
            <div class="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl">
              <img
                :src="column.thumbnail"
                :alt="column.title"
                class="h-full w-full object-cover"
                @error="onImgError"
              />
            </div>

            <div class="min-w-0 flex-1">
              <div class="mb-2 flex items-center gap-2">
                <span class="rounded border border-[var(--gray-200)] bg-[var(--gray-100)] px-2 py-0.5 text-sm text-[var(--gray-700)]">
                  {{ column.category }}
                </span>
                <span class="flex items-center gap-1 text-sm text-[var(--gray-600)]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" stroke-width="2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
                  </svg>
                  {{ column.readTime }}
                </span>
              </div>

              <h3 class="mb-2 line-clamp-1">{{ column.title }}</h3>

              <p class="mb-3 line-clamp-2 text-[var(--gray-600)]">
                {{ column.summary }}
              </p>

              <div class="flex items-center justify-between">
                <p class="text-[var(--gray-600)]">{{ column.author }}</p>

                <div class="flex items-center gap-3 text-sm text-[var(--gray-600)]">
                  <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20.8 4.6c-1.44-3.4-4.78-3.4-6.64-1.64-.3.29-.56.6-.76.91a.11.11 0 01-.18 0 4.7 4.7 0 00-.76-.91C10.9 1.2 7.56 1.2 6.12 4.6c-1.02 2.4-.42 5.36 2.04 8.78a20.1 20.1 0 003.9 3.92.5.5 0 00.6 0 20.1 20.1 0 003.9-3.92c2.46-3.42 3.06-6.38 2.04-8.78z"
                      />
                    </svg>
                    {{ column.likes.toLocaleString() }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                      <circle cx="12" cy="12" r="3" stroke-width="2" />
                    </svg>
                    {{ (column.views / 1000).toFixed(1) }}k
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="filteredColumns.length === 0"
        class="mt-4 rounded-2xl border border-[var(--gray-200)] bg-white p-12 text-center"
      >
        <p class="text-[var(--gray-600)]">검색 결과가 없습니다</p>
      </div>
    </div>
  </div>
</template>
