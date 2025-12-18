<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Share2 } from 'lucide-vue-next'
import CafeteriaMenuCard from '@/components/Diet/CafeteriaMenuCard.vue'

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

const menuData = {
  breakfast: {
    time: '07:20 ~ 09:00',
    menus: [
      {
        corner: '한식',
        main: '소고기 미역국',
        sub: '쌀밥, 계란후라이, 배추김치, 도시락김, 누룽지',
        kcal: 450,
        protein: 18,
        image:
          'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
      },
      {
        corner: '간편식',
        main: '모닝 샌드위치',
        sub: '시리얼 & 우유, 그린샐러드, 삶은계란, 바나나',
        kcal: 380,
        protein: 12,
        image: null,
      },
    ],
  },
  lunch: {
    time: '11:30 ~ 13:30',
    menus: [
      {
        corner: 'A코너',
        main: '한우 사골 곰탕',
        sub: '잡곡밥, 언양식 불고기, 시금치나물, 석박지, 요구르트',
        kcal: 750,
        protein: 35,
        soldout: false,
        image:
          'https://images.unsplash.com/photo-1543340550-9833cb53530f?auto=format&fit=crop&w=600&q=80',
      },
      {
        corner: 'B코너',
        main: '해물 순두부찌개',
        sub: '쌀밥, 고등어구이, 어묵볶음, 콩나물무침, 깍두기',
        kcal: 680,
        protein: 42,
        soldout: false,
        image:
          'https://images.unsplash.com/photo-1596450650505-f938f3cc3b06?auto=format&fit=crop&w=600&q=80',
      },
      {
        corner: 'Plus',
        main: '치즈 오븐 스파게티',
        sub: '마늘빵, 콥샐러드, 수제피클, 크림스프',
        kcal: 820,
        protein: 25,
        soldout: true,
        image: null,
      },
      {
        corner: 'Salad',
        main: '훈제연어 샐러드',
        sub: '오리엔탈 드레싱, 단호박스프, 호밀빵',
        kcal: 320,
        protein: 22,
        soldout: false,
        image: null,
      },
    ],
  },
  dinner: {
    time: '17:30 ~ 19:00',
    menus: [
      {
        corner: '석식',
        main: '춘천 닭갈비 덮밥',
        sub: '콩나물국, 백김치, 마카로니 샐러드, 쥬시쿨',
        kcal: 820,
        protein: 32,
        image:
          'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
} as const

function isSelectedDate(date: Date) {
  return (
    date.getDate() === selectedDate.value.getDate() &&
    date.getMonth() === selectedDate.value.getMonth()
  )
}

function isToday(date: Date) {
  const today = new Date()
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth()
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
