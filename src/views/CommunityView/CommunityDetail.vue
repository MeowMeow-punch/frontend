<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowLeft, Heart, User, Share2, Link, MessageCircle, Twitter } from 'lucide-vue-next'
import type { CommunityDetailPost, CommunityRelatedPost } from '@/types/community'

const props = defineProps<{
  detail: {
    post: CommunityDetailPost
    relatedPosts: CommunityRelatedPost[]
  }
}>()
const emit = defineEmits<{
  (event: 'back'): void
  (event: 'select-related', postId: number): void
}>()

const isShareOpen = ref(false)
const isMobile = ref(false)
const fallbackThumbnail =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'

const categoryLabelMap: Record<string, string> = {
  DIET: '다이어트',
  EXERISE: '운동',
  NUTRIENT: '영양',
  DISEASE: '질병관리',
  all: '전체',
}

const formatDate = (isoString: string) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

const estimatedReadTime = computed(() => {
  const content = props.detail.post?.content ?? ''
  const plainText = content.replace(/<[^>]+>/g, ' ')
  const words = plainText.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes}분`
})

const article = computed(() => props.detail.post)
const relatedArticles = computed(() => props.detail.relatedPosts ?? [])
const categoryLabel = computed(
  () => categoryLabelMap[String(article.value.category)] ?? article.value.category,
)
const createdAt = computed(() => formatDate(article.value.createdAt))
const content = computed(() => article.value.content || '')
const formatCategory = (code: string) => categoryLabelMap[String(code)] ?? code

const handleResize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const shareOptions = [
  { name: '링크 복사', icon: Link, color: 'bg-gray-100 text-gray-900' },
  { name: '카카오톡', icon: MessageCircle, color: 'bg-[#FEE500] text-[#000000]' },
  { name: '트위터', icon: Twitter, color: 'bg-[#1DA1F2] text-white' },
]

const handleImageError = (event: Event) => {
  ;(event.target as HTMLImageElement).src = fallbackThumbnail
}

const selectRelated = (relatedArticle: CommunityRelatedPost) => {
  emit('select-related', relatedArticle.postId)
}

const handleShareOption = (optionName: string) => {
  if (optionName === '링크 복사' && typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).catch(() => null)
  }
  isShareOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="sticky top-0 z-50 border-b border-[var(--gray-100)] bg-white/80 backdrop-blur-md">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-14 items-center justify-between">
          <button
            @click="emit('back')"
            class="flex items-center gap-1.5 text-[var(--gray-700)] transition-colors hover:text-[var(--gray-900)]"
          >
            <ArrowLeft class="h-5 w-5" />
            <span class="text-[15px] font-medium">뒤로</span>
          </button>

          <button
            class="rounded-full p-2 text-[var(--gray-700)] transition-colors hover:bg-[var(--gray-100)]"
            @click="isShareOpen = true"
          >
            <Share2 class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <div class="mb-8 text-center md:mb-10">
        <div class="mb-4 flex items-center justify-center gap-2">
          <span class="text-[14px] font-semibold text-[#00C73C]">
            {{ categoryLabel }}
          </span>
          <span class="h-1 w-1 rounded-full bg-[var(--gray-300)]" />
          <span class="text-[14px] text-[var(--gray-500)]">
            {{ createdAt }}
          </span>
          <span class="h-1 w-1 rounded-full bg-[var(--gray-300)]" />
          <span class="text-[14px] text-[var(--gray-500)]">
            {{ estimatedReadTime }}
          </span>
        </div>

        <h1
          class="mb-6 break-keep text-[26px] font-bold leading-[1.3] text-[var(--gray-900)] md:text-[32px]"
        >
          {{ article.title }}
        </h1>

        <div class="flex items-center justify-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--gray-100)]"
          >
            <User class="h-5 w-5 text-[var(--gray-500)]" />
          </div>
          <div class="text-left">
            <p class="text-[14px] font-semibold text-[var(--gray-900)]">
              {{ article.writer }}
            </p>
            <p class="text-[12px] text-[var(--gray-500)]">전문 에디터</p>
          </div>
        </div>
      </div>

      <div
        class="mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[var(--gray-100)] shadow-sm"
      >
        <img
          :src="article.thumbnailUrl"
          :alt="article.title"
          class="h-full w-full object-cover"
          @error="handleImageError"
        />
      </div>

      <div class="mb-12">
        <div
          class="prose prose-lg prose-p:text-[var(--gray-800)] prose-headings:text-[var(--gray-900)] max-w-none"
          style="line-height: 1.75"
          v-html="content"
        />
      </div>

      <div class="mb-16 flex justify-center">
        <button class="group flex flex-col items-center gap-2 transition-all">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gray-200)] bg-white text-[var(--gray-400)] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[#FF3B30] group-hover:text-[#FF3B30]"
          >
            <Heart class="h-7 w-7 fill-current transition-colors" />
          </div>
          <span class="text-[13px] text-[var(--gray-500)] group-hover:text-[var(--gray-900)]">
            {{ article.likes.toLocaleString() }}
          </span>
        </button>
      </div>

      <div class="border-t border-[var(--gray-100)] pt-10">
        <h2 class="mb-6 text-[18px] font-bold text-[var(--gray-900)]">이 글과 함께 많이 본 글</h2>
        <div class="grid gap-6">
          <div
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.postId"
            @click="selectRelated(relatedArticle)"
            class="group flex cursor-pointer items-center gap-5"
          >
            <div class="min-w-0 flex-1">
              <span class="mb-1 block text-[12px] font-semibold text-[#00C73C]">
                {{ formatCategory(relatedArticle.category) }}
              </span>
              <h3
                class="mb-1 text-[16px] font-bold text-[var(--gray-900)] decoration-[var(--gray-300)] underline-offset-4 group-hover:underline"
              >
                {{ relatedArticle.title }}
              </h3>
              <p class="line-clamp-1 text-[14px] text-[var(--gray-500)]">
                {{ relatedArticle.previewText }}
              </p>
            </div>
            <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--gray-100)]">
              <img
                :src="relatedArticle.thumbnailUrl"
                :alt="relatedArticle.title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isShareOpen"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      @click.self="isShareOpen = false"
    >
      <div v-if="isMobile" class="w-full max-w-xl rounded-t-2xl bg-white p-6 pb-10 shadow-xl">
        <h3 class="mb-2 text-xl font-bold">공유하기</h3>
        <p class="mb-4 text-sm text-[var(--gray-600)]">이 유용한 정보를 친구들에게 공유해보세요.</p>
        <div class="grid grid-cols-3 gap-4 py-4">
          <button
            v-for="option in shareOptions"
            :key="option.name"
            class="group flex flex-col items-center gap-2"
            @click="handleShareOption(option.name)"
          >
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-active:scale-95"
              :class="option.color"
            >
              <component :is="option.icon" class="h-6 w-6" />
            </div>
            <span class="text-sm text-[var(--gray-700)]">{{ option.name }}</span>
          </button>
        </div>
        <button
          class="mt-6 h-12 w-full rounded-xl border border-[var(--gray-200)] text-[15px] font-medium transition-colors hover:bg-[var(--gray-50)]"
          @click="isShareOpen = false"
        >
          닫기
        </button>
      </div>

      <div v-else class="mx-4 w-[360px] rounded-2xl bg-white p-6 shadow-xl">
        <h3 class="mb-2 text-lg font-semibold">공유하기</h3>
        <p class="mb-4 text-sm text-[var(--gray-600)]">이 유용한 정보를 친구들에게 공유해보세요.</p>
        <div class="grid grid-cols-3 gap-4 py-4">
          <button
            v-for="option in shareOptions"
            :key="option.name"
            class="group flex flex-col items-center gap-2"
            @click="handleShareOption(option.name)"
          >
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-active:scale-95"
              :class="option.color"
            >
              <component :is="option.icon" class="h-6 w-6" />
            </div>
            <span class="text-sm text-[var(--gray-700)]">{{ option.name }}</span>
          </button>
        </div>
        <button
          class="mt-4 h-11 w-full rounded-xl border border-[var(--gray-200)] text-[15px] font-medium transition-colors hover:bg-[var(--gray-50)]"
          @click="isShareOpen = false"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose p {
  margin-bottom: 1.75rem;
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
  word-break: keep-all;
}

.prose h3 {
  margin-top: 3rem;
  margin-bottom: 1.25rem;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.prose ul {
  margin-top: 1rem;
  margin-bottom: 2rem;
  list-style-type: none;
  padding-left: 0;
  background-color: var(--gray-50);
  padding: 1.5rem;
  border-radius: 1rem;
}

.prose li {
  color: var(--gray-800);
  margin-bottom: 0.75rem;
  padding-left: 0;
  position: relative;
  font-size: 1rem;
  display: flex;
  gap: 0.75rem;
}

.prose li:before {
  content: '•';
  color: #00c73c;
  font-weight: bold;
  flex-shrink: 0;
}

.prose li:last-child {
  margin-bottom: 0;
}

.prose strong {
  color: var(--gray-900);
  font-weight: 600;
}
</style>
