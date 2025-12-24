<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { menuList, type MenuItem } from '@/data/menuData'

const router = useRouter()

// --- State ---
const selectedCategory = ref<string>('전체')
const selectedCompanion = ref<string>('전체')
const isAnimating = ref(false)
const currentMenu = ref<MenuItem | null>(null)
const displayMenuName = ref('메뉴 추천을 받아보세요!')
const displayEmoji = ref('🍽️')

// --- Constants & Options ---
const categories = ['전체', '한식', '중식', '일식', '양식', '아시아', '분식/야식', '카페/디저트']
const companions = ['전체', '혼밥', '친구', '연인', '가족', '회식/모임']

// --- Computed ---
const filteredMenus = computed(() => {
  if (selectedCategory.value === '전체') {
    return menuList
  }
  return menuList.filter((menu) => menu.category === selectedCategory.value)
})

// --- Methods ---
const startRecommendation = () => {
  if (isAnimating.value) return
  if (filteredMenus.value.length === 0) {
    alert('해당 조건에 맞는 메뉴가 없습니다.')
    return
  }

  isAnimating.value = true
  let count = 0
  const maxCount = 20 // 애니메이션 반복 횟수
  const intervalTime = 80 // 애니메이션 속도 (ms)

  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * filteredMenus.value.length)
    const randomMenu = filteredMenus.value[randomIndex]
    if (randomMenu) {
      displayMenuName.value = randomMenu.name
      displayEmoji.value = randomMenu.emoji
    }
    count++

    if (count >= maxCount) {
      clearInterval(interval)
      pickFinalMenu()
    }
  }, intervalTime)
}

const pickFinalMenu = () => {
  const randomIndex = Math.floor(Math.random() * filteredMenus.value.length)
  const finalMenu = filteredMenus.value[randomIndex]
  if (finalMenu) {
    currentMenu.value = finalMenu
    displayMenuName.value = finalMenu.name
    displayEmoji.value = finalMenu.emoji
  }
  isAnimating.value = false
}

const goToDietRecord = () => {
  router.push('/diet/record')
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-start bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <button
        @click="router.back()"
        class="mb-2 flex items-center gap-1 self-start text-gray-500 transition-colors hover:text-gray-700"
      >
        <span>&larr;</span> 뒤로가기
      </button>

      <!-- Title / Result Area -->
      <div
        class="flex min-h-[250px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300"
      >
        <div class="animate-bounce-short mb-4 text-6xl">{{ displayEmoji }}</div>
        <h1 class="animate-fade-in break-keep text-3xl font-bold text-gray-900">
          {{ displayMenuName }}
        </h1>
        <p v-if="!currentMenu && !isAnimating" class="mt-2 text-gray-500">
          옵션을 선택하고 버튼을 눌러보세요!
        </p>
      </div>

      <!-- Options -->
      <div class="space-y-4">
        <!-- Category Selection -->
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <label class="mb-3 block text-sm font-medium text-gray-700">종류</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200',
                selectedCategory === category
                  ? 'bg-[#00c73c] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <!-- Companion Selection (Visual only for now as logic doesn't use it yet) -->
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <label class="mb-3 block text-sm font-medium text-gray-700">누구와 함께?</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="who in companions"
              :key="who"
              @click="selectedCompanion = who"
              :class="[
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200',
                selectedCompanion === who
                  ? 'bg-[#00c73c] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              {{ who }}
            </button>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        @click="startRecommendation"
        :disabled="isAnimating"
        class="w-full transform rounded-xl bg-gradient-to-r from-[#00c73c] to-[#4cd471] py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {{ isAnimating ? '메뉴 탐색 중...' : '메뉴 추천받기!' }}
      </button>

      <!-- AI Recommendation Link -->
      <div v-if="currentMenu" class="animate-fade-in-up pt-4 text-center">
        <div class="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p class="mb-2 text-sm text-gray-700">
            이 메뉴 어떠세요? <br />
            내 생활패턴과 식단을 기반으로 <br class="hidden sm:block" />
            <span class="font-bold text-[#3182f6]">AI에게 정밀한 추천</span>을 받아보는 건 어때요?
          </p>
          <button
            @click="goToDietRecord"
            class="text-sm font-semibold text-[#3182f6] underline decoration-2 underline-offset-4 hover:text-[#6ba5f8]"
          >
            식단 작성하고 AI 식단 추천 받으러 가기 &rarr;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-short {
  animation: bounce-short 1s infinite alternate;
}

@keyframes bounce-short {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
