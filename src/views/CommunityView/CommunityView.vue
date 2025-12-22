<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import CommunityDetail from './CommunityDetail.vue'
import {
  fetchCommunityDetail,
  fetchCommunityList,
  fetchCommunitySearch,
} from '@/services/communityService'
import type {
  CommunityCategoryPath,
  CommunityDetailResponse,
  CommunityPageInfo,
  CommunityPostSummary,
} from '@/types/community'

const categories: { id: CommunityCategoryPath; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'diet', label: '다이어트' },
  { id: 'exerise', label: '운동' },
  { id: 'nutrient', label: '영양' },
  { id: 'disease', label: '질병관리' },
]

const categoryLabelMap: Record<string, string> = {
  DIET: '다이어트',
  EXERISE: '운동',
  NUTRIENT: '영양',
  DISEASE: '질병관리',
}

const selectedCategory = ref<CommunityCategoryPath>('all')
const searchQuery = ref('')
const posts = ref<CommunityPostSummary[]>([])
const pageInfo = ref<CommunityPageInfo>({ nextCursor: null, hasNext: false })
const isLoading = ref(false)
const isLoadingMore = ref(false)
const isDetailLoading = ref(false)
const isSearchLoading = ref(false)
const errorMessage = ref('')
const selectedDetail = ref<CommunityDetailResponse['data'] | null>(null)
const activeKeyword = ref('')
const searchDebounceId = ref<number | null>(null)

const fallbackThumbnail =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'

const formatCategoryLabel = (code: string) => categoryLabelMap[code] ?? code

const formatDate = (isoString: string) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

const formatReadingTime = (value?: number) => {
  if (!value && value !== 0) return ''
  return `${value}분`
}

const resetPagination = () => {
  pageInfo.value = { nextCursor: null, hasNext: false }
}

const setLoadingFlags = (append: boolean, search: boolean) => {
  if (!append) {
    isLoading.value = !search
    isSearchLoading.value = search
  } else {
    isLoadingMore.value = true
  }
}

