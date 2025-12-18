<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Edit2,
  LogOut,
  ChevronRight,
  TrendingDown,
  Calendar,
  Apple,
  Shield,
  UserCog,
  Scale,
} from 'lucide-vue-next'
import Dialog from '@/components/Dialog/Dialog.vue'
import EditGoal from '@/views/MyPageView/EditGoal.vue'
import EditProfile from '@/views/MyPageView/EditProfile.vue'
import PrivacyPolicy from '@/views/MyPageView/PrivacyPolicy.vue'

type SubPage = 'main' | 'edit-goal' | 'edit-profile' | 'privacy'

const router = useRouter()
const nickname = ref('건강한하루')
const tempNickname = ref(nickname.value)
const isEditingNickname = ref(false)
const currentSubPage = ref<SubPage>('main')

const userInfo = {
  email: 'user@pickit.com',
  joinDate: '2024.11.01',
  gender: '남성',
  height: 175,
  age: 28,
  allergies: ['새우', '땅콩'],
  group: 'SSAFY 12기',
  userType: '영양관리',
  startWeight: 75,
  currentWeight: 72.7,
  targetWeight: 68,
  lastWeightRecord: '2024.12.02',
  totalRecordDays: 23,
  consecutiveDays: 7,
  thisWeekMealCount: 5,
  thisWeekTargetMealCount: 7,
} as const

const isWeightFocused = computed(
  () => userInfo.userType === '다이어트' || userInfo.userType === '체중증량',
)
const weightChange = computed(() => userInfo.currentWeight - userInfo.startWeight)
const progressPercentage = computed(
  () =>
    ((userInfo.startWeight - userInfo.currentWeight) /
      (userInfo.startWeight - userInfo.targetWeight)) *
    100,
)
const weeklyMealRate = computed(
  () => (userInfo.thisWeekMealCount / userInfo.thisWeekTargetMealCount) * 100,
)

const handleNicknameUpdate = () => {
  nickname.value = tempNickname.value
  isEditingNickname.value = false
}

const handleSaveSubPage = () => {
  currentSubPage.value = 'main'
}

const handleLogout = () => {
  router.push('/login')
}

const handleDeleteAccount = () => {
  if (confirm('정말 회원 탈퇴하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.')) {
    console.log('회원 탈퇴')
  }
}
</script>

