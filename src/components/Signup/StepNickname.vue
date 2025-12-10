<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', nickname: string): void
}>()

const nickname = ref('')
const error = ref('')
const hasAttempted = ref(false)

const validateNickname = (value: string): string => {
  if (!value) return '닉네임을 입력해주세요'

  const validPattern = /^[가-힣a-zA-Z0-9]+$/
  if (!validPattern.test(value)) {
    return '한글, 영문, 숫자만 사용 가능합니다'
  }

  if (value.length < 2) {
    return '닉네임은 최소 2자 이상이어야 합니다'
  }

  if (value.length > 10) {
    return '닉네임은 최대 10자까지 가능합니다'
  }

  return ''
}

const isValid = computed(() => {
  if (!nickname.value) return false
  return !validateNickname(nickname.value)
})

const handleSubmit = () => {
  hasAttempted.value = true
  const errorMsg = validateNickname(nickname.value)

  if (!errorMsg) {
    emit('next', nickname.value)
  } else {
    error.value = errorMsg
  }
}

const handleInput = (value: string) => {
  nickname.value = value
  if (hasAttempted.value) {
    error.value = ''
    hasAttempted.value = false
  }
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1
        class="mb-3 text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        반가워요!<br />
        어떻게 불러드리면 될까요?
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        2~10자의 닉네임을 입력해주세요
      </p>
    </div>

    <div>
      <input
        type="text"
        :value="nickname"
        maxlength="10"
        placeholder="닉네임"
        autofocus
        @input="handleInput(($event.target as HTMLInputElement).value)"
        @keyup.enter="isValid && handleSubmit()"
        :class="[
          'w-full border-b-2 bg-transparent px-0 py-4 text-[18px] transition-colors placeholder:text-[var(--gray-400)] focus:outline-none',
          error && hasAttempted
            ? 'border-[var(--error-300)] focus:border-[var(--error-300)]'
            : 'border-[var(--gray-300)] focus:border-[#00C73C]',
        ]"
        style="font-weight: 400"
      />
      <div class="mt-2 flex items-center justify-between">
        <p
          v-if="error && hasAttempted"
          class="text-[13px] text-[var(--error-300)]"
          style="font-weight: 400"
        >
          {{ error }}
        </p>
        <div v-else />
        <p v-if="nickname" class="text-[13px] text-[var(--gray-500)]" style="font-weight: 400">
          {{ nickname.length }}/10
        </p>
      </div>
    </div>

    <button
      type="button"
      :disabled="!nickname"
      @click="handleSubmit"
      :class="[
        'h-[56px] w-full rounded-xl text-[16px] transition-all',
        nickname
          ? 'text-white active:scale-[0.98]'
          : 'cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]',
      ]"
      :style="{
        fontWeight: 600,
        backgroundColor: nickname ? '#00C73C' : undefined,
      }"
    >
      다음
    </button>
  </div>
</template>
