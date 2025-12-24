<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
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
import { getUserProfile, logout, updateProfile, withdraw } from '@/services/authService'
import { useModalStore } from '@/stores/modalStore'

type SubPage = 'main' | 'edit-goal' | 'edit-profile' | 'privacy'

const router = useRouter()
const modalStore = useModalStore()
const nickname = ref('')
const tempNickname = ref(nickname.value)
const isEditingNickname = ref(false)
const currentSubPage = ref<SubPage>('main')
const isDev = import.meta.env.DEV

const userInfo = reactive({
  email: '',
  joinDate: '',
  gender: '',
  height: 0,
  age: 0,
  allergies: [] as string[],
  group: '',
  userType: '',
  startWeight: 0,
  currentWeight: 0,
  targetWeight: 0,
  lastWeightRecord: '',
  totalRecordDays: 0,
  consecutiveDays: 0,
  thisWeekMealCount: 0,
  thisWeekTargetMealCount: 0,
  marketingConsent: false,
})

const mapFocusLabel = (focus: string) => {
  if (focus === 'DIET') return '다이어트'
  if (focus === 'MUSCLE') return '체중증량'
  return '영양관리'
}

const mapGenderLabel = (gender: string) => (gender === 'MALE' ? '남성' : '여성')

const isWeightFocused = computed(
  () => userInfo.userType === '다이어트' || userInfo.userType === '체중증량',
)
const weeklyMealRate = computed(() => {
  if (!userInfo.thisWeekTargetMealCount) {
    return 0
  }
  return (userInfo.thisWeekMealCount / userInfo.thisWeekTargetMealCount) * 100
})

const handleNicknameUpdate = async () => {
  const nextNickname = tempNickname.value.trim()
  if (nextNickname.length < 2 || nextNickname.length > 10) {
    return
  }

  try {
    const response = await updateProfile({ nickname: nextNickname })
    if (isDev) {
      console.info('[MyPage] nickname update response', response)
    }
    if (response.code === 200) {
      nickname.value = nextNickname
      tempNickname.value = nextNickname
      isEditingNickname.value = false
    } else {
      modalStore.openAppModal({
        title: '변경 실패',
        content: response.message || '닉네임 변경에 실패했습니다.',
        type: 'error',
      })
    }
  } catch (e) {
    modalStore.openAppModal({
      title: '오류 발생',
      content: '닉네임 변경 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.',
      type: 'error',
    })
  }
}

const handleProfileSave = (profile: {
  nickname: string
  gender: string
  height: number
  weight: number
  age: number
  group: string
  allergies: string[]
  marketingConsent: boolean
}) => {
  nickname.value = profile.nickname
  tempNickname.value = profile.nickname
  userInfo.gender = profile.gender
  userInfo.height = profile.height
  userInfo.currentWeight = profile.weight
  userInfo.age = profile.age
  userInfo.group = profile.group
  userInfo.allergies = [...profile.allergies]
  userInfo.marketingConsent = profile.marketingConsent
  currentSubPage.value = 'main'
}

const handleGoalSave = (payload: { focus: string; targetWeight: string }) => {
  userInfo.userType = payload.focus
  if (payload.targetWeight) {
    userInfo.targetWeight = Number(payload.targetWeight)
  }
  currentSubPage.value = 'main'
}

const profileSnapshot = computed(() => ({
  nickname: nickname.value,
  email: userInfo.email,
  gender: userInfo.gender,
  height: String(userInfo.height),
  weight: String(userInfo.currentWeight),
  age: String(userInfo.age),
  group: userInfo.group,
  allergies: userInfo.allergies,
  marketingConsent: userInfo.marketingConsent,
}))

