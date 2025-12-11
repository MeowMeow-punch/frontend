<script setup lang="ts">
import { computed, toRefs } from 'vue'

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

const props = defineProps<{
  article: Article
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'article-click', article: Article): void
}>()

const fallbackSrc =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" fill="none"><rect width="240" height="240" rx="16" fill="%23f1f5f9"/><path d="M64 152l32-40 40 48 24-32 32 40" stroke="%23cbd5e1" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="92" cy="92" r="18" fill="%23cbd5e1"/><rect x="32" y="32" width="176" height="176" rx="16" stroke="%23e2e8f0" stroke-width="12" stroke-dasharray="12 12"/></svg>'

const { article } = toRefs(props)

const articleContent = computed(() => {
  const intro =
    '건강한 식단 관리는 단순히 칼로리를 계산하는 것을 넘어서, 우리 몸에 필요한 영양소를 균형 있게 섭취하는 것을 의미합니다.'
  const sectionTitle =
    article.value.category === '영양' ? '단백질의 중요성' : '건강한 식습관의 시작'

  return `
    <p>${intro}</p>
    
    <h3>1. ${sectionTitle}</h3>
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
    
    <h3>4. 균형 잡힌 식단이 답입니다</h3>
    <p>단백질만 집중하기보다는 탄수화물, 지방, 비타민, 미네랄을 모두 고려한 균형 잡힌 식단을 구성하는 것이 가장 중요합니다.</p>
    
    <p>건강한 식습관은 하루아침에 만들어지지 않습니다. 작은 변화부터 시작해서 꾸준히 실천하는 것이 중요합니다.</p>
  `
})

const relatedArticles: Article[] = [
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
]

const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (!target) return
  target.onerror = null
  target.src = fallbackSrc
}

const handleBack = () => emit('back')
const handleArticleClick = (article: Article) => emit('article-click', article)
</script>

<template>
  <div class="min-h-screen bg-[var(--gray-50)]">
    <div class="sticky top-0 z-50 border-b border-[var(--gray-200)] bg-white">
      <div class="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          @click="handleBack"
          class="flex items-center gap-2 text-[var(--gray-700)] transition-colors hover:text-[var(--gray-900)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>목록</span>
        </button>

        <button
          type="button"
          class="flex items-center rounded-lg border border-[var(--gray-200)] px-3 py-1.5 text-sm text-[var(--gray-800)] transition hover:bg-[var(--gray-50)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12v-2a2 2 0 012-2h3l2-3 2 3h3a2 2 0 012 2v2" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12v6h6M20 12v6h-6M12 16l-3.5 3.5M12 16l3.5 3.5" />
          </svg>
          공유
        </button>
      </div>
    </div>

    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-8">
        <div class="mb-4 flex items-center gap-2">
          <span class="rounded-lg border border-[var(--gray-200)] bg-[var(--gray-100)] px-3 py-1 text-sm text-[var(--gray-700)]">
            {{ article.category }}
          </span>
          <span class="flex items-center gap-1 text-sm text-[var(--gray-600)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
            </svg>
            {{ article.readTime }}
          </span>
        </div>

        <h1 class="mb-6 text-3xl">{{ article.title }}</h1>

        <div class="flex items-center justify-between border-b border-[var(--gray-200)] pb-6">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--main-100)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--main-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A7.963 7.963 0 0112 15c2.21 0 4.208.896 5.656 2.344M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
              </svg>
            </div>
            <div>
              <p class="text-[var(--gray-900)]">{{ article.author }}</p>
              <p class="text-sm text-[var(--gray-600)]">{{ article.date }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 text-sm text-[var(--gray-600)]">
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" stroke-width="2" />
              </svg>
              {{ article.views.toLocaleString() }}
            </span>
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.8 4.6c-1.44-3.4-4.78-3.4-6.64-1.64-.3.29-.56.6-.76.91a.11.11 0 01-.18 0 4.7 4.7 0 00-.76-.91C10.9 1.2 7.56 1.2 6.12 4.6c-1.02 2.4-.42 5.36 2.04 8.78a20.1 20.1 0 003.9 3.92.5.5 0 00.6 0 20.1 20.1 0 003.9-3.92c2.46-3.42 3.06-6.38 2.04-8.78z"
                />
              </svg>
              {{ article.likes.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>

      <div class="mb-8 h-80 w-full overflow-hidden rounded-2xl">
        <img
          :src="article.thumbnail"
          :alt="article.title"
          class="h-full w-full object-cover"
          @error="onImgError"
        />
      </div>

      <div class="mb-8 rounded-2xl border border-[var(--gray-200)] bg-white p-8">
        <div class="prose prose-lg max-w-none" v-html="articleContent" />
      </div>

      <div class="mb-12 flex justify-center">
        <button
          type="button"
          class="flex items-center rounded-xl border-2 border-[var(--gray-200)] bg-white px-8 py-3 text-[var(--gray-900)] transition hover:bg-[var(--gray-50)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.8 4.6c-1.44-3.4-4.78-3.4-6.64-1.64-.3.29-.56.6-.76.91a.11.11 0 01-.18 0 4.7 4.7 0 00-.76-.91C10.9 1.2 7.56 1.2 6.12 4.6c-1.02 2.4-.42 5.36 2.04 8.78a20.1 20.1 0 003.9 3.92.5.5 0 00.6 0 20.1 20.1 0 003.9-3.92c2.46-3.42 3.06-6.38 2.04-8.78z"
            />
          </svg>
          도움이 되었어요
        </button>
      </div>

      <div>
        <h2 class="mb-4 text-xl">관련 글</h2>
        <div class="space-y-3">
          <div
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.id"
            class="cursor-pointer overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white transition-colors hover:border-[var(--main-300)]"
            @click="handleArticleClick(relatedArticle)"
          >
            <div class="flex gap-4 p-5">
              <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                <img
                  :src="relatedArticle.thumbnail"
                  :alt="relatedArticle.title"
                  class="h-full w-full object-cover"
                  @error="onImgError"
                />
              </div>

              <div class="min-w-0 flex-1">
                <div class="mb-1 flex items-center gap-2">
                  <span class="rounded border border-[var(--gray-200)] bg-[var(--gray-100)] px-2 py-0.5 text-sm text-[var(--gray-700)]">
                    {{ relatedArticle.category }}
                  </span>
                </div>

                <h3 class="mb-1 line-clamp-1 text-base">{{ relatedArticle.title }}</h3>

                <p class="mb-2 line-clamp-1 text-sm text-[var(--gray-600)]">
                  {{ relatedArticle.summary }}
                </p>

                <div class="flex items-center gap-3 text-xs text-[var(--gray-600)]">
                  <span>{{ relatedArticle.author }}</span>
                  <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                      <circle cx="12" cy="12" r="3" stroke-width="2" />
                    </svg>
                    {{ (relatedArticle.views / 1000).toFixed(1) }}k
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose p {
  color: var(--gray-800);
  margin-bottom: 1.5rem;
  font-size: 1.0625rem;
  line-height: 1.8;
}

.prose h3 {
  color: var(--gray-900);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.375rem;
  font-weight: 600;
}

.prose ul {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  list-style-type: none;
  padding-left: 0;
}

.prose li {
  color: var(--gray-800);
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  font-size: 1.0625rem;
}

.prose li:before {
  content: '•';
  color: var(--main-300);
  font-weight: bold;
  position: absolute;
  left: 0;
}

.prose strong {
  color: var(--gray-900);
  font-weight: 600;
}
</style>
