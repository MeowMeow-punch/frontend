<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
import { useDietStore } from '@/composables/useDietStore'
import {
  getDietDaily,
  getDietMain,
  registerRecommendedDiet,
  resolveDietImageUrl,
  type DietMainData,
  type DietMealType,
} from '@/services/dietService'
import { getUserProfile } from '@/services/authService'
import { getAuthMode, isAuthenticated } from '@/services/tokenStore'
import type { MealTime } from '@/types/diet'

const router = useRouter()
const goTo = (path: string) => router.push(path)
const { setDraftMeal, setDraftSearch, markCafeteriaMeal } = useDietStore()

function isMealTime(value: string): value is MealTime {
  return value === 'breakfast' || value === 'lunch' || value === 'dinner' || value === 'snack'
}

function handleRecommendedMealSelect(meal: RecommendedMeal) {
  if (meal.isCafeteria) {
    void registerCafeteriaMeal(meal)
    return
  }
  if (isMealTime(meal.time)) {
    setDraftMeal({ time: meal.time, foods: meal.foods })
    goTo('/diet/record')
    return
  }
  goTo('/diet')
}

const isQuickAddPending = ref(false)

async function registerCafeteriaMeal(meal: RecommendedMeal) {
  if (isQuickAddPending.value) return
  const time = isMealTime(meal.time) ? meal.time : undefined
  console.info('[Home] cafeteria quick add', { mealId: meal.id, name: meal.name, time })
  try {
    isQuickAddPending.value = true
    const response = await registerRecommendedDiet(meal.id)
    const myDietId = response.data?.myDietId
    if (Number.isFinite(myDietId)) {
      markCafeteriaMeal(Number(myDietId))
    }
    goTo('/diet')
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Cafeteria recommendation register failed.'
    console.warn('[Home] cafeteria quick add failed', { mealId: meal.id, message })
    const duplicateHint =
      message.includes('중복') ||
      message.includes('이미') ||
      message.toLowerCase().includes('duplicate')
    alert(
      duplicateHint
        ? '같은 시간대 식단은 하루에 1개만 등록할 수 있습니다.'
        : '사내 식단 등록에 실패했습니다. 잠시 후 다시 시도해주세요.',
    )
  } finally {
    isQuickAddPending.value = false
  }
}

async function handleRecommendedMealQuickAdd(meal: RecommendedMeal) {
  const time = isMealTime(meal.time) ? meal.time : undefined
  if (meal.isCafeteria) {
    await registerCafeteriaMeal(meal)
    return
  }
  if (isQuickAddPending.value) return
  console.info('[Home] recommended quick add', { mealId: meal.id, name: meal.name, time })
  setDraftSearch({ keyword: meal.name, time })
  goTo('/diet/record')
}

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
    id: 2,
    title: '지금 뭐 먹지?',
    subtitle: '랜덤 메뉴 추천받고 고민 해결!',
    buttonText: '추천받기',
    route: '/menu-recommendation',
    theme: 'orange',
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

const totalCalories = ref(0)
const targetCalories = ref(0)
const aiMessage = ref('')

const nutritionData = ref<NutritionItem[]>([
  { name: '탄수화물', current: 0, target: 0 },
  { name: '단백질', current: 0, target: 0 },
  { name: '지방', current: 0, target: 0 },
])

const recommendedMeals = ref<RecommendedMeal[]>([])
const weeklyAverageCalories = ref('0kcal')
const weeklyAchievement = ref('0%')
const weeklyStreak = ref('0일')
const menuCardLabel = ref('메뉴 보러가기')
const menuCardSubtitle = ref('오늘 등록된 메뉴가 없습니다.')
const menuCardChip = ref('NEW')
const menuCardFooter = ref('소속 미지정')

const mealTypeLabels: Record<DietMealType, string> = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
  SNACK: '간식',
}

const mealTypeDraftMap: Record<DietMealType, MealTime> = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
}

const menuSlotOrder = ['LUNCH', 'DINNER', 'BREAKFAST', 'SNACK'] as const
const menuSlotLabels: Record<string, string> = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
  SNACK: '간식',
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getWeekDates = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(today)
  monday.setDate(diff)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return formatDate(date)
  })
}