const loadPosts = async (category: CommunityCategoryPath, cursor?: string, append = false) => {
  errorMessage.value = ''
  if (!append) {
    resetPagination()
    if (!cursor) {
      posts.value = []
    }
  }
  setLoadingFlags(append, false)

  try {
    const response = await fetchCommunityList(category, cursor)
    const nextPosts = response.data?.posts ?? []
    posts.value = append ? [...posts.value, ...nextPosts] : nextPosts
    pageInfo.value = response.data?.pageInfo ?? { nextCursor: null, hasNext: false }
  } catch (error) {
    const message = error instanceof Error ? error.message : '커뮤니티 목록을 불러오지 못했습니다.'
    errorMessage.value = message
    if (!append) {
      posts.value = []
      resetPagination()
    }
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const loadSearch = async (keyword: string, cursor?: string, append = false) => {
  const trimmed = keyword.trim()
  errorMessage.value = ''
  if (!append) {
    resetPagination()
    posts.value = []
  }
  setLoadingFlags(append, true)

  if (!trimmed) {
    isLoadingMore.value = false
    isSearchLoading.value = false
    return
  }

  try {
    const response = await fetchCommunitySearch(trimmed, cursor)
    const nextPosts = response.data?.posts ?? []
    posts.value = append ? [...posts.value, ...nextPosts] : nextPosts
    pageInfo.value = response.data?.pageInfo ?? { nextCursor: null, hasNext: false }
  } catch (error) {
    const message = error instanceof Error ? error.message : '커뮤니티 검색에 실패했습니다.'
    errorMessage.value = message
    if (!append) {
      posts.value = []
      resetPagination()
    }
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
    isSearchLoading.value = false
  }
}

const loadDetail = async (postId: number) => {
  isDetailLoading.value = true
  errorMessage.value = ''
  try {
    const detail = await fetchCommunityDetail(postId)
    selectedDetail.value = detail
  } catch (error) {
    const message = error instanceof Error ? error.message : '콘텐츠를 불러오지 못했습니다.'
    errorMessage.value = message
    selectedDetail.value = null
  } finally {
    isDetailLoading.value = false
  }
}

const handleArticleSelect = (article: CommunityPostSummary) => {
  loadDetail(article.postId)
}

const handleRelatedSelect = (postId: number) => {
  loadDetail(postId)
}

const handleImageError = (event: Event) => {
  ;(event.target as HTMLImageElement).src = fallbackThumbnail
}

const filteredPosts = computed(() => {
  return posts.value
})

const loadMore = () => {
  if (!pageInfo.value.hasNext || isLoadingMore.value) return
  const cursor = pageInfo.value.nextCursor ?? undefined
  if (activeKeyword.value) {
    loadSearch(activeKeyword.value, cursor, true)
  } else {
    loadPosts(selectedCategory.value, cursor, true)
  }
}

onMounted(() => {
  loadPosts(selectedCategory.value)
})

watch(
  () => searchQuery.value,
  (value) => {
    if (searchDebounceId.value) {
      window.clearTimeout(searchDebounceId.value)
    }
    searchDebounceId.value = window.setTimeout(() => {
      activeKeyword.value = value.trim()
      if (activeKeyword.value) {
        loadSearch(activeKeyword.value)
      } else {
        loadPosts(selectedCategory.value)
      }
    }, 300)
  },
)
</script>

<template>
  <CommunityDetail
    v-if="selectedDetail"
    :detail="selectedDetail"
    @back="selectedDetail = null"
    @select-related="handleRelatedSelect"
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
          @click="
            () => {
              selectedCategory = category.id
              loadPosts(category.id)
            }
          "
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
        <div v-if="isLoading" class="py-10 text-center text-[15px] text-[var(--gray-600)]">
          목록을 불러오는 중입니다...
        </div>

        <div v-else-if="errorMessage" class="py-10 text-center text-[15px] text-[var(--error-500)]">
          {{ errorMessage }}
        </div>

        <div
          v-else-if="filteredPosts.length === 0"
          class="py-10 text-center text-[15px] text-[var(--gray-600)]"
        >
          검색 결과가 없습니다
        </div>

        <div v-else v-for="(column, index) in filteredPosts" :key="column.postId" class="group">
          <div
            @click="handleArticleSelect(column)"
            class="cursor-pointer rounded-xl bg-white px-2 py-6 transition-colors hover:bg-[var(--gray-50)] md:px-4"
          >
            <div class="flex justify-between gap-5">
              <div class="flex min-w-0 flex-1 flex-col justify-between py-1">
                <div>
                  <div class="mb-2 flex items-center gap-2">
                    <span class="text-[13px] font-semibold text-[#00C73C]">
                      {{ formatCategoryLabel(column.category) }}
                    </span>
                    <span class="h-3 w-0.5 bg-[var(--gray-300)]" />
                    <span
                      v-if="formatReadingTime(column.readingTime)"
                      class="text-[13px] font-normal text-[var(--gray-500)]"
                    >
                      {{ formatReadingTime(column.readingTime) }}
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
                    {{ column.previewText }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <p class="text-[13px] font-medium text-[var(--gray-500)]">
                    {{ column.writer }} · {{ formatDate(column.createdAt) }}
                  </p>
                </div>
              </div>

              <div
                class="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--gray-100)] md:h-36 md:w-36"
              >
                <img
                  :src="column.thumbnailUrl"
                  :alt="column.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>

          <div
            v-if="index < filteredPosts.length - 1"
            class="mx-2 h-[1px] bg-[var(--gray-100)] md:mx-4"
          />
        </div>

        <div v-if="pageInfo.hasNext && !isLoading" class="mt-8 flex justify-center">
          <button
            type="button"
            class="h-12 min-w-[160px] rounded-xl border border-[var(--gray-200)] bg-white px-4 text-[14px] font-semibold text-[var(--gray-700)] transition hover:bg-[var(--gray-50)] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoadingMore"
            @click="loadMore"
          >
            {{ isLoadingMore ? '불러오는 중...' : '더 보기' }}
          </button>
        </div>
      </div>

      <div
        v-if="isDetailLoading"
        class="rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-16 text-center"
      >
        <p class="text-[15px] font-normal text-[var(--gray-600)]">콘텐츠를 불러오는 중입니다...</p>
      </div>
    </div>
  </div>
</template>
