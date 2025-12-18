<script setup lang="ts">
import { reactive } from 'vue'
import { ArrowLeft, Check } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'save'): void
}>()

const formData = reactive({
  nickname: '건강한하루',
  email: 'user@pickit.com',
  gender: '남성',
  height: '175',
  weight: '73',
  age: '28',
  group: 'SSAFY 12기',
  allergies: ['새우', '땅콩'],
  marketingConsent: true,
})

const socialConnections = reactive({
  google: true,
  kakao: false,
  naver: false,
})

const allergyOptions = ['땅콩', '새우', '우유', '계란', '밀가루', '대두', '생선', '견과류']

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

const handleSave = () => {
  emit('save')
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
            <input
              id="group"
              v-model="formData.group"
              placeholder="예: SSAFY 12기, OO 대학교"
              class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
            />
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
                  class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 pr-10 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--gray-500)]"
                  style="font-weight: 500"
                >
                  cm
                </span>
              </div>
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
                  class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 pr-10 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--gray-500)]"
                  style="font-weight: 500"
                >
                  kg
                </span>
              </div>
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
                  class="h-11 w-full rounded-lg border border-[var(--gray-300)] px-3 pr-10 text-[14px] text-[var(--gray-900)] outline-none transition focus:border-[#00C73C]"
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--gray-500)]"
                  style="font-weight: 500"
                >
                  세
                </span>
              </div>
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
        style="background-color: #00c73c; font-weight: 600"
        @click="handleSave"
      >
        저장
      </button>
    </div>
  </div>
</template>