const updateMenuCard = (
  menus?: Record<string, { name: string; calorie: number; subName: string }>,
) => {
  if (!menus || Object.keys(menus).length === 0) {
    menuCardLabel.value = '메뉴 보러가기'
    menuCardSubtitle.value = '오늘 등록된 메뉴가 없습니다.'
    menuCardChip.value = 'NEW'
    return
  }

  const slot = menuSlotOrder.find((key) => menus[key]?.name) ?? Object.keys(menus)[0]
  if (!slot) {
    menuCardLabel.value = '메뉴 보러가기'
    menuCardSubtitle.value = '오늘 등록된 메뉴가 없습니다.'
    menuCardChip.value = 'NEW'
    return
  }

  const menu = menus[slot]
  if (!menu?.name) {
    menuCardLabel.value = '메뉴 보러가기'
    menuCardSubtitle.value = '오늘 등록된 메뉴가 없습니다.'
    menuCardChip.value = 'NEW'
    return
  }

  const slotLabel = menuSlotLabels[slot] ?? '오늘'
  const suffix = menu.subName ? ` · ${menu.subName}` : ''
  menuCardLabel.value = '메뉴 보러가기'
  menuCardSubtitle.value = `${slotLabel} ${menu.name}${suffix}`
  menuCardChip.value = slotLabel
}

type DietMainRecommendation = DietMainData['recommendedDietsInfo'][number]

const mapRecommendedMeals = (items: DietMainRecommendation[]) =>
  items.map((item) => {
    const imageUrl = resolveDietImageUrl(item.thumbnailUrls?.[0])
    const nutrients = item.nutrients ?? { carbs: 0, protein: 0, fat: 0 }
    const sourceType = item.sourceType?.toString().trim().toUpperCase() ?? ''
    const isCafeteria =
      sourceType === 'WELSTORY' ||
      sourceType.includes('WELSTORY') ||
      (item.thumbnailUrls ?? []).some((url) => url.toLowerCase().includes('welstory'))
    return {
      id: item.recommendationId,
      name: item.name,
      time: mealTypeDraftMap[item.mealType],
      timeLabel: mealTypeLabels[item.mealType],
      calories: item.calorie,
      protein: nutrients.protein,
      carbs: nutrients.carbs,
      fat: nutrients.fat,
      isCafeteria,
      foods: [
        {
          id: item.recommendationId,
          name: item.name,
          calories: item.calorie,
          protein: nutrients.protein,
          carbs: nutrients.carbs,
          fat: nutrients.fat,
          servingSize: '1 serving',
          category: 'recommendation',
          image: imageUrl,
          quantity: 1,
        },
      ],
    }
  })

