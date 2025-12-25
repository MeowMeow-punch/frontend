<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SignupFlow from '@/components/Signup/SignupFlow.vue'
import type { SignupResult } from '@/types/signup'
import { register } from '@/services/authService'
import { buildRegisterPayload } from '@/utils/signupMapper'
import { clearRegisterToken, getRegisterToken } from '@/services/registerTokenStore'
import { useModalStore } from '@/stores/modalStore'

const router = useRouter()
const modalStore = useModalStore()
const isSubmitting = ref(false)

// OAuthCallback에서 전달받은 registerToken 확인
const registerTokenFromState =
  (
    history.state as
      | { registerToken?: string; state?: { registerToken?: string } }
      | null
      | undefined
  )?.registerToken ??
  (history.state as { state?: { registerToken?: string } } | null | undefined)?.state?.registerToken
const registerToken = getRegisterToken() || registerTokenFromState

if (!registerToken) {
  // 토큰 없이 직접 접근 시 로그인 페이지로 리다이렉트
  console.warn('Missing registerToken')
  router.replace('/login')
}

const handleComplete = async (payload: SignupResult) => {
  if (isSubmitting.value) {
    return
  }

  if (!registerToken) {
    await modalStore.openAppModal({
      title: '잘못된 접근',
      content: '회원가입 세션이 만료되었습니다.\n다시 로그인해주세요.',
      type: 'error',
    })
    clearRegisterToken()
    router.push('/login')
    return
  }

  isSubmitting.value = true

  try {
    const request = buildRegisterPayload(payload, registerToken)
    console.log('[Signup] register request', request)
    const response = await register(request)
    console.log('[Signup] register response', response)

    // 회원가입 후 로그인 성공 처리 -> 메인으로 이동
    clearRegisterToken()

    // Note: Success modal is typically not needed if auto-redirecting to onboarding/home,
    // but we can add one if desired. Previous logic just redirected.
    // Let's stick to redirect for success as per user instructions.

    router.push('/home')
  } catch (error) {
    console.error('Signup failed:', error)
    await modalStore.openAppModal({
      title: '가입 실패',
      content: '회원가입 처리에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      type: 'error',
    })
    clearRegisterToken()
    router.push('/login')
  } finally {
    isSubmitting.value = false
  }
}

const handleExit = () => {
  clearRegisterToken()
  router.push('/login')
}
</script>

<template>
  <div class="signup-shell bg-white">
    <SignupFlow @complete="handleComplete" @exit="handleExit" />
  </div>
</template>

<style scoped>
.signup-shell {
  min-height: 100vh;
  background-color: #ffffff;
}
</style>
