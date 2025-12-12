<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowLeft, Heart, User, Share2, Link, MessageCircle, Twitter } from 'lucide-vue-next'

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

const props = defineProps<{ article: Article }>()
const emit = defineEmits<{
  (event: 'back'): void
  (event: 'select-article', article: Article): void
}>()

const isShareOpen = ref(false)
const isMobile = ref(false)
const fallbackThumbnail =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'

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

const content = computed(
  () => `
    <p>건강한 식단 관리는 단순히 칼로리를 계산하는 것을 넘어서, 우리 몸에 필요한 영양소를 균형있게 섭취하는 것을 의미합니다.</p>
    
    <h3>1. ${props.article.category === '영양' ? '단백질의 중요성' : '건강한 식습관의 시작'}</h3>
    <p>단백질은 우리 몸의 근육, 뼈, 피부를 구성하는 필수 영양소입니다. 하지만 무조건 많이 섭취한다고 좋은 것은 아닙니다. 개인의 체중, 활동량, 건강 상태에 따라 적절한 양을 섭취하는 것이 중요합니다.</p>
    
    <p>일반적으로 성인의 경우 체중 1kg당 0.8~1.2g의 단백질 섭취가 권장됩니다. 운동을 많이 하는 분들은 1.6~2.2g까지 섭취할 수 있습니다.</p>
    
    <h3>2. 양질의 단백질 선택하기</h3>
    <p>단백질의 양만큼 중요한 것이 질입니다. 다음과 같은 양질의 단백질 급원을 선택하세요:</p>
    
    <ul>
      <li><strong>동물성 단백질:</strong> 닭가슴살, 생선, 계란, 저지방 유제품</li>
      <li><strong>식물성 단백질:</strong> 콩, 두부, 렌틸콩, 퀴노아</li>
      <li><strong>보충제:</strong> 필요시 단백질 파우더 활용 (과도한 섭취는 주의)</li>
    </ul>
    
    <h3>3. 단백질 과다 섭취의 위험성</h3>
    <p>과도한 단백질 섭취는 신장에 부담을 줄 수 있으며, 칼슘 배출을 증가시켜 뼈 건강에 악영향을 미칠 수 있습니다. 특히 신장 질환이 있는 분들은 단백질 섭취량을 제한해야 합니다.</p>
    
    <h3>4. 균형잡힌 식단이 답입니다</h3>
    <p>단백질만 집중하기보다는 탄수화물, 지방, 비타민, 미네랄을 모두 고려한 균형잡힌 식단을 구성하는 것이 가장 중요합니다.</p>
    
    <p>건강한 식습관은 하루아침에 만들어지지 않습니다. 작은 변화부터 시작해서 꾸준히 실천하는 것이 중요합니다.</p>
  `,
)

const relatedArticles = ref<Article[]>([
  {
    id: 5,
    category: '영양',
    title: '탄수화물, 적으로만 생각하지 마세요',
    author: '정영양 영양사',
    date: '2024.11.10',
    views: 8920,
    likes: 650,
    thumbnail:
      'https://images.unsplash.com/photo-1642497393790-c5751b818e1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGluZ3JlZGllbnRzfGVufDF8fHx8MTc2MzI4NjA2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    summary: '탄수화물은 우리 몸의 주요 에너지원입니다. 올바른 탄수화물 선택 방법을 알아보세요.',
    readTime: '4분',
  },
  {
    id: 6,
    category: '운동',
    title: '근력운동과 영양의 완벽한 조합',
    author: '강트레이너',
    date: '2024.11.09',
    views: 11200,
    likes: 890,
    thumbnail:
      'https://images.unsplash.com/photo-1666819691716-827f78d892f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMGJvd2x8ZW58MXx8fHwxNzYzMjc3MjgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    summary: '근력운동 효과를 극대화하는 식단 관리법을 소개합니다.',
    readTime: '6분',
  },
])

const shareOptions = [
  { name: '링크 복사', icon: Link, color: 'bg-gray-100 text-gray-900' },
  { name: '카카오톡', icon: MessageCircle, color: 'bg-[#FEE500] text-[#000000]' },
  { name: '트위터', icon: Twitter, color: 'bg-[#1DA1F2] text-white' },
]

const handleImageError = (event: Event) => {
  ;(event.target as HTMLImageElement).src = fallbackThumbnail
}

const selectRelated = (article: Article) => {
  emit('select-article', article)
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
            {{ props.article.category }}
          </span>
          <span class="h-1 w-1 rounded-full bg-[var(--gray-300)]" />
          <span class="text-[14px] text-[var(--gray-500)]">
            {{ props.article.date }}
          </span>
        </div>

        <h1
          class="mb-6 break-keep text-[26px] font-bold leading-[1.3] text-[var(--gray-900)] md:text-[32px]"
        >
          {{ props.article.title }}
        </h1>

        <div class="flex items-center justify-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--gray-100)]"
          >
            <User class="h-5 w-5 text-[var(--gray-500)]" />
          </div>
          <div class="text-left">
            <p class="text-[14px] font-semibold text-[var(--gray-900)]">
              {{ props.article.author }}
            </p>
            <p class="text-[12px] text-[var(--gray-500)]">전문 에디터</p>
          </div>
        </div>
      </div>

      <div
        class="mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[var(--gray-100)] shadow-sm"
      >
        <img
          :src="props.article.thumbnail"
          :alt="props.article.title"
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
            {{ props.article.likes.toLocaleString() }}
          </span>
        </button>
      </div>

      <div class="border-t border-[var(--gray-100)] pt-10">
        <h2 class="mb-6 text-[18px] font-bold text-[var(--gray-900)]">이 글과 함께 많이 본 글</h2>
        <div class="grid gap-6">
          <div
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.id"
            @click="selectRelated(relatedArticle)"
            class="group flex cursor-pointer items-center gap-5"
          >
            <div class="min-w-0 flex-1">
              <span class="mb-1 block text-[12px] font-semibold text-[#00C73C]">
                {{ relatedArticle.category }}
              </span>
              <h3
                class="mb-1 text-[16px] font-bold text-[var(--gray-900)] decoration-[var(--gray-300)] underline-offset-4 group-hover:underline"
              >
                {{ relatedArticle.title }}
              </h3>
              <p class="line-clamp-1 text-[14px] text-[var(--gray-500)]">
                {{ relatedArticle.summary }}
              </p>
            </div>
            <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--gray-100)]">
              <img
                :src="relatedArticle.thumbnail"
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