const handleLogout = async () => {
  try {
    // Confirm Logout
    const confirmed = await modalStore.openAppModal({
      title: '로그아웃',
      content: '로그아웃 하시겠습니까?',
      type: 'confirm',
      confirmText: '로그아웃',
    })

    if (!confirmed) return

    await logout()
    await modalStore.openAppModal({
      title: '로그아웃 완료',
      content: '안전하게 로그아웃 되었습니다.',
      type: 'success',
    })

    router.push({ name: 'landing' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const handleDeleteAccount = async () => {
  try {
    const confirmed = await modalStore.openAppModal({
      title: '회원 탈퇴',
      content: '정말 탈퇴하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.',
      type: 'confirm',
      confirmText: '탈퇴하기',
      cancelText: '유지하기', // More friendly text
    })

    if (!confirmed) return

    await withdraw()
    await modalStore.openAppModal({
      title: '탈퇴 완료',
      content: '회원 탈퇴가 완료되었습니다.\n그동안 이용해 주셔서 감사합니다.',
      type: 'success',
    })

    router.push({ name: 'landing' })
  } catch (error) {
    console.error('Withdraw failed:', error)
    modalStore.openAppModal({
      title: '오류 발생',
      content: '회원 탈퇴 처리에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      type: 'error',
    })
  }
}

const loadUserProfile = async () => {
  try {
    if (isDev) {
      console.info('[MyPage] load user profile')
    }
    const response = await getUserProfile()
    if (isDev) {
      console.info('[MyPage] user profile response', response)
    }
    const apiInfo = response.data?.userProfile
    const basicInfo = response.data?.basicInfo
    const activitySummary = response.data?.activitySummary
    if (!apiInfo || !basicInfo) {
      return
    }

    nickname.value = apiInfo.nickname
    tempNickname.value = apiInfo.nickname
    userInfo.gender = mapGenderLabel(basicInfo.gender)
    userInfo.height = basicInfo.height
    userInfo.age = basicInfo.age
    userInfo.group = apiInfo.groupName ?? ''
    userInfo.userType = mapFocusLabel(apiInfo.focus)
    userInfo.currentWeight = basicInfo.weight
    userInfo.allergies = Array.isArray(basicInfo.allergies) ? basicInfo.allergies : []
    if (apiInfo.createdAt) {
      userInfo.joinDate = apiInfo.createdAt
    }

    const streakInfo = activitySummary?.streak
    const weeklyDietInfo = activitySummary?.weeklyDiet
    userInfo.consecutiveDays = typeof streakInfo?.count === 'number' ? streakInfo.count : 0
    userInfo.totalRecordDays = typeof streakInfo?.total === 'number' ? streakInfo.total : 0
    userInfo.thisWeekMealCount =
      typeof weeklyDietInfo?.count === 'number' ? weeklyDietInfo.count : 0
    userInfo.thisWeekTargetMealCount =
      typeof weeklyDietInfo?.goal === 'number' ? weeklyDietInfo.goal : 0
    if (isDev) {
      console.info('[MyPage] user profile mapped', {
        nickname: nickname.value,
        gender: userInfo.gender,
        height: userInfo.height,
        age: userInfo.age,
        group: userInfo.group,
        userType: userInfo.userType,
      })
    }
  } catch (error) {
    console.error('User profile load failed:', error)
  }
}

onMounted(loadUserProfile)
</script>

<template>
  <EditGoal
    v-if="currentSubPage === 'edit-goal'"
    @back="currentSubPage = 'main'"
    @save="handleGoalSave"
  />
  <EditProfile
    v-else-if="currentSubPage === 'edit-profile'"
    :profile="profileSnapshot"
    @back="currentSubPage = 'main'"
    @save="handleProfileSave"
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
        <!-- TODO: replace activity summary values once diet stats API is wired -->
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
                  체중
                </span>
              </div>
              <p class="text-[24px] text-[var(--gray-900)]" style="font-weight: 700">
                {{ userInfo.currentWeight }}
                <span class="ml-1 text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
                  kg
                </span>
              </p>
              <p class="mt-1 text-[12px] text-[var(--gray-500)]" style="font-weight: 400">
                목표 {{ userInfo.targetWeight }}kg
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
