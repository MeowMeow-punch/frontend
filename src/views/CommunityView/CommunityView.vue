<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import CommunityDetail from './CommunityDetail.vue'
import {
  getCommunityList,
  resolveCommunityImageUrl,
  searchCommunity,
  type CommunityCategoryValue,
  type CommunitySearchPost,
  type CommunitySummary,
} from '@/services/communityService'

type CommunityListItem = {
  id: number
  category: CommunityCategoryValue
  categoryLabel: string
  title: string
  author: string
  date: string
  likes: number
  thumbnail: string
  summary: string
  readTime: string
}

const categories = [
  { id: 'all', label: '전체', value: 'ALL' },
  { id: 'diet', label: '다이어트', value: 'DIET' },
  { id: 'exercise', label: '운동', value: 'EXERCISE' },
  { id: 'nutrition', label: '영양', value: 'NUTRIENT' },
  { id: 'disease', label: '질병관리', value: 'DISEASE' },
] as const

const categoryLabelMap: Record<string, string> = {
  DIET: '다이어트',
  EXERCISE: '운동',
  EXCERCISE: '운동',
  NUTRIENT: '영양',
  DISEASE: '질병관리',
}

const PAGE_SIZE = 5
const selectedCategory = ref<(typeof categories)[number]['id']>('all')
const searchQuery = ref('')
const selectedPostId = ref<number | null>(null)
const listItems = ref<CommunityListItem[]>([])
const searchItems = ref<CommunityListItem[]>([])
const searchCount = ref(0)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const isSearching = ref(false)
const hasNext = ref(false)
const nextCursor = ref<string | null>(null)
const fallbackThumbnail =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'

let listRequestId = 0
let searchRequestId = 0
let searchTimeout: number | null = null

const selectedCategoryValue = computed(
  () => categories.find((category) => category.id === selectedCategory.value)?.value ?? 'ALL',
)

const trimmedQuery = computed(() => searchQuery.value.trim())
const isSearchActive = computed(() => trimmedQuery.value.length >= 2)
const isQueryTooShort = computed(
  () => trimmedQuery.value.length > 0 && trimmedQuery.value.length < 2,
)
const displayItems = computed(() => (isSearchActive.value ? searchItems.value : listItems.value))

const formatDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

const formatReadingTime = (value?: number | string | null) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return `${value}분`
  return value
}

const mapSummaryToItem = (summary: CommunitySummary): CommunityListItem | null => {
  const id = summary.postId ?? summary.id
  if (!id) return null
  const readingTimeValue =
    summary.readingTime ?? (summary as { readingtime?: number | string }).readingtime
  return {
    id,
    category: summary.category,
    categoryLabel: categoryLabelMap[summary.category] ?? String(summary.category),
    title: summary.title,
    author: summary.writer,
    date: formatDate(summary.createdAt),
    likes: summary.likes,
    thumbnail: resolveCommunityImageUrl(summary.thumbnailUrl) || fallbackThumbnail,
    summary: summary.previewText,
    readTime: formatReadingTime(readingTimeValue),
  }
}

const mapSearchToItem = (post: CommunitySearchPost): CommunityListItem => ({
  id: post.postId,
  category: post.category,
  categoryLabel: categoryLabelMap[post.category] ?? String(post.category),
  title: post.title,
  author: post.writer,
  date: formatDate(post.createdAt),
  likes: post.likes,
  thumbnail: resolveCommunityImageUrl(post.thumbnailUrl) || fallbackThumbnail,
  summary: post.previewText,
  readTime: formatReadingTime(
    post.readingTime ?? (post as { readingtime?: number | string }).readingtime,
  ),
})

