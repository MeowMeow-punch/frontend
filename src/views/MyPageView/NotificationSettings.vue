<script setup lang="ts">
import { reactive } from 'vue'
import { ArrowLeft, Bell, BellOff } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'save'): void
}>()

const settings = reactive({
  mealReminder: true,
  mealReminderTime: '12:00',
  dailySummary: true,
  dailySummaryTime: '21:00',
  weeklyReport: true,
  goalAchievement: true,
  communityActivity: false,
  newMealSuggestion: true,
})

const handleSave = () => {
  emit('save')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--gray-50)]">
    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        class="mb-6 flex items-center gap-2 text-[var(--gray-600)] transition-colors hover:text-[var(--gray-900)]"
        @click="emit('back')"
      >
        <ArrowLeft class="h-5 w-5" />
        <span class="text-[15px]">뒤로가기</span>
      </button>

      <div class="mb-8">
        <h1 class="mb-2 text-[28px] font-semibold">알림 설정</h1>
        <p class="text-[15px] text-[var(--gray-600)]">받고 싶은 알림을 설정하세요</p>
      </div>

      <div class="mb-4 rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <div class="mb-5 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F9ED]">
            <Bell class="h-5 w-5 text-[#00C73C]" />
          </div>
          <h2 class="text-[18px] font-semibold">식단 알림</h2>
        </div>

        <div class="space-y-4">
          <div class="rounded-lg bg-[var(--gray-50)] p-4">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex-1">
                <p class="mb-1 text-[15px] font-medium text-[var(--gray-900)]">식사 시간 알림</p>
                <p class="text-[13px] text-[var(--gray-600)]">
                  설정한 시간에 식사 기록 알림을 받습니다
                </p>
              </div>
              <input
                type="checkbox"
                v-model="settings.mealReminder"
                class="h-5 w-5 accent-[#00C73C]"
              />
            </div>
            <div v-if="settings.mealReminder" class="flex items-center gap-2">
              <label class="text-[14px] text-[var(--gray-700)]">알림 시간:</label>
              <input
                type="time"
                v-model="settings.mealReminderTime"
                class="rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[14px]"
              />
            </div>
          </div>

          <div class="rounded-lg bg-[var(--gray-50)] p-4">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex-1">
                <p class="mb-1 text-[15px] font-medium text-[var(--gray-900)]">하루 요약 알림</p>
                <p class="text-[13px] text-[var(--gray-600)]">
                  하루 식단 요약과 칼로리 정보를 받습니다
                </p>
              </div>
              <input
                type="checkbox"
                v-model="settings.dailySummary"
                class="h-5 w-5 accent-[#00C73C]"
              />
            </div>
            <div v-if="settings.dailySummary" class="flex items-center gap-2">
              <label class="text-[14px] text-[var(--gray-700)]">알림 시간:</label>
              <input
                type="time"
                v-model="settings.dailySummaryTime"
                class="rounded-lg border border-[var(--gray-200)] px-3 py-2 text-[14px]"
              />
            </div>
          </div>

          <div class="flex items-center justify-between rounded-lg bg-[var(--gray-50)] p-4">
            <div class="flex-1">
              <p class="mb-1 text-[15px] font-medium text-[var(--gray-900)]">새로운 식단 추천</p>
              <p class="text-[13px] text-[var(--gray-600)]">
                AI가 분석한 맞춤 식단 추천 알림을 받습니다
              </p>
            </div>
            <input
              type="checkbox"
              v-model="settings.newMealSuggestion"
              class="h-5 w-5 accent-[#00C73C]"
            />
          </div>
        </div>
      </div>

      <div class="mb-4 rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <div class="mb-5 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F9ED]">
            <Bell class="h-5 w-5 text-[#00C73C]" />
          </div>
          <h2 class="text-[18px] font-semibold">목표 및 리포트</h2>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-lg bg-[var(--gray-50)] p-4">
            <div class="flex-1">
              <p class="mb-1 text-[15px] font-medium text-[var(--gray-900)]">주간 리포트</p>
              <p class="text-[13px] text-[var(--gray-600)]">
                매주 일요일에 주간 식단 리포트를 받습니다
              </p>
            </div>
            <input
              type="checkbox"
              v-model="settings.weeklyReport"
              class="h-5 w-5 accent-[#00C73C]"
            />
          </div>

          <div class="flex items-center justify-between rounded-lg bg-[var(--gray-50)] p-4">
            <div class="flex-1">
              <p class="mb-1 text-[15px] font-medium text-[var(--gray-900)]">목표 달성 알림</p>
              <p class="text-[13px] text-[var(--gray-600)]">
                일일/주간 목표 달성 시 축하 알림을 받습니다
              </p>
            </div>
            <input
              type="checkbox"
              v-model="settings.goalAchievement"
              class="h-5 w-5 accent-[#00C73C]"
            />
          </div>
        </div>
      </div>

      <div class="mb-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <div class="mb-5 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gray-100)]">
            <BellOff class="h-5 w-5 text-[var(--gray-600)]" />
          </div>
          <h2 class="text-[18px] font-semibold">커뮤니티</h2>
        </div>

        <div class="flex items-center justify-between rounded-lg bg-[var(--gray-50)] p-4">
          <div class="flex-1">
            <p class="mb-1 text-[15px] font-medium text-[var(--gray-900)]">커뮤니티 활동 알림</p>
            <p class="text-[13px] text-[var(--gray-600)]">
              내 게시글에 댓글이 달리거나 좋아요를 받으면 알림을 받습니다
            </p>
          </div>
          <input
            type="checkbox"
            v-model="settings.communityActivity"
            class="h-5 w-5 accent-[#00C73C]"
          />
        </div>
      </div>

      <button
        type="button"
        class="h-12 w-full rounded-lg text-[15px] text-white"
        style="background-color: #00c73c"
        @click="handleSave"
      >
        저장
      </button>
    </div>
  </div>
</template>
