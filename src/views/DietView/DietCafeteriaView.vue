<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Share2 } from 'lucide-vue-next'
import CafeteriaMenuCard from '@/components/Diet/CafeteriaMenuCard.vue'
import {
  getRestaurantMenu,
  resolveDietImageUrl,
  type RestaurantMenuItem,
} from '@/services/dietService'
import { isSameDay } from '@/utils/diet/dietUtils'

const router = useRouter()
const selectedDate = ref(new Date())

function getWeekDates(baseDate: Date) {
  const base = new Date(baseDate)
  const day = base.getDay()
  const diff = base.getDate() - day + (day === 0 ? -6 : 1)

  const monday = new Date(base)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 5 }, (_, idx) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + idx)
    return date
  })
}

const weekDates = computed(() => getWeekDates(new Date()))
const days = ['월', '화', '수', '목', '금']

const menuBySlot = ref<Record<string, RestaurantMenuItem[]>>({})
const isLoadingMenu = ref(false)

const slotTime = {
  BREAKFAST: '07:20 ~ 09:00',
  LUNCH: '11:30 ~ 13:30',
  DINNER: '17:30 ~ 19:00',
} as const

const mapSlotMenus = (slot: keyof typeof slotTime) =>
  (menuBySlot.value[slot] ?? []).map((menu, idx) => ({
    corner: menu.restaurantName || `${slot} ${idx + 1}`,
    main: menu.name,
    sub: menu.subName,
    kcal: menu.calorie,
    carbs: menu.nutrients?.carbs,
    protein: menu.nutrients?.protein,
    fat: menu.nutrients?.fat,
    soldout: false,
    image: resolveDietImageUrl(menu.thumbnailUrls?.[0]),
  }))

const menuData = computed(() => ({
  breakfast: {
    time: slotTime.BREAKFAST,
    menus: mapSlotMenus('BREAKFAST'),
  },
  lunch: {
    time: slotTime.LUNCH,
    menus: mapSlotMenus('LUNCH'),
  },
  dinner: {
    time: slotTime.DINNER,
    menus: mapSlotMenus('DINNER'),
  },
}))

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fetchMenus = async (date: Date) => {
  const dateString = formatDate(date)
  isLoadingMenu.value = true
  console.info('[DietCafeteria] menu request', { date: dateString })
  try {
    const response = await getRestaurantMenu(dateString)
    console.info('[DietCafeteria] menu raw response', response)
    menuBySlot.value = response ?? {}
    console.info('[DietCafeteria] menu response', {
      date: dateString,
      slots: Object.keys(menuBySlot.value),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Menu fetch failed.'
    console.warn('[DietCafeteria] menu error', { date: dateString, message })
    menuBySlot.value = {}
  } finally {
    isLoadingMenu.value = false
  }
}

watch(
  selectedDate,
  (next) => {
    fetchMenus(next)
  },
  { immediate: true },
)

function isSelectedDate(date: Date) {
  return isSameDay(date, selectedDate.value)
}

function isToday(date: Date) {
  return isSameDay(date, new Date())
}
</script>

<template>
  <div class="min-h-screen bg-[#F2F4F6] pb-10 font-sans">
    <div class="sticky top-0 z-30 border-b border-[var(--gray-200)] bg-white">
      <div class="mx-auto max-w-2xl px-4">
        <div class="flex h-[60px] items-center">
          <button
            type="button"
            class="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--gray-600)] transition-colors hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]"
            @click="router.push('/diet')"
          >
            <ArrowLeft class="h-5 w-5" />
          </button>
          <h1 class="flex-1 pr-8 text-center text-[17px] font-bold text-[var(--gray-900)]">
            금주 식단표
          </h1>
          <button
            type="button"
            class="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--gray-600)] transition-colors hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]"
          >
            <Share2 class="h-5 w-5" />
          </button>
        </div>

        <div class="flex justify-between pb-4 pt-1">
          <button
            v-for="(date, idx) in weekDates"
            :key="`${idx}-${date.toISOString()}`"
            type="button"
            class="relative flex w-[18%] flex-col items-center justify-center rounded-[16px] py-3 transition-all"
            :class="
              isSelectedDate(date)
                ? 'bg-[#00C73C] text-white shadow-md shadow-[#00C73C]/20'
                : 'bg-transparent text-[var(--gray-500)] hover:bg-[var(--gray-50)]'
            "
            @click="selectedDate = date"
          >
            <span
              class="mb-0.5 text-[13px]"
              :class="isSelectedDate(date) ? 'font-medium opacity-90' : 'font-normal'"
            >
              {{ days[idx] }}
            </span>
            <span
              class="text-[16px]"
              :class="isSelectedDate(date) ? 'font-bold' : 'font-semibold text-[var(--gray-800)]'"
            >
              {{ date.getDate() }}
            </span>
            <div
              v-if="isToday(date) && !isSelectedDate(date)"
              class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#00C73C]"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-2xl space-y-8 px-4 pt-6">
      <section>
        <div class="mb-3 flex items-center gap-2 px-1">
          <span class="rounded-[8px] bg-[#FFF4E6] px-2.5 py-1 text-[12px] font-bold text-[#FF9500]"
            >아침</span
          >
          <span class="text-[13px] text-[var(--gray-500)]">{{ menuData.breakfast.time }}</span>
        </div>

        <div class="space-y-3">
          <CafeteriaMenuCard
            v-for="(menu, idx) in menuData.breakfast.menus"
            :key="`b-${idx}`"
            :menu="menu"
          />
        </div>
      </section>

      <section>
        <div class="mb-3 flex items-center gap-2 px-1">
          <span class="rounded-[8px] bg-[#E5F9EB] px-2.5 py-1 text-[12px] font-bold text-[#00C73C]"
            >점심</span
          >
          <span class="text-[13px] text-[var(--gray-500)]">{{ menuData.lunch.time }}</span>
        </div>

        <div class="space-y-3">
          <CafeteriaMenuCard
            v-for="(menu, idx) in menuData.lunch.menus"
            :key="`l-${idx}`"
            :menu="menu"
          />
        </div>
      </section>

      <section>
        <div class="mb-3 flex items-center gap-2 px-1">
          <span class="rounded-[8px] bg-[#EAEBFF] px-2.5 py-1 text-[12px] font-bold text-[#555FE0]"
            >저녁</span
          >
          <span class="text-[13px] text-[var(--gray-500)]">{{ menuData.dinner.time }}</span>
        </div>

        <div class="space-y-3">
          <CafeteriaMenuCard
            v-for="(menu, idx) in menuData.dinner.menus"
            :key="`d-${idx}`"
            :menu="menu"
          />
        </div>
      </section>
    </div>
  </div>
</template>
