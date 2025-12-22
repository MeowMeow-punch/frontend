<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ArrowLeft, Check, X } from 'lucide-vue-next'
import { updateProfile } from '@/services/authService'
import StepAffiliationSearch from '@/components/Signup/StepAffiliationSearch.vue'

type ProfileForm = {
  nickname: string
  email: string
  gender: string
  height: string
  weight: string
  age: string
  group: string
  allergies: string[]
  marketingConsent: boolean
}

const emit = defineEmits<{
  (e: 'back'): void
  (
    e: 'save',
    profile: {
      nickname: string
      gender: string
      height: number
      weight: number
      age: number
      group: string
      allergies: string[]
      marketingConsent: boolean
    },
  ): void
}>()

const props = defineProps<{
  profile: ProfileForm
}>()

const formData = reactive({
  nickname: '',
  email: '',
  gender: '',
  height: '',
  weight: '',
  age: '',
  group: '',
  groupId: null as number | null,
  allergies: [] as string[],
  marketingConsent: false,
})

const socialConnections = reactive({
  google: true,
  kakao: false,
  naver: false,
})

const isSaving = ref(false)
const isGroupSearchOpen = ref(false)

const allergyOptions = ['땅콩', '새우', '우유', '계란', '밀가루', '대두', '생선', '견과류']

const syncFormData = (profile: ProfileForm) => {
  formData.nickname = profile.nickname
  formData.email = profile.email
  formData.gender = profile.gender
  formData.height = profile.height
  formData.weight = profile.weight
  formData.age = profile.age
  formData.group = profile.group
  formData.marketingConsent = profile.marketingConsent
  formData.allergies.splice(0, formData.allergies.length, ...profile.allergies)
}

watch(
  () => props.profile,
  (value) => syncFormData(value),
  { immediate: true },
)

const toggleAllergy = (allergy: string) => {
  const index = formData.allergies.indexOf(allergy)
  if (index >= 0) {
    formData.allergies.splice(index, 1)
  } else {
    formData.allergies.push(allergy)
  }
}

const handleToggleSocial = (platform: 'google' | 'kakao' | 'naver') => {
  const connectedCount = Object.values(socialConnections).filter(Boolean).length

  if (socialConnections[platform] && connectedCount === 1) {
    alert('최소 하나의 소셜 계정은 연결되어 있어야 합니다.')
    return
  }

  socialConnections[platform] = !socialConnections[platform]
}

const handleSelectGroup = (group: { id: number; name: string }) => {
  formData.groupId = group.id
  formData.group = group.name
  isGroupSearchOpen.value = false
}

const handleClearGroup = () => {
  formData.groupId = null
  formData.group = ''
  isGroupSearchOpen.value = false
}

const mapGenderToApi = (gender: string) => (gender === '남성' ? 'MALE' : 'FEMALE')

const getNumberError = (value: string, label: string) => {
  if (!value) {
    return ''
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return `${label}는 0보다 커야 합니다.`
  }

  return ''
}

const heightError = computed(() => getNumberError(formData.height, '키'))
const weightError = computed(() => getNumberError(formData.weight, '체중'))
const ageError = computed(() => getNumberError(formData.age, '나이'))

