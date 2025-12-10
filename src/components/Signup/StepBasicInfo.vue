<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface UserInfo {
  height: string
  weight: string
  age: string
  gender: string
}

interface ValidationErrors {
  height: string
  weight: string
  age: string
}

const emit = defineEmits<{
  (e: 'next', info: UserInfo): void
}>()

const userInfo = reactive<UserInfo>({
  height: '',
  weight: '',
  age: '',
  gender: '',
})

const errors = reactive<ValidationErrors>({
  height: '',
  weight: '',
  age: '',
})

const hasAttempted = ref(false)

const validateHeight = (value: string): string => {
  if (!value) return '키를 입력해주세요'
  const height = parseFloat(value)
  if (Number.isNaN(height)) return '올바르지 않은 수치입니다'
  if (height < 100 || height > 250) return '올바르지 않은 수치입니다'
  return ''
}

const validateWeight = (value: string): string => {
  if (!value) return '몸무게를 입력해주세요'
  const weight = parseFloat(value)
  if (Number.isNaN(weight)) return '올바르지 않은 수치입니다'
  if (weight < 30 || weight > 200) return '올바르지 않은 수치입니다'
  return ''
}

const validateAge = (value: string): string => {
  if (!value) return '나이를 입력해주세요'
  const age = parseInt(value, 10)
  if (Number.isNaN(age)) return '올바르지 않은 수치입니다'
  if (age < 10 || age > 100) return '올바르지 않은 수치입니다'
  return ''
}

const handleInputChange = (field: keyof ValidationErrors, value: string) => {
  userInfo[field] = value

  if (hasAttempted.value) {
    errors[field] = ''
  }
}

const handleSubmit = () => {
  hasAttempted.value = true

  const heightError = validateHeight(userInfo.height)
  const weightError = validateWeight(userInfo.weight)
  const ageError = validateAge(userInfo.age)

  if (!heightError && !weightError && !ageError && userInfo.gender) {
    emit('next', { ...userInfo })
  } else {
    errors.height = heightError
    errors.weight = weightError
    errors.age = ageError
  }
}

const isValid = computed(
  () => userInfo.height && userInfo.weight && userInfo.age && userInfo.gender,
)
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1
        class="mb-3 text-[26px] leading-[1.35] tracking-[-0.03em] text-[var(--gray-900)]"
        style="font-weight: 700"
      >
        기본 정보를<br />
        알려주세요
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        정확한 식단 추천을 위해 필요해요
      </p>
    </div>

    <div class="space-y-8">
      <div>
        <label class="mb-3 block text-[13px] text-[var(--gray-600)]" style="font-weight: 600">
          성별
        </label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="userInfo.gender = 'male'"
            :class="[
              'rounded-xl border-2 py-4 text-[15px] transition-all active:scale-95',
              userInfo.gender === 'male'
                ? 'text-white'
                : 'border-[var(--gray-300)] text-[var(--gray-700)] hover:bg-[var(--gray-50)]',
            ]"
            :style="{
              fontWeight: 600,
              borderColor: userInfo.gender === 'male' ? '#00C73C' : undefined,
              backgroundColor: userInfo.gender === 'male' ? '#00C73C' : undefined,
            }"
          >
            남성
          </button>
          <button
            type="button"
            @click="userInfo.gender = 'female'"
            :class="[
              'rounded-xl border-2 py-4 text-[15px] transition-all active:scale-95',
              userInfo.gender === 'female'
                ? 'text-white'
                : 'border-[var(--gray-300)] text-[var(--gray-700)] hover:bg-[var(--gray-50)]',
            ]"
            :style="{
              fontWeight: 600,
              borderColor: userInfo.gender === 'female' ? '#00C73C' : undefined,
              backgroundColor: userInfo.gender === 'female' ? '#00C73C' : undefined,
            }"
          >
            여성
          </button>
        </div>
      </div>

      <div>
        <label class="mb-3 block text-[13px] text-[var(--gray-600)]" style="font-weight: 600">
          키
        </label>
        <div class="relative">
          <input
            type="number"
            :value="userInfo.height"
            placeholder="170"
            @input="handleInputChange('height', ($event.target as HTMLInputElement).value)"
            :class="[
              'w-full border-b-2 bg-transparent px-0 py-3 pr-12 text-[18px] transition-colors placeholder:text-[var(--gray-400)] focus:outline-none',
              errors.height && hasAttempted
                ? 'border-[var(--error-300)] focus:border-[var(--error-300)]'
                : 'border-[var(--gray-300)] focus:border-[#00C73C]',
            ]"
            style="font-weight: 400"
          />
          <span
            class="absolute bottom-3 right-0 text-[16px] text-[var(--gray-500)]"
            style="font-weight: 400"
          >
            cm
          </span>
        </div>
        <p
          v-if="errors.height && hasAttempted"
          class="mt-2 text-[13px] text-[var(--error-300)]"
          style="font-weight: 400"
        >
          {{ errors.height }}
        </p>
      </div>

      <div>
        <label class="mb-3 block text-[13px] text-[var(--gray-600)]" style="font-weight: 600">
          몸무게
        </label>
        <div class="relative">
          <input
            type="number"
            :value="userInfo.weight"
            placeholder="65"
            @input="handleInputChange('weight', ($event.target as HTMLInputElement).value)"
            :class="[
              'w-full border-b-2 bg-transparent px-0 py-3 pr-12 text-[18px] transition-colors placeholder:text-[var(--gray-400)] focus:outline-none',
              errors.weight && hasAttempted
                ? 'border-[var(--error-300)] focus:border-[var(--error-300)]'
                : 'border-[var(--gray-300)] focus:border-[#00C73C]',
            ]"
            style="font-weight: 400"
          />
          <span
            class="absolute bottom-3 right-0 text-[16px] text-[var(--gray-500)]"
            style="font-weight: 400"
          >
            kg
          </span>
        </div>
        <p
          v-if="errors.weight && hasAttempted"
          class="mt-2 text-[13px] text-[var(--error-300)]"
          style="font-weight: 400"
        >
          {{ errors.weight }}
        </p>
      </div>

      <div>
        <label class="mb-3 block text-[13px] text-[var(--gray-600)]" style="font-weight: 600">
          나이
        </label>
        <div class="relative">
          <input
            type="number"
            :value="userInfo.age"
            placeholder="25"
            @input="handleInputChange('age', ($event.target as HTMLInputElement).value)"
            :class="[
              'w-full border-b-2 bg-transparent px-0 py-3 pr-12 text-[18px] transition-colors placeholder:text-[var(--gray-400)] focus:outline-none',
              errors.age && hasAttempted
                ? 'border-[var(--error-300)] focus:border-[var(--error-300)]'
                : 'border-[var(--gray-300)] focus:border-[#00C73C]',
            ]"
            style="font-weight: 400"
          />
          <span
            class="absolute bottom-3 right-0 text-[16px] text-[var(--gray-500)]"
            style="font-weight: 400"
          >
            세
          </span>
        </div>
        <p
          v-if="errors.age && hasAttempted"
          class="mt-2 text-[13px] text-[var(--error-300)]"
          style="font-weight: 400"
        >
          {{ errors.age }}
        </p>
      </div>
    </div>

    <button
      type="button"
      :disabled="!isValid"
      @click="handleSubmit"
      :class="[
        'h-[56px] w-full rounded-xl text-[16px] transition-all',
        isValid
          ? 'text-white active:scale-[0.98]'
          : 'cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]',
      ]"
      :style="{
        fontWeight: 600,
        backgroundColor: isValid ? '#00C73C' : undefined,
      }"
    >
      다음
    </button>
  </div>
</template>
