<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

type BannerTheme = 'green' | 'purple'

interface Banner {
  id: number
  title: string
  subtitle: string
  buttonText: string
  action: () => void
  theme: BannerTheme
  available: boolean
  comingSoon?: string
}

interface RecommendedFood {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  category: string
  image: string
  quantity: number
}

interface RecommendedMeal {
  id: number
  name: string
  time: string
  timeLabel: string
  calories: number
  protein: number
  foods: RecommendedFood[]
}

const router = useRouter()

const goTo = (path: string) => {
  router.push(path)
}

const banners: Banner[] = [
  {
    id: 1,
    title: '오늘의 식단 기록',
    subtitle: 'AI 영양 분석으로 건강 목표 달성하기',
    buttonText: '식단 기록하기',
    action: () => goTo('/diet'),
    theme: 'green',
    available: true,
  },
  {
    id: 3,
    title: '그룹 챌린지',
    subtitle: '친구들과 함께 만드는 건강한 습관',
    buttonText: '알림 신청',
    action: () => goTo('/community'),
    theme: 'purple',
    available: false,
    comingSoon: '곧 만나요',
  },
]

const currentBannerIndex = ref(0)
const isTransitioning = ref(false)
const touchStart = ref(0)
const touchEnd = ref(0)
const dragStart = ref(0)
const dragEnd = ref(0)
const timerId = ref<number | null>(null)

const goToPreviousBanner = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentBannerIndex.value = (currentBannerIndex.value - 1 + banners.length) % banners.length
  window.setTimeout(() => {
    isTransitioning.value = false
  }, 400)
}

const goToNextBanner = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.length
  window.setTimeout(() => {
    isTransitioning.value = false
  }, 400)
}

const handleTouchStart = (e: TouchEvent) => {
  touchStart.value = e.touches[0].clientX
}
const handleTouchMove = (e: TouchEvent) => {
  touchEnd.value = e.touches[0].clientX
}
const handleTouchEnd = () => {
  if (!touchStart.value || !touchEnd.value) return
  const distance = touchStart.value - touchEnd.value
  if (Math.abs(distance) > 50) {
    distance > 0 ? goToNextBanner() : goToPreviousBanner()
  }
  touchStart.value = 0
  touchEnd.value = 0
}

const handleMouseDown = (e: MouseEvent) => {
  dragStart.value = e.clientX
  dragEnd.value = e.clientX
}
const handleMouseMove = (e: MouseEvent) => {
  if (!dragStart.value) return
  dragEnd.value = e.clientX
}
const handleMouseUp = () => {
  if (!dragStart.value || !dragEnd.value) {
    dragStart.value = 0
    dragEnd.value = 0
    return
  }
  const distance = dragStart.value - dragEnd.value
  if (Math.abs(distance) > 50) {
    distance > 0 ? goToNextBanner() : goToPreviousBanner()
  }
  dragStart.value = 0
  dragEnd.value = 0
}
const handleMouseLeave = () => {
  dragStart.value = 0
  dragEnd.value = 0
}

onMounted(() => {
  timerId.value = window.setInterval(() => {
    goToNextBanner()
  }, 15000)
})

onBeforeUnmount(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }
})

const currentBanner = computed(() => banners[currentBannerIndex.value])

const totalCalories = 1850
const targetCalories = 2000
const caloriePercentage = computed(() =>
  Math.min(100, Math.round((totalCalories / targetCalories) * 100)),
)

const nutritionData = [
  { name: '탄수화물', current: 250, target: 280 },
  { name: '단백질', current: 95, target: 120 },
  { name: '지방', current: 82, target: 70 },
]

