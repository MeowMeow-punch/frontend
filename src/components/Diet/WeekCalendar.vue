<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { isSameDay } from '@/utils/diet/dietUtils'

const props = defineProps<{
  selectedDate: Date
}>()

const emit = defineEmits<{
  (e: 'select', date: Date): void
}>()

function getWeekStart(date: Date) {
  const base = new Date(date)
  const day = base.getDay()
  const diff = base.getDate() - day + (day === 0 ? -6 : 1)
  base.setDate(diff)
  base.setHours(0, 0, 0, 0)
  return base
}

function getWeekDays(startDate: Date) {
  return Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + idx)
    return date
  })
}

function getWeekNumber(date: Date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const currentDate = date.getDate()
  return Math.ceil((currentDate + firstDayOfWeek) / 7)
}

const currentWeekStart = ref(getWeekStart(props.selectedDate))

watch(
  () => props.selectedDate,
  (next) => {
    const weekStart = getWeekStart(next)
    if (!isSameDay(weekStart, currentWeekStart.value)) {
      currentWeekStart.value = weekStart
    }
  },
)

const weekDays = computed(() => getWeekDays(currentWeekStart.value))
const dayNames = ['월', '화', '수', '목', '금', '토', '일']

const titleText = computed(() => {
  const titleDate = new Date(currentWeekStart.value)
  titleDate.setDate(currentWeekStart.value.getDate() + 3)
  const year = titleDate.getFullYear()
  const month = titleDate.getMonth() + 1
  const weekNum = getWeekNumber(titleDate)
  return `${year}년 ${month}월 ${weekNum}주차`
})

function goToPreviousWeek() {
  const date = new Date(currentWeekStart.value)
  date.setDate(currentWeekStart.value.getDate() - 7)
  currentWeekStart.value = date
}

function goToNextWeek() {
  const date = new Date(currentWeekStart.value)
  date.setDate(currentWeekStart.value.getDate() + 7)
  currentWeekStart.value = date
}

function isToday(date: Date) {
  return isSameDay(date, new Date())
}

function isSelected(date: Date) {
  return isSameDay(date, props.selectedDate)
}
</script>

<template>
  <div class="space-y-4">
    <div class="mb-4 flex items-center justify-center gap-2">
      <button
        type="button"
        class="h-8 w-8 rounded-full p-0 text-[var(--gray-500)] hover:bg-[var(--gray-100)]"
        @click="goToPreviousWeek"
      >
        <ChevronLeft class="h-5 w-5" />
      </button>

      <h3 class="text-[20px] font-bold tracking-[-0.02em] text-[var(--gray-900)]">
        {{ titleText }}
      </h3>

      <button
        type="button"
        class="h-8 w-8 rounded-full p-0 text-[var(--gray-500)] hover:bg-[var(--gray-100)]"
        @click="goToNextWeek"
      >
        <ChevronRight class="h-5 w-5" />
      </button>
    </div>

    <div class="rounded-3xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(date, index) in weekDays"
          :key="date.toISOString()"
          type="button"
          class="group relative flex flex-col items-center justify-center py-2"
          @click="emit('select', date)"
        >
          <span
            class="mb-2 text-[13px]"
            :class="isToday(date) ? 'font-semibold text-[#00C73C]' : 'text-[var(--gray-500)]'"
          >
            {{ dayNames[index] }}
          </span>

          <div
            class="flex h-9 w-9 items-center justify-center rounded-full text-[15px] transition-all duration-200"
            :class="
              isSelected(date)
                ? 'scale-105 bg-[#00C73C] font-bold text-white shadow-md shadow-[#00C73C]/30'
                : isToday(date)
                  ? 'bg-[#E5F9EB] font-bold text-[#00C73C]'
                  : 'text-[var(--gray-800)] group-hover:bg-[var(--gray-100)]'
            "
          >
            {{ date.getDate() }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