const fetchWeeklyOverview = async () => {
  const hasToken = isAuthenticated()
  const authMode = getAuthMode()
  if (!hasToken) {
    console.info('[Home] weekly overview skipped', { reason: 'no access token', authMode })
    return
  }

  const dates = getWeekDates()
  const todayString = formatDate(new Date())
  console.info('[Home] weekly overview request', { dates })

  try {
    const [profileResult, dailyResult] = await Promise.allSettled([
      getUserProfile(),
      Promise.allSettled(dates.map((date) => getDietDaily(date))),
    ])

    if (profileResult.status === 'fulfilled') {
      const activitySummary = profileResult.value.data?.activitySummary
      const userProfile = profileResult.value.data?.userProfile
      const streakCount = activitySummary?.streak?.count ?? 0
      const weeklyDietCount = activitySummary?.weeklyDiet?.count ?? 0
      const weeklyDietGoal = activitySummary?.weeklyDiet?.goal ?? 0
      const achievementPercent =
        weeklyDietGoal > 0 ? Math.round((weeklyDietCount / weeklyDietGoal) * 100) : 0

      weeklyStreak.value = `${streakCount}일`
      weeklyAchievement.value = `${achievementPercent}%`
      menuCardFooter.value = userProfile?.groupName?.trim() || '소속 미지정'

      console.info('[Home] weekly overview profile mapped', {
        streak: weeklyStreak.value,
        achievement: weeklyAchievement.value,
        groupName: menuCardFooter.value,
      })
    } else {
      console.warn('[Home] weekly overview profile failed', {
        message:
          profileResult.reason instanceof Error
            ? profileResult.reason.message
            : profileResult.reason,
      })
    }

    if (dailyResult.status === 'fulfilled') {
      const fulfilledResults = dailyResult.value.filter(
        (result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof getDietDaily>>> =>
          result.status === 'fulfilled',
      )
      const summaries = fulfilledResults.map(
        (result) => result.value.summaryInfo?.calorie?.current ?? 0,
      )
      const total = summaries.reduce((sum, value) => sum + value, 0)
      if (summaries.length > 0) {
        const average = Math.round(total / summaries.length)
        weeklyAverageCalories.value = `${average.toLocaleString()}kcal`
      } else {
        weeklyAverageCalories.value = '0kcal'
      }

      const todayIndex = dates.findIndex((date) => date === todayString)
      const todayResult = todayIndex >= 0 ? dailyResult.value[todayIndex] : null
      if (todayResult && todayResult.status === 'fulfilled') {
        updateMenuCard(todayResult.value.todayRestaurantMenu)
      } else {
        updateMenuCard(undefined)
      }

      console.info('[Home] weekly overview daily mapped', {
        averageCalories: weeklyAverageCalories.value,
        menuCardSubtitle: menuCardSubtitle.value,
        menuCardChip: menuCardChip.value,
      })
    } else {
      console.warn('[Home] weekly overview daily failed', {
        message:
          dailyResult.reason instanceof Error ? dailyResult.reason.message : dailyResult.reason,
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Weekly overview fetch failed.'
    console.warn('[Home] weekly overview error', { message, authMode, hasToken })
  }
}

const fetchDietMain = async () => {
  const hasToken = isAuthenticated()
  const authMode = getAuthMode()
  if (!hasToken) {
    console.info('[Home] diet main skipped', { reason: 'no access token', authMode })
    return
  }

  try {
    const data = await getDietMain()
    console.info('[Home] diet main response', data)

    totalCalories.value = data.summaryInfo.calorie.current
    targetCalories.value = data.summaryInfo.calorie.goal
    nutritionData.value = [
      {
        name: '탄수화물',
        current: data.summaryInfo.carbs.current,
        target: data.summaryInfo.carbs.goal,
      },
      {
        name: '단백질',
        current: data.summaryInfo.protein.current,
        target: data.summaryInfo.protein.goal,
      },
      { name: '지방', current: data.summaryInfo.fat.current, target: data.summaryInfo.fat.goal },
    ]

    if (data.aiFeedbackInfo?.message) {
      aiMessage.value = data.aiFeedbackInfo.message
    }

    const recommendedItems = Array.isArray(data.recommendedDietsInfo)
      ? data.recommendedDietsInfo
      : []
    recommendedMeals.value = mapRecommendedMeals(recommendedItems)

    console.info('[Home] diet main mapped', {
      calories: `${totalCalories.value}/${targetCalories.value}`,
      recommendations: recommendedMeals.value.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Diet main fetch failed.'
    console.warn('[Home] diet main error', { message, authMode, hasToken })
  }
}

onMounted(() => {
  fetchDietMain()
  fetchWeeklyOverview()
})
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
          <RecommendedMealsCard
            :meals="recommendedMeals"
            @select="handleRecommendedMealSelect"
            @quick-add="handleRecommendedMealQuickAdd"
          />
        </div>

        <div class="min-w-0 space-y-4 md:space-y-5 lg:space-y-6">
          <NutritionCard :items="nutritionData" />
          <MenuShortcutCard
            :label="menuCardLabel"
            :subtitle="menuCardSubtitle"
            :chip="menuCardChip"
            :footer="menuCardFooter"
            @click="goTo('/diet')"
          />
          <WeeklyAverageCard
            :calorie="weeklyAverageCalories"
            :achievement="weeklyAchievement"
            :streak="weeklyStreak"
          />
        </div>
      </div>
    </div>
  </div>
</template>