const recommendedMeals: RecommendedMeal[] = [
  {
    id: 1,
    name: '연어 포케 볼 세트',
    time: 'lunch',
    timeLabel: '점심',
    calories: 520,
    protein: 35,
    foods: [
      {
        id: 101,
        name: '연어 포케',
        calories: 450,
        protein: 30,
        carbs: 45,
        fat: 15,
        servingSize: '1인분',
        category: '주식',
        image:
          'https://images.unsplash.com/photo-1666819691716-827f78d892f3?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
      },
      {
        id: 102,
        name: '미소 된장국',
        calories: 70,
        protein: 5,
        carbs: 8,
        fat: 2,
        servingSize: '1그릇',
        category: '국/찌개',
        image:
          'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    name: '닭가슴살 샐러드 정식',
    time: 'dinner',
    timeLabel: '저녁',
    calories: 380,
    protein: 42,
    foods: [
      {
        id: 201,
        name: '닭가슴살 샐러드',
        calories: 230,
        protein: 35,
        carbs: 10,
        fat: 5,
        servingSize: '1접시',
        category: '단백질',
        image:
          'https://images.unsplash.com/photo-1562436260-126d541901e0?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
      },
      {
        id: 202,
        name: '호밀빵',
        calories: 150,
        protein: 7,
        carbs: 30,
        fat: 2,
        servingSize: '2조각',
        category: '주식',
        image:
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
      },
    ],
  },
  {
    id: 3,
    name: '현미 비빔밥',
    time: 'breakfast',
    timeLabel: '아침',
    calories: 450,
    protein: 18,
    foods: [
      {
        id: 301,
        name: '현미 비빔밥',
        calories: 450,
        protein: 18,
        carbs: 75,
        fat: 10,
        servingSize: '1그릇',
        category: '주식',
        image:
          'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
      },
    ],
  },
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <div
      class="mx-auto max-w-6xl px-4 py-8 pb-16 md:px-8 md:py-12 md:pb-24 lg:px-12 lg:py-16 lg:pb-32"
    >
      <!-- 배너 캐러셀 -->
      <div
        class="relative mb-8 flex min-h-[220px] cursor-grab select-none flex-col justify-center overflow-hidden rounded-[26px] p-7 active:cursor-grabbing md:mb-10 md:p-9"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
      >
        <!-- 배경 -->
        <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          :class="[
            'absolute inset-0 transition-opacity duration-500 ease-in-out',
            index === currentBannerIndex ? 'z-10 opacity-100' : 'z-0 opacity-0',
          ]"
        >
          <div
            v-if="banner.theme === 'green'"
            class="absolute inset-0 overflow-hidden bg-[#E8F9EC]"
          >
            <div
              class="absolute right-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-[#B2F2BB] opacity-60 blur-[80px]"
            />
            <div
              class="animate-float absolute right-[5%] top-[15%] rotate-[15deg] text-[100px] drop-shadow-xl"
            >
              🥗
            </div>
            <div
              class="animate-float-delayed absolute bottom-[15%] right-[25%] -rotate-[15deg] text-[60px] opacity-90 drop-shadow-lg"
            >
              🥑
            </div>
          </div>

          <div
            v-if="banner.theme === 'purple'"
            class="absolute inset-0 overflow-hidden bg-[#F3F0FF]"
          >
            <div
              class="absolute left-[20%] top-[-10%] h-[400px] w-[400px] rounded-full bg-[#E9E4FF] blur-[80px]"
            />
            <div
              class="animate-float absolute right-[10%] top-[15%] rotate-[5deg] text-[90px] drop-shadow-xl"
            >
              🔥
            </div>
            <div
              class="animate-float-delayed absolute right-[25%] top-[10%] -rotate-[10deg] text-[50px] opacity-80 drop-shadow-lg"
            >
              👟
            </div>
          </div>
        </div>

        <!-- 배너 내용 -->
        <div class="relative z-20 flex max-w-[70%] flex-col items-start">
          <div class="mb-6">
            <h2 class="mb-2 text-[24px] font-bold leading-[1.3] tracking-tight md:text-[28px]">
              {{ currentBanner.title }}
            </h2>
            <p class="text-[15px] font-medium leading-relaxed text-gray-600">
              {{ currentBanner.subtitle }}
            </p>
          </div>

          <button
            class="inline-flex h-[42px] items-center gap-1.5 rounded-[14px] px-5 text-[14px] font-bold transition-all active:scale-95"
            :class="
              currentBanner.available
                ? 'bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg'
                : 'cursor-not-allowed bg-gray-200 text-gray-400'
            "
            :disabled="!currentBanner.available"
            @click="currentBanner.available ? currentBanner.action() : undefined"
          >
            {{ currentBanner.buttonText }}
            <span v-if="currentBanner.available" class="text-white/90">→</span>
          </button>
        </div>

        <div
          v-if="!currentBanner.available"
          class="absolute right-6 top-6 z-20 rounded-full border border-white/50 bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur-md"
        >
          <span class="text-[12px] font-bold tracking-tight text-gray-600">
            {{ currentBanner.comingSoon }}
          </span>
        </div>

        <!-- 인디케이터 -->
        <div
          class="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/40 p-1.5 backdrop-blur-sm"
        >
          <button
            v-for="(_, index) in banners"
            :key="index"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="index === currentBannerIndex ? 'w-4 bg-gray-800' : 'w-1.5 bg-gray-400/50'"
            @click.stop="
              () => {
                if (isTransitioning) return
                isTransitioning = true
                currentBannerIndex = index
                window.setTimeout(() => {
                  isTransitioning = false
                }, 400)
              }
            "
          />
        </div>
      </div>

      <!-- 콘텐츠 영역 -->
      <div class="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-[1fr_320px] lg:gap-6">
        <!-- 왼쪽 컬럼 -->
        <div class="min-w-0 space-y-4 md:space-y-5 lg:space-y-6">
          <!-- 칼로리 요약 -->
          <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p class="mb-1 text-[13px] font-medium text-[var(--gray-600)]">오늘의 칼로리</p>
                <p class="text-[28px] font-bold text-[var(--gray-900)]">
                  {{ totalCalories.toLocaleString() }}
                  <span class="ml-1 text-[16px] font-normal text-[var(--gray-500)]">
                    / {{ targetCalories.toLocaleString() }}kcal
                  </span>
                </p>
              </div>
              <div class="text-right">
                <p class="mb-1 text-[13px] font-medium text-[var(--gray-600)]">달성률</p>
                <p class="text-[22px] font-bold text-[var(--gray-900)]">{{ caloriePercentage }}%</p>
              </div>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-[var(--gray-200)]">
              <div
                class="h-full rounded-full bg-[#00C73C]"
                :style="{ width: `${caloriePercentage}%` }"
              />
            </div>
          </div>

          <!-- AI 인사이트 -->
          <div class="rounded-2xl bg-[var(--gray-50)] p-5">
            <div class="flex items-start gap-3">
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--gray-900)]"
              >
                <span class="text-sm text-white">AI</span>
              </div>
              <div>
                <p class="mb-1 text-[14px] font-bold text-[var(--gray-900)]">AI 분석</p>
                <p class="text-[13px] text-[var(--gray-700)]">
                  단백질 섭취가 목표보다 25g 부족해요. 저녁에 고단백 저지방 식품을 추가해보세요.
                </p>
              </div>
            </div>
          </div>

          <!-- 추천 식단 -->
          <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
            <div class="mb-5">
              <h2 class="text-[17px] font-bold text-[var(--gray-900)]">오늘의 추천 식단</h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="meal in recommendedMeals"
                :key="meal.id"
                class="flex cursor-pointer items-center gap-4"
                @click="goTo('/diet')"
              >
                <div
                  class="grid h-20 w-20 shrink-0 grid-cols-2 gap-px overflow-hidden rounded-xl bg-[var(--gray-200)]"
                >
                  <div
                    v-for="(food, i) in meal.foods.slice(0, 4)"
                    :key="`${meal.id}-${food.id}-${i}`"
                    :class="meal.foods.length === 1 ? 'col-span-2 row-span-2' : ''"
                    class="relative h-full w-full"
                  >
                    <img
                      :src="food.image"
                      :alt="food.name"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div class="min-w-0 flex-1 py-1">
                  <div class="mb-1 flex items-center gap-2">
                    <span
                      class="rounded-md bg-[#E5F9EB] px-2 py-0.5 text-[11px] font-bold text-[#00C73C]"
                    >
                      {{ meal.timeLabel }}
                    </span>
                    <span class="text-[12px] text-[var(--gray-500)]">
                      {{ meal.calories }} kcal
                    </span>
                  </div>

                  <h3 class="mb-1 truncate text-[15px] font-semibold text-[var(--gray-900)]">
                    {{ meal.name }}
                  </h3>

                  <p class="truncate text-[13px] text-[var(--gray-500)]">
                    {{ meal.foods.map((f) => f.name).join(', ') }}
                  </p>
                </div>

                <button
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--gray-200)] bg-[var(--gray-50)] text-[var(--gray-400)] transition-colors hover:bg-[var(--gray-100)] hover:text-[var(--gray-600)]"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽 컬럼 -->
        <div class="min-w-0 space-y-4 md:space-y-5 lg:space-y-6">
          <!-- 영양소 -->
          <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
            <h3 class="mb-5 text-[16px] font-bold text-[var(--gray-900)]">영양소</h3>
            <div class="space-y-6">
              <div v-for="(nut, i) in nutritionData" :key="nut.name">
                <div class="mb-2 flex justify-between text-[13px]">
                  <span class="font-medium text-[var(--gray-600)]">{{ nut.name }}</span>
                  <span class="text-[var(--gray-500)]">
                    <b class="text-[var(--gray-900)]">{{ nut.current }}</b
                    >/ {{ nut.target }}g
                  </span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-[var(--gray-100)]">
                  <div
                    :class="[
                      'h-full rounded-full',
                      i === 0 ? 'bg-[#00C73C]' : i === 1 ? 'bg-[#9CA3AF]' : 'bg-[#FF3B30]',
                    ]"
                    :style="{ width: `${(nut.current / nut.target) * 100}%` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 메뉴 바로가기 -->
          <div
            class="cursor-pointer rounded-2xl border border-[var(--gray-200)] bg-white p-6 transition-colors hover:border-[#00C73C]"
            @click="goTo('/diet')"
          >
            <div class="mb-3 flex items-center gap-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gray-100)]"
              >
                <span class="text-sm text-[var(--gray-600)]">🍽️</span>
              </div>
              <span
                class="rounded-md bg-[#E5F9EB] px-2 py-0.5 text-[11px] font-bold text-[#00C73C]"
              >
                NEW
              </span>
            </div>
            <div class="mb-1 flex items-center justify-between">
              <h3 class="text-[16px] font-bold text-[var(--gray-900)]">메뉴 보러가기</h3>
              <span class="text-[var(--gray-400)]">→</span>
            </div>
            <p class="mb-4 text-[13px] text-[var(--gray-500)]">오늘 우리 회사 메뉴는 무엇일까요?</p>
            <p class="text-[12px] font-medium text-[var(--gray-400)]">SSAFY 14기 · 23명</p>
          </div>

          <!-- 이번 주 평균 -->
          <div class="rounded-2xl border border-[var(--gray-200)] bg-[#F9FAFB] p-6">
            <h3 class="mb-4 text-[14px] font-medium text-[var(--gray-500)]">이번 주 평균</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[14px] text-[var(--gray-700)]">칼로리</span>
                <span class="text-[16px] font-bold text-[var(--gray-900)]">1,920kcal</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[14px] text-[var(--gray-700)]">달성률</span>
                <span class="text-[16px] font-bold text-[#00C73C]">96%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[14px] text-[var(--gray-700)]">연속일</span>
                <span class="text-[16px] font-bold text-[var(--gray-900)]">7일</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 10s ease-in-out infinite 1s;
}
</style>
