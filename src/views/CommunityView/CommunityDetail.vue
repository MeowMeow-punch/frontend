<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowLeft, Heart, User, Share2, Link, MessageCircle, Twitter } from 'lucide-vue-next'
import {
  getCommunityDetail,
  resolveCommunityImageUrl,
  updateCommunityLike,
  type CommunityDetailPost,
  type CommunityRelatedPost,
} from '@/services/communityService'
import { useModalStore } from '@/stores/modalStore'

const props = defineProps<{ postId: number }>()
const emit = defineEmits<{
  (event: 'back'): void
  (event: 'select-article', postId: number): void
}>()

const modalStore = useModalStore()
const isShareOpen = ref(false)
const isMobile = ref(false)
const isLoading = ref(false)
const isLiking = ref(false)
const post = ref<CommunityDetailPost | null>(null)
const relatedPosts = ref<CommunityRelatedPost[]>([])
const fallbackThumbnail =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'

const categoryLabelMap: Record<string, string> = {
  DIET: '다이어트',
  EXERCISE: '운동',
  EXCERCISE: '운동',
  NUTRIENT: '영양',
  DISEASE: '질병관리',
}

const handleResize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

const formatDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const contentHtml = computed(() => {
  const raw = post.value?.content?.trim()
  if (!raw) return ''
  if (/<[a-z][\s\S]*>/i.test(raw)) {
    return raw
  }
  return raw
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br/>')}</p>`)
    .join('')
})

const formattedDate = computed(() => formatDate(post.value?.createdAt))
const categoryLabel = computed(() =>
  post.value ? (categoryLabelMap[post.value.category] ?? String(post.value.category)) : '',
)

const shareOptions = [
  { name: '링크 복사', icon: Link, color: 'bg-gray-100 text-gray-900' },
  { name: '카카오톡', icon: MessageCircle, color: 'bg-[#FEE500] text-[#000000]' },
  { name: '트위터', icon: Twitter, color: 'bg-[#1DA1F2] text-white' },
]