<template>
  <EditGoal
    v-if="currentSubPage === 'edit-goal'"
    @back="currentSubPage = 'main'"
    @save="handleSaveSubPage"
  />
  <EditProfile
    v-else-if="currentSubPage === 'edit-profile'"
    @back="currentSubPage = 'main'"
    @save="handleSaveSubPage"
  />
  <PrivacyPolicy v-else-if="currentSubPage === 'privacy'" @back="currentSubPage = 'main'" />

  <div v-else class="min-h-screen bg-white">
    <div class="mx-auto max-w-[960px] px-4 py-8 pb-16 md:px-8 md:py-12 md:pb-24">
      <div class="mb-6 md:mb-8">
        <h1
          class="mb-2 text-[20px] leading-[1.4] tracking-[-0.02em] text-[var(--gray-900)] md:text-[22px]"
          style="font-weight: 700"
        >
          마이페이지
        </h1>
        <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
          내 정보와 설정을 관리하세요
        </p>
      </div>

      <div class="mb-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <div class="flex items-start gap-4">
          <div
            class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00C73C] to-[#00A332]"
          >
            <User class="h-8 w-8 text-white" />
          </div>

          <div class="flex-1">
            <div class="mb-1.5 flex items-center gap-2">
              <h2 class="text-[20px] text-[var(--gray-900)]" style="font-weight: 700">
                {{ nickname }}
              </h2>
              <button
                type="button"
                class="rounded-lg p-1.5 transition-colors hover:bg-[var(--gray-100)]"
                @click="isEditingNickname = true"
              >
                <Edit2 class="h-4 w-4 text-[var(--gray-600)]" />
              </button>
            </div>

            <Dialog v-model="isEditingNickname">
              <template #title>닉네임 변경</template>
              <template #description>새로운 닉네임을 입력해주세요 (2~10자)</template>

              <div class="space-y-4 py-4">
                <div class="space-y-2">
                  <label
                    for="nickname"
                    class="text-[14px] text-[var(--gray-700)]"
                    style="font-weight: 600"
                  >
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    v-model="tempNickname"
                    maxlength="10"
                    class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
                  />
                  <p class="text-sm text-[var(--gray-600)]">{{ tempNickname.length }}/10자</p>
                </div>
                <div class="flex gap-3">
                  <button
                    type="button"
                    class="flex-1 rounded-lg border border-[var(--gray-300)] px-4 py-2 text-[14px] text-[var(--gray-700)] transition hover:bg-[var(--gray-50)]"
                    style="font-weight: 600"
                    @click="isEditingNickname = false"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    class="flex-1 rounded-lg px-4 py-2 text-[14px] text-white transition disabled:cursor-not-allowed disabled:bg-[var(--gray-200)]"
                    :disabled="tempNickname.length < 2 || tempNickname.length > 10"
                    style="background-color: #00c73c; font-weight: 600"
                    @click="handleNicknameUpdate"
                  >
                    변경
                  </button>
                </div>
              </div>
            </Dialog>

            <p class="mb-3 text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
              {{ userInfo.email }}
            </p>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-lg bg-[#E6F9ED] px-3 py-1.5 text-[13px] text-[#00C73C]"
                style="font-weight: 600"
              >
                {{
                  userInfo.userType === '다이어트'
                    ? '🔥 다이어트'
                    : userInfo.userType === '영양관리'
                      ? '🥗 영양관리'
                      : '💪 체중증량'
                }}
              </span>
              <span
                v-if="userInfo.group"
                class="rounded-lg bg-[var(--gray-100)] px-3 py-1.5 text-[13px] text-[var(--gray-700)]"
                style="font-weight: 500"
              >
                {{ userInfo.group }}
              </span>
              <span class="text-[13px] text-[var(--gray-500)]" style="font-weight: 400">
                {{ userInfo.joinDate }} 가입
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6 rounded-2xl bg-[var(--gray-50)] p-6">
        <h2 class="mb-4 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">활동 통계</h2>

        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div class="mb-2 flex items-center gap-2">
              <Calendar class="h-4 w-4 text-[#00C73C]" />
              <span class="text-[13px] text-[var(--gray-600)]" style="font-weight: 500">
                연속 기록
              </span>
            </div>
            <p class="text-[24px] text-[var(--gray-900)]" style="font-weight: 700">
              {{ userInfo.consecutiveDays }}
              <span class="ml-1 text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
                일
              </span>
            </p>
            <p class="mt-1 text-[12px] text-[var(--gray-500)]" style="font-weight: 400">
              총 {{ userInfo.totalRecordDays }}일 기록
            </p>
          </div>

          <div>
            <div class="mb-2 flex items-center gap-2">
              <Apple class="h-4 w-4 text-[#00C73C]" />
              <span class="text-[13px] text-[var(--gray-600)]" style="font-weight: 500">
                이번 주 식단
              </span>
            </div>
            <p class="text-[24px] text-[var(--gray-900)]" style="font-weight: 700">
              {{ userInfo.thisWeekMealCount }}
              <span class="ml-1 text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
                / {{ userInfo.thisWeekTargetMealCount }}끼
              </span>
            </p>
            <p class="mt-1 text-[12px] text-[var(--gray-500)]" style="font-weight: 400">
              기록률 {{ weeklyMealRate.toFixed(0) }}%
            </p>
          </div>

          <template v-if="isWeightFocused">
            <div>
              <div class="mb-2 flex items-center gap-2">
                <Scale class="h-4 w-4 text-[#00C73C]" />
                <span class="text-[13px] text-[var(--gray-600)]" style="font-weight: 500">
                  시작 체중
                </span>
              </div>
              <p class="text-[24px] text-[var(--gray-900)]" style="font-weight: 700">
                {{ userInfo.startWeight }}
                <span class="ml-1 text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
                  kg
                </span>
              </p>
              <p class="mt-1 text-[12px] text-[var(--gray-500)]" style="font-weight: 400">
                목표 {{ userInfo.targetWeight }}kg
              </p>
            </div>

            <div>
              <div class="mb-2 flex items-center gap-2">
                <TrendingDown class="h-4 w-4 text-[#00C73C]" />
                <span class="text-[13px] text-[var(--gray-600)]" style="font-weight: 500">
                  체중 변화
                </span>
              </div>
              <p class="text-[24px]" style="font-weight: 700; color: #00c73c">
                {{ weightChange >= 0 ? '+' : '' }}{{ weightChange.toFixed(1) }}
                <span class="ml-1 text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
                  kg
                </span>
              </p>
              <p class="mt-1 text-[12px] text-[var(--gray-500)]" style="font-weight: 400">
                달성률 {{ progressPercentage.toFixed(0) }}%
              </p>
            </div>
          </template>
        </div>
      </div>

      <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
          <h2 class="mb-4 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">
            기본 정보
          </h2>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[14px] text-[var(--gray-600)]" style="font-weight: 500">성별</span>
              <span class="text-[14px] text-[var(--gray-900)]" style="font-weight: 600">
                {{ userInfo.gender }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[14px] text-[var(--gray-600)]" style="font-weight: 500">나이</span>
              <span class="text-[14px] text-[var(--gray-900)]" style="font-weight: 600">
                {{ userInfo.age }}세
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[14px] text-[var(--gray-600)]" style="font-weight: 500">키</span>
              <span class="text-[14px] text-[var(--gray-900)]" style="font-weight: 600">
                {{ userInfo.height }}cm
              </span>
            </div>
            <div v-if="userInfo.allergies.length" class="flex items-start justify-between">
              <span class="text-[14px] text-[var(--gray-600)]" style="font-weight: 500">
                알레르기
              </span>
              <div class="flex max-w-[60%] flex-wrap justify-end gap-1.5">
                <span
                  v-for="allergy in userInfo.allergies"
                  :key="allergy"
                  class="rounded-lg bg-[var(--gray-100)] px-2.5 py-1 text-[12px] text-[var(--gray-700)]"
                  style="font-weight: 500"
                >
                  {{ allergy }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
          <h2 class="mb-4 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">설정</h2>

          <div class="space-y-2">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl p-3 transition-colors hover:bg-[var(--gray-50)]"
              @click="currentSubPage = 'edit-goal'"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gray-100)]"
                >
                  <TrendingDown class="h-4 w-4 text-[var(--gray-700)]" />
                </div>
                <span class="text-[14px] text-[var(--gray-900)]" style="font-weight: 500">
                  목표 및 건강정보 수정
                </span>
              </div>
              <ChevronRight class="h-5 w-5 text-[var(--gray-400)]" />
            </button>

            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl p-3 transition-colors hover:bg-[var(--gray-50)]"
              @click="currentSubPage = 'edit-profile'"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gray-100)]"
                >
                  <UserCog class="h-4 w-4 text-[var(--gray-700)]" />
                </div>
                <span class="text-[14px] text-[var(--gray-900)]" style="font-weight: 500">
                  개인정보 설정
                </span>
              </div>
              <ChevronRight class="h-5 w-5 text-[var(--gray-400)]" />
            </button>

            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl p-3 transition-colors hover:bg-[var(--gray-50)]"
              @click="currentSubPage = 'privacy'"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gray-100)]"
                >
                  <Shield class="h-4 w-4 text-[var(--gray-700)]" />
                </div>
                <span class="text-[14px] text-[var(--gray-900)]" style="font-weight: 500">
                  개인정보 처리방침
                </span>
              </div>
              <ChevronRight class="h-5 w-5 text-[var(--gray-400)]" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          class="flex items-center gap-1.5 text-[13px] text-[var(--gray-600)] transition-colors hover:text-[var(--gray-900)]"
          style="font-weight: 500"
          @click="handleLogout"
        >
          <LogOut class="h-4 w-4" />
          로그아웃
        </button>
        <span class="h-3 w-px bg-[var(--gray-300)]" />
        <button
          type="button"
          class="text-[13px] text-[var(--gray-500)] transition-colors hover:text-[var(--error-300)]"
          style="font-weight: 500"
          @click="handleDeleteAccount"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  </div>
</template>
