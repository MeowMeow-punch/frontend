<script setup lang="ts">
import { useRouter } from 'vue-router'
import BannerCarousel, { type Banner } from '@/components/Home/BannerCarousel.vue'
import CalorieSummaryCard from '@/components/Home/CalorieSummaryCard.vue'
import AiInsightCard from '@/components/Home/AiInsightCard.vue'
import RecommendedMealsCard, {
  type RecommendedMeal,
} from '@/components/Home/RecommendedMealsCard.vue'
import NutritionCard, { type NutritionItem } from '@/components/Home/NutritionCard.vue'
import MenuShortcutCard from '@/components/Home/MenuShortcutCard.vue'
import WeeklyAverageCard from '@/components/Home/WeeklyAverageCard.vue'

const router = useRouter()
const goTo = (path: string) => router.push(path)

const banners: Banner[] = [
  {
    id: 1,
    title: '오늘의 식단 기록',
    subtitle: 'AI 영양 분석으로 건강 목표 달성하기',
    buttonText: '식단 기록하기',
    route: '/diet',
    theme: 'green',
    available: true,
  },
  {
    id: 3,
    title: '그룹 챌린지',
    subtitle: '친구들과 함께 만드는 건강한 습관',
    buttonText: '알림 신청',
    route: '/community',
    theme: 'purple',
    available: false,
    comingSoon: '곧 만나요',
  },
]

const totalCalories = 1850
const targetCalories = 2000
const aiMessage = '단백질 섭취가 목표보다 25g 부족해요. 저녁에 고단백 저지방 식품을 추가해보세요.'

const nutritionData: NutritionItem[] = [
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
      <BannerCarousel :banners="banners" @navigate="goTo" />

      <div class="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-[1fr_320px] lg:gap-6">
        <div class="min-w-0 space-y-4 md:space-y-5 lg:space-y-6">
          <CalorieSummaryCard :total-calories="totalCalories" :target-calories="targetCalories" />
          <AiInsightCard :message="aiMessage" />
          <RecommendedMealsCard :meals="recommendedMeals" @select="() => goTo('/diet')" />
        </div>

        <div class="min-w-0 space-y-4 md:space-y-5 lg:space-y-6">
          <NutritionCard :items="nutritionData" />
          <MenuShortcutCard
            label="메뉴 보러가기"
            subtitle="오늘 우리 회사 메뉴는 무엇일까요?"
            @click="goTo('/diet')"
          />
          <WeeklyAverageCard calorie="1,920kcal" achievement="96%" streak="7일" />
        </div>
      </div>
    </div>
  </div>
</template>