const handleSave = async () => {
  if (isSaving.value) {
    return
  }

  const trimmedNickname = formData.nickname.trim()
  if (!trimmedNickname || trimmedNickname.length < 2 || trimmedNickname.length > 10) {
    alert('닉네임은 2~10자로 입력해주세요.')
    return
  }

  if (!formData.gender) {
    alert('성별을 선택해주세요.')
    return
  }

  const heightValue = Number(formData.height)
  if (!Number.isFinite(heightValue) || heightValue <= 0) {
    alert('키를 올바르게 입력해주세요.')
    return
  }

  const weightValue = Number(formData.weight)
  if (!Number.isFinite(weightValue) || weightValue <= 0) {
    alert('몸무게를 올바르게 입력해주세요.')
    return
  }

  const ageValue = Number(formData.age)
  if (!Number.isFinite(ageValue) || ageValue <= 0) {
    alert('나이를 올바르게 입력해주세요.')
    return
  }

  isSaving.value = true
  try {
    const profilePayload = {
      nickname: trimmedNickname !== props.profile.nickname ? trimmedNickname : undefined,
      gender: mapGenderToApi(formData.gender),
      height: heightValue,
      weight: weightValue,
      age: ageValue,
      allergies: [...formData.allergies],
      isMarketing: formData.marketingConsent,
      groupId: formData.groupId ? String(formData.groupId) : undefined,
    } as const

    const response = await updateProfile(profilePayload)
    if (import.meta.env.DEV) {
      console.info('[MyPage] profile update response', response)
    }
    if (response.code !== 200) {
      alert(response.message || '개인정보 수정에 실패했습니다.')
      return
    }

    emit('save', {
      nickname: trimmedNickname,
      gender: formData.gender,
      height: heightValue,
      weight: weightValue,
      age: ageValue,
      group: formData.group,
      allergies: [...formData.allergies],
      marketingConsent: formData.marketingConsent,
    })
  } catch (error) {
    console.error('Profile update failed:', error)
    alert('개인정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto max-w-[960px] px-4 py-8 pb-16 md:px-8 md:py-12 md:pb-24">
      <button
        type="button"
        class="mb-6 flex items-center gap-2 text-[var(--gray-600)] transition-colors hover:text-[var(--gray-900)]"
        @click="emit('back')"
      >
        <ArrowLeft class="h-5 w-5" />
        <span class="text-[14px]" style="font-weight: 500">뒤로가기</span>
      </button>

      <div class="mb-8">
        <h1
          class="mb-2 text-[20px] leading-[1.4] tracking-[-0.02em] text-[var(--gray-900)] md:text-[22px]"
          style="font-weight: 700"
        >
          개인정보 설정
        </h1>
        <p class="text-[14px] text-[var(--gray-600)]" style="font-weight: 400">
          개인 정보를 확인하고 수정할 수 있습니다
        </p>
      </div>

      <div class="mb-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <h2 class="mb-4 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">계정 정보</h2>

        <div class="space-y-5">
          <div class="space-y-2">
            <label
              for="nickname"
              class="text-[14px] text-[var(--gray-700)]"
              style="font-weight: 600"
              >닉네임</label
            >
            <input
              id="nickname"
              v-model="formData.nickname"
              maxlength="10"
              class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
            />
            <p class="text-[13px] text-[var(--gray-600)]" style="font-weight: 400">
              {{ formData.nickname.length }}/10자
            </p>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-[14px] text-[var(--gray-700)]" style="font-weight: 600"
              >이메일</label
            >
            <input
              id="email"
              type="email"
              v-model="formData.email"
              disabled
              class="h-11 w-full rounded-lg border border-[var(--gray-200)] bg-[var(--gray-50)] px-3 text-[14px] text-[var(--gray-600)]"
            />
            <p class="text-[13px] text-[var(--gray-500)]" style="font-weight: 400">
              이메일은 변경할 수 없습니다
            </p>
          </div>

          <div class="space-y-2">
            <label for="group" class="text-[14px] text-[var(--gray-700)]" style="font-weight: 600"
              >소속</label
            >
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <input
                  id="group"
                  v-model="formData.group"
                  placeholder="예: SSAFY 12기, OO 대학교"
                  class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 pr-9 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
                  readonly
                />
                <button
                  v-if="formData.group"
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--gray-500)] transition hover:bg-[var(--gray-100)] hover:text-[var(--gray-700)]"
                  @click="handleClearGroup"
                >
                  <X class="h-4 w-4" />
                  <span class="sr-only">소속 제거</span>
                </button>
              </div>
              <button
                type="button"
                class="h-11 rounded-lg border border-[var(--gray-300)] px-3 text-[13px] text-[var(--gray-700)] transition hover:bg-[var(--gray-50)]"
                style="font-weight: 600"
                @click="isGroupSearchOpen = !isGroupSearchOpen"
              >
                {{ isGroupSearchOpen ? '닫기' : '검색' }}
              </button>
            </div>
          </div>
          <div
            v-if="isGroupSearchOpen"
            class="mt-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6"
          >
            <StepAffiliationSearch variant="inline" @next="handleSelectGroup" />
          </div>
        </div>
      </div>

      <div class="mb-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <h2 class="mb-4 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">기본 정보</h2>

        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-[14px] text-[var(--gray-700)]" style="font-weight: 600">성별</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="formData.gender = '남성'"
                :class="[
                  'rounded-lg border-2 p-3 transition-all',
                  formData.gender === '남성'
                    ? 'border-[#00C73C] bg-[#E6F9ED]'
                    : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]',
                ]"
              >
                <span
                  class="text-[14px]"
                  :class="formData.gender === '남성' ? 'text-[#00C73C]' : 'text-[var(--gray-700)]'"
                  style="font-weight: 600"
                >
                  남성
                </span>
              </button>
              <button
                type="button"
                @click="formData.gender = '여성'"
                :class="[
                  'rounded-lg border-2 p-3 transition-all',
                  formData.gender === '여성'
                    ? 'border-[#00C73C] bg-[#E6F9ED]'
                    : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]',
                ]"
              >
                <span
                  class="text-[14px]"
                  :class="formData.gender === '여성' ? 'text-[#00C73C]' : 'text-[var(--gray-700)]'"
                  style="font-weight: 600"
                >
                  여성
                </span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-2">
              <label
                for="height"
                class="text-[14px] text-[var(--gray-700)]"
                style="font-weight: 600"
                >키</label
              >
              <div class="relative">
                <input
                  id="height"
                  v-model="formData.height"
                  type="number"
                  min="1"
                  class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 pr-10 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--gray-500)]"
                  style="font-weight: 500"
                >
                  cm
                </span>
              </div>
              <p
                v-if="heightError"
                class="text-[12px] text-[var(--error-300)]"
                style="font-weight: 400"
              >
                {{ heightError }}
              </p>
            </div>

            <div class="space-y-2">
              <label
                for="weight"
                class="text-[14px] text-[var(--gray-700)]"
                style="font-weight: 600"
                >체중</label
              >
              <div class="relative">
                <input
                  id="weight"
                  v-model="formData.weight"
                  type="number"
                  min="1"
                  class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 pr-10 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--gray-500)]"
                  style="font-weight: 500"
                >
                  kg
                </span>
              </div>
              <p
                v-if="weightError"
                class="text-[12px] text-[var(--error-300)]"
                style="font-weight: 400"
              >
                {{ weightError }}
              </p>
            </div>

            <div class="space-y-2">
              <label for="age" class="text-[14px] text-[var(--gray-700)]" style="font-weight: 600"
                >나이</label
              >
              <div class="relative">
                <input
                  id="age"
                  v-model="formData.age"
                  type="number"
                  min="1"
                  class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 pr-10 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--gray-500)]"
                  style="font-weight: 500"
                >
                  세
                </span>
              </div>
              <p
                v-if="ageError"
                class="text-[12px] text-[var(--error-300)]"
                style="font-weight: 400"
              >
                {{ ageError }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <h2 class="mb-2 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">
          소셜 로그인 연동
        </h2>
        <p class="mb-4 text-[13px] text-[var(--gray-600)]" style="font-weight: 400">
          최소 하나의 계정은 연결되어 있어야 합니다
        </p>

        <div class="space-y-3">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all"
            :class="
              socialConnections.google
                ? 'border-[#00C73C] bg-[#E6F9ED]'
                : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]'
            "
            @click="handleToggleSocial('google')"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <span class="text-[20px]">G</span>
              </div>
              <div class="text-left">
                <p class="text-[14px] text-[var(--gray-900)]" style="font-weight: 600">Google</p>
                <p class="text-[12px] text-[var(--gray-600)]" style="font-weight: 400">
                  {{ socialConnections.google ? '연동됨' : '연동 안됨' }}
                </p>
              </div>
            </div>
            <div
              v-if="socialConnections.google"
              class="flex h-6 w-6 items-center justify-center rounded-full bg-[#00C73C]"
            >
              <Check class="h-4 w-4 text-white" />
            </div>
          </button>

          <button
            type="button"
            class="flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all"
            :class="
              socialConnections.kakao
                ? 'border-[#00C73C] bg-[#E6F9ED]'
                : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]'
            "
            @click="handleToggleSocial('kakao')"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEE500]">
                <span class="text-[16px]">💬</span>
              </div>
              <div class="text-left">
                <p class="text-[14px] text-[var(--gray-900)]" style="font-weight: 600">Kakao</p>
                <p class="text-[12px] text-[var(--gray-600)]" style="font-weight: 400">
                  {{ socialConnections.kakao ? '연동됨' : '연동 안됨' }}
                </p>
              </div>
            </div>
            <div
              v-if="socialConnections.kakao"
              class="flex h-6 w-6 items-center justify-center rounded-full bg-[#00C73C]"
            >
              <Check class="h-4 w-4 text-white" />
            </div>
          </button>

          <button
            type="button"
            class="flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all"
            :class="
              socialConnections.naver
                ? 'border-[#00C73C] bg-[#E6F9ED]'
                : 'border-[var(--gray-200)] hover:border-[var(--gray-300)]'
            "
            @click="handleToggleSocial('naver')"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#03C75A]">
                <span class="text-[16px] text-white" style="font-weight: 700">N</span>
              </div>
              <div class="text-left">
                <p class="text-[14px] text-[var(--gray-900)]" style="font-weight: 600">Naver</p>
                <p class="text-[12px] text-[var(--gray-600)]" style="font-weight: 400">
                  {{ socialConnections.naver ? '연동됨' : '연동 안됨' }}
                </p>
              </div>
            </div>
            <div
              v-if="socialConnections.naver"
              class="flex h-6 w-6 items-center justify-center rounded-full bg-[#00C73C]"
            >
              <Check class="h-4 w-4 text-white" />
            </div>
          </button>
        </div>
      </div>

      <div class="mb-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6">
        <h2 class="mb-4 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">건강 정보</h2>

        <div class="space-y-3">
          <label class="text-[14px] text-[var(--gray-700)]" style="font-weight: 600"
            >알레르기 정보</label
          >
          <p class="text-[13px] text-[var(--gray-600)]" style="font-weight: 400">
            해당하는 항목을 모두 선택해주세요
          </p>

          <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
            <button
              v-for="allergy in allergyOptions"
              :key="allergy"
              type="button"
              @click="toggleAllergy(allergy)"
              :class="[
                'rounded-xl border-2 py-3 text-[14px] transition-all',
                formData.allergies.includes(allergy)
                  ? 'text-white'
                  : 'border-[var(--gray-300)] text-[var(--gray-700)] hover:bg-[var(--gray-50)]',
              ]"
              :style="{
                fontWeight: 600,
                borderColor: formData.allergies.includes(allergy) ? '#00C73C' : undefined,
                backgroundColor: formData.allergies.includes(allergy) ? '#00C73C' : undefined,
              }"
            >
              {{ allergy }}
            </button>
          </div>

          <p
            v-if="formData.allergies.length"
            class="text-[13px] text-[#00C73C]"
            style="font-weight: 500"
          >
            {{ formData.allergies.length }}개 선택됨
          </p>
        </div>
      </div>

      <div class="mb-6 rounded-2xl bg-[var(--gray-50)] p-6">
        <h2 class="mb-4 text-[17px] text-[var(--gray-900)]" style="font-weight: 700">
          마케팅 정보 수신
        </h2>

        <div
          class="flex items-center justify-between rounded-xl border border-[var(--gray-200)] bg-white p-4"
        >
          <div class="flex-1">
            <p class="mb-1 text-[14px] text-[var(--gray-900)]" style="font-weight: 600">
              마케팅 정보 수신 동의
            </p>
            <p class="text-[13px] text-[var(--gray-600)]" style="font-weight: 400">
              이벤트, 프로모션 등 마케팅 정보를 받습니다
            </p>
          </div>
          <input
            type="checkbox"
            v-model="formData.marketingConsent"
            class="h-5 w-5 accent-[#00C73C]"
          />
        </div>
      </div>

      <button
        type="button"
        class="h-12 w-full rounded-xl text-[15px] text-white"
        :disabled="isSaving"
        style="background-color: #00c73c; font-weight: 600"
        @click="handleSave"
      >
        {{ isSaving ? '저장 중...' : '저장' }}
      </button>
    </div>
  </div>
</template>
