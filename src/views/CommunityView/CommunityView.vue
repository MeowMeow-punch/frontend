<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import CommunityDetail from './CommunityDetail.vue'

type Article = {
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
    summary:
      '급격한 체중 감량은 요요현상을 부르고 건강을 해칩니다. 지속 가능한 건강한 다이어트를 위한 5가지 핵심 원칙.',
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
const fallbackThumbnail =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'

const filteredColumns = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const categoryLabel = categories.find((c) => c.id === selectedCategory.value)?.label
  return expertColumns.filter((column) => {
    const matchesCategory = selectedCategory.value === 'all' || column.category === categoryLabel
    const matchesQuery =
      query === '' ||
      column.title.toLowerCase().includes(query) ||
      column.summary.toLowerCase().includes(query)
    return matchesCategory && matchesQuery
  })
})

const handleArticleSelect = (article: Article) => {
  selectedArticle.value = article
}

const handleImageError = (event: Event) => {
  ;(event.target as HTMLImageElement).src = fallbackThumbnail
}
</script>

<template>
  <CommunityDetail
    v-if="selectedArticle"
    :article="selectedArticle"
    @back="selectedArticle = null"
    @select-article="handleArticleSelect"
  />

  <div v-else class="min-h-screen bg-white">
    <div
      class="mx-auto max-w-6xl px-4 py-8 pb-16 md:px-8 md:py-12 md:pb-24 lg:px-12 lg:py-16 lg:pb-32"
    >
      <div class="mb-8 md:mb-10">
        <h1
          class="mb-2 text-[24px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--gray-900)] md:text-[28px]"
        >
          커뮤니티
        </h1>
        <p class="text-[15px] font-normal text-[var(--gray-600)]">전문가들의 건강 칼럼</p>
      </div>

      <div class="relative mb-8">
        <div
          class="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 transform text-[var(--gray-500)]"
        >
          <Search class="h-5 w-5" />
        </div>
        <input
          v-model="searchQuery"
          placeholder="궁금한 건강 정보를 검색해보세요"
          class="h-14 w-full rounded-2xl border-0 bg-[var(--gray-50)] pl-12 pr-4 text-[16px] font-normal text-[var(--gray-900)] outline-none ring-1 ring-inset ring-transparent transition-all duration-200 placeholder:text-[var(--gray-500)] hover:bg-[var(--gray-100)] focus:bg-white focus:ring-[var(--gray-300)]"
        />
      </div>

      <div class="scrollbar-hide mb-8 flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          class="whitespace-nowrap rounded-xl px-5 py-2.5 text-[14px] transition-all"
          :class="
            selectedCategory === category.id
              ? 'bg-[#00C73C] text-white shadow-md shadow-[#00C73C]/20'
              : 'border border-[var(--gray-200)] bg-white text-[var(--gray-700)] hover:border-[var(--gray-400)] hover:bg-[var(--gray-50)]'
          "
        >
          <span class="font-semibold">{{ category.label }}</span>
        </button>
      </div>

      <div class="mx-auto max-w-4xl">
        <div v-for="(column, index) in filteredColumns" :key="column.id" class="group">
          <div
            @click="handleArticleSelect(column)"
            class="cursor-pointer rounded-xl bg-white px-2 py-6 transition-colors hover:bg-[var(--gray-50)] md:px-4"
          >
            <div class="flex justify-between gap-5">
              <div class="flex min-w-0 flex-1 flex-col justify-between py-1">
                <div>
                  <div class="mb-2 flex items-center gap-2">
                    <span class="text-[13px] font-semibold text-[#00C73C]">
                      {{ column.category }}
                    </span>
                    <span class="h-3 w-0.5 bg-[var(--gray-300)]" />
                    <span class="text-[13px] font-normal text-[var(--gray-500)]">
                      {{ column.readTime }}
                    </span>
                  </div>

                  <h3
                    class="mb-2 line-clamp-2 text-[17px] font-bold leading-[1.4] text-[var(--gray-900)] md:text-[19px]"
                  >
                    {{ column.title }}
                  </h3>

                  <p
                    class="mb-3 line-clamp-2 text-[15px] font-normal leading-[1.6] text-[var(--gray-600)]"
                  >
                    {{ column.summary }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <p class="text-[13px] font-medium text-[var(--gray-500)]">
                    {{ column.author }} · {{ column.date }}
                  </p>
                </div>
              </div>

              <div
                class="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--gray-100)] md:h-36 md:w-36"
              >
                <img
                  :src="column.thumbnail"
                  :alt="column.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>

          <div
            v-if="index < filteredColumns.length - 1"
            class="mx-2 h-[1px] bg-[var(--gray-100)] md:mx-4"
          />
        </div>
      </div>

      <div
        v-if="filteredColumns.length === 0"
        class="rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-16 text-center"
      >
        <p class="text-[15px] font-normal text-[var(--gray-600)]">검색 결과가 없습니다</p>
      </div>
    </div>
  </div>
</template>