const fetchList = async (options: { reset?: boolean } = {}) => {
  const reset = options.reset ?? false
  const requestId = ++listRequestId
  const cursorId = reset ? null : nextCursor.value

  if (reset) {
    listItems.value = []
    nextCursor.value = null
    hasNext.value = false
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  console.info('[Community] list request', {
    category: selectedCategoryValue.value,
    cursorId,
    size: PAGE_SIZE,
  })

  try {
    const data = await getCommunityList({
      category: selectedCategoryValue.value,
      cursorId: cursorId ?? undefined,
      size: PAGE_SIZE,
    })
    if (requestId !== listRequestId) return

    const nextItems = Array.isArray(data?.posts)
      ? data.posts.map(mapSummaryToItem).filter((item): item is CommunityListItem => Boolean(item))
      : []
    listItems.value = reset ? nextItems : [...listItems.value, ...nextItems]
    nextCursor.value = data?.pageInfo?.nextCursor ?? null
    hasNext.value = Boolean(data?.pageInfo?.hasNext)
    console.info('[Community] list mapped', {
      count: listItems.value.length,
      hasNext: hasNext.value,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Community list fetch failed.'
    console.warn('[Community] list error', { message })
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const runSearch = async (keyword: string) => {
  const requestId = ++searchRequestId
  isSearching.value = true
  console.info('[Community] search request', { keyword })

  try {
    const data = await searchCommunity(keyword)
    if (requestId !== searchRequestId) return

    searchCount.value = data?.searchNum ?? 0
    searchItems.value = Array.isArray(data?.posts) ? data.posts.map(mapSearchToItem) : []
    console.info('[Community] search mapped', {
      keyword,
      count: searchItems.value.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Community search failed.'
    console.warn('[Community] search error', { keyword, message })
    searchCount.value = 0
    searchItems.value = []
  } finally {
    isSearching.value = false
  }
}

const scheduleSearch = (value: string) => {
  if (searchTimeout) {
    window.clearTimeout(searchTimeout)
  }

  if (value.trim().length < 2) {
    searchRequestId += 1
    searchItems.value = []
    searchCount.value = 0
    if (!value.trim()) {
      fetchList({ reset: true })
    }
    return
  }

  searchTimeout = window.setTimeout(() => {
    runSearch(value.trim())
  }, 300)
}

const handleArticleSelect = (articleId: number) => {
  selectedPostId.value = articleId
}

const handleImageError = (event: Event) => {
  ;(event.target as HTMLImageElement).src = fallbackThumbnail
}

watch(selectedCategory, () => {
  if (!isSearchActive.value) {
    fetchList({ reset: true })
  }
})

watch(searchQuery, (next) => {
  scheduleSearch(next)
})

onMounted(() => {
  fetchList({ reset: true })
})
</script>

<template>
  <CommunityDetail
    v-if="selectedPostId"
    :post-id="selectedPostId"
    @back="selectedPostId = null"
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
      <p v-if="isQueryTooShort" class="-mt-4 mb-6 text-[13px] text-[var(--gray-500)]">
        검색어는 2자 이상 입력해주세요.
      </p>

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
        <p v-if="isSearching" class="mb-4 text-[14px] text-[var(--gray-500)]">검색 중...</p>
        <p v-else-if="isSearchActive" class="mb-4 text-[14px] font-medium text-[var(--gray-500)]">
          검색 결과 {{ searchCount.toLocaleString() }}건
        </p>

        <div
          v-if="isLoading && displayItems.length === 0"
          class="rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-16 text-center"
        >
          <p class="text-[15px] font-normal text-[var(--gray-600)]">불러오는 중...</p>
        </div>

        <div v-else>
          <div v-for="(column, index) in displayItems" :key="column.id" class="group">
            <div
              @click="handleArticleSelect(column.id)"
              class="cursor-pointer rounded-xl bg-white px-2 py-6 transition-colors hover:bg-[var(--gray-50)] md:px-4"
            >
              <div class="flex justify-between gap-5">
                <div class="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <div class="mb-2 flex items-center gap-2">
                      <span class="text-[13px] font-semibold text-[#00C73C]">
                        {{ column.categoryLabel }}
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
              v-if="index < displayItems.length - 1"
              class="mx-2 h-[1px] bg-[var(--gray-100)] md:mx-4"
            />
          </div>
        </div>
      </div>

      <div
        v-if="displayItems.length === 0 && !isLoading && !isQueryTooShort"
        class="rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-16 text-center"
      >
        <p class="text-[15px] font-normal text-[var(--gray-600)]">검색 결과가 없습니다</p>
      </div>

      <div v-if="!isSearchActive && hasNext" class="mt-10 flex justify-center">
        <button
          type="button"
          class="h-11 rounded-xl border border-[var(--gray-200)] px-6 text-[14px] font-medium text-[var(--gray-700)] transition-colors hover:bg-[var(--gray-50)] disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isLoadingMore"
          @click="fetchList()"
        >
          {{ isLoadingMore ? '불러오는 중...' : '더보기' }}
        </button>
      </div>
    </div>
  </div>
</template>
