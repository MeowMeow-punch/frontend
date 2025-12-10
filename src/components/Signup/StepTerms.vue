<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', terms: { service: boolean; privacy: boolean; marketing: boolean }): void
}>()

const termsAccepted = ref({
  service: false,
  privacy: false,
  marketing: false,
})

const allChecked = computed(
  () => termsAccepted.value.service && termsAccepted.value.privacy && termsAccepted.value.marketing,
)

const canProceed = computed(() => termsAccepted.value.service && termsAccepted.value.privacy)

const handleSubmit = () => {
  if (canProceed.value) {
    emit('next', { ...termsAccepted.value })
  }
}

const toggleAll = () => {
  const newValue = !allChecked.value
  termsAccepted.value = {
    service: newValue,
    privacy: newValue,
    marketing: newValue,
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
        서비스 이용약관에<br />
        동의해주세요
      </h1>
      <p class="text-[15px] leading-[1.5] text-[var(--gray-600)]" style="font-weight: 400">
        안전한 서비스 이용을 위해 필요해요
      </p>
    </div>

    <div class="space-y-5">
      <button
        type="button"
        @click="toggleAll"
        class="flex w-full items-center gap-3 border-b border-[var(--gray-200)] py-5 transition-opacity active:opacity-70"
      >
        <div
          class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all"
          :style="{ backgroundColor: allChecked ? 'var(--gray-900)' : 'var(--gray-200)' }"
        >
          <span v-if="allChecked" class="text-sm leading-none text-white">✓</span>
        </div>
        <span class="text-[16px] text-[var(--gray-900)]" style="font-weight: 600">전체 동의</span>
      </button>

      <div class="space-y-3 pt-2">
        <button
          type="button"
          @click="termsAccepted.service = !termsAccepted.service"
          class="flex w-full items-center gap-3 py-1 transition-opacity active:opacity-70"
        >
          <div
            class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all"
            :class="{ 'border-2 border-[var(--gray-300)]': !termsAccepted.service }"
            :style="{ backgroundColor: termsAccepted.service ? '#00C73C' : 'transparent' }"
          >
            <span v-if="termsAccepted.service" class="text-xs leading-none text-white">✓</span>
          </div>
          <span class="text-[15px] text-[var(--gray-700)]" style="font-weight: 400">
            [필수] 서비스 이용약관
          </span>
        </button>

        <button
          type="button"
          @click="termsAccepted.privacy = !termsAccepted.privacy"
          class="flex w-full items-center gap-3 py-1 transition-opacity active:opacity-70"
        >
          <div
            class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all"
            :class="{ 'border-2 border-[var(--gray-300)]': !termsAccepted.privacy }"
            :style="{ backgroundColor: termsAccepted.privacy ? '#00C73C' : 'transparent' }"
          >
            <span v-if="termsAccepted.privacy" class="text-xs leading-none text-white">✓</span>
          </div>
          <span class="text-[15px] text-[var(--gray-700)]" style="font-weight: 400">
            [필수] 개인정보 처리방침
          </span>
        </button>

        <button
          type="button"
          @click="termsAccepted.marketing = !termsAccepted.marketing"
          class="flex w-full items-center gap-3 py-1 transition-opacity active:opacity-70"
        >
          <div
            class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all"
            :class="{ 'border-2 border-[var(--gray-300)]': !termsAccepted.marketing }"
            :style="{ backgroundColor: termsAccepted.marketing ? '#00C73C' : 'transparent' }"
          >
            <span v-if="termsAccepted.marketing" class="text-xs leading-none text-white">✓</span>
          </div>
          <span class="text-[15px] text-[var(--gray-700)]" style="font-weight: 400">
            [선택] 마케팅 정보 수신
          </span>
        </button>
      </div>
    </div>

    <button
      type="button"
      :disabled="!canProceed"
      @click="handleSubmit"
      :class="[
        'h-[56px] w-full rounded-xl text-[16px] transition-all',
        canProceed
          ? 'text-white active:scale-[0.98]'
          : 'cursor-not-allowed bg-[var(--gray-100)] text-[var(--gray-400)]',
      ]"
      :style="{
        fontWeight: 600,
        backgroundColor: canProceed ? '#00C73C' : undefined,
      }"
    >
      다음
    </button>
  </div>
</template>