const fetchDetail = async (postId: number) => {
  isLoading.value = true
  console.info('[CommunityDetail] detail request', { postId })
  try {
    const data = await getCommunityDetail(postId)
    post.value = data?.post ?? null
    relatedPosts.value = Array.isArray(data?.relatedPosts) ? data.relatedPosts : []
    console.info('[CommunityDetail] detail mapped', {
      postId,
      related: relatedPosts.value.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Community detail fetch failed.'
    console.warn('[CommunityDetail] detail error', { postId, message })
    post.value = null
    relatedPosts.value = []
  } finally {
    isLoading.value = false
  }
}

const toggleLike = async () => {
  if (!post.value || isLiking.value) return
  const nextLiked = !post.value.isLiked
  isLiking.value = true
  console.info('[CommunityDetail] like request', { postId: post.value.postId, isLiked: nextLiked })
  try {
    await updateCommunityLike(post.value.postId, nextLiked)
    post.value = {
      ...post.value,
      isLiked: nextLiked,
      likes: Math.max(0, post.value.likes + (nextLiked ? 1 : -1)),
    }
    console.info('[CommunityDetail] like updated', {
      postId: post.value.postId,
      likes: post.value.likes,
      isLiked: post.value.isLiked,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Community like failed.'
    console.warn('[CommunityDetail] like error', { message })
    await modalStore.openAppModal({
      title: '오류 발생',
      content: '좋아요 처리에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      type: 'error',
    })
  } finally {
    isLiking.value = false
  }
}

const handleImageError = (event: Event) => {
  ;(event.target as HTMLImageElement).src = fallbackThumbnail
}

const selectRelated = (postId: number | null | undefined) => {
  if (!postId) return
  emit('select-article', postId)
}

const handleShareOption = (optionName: string) => {
  if (optionName === '링크 복사' && typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).catch(() => null)
    modalStore.openAppModal({
      title: '링크 복사 완료',
      content: '게시글 링크가 클립보드에 복사되었습니다.',
      type: 'success',
    })
  }
  isShareOpen.value = false
}

watch(
  () => props.postId,
  (next) => {
    fetchDetail(next)
  },
  { immediate: true },
)

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
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
      <div
        v-if="isLoading"
        class="rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-16 text-center"
      >
        <p class="text-[15px] font-normal text-[var(--gray-600)]">불러오는 중...</p>
      </div>

      <template v-else-if="post">
        <div class="mb-8 text-center md:mb-10">
          <div class="mb-4 flex items-center justify-center gap-2">
            <span class="text-[14px] font-semibold text-[#00C73C]">
              {{ categoryLabel }}
            </span>
            <span class="h-1 w-1 rounded-full bg-[var(--gray-300)]" />
            <span class="text-[14px] text-[var(--gray-500)]">
              {{ formattedDate }}
            </span>
          </div>

          <h1
            class="mb-6 break-keep text-[26px] font-bold leading-[1.3] text-[var(--gray-900)] md:text-[32px]"
          >
            {{ post.title }}
          </h1>

          <div class="flex items-center justify-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--gray-100)]"
            >
              <User class="h-5 w-5 text-[var(--gray-500)]" />
            </div>
            <div class="text-left">
              <p class="text-[14px] font-semibold text-[var(--gray-900)]">
                {{ post.writer }}
              </p>
              <p class="text-[12px] text-[var(--gray-500)]">전문 에디터</p>
            </div>
          </div>
        </div>

        <div
          class="mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[var(--gray-100)] shadow-sm"
        >
          <img
            :src="resolveCommunityImageUrl(post.thumbnailUrl) || fallbackThumbnail"
            :alt="post.title"
            class="h-full w-full object-cover"
            @error="handleImageError"
          />
        </div>

        <div class="mb-12">
          <div
            class="prose prose-lg prose-p:text-[var(--gray-800)] prose-headings:text-[var(--gray-900)] max-w-none"
            style="line-height: 1.75"
            v-html="contentHtml"
          />
        </div>

        <div class="mb-16 flex justify-center">
          <button
            class="group flex flex-col items-center gap-2 transition-all disabled:cursor-not-allowed"
            :disabled="isLiking"
            @click="toggleLike"
          >
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gray-200)] bg-white text-[var(--gray-400)] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[#FF3B30] group-hover:text-[#FF3B30]"
              :class="post.isLiked ? 'border-[#FF3B30] text-[#FF3B30]' : ''"
            >
              <Heart class="h-7 w-7 fill-current transition-colors" />
            </div>
            <span class="text-[13px] text-[var(--gray-500)] group-hover:text-[var(--gray-900)]">
              {{ post.likes.toLocaleString() }}
            </span>
          </button>
        </div>

        <div class="border-t border-[var(--gray-100)] pt-10">
          <h2 class="mb-6 text-[18px] font-bold text-[var(--gray-900)]">이 글과 함께 많이 본 글</h2>
          <div class="grid gap-6">
            <div
              v-for="relatedArticle in relatedPosts"
              :key="relatedArticle.postId ?? relatedArticle.id"
              @click="selectRelated(relatedArticle.postId ?? relatedArticle.id ?? 0)"
              class="group flex cursor-pointer items-center gap-5"
            >
              <div class="min-w-0 flex-1">
                <span class="mb-1 block text-[12px] font-semibold text-[#00C73C]">
                  {{ categoryLabelMap[relatedArticle.category] ?? String(relatedArticle.category) }}
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
                  :src="resolveCommunityImageUrl(relatedArticle.thumbnailUrl) || fallbackThumbnail"
                  :alt="relatedArticle.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        v-else
        class="rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-16 text-center"
      >
        <p class="text-[15px] font-normal text-[var(--gray-600)]">게시글을 불러올 수 없습니다.</p>
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
