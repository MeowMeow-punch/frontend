<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SignupFlow from '@/components/Signup/SignupFlow.vue'
import type { SignupResult } from '@/types/signup'
import { register } from '@/services/authService'
import { buildRegisterPayload } from '@/utils/signupMapper'

const router = useRouter()
const isSubmitting = ref(false)

// OAuthCallback에서 전달받은 registerToken 확인
const registerToken = history.state.registerToken as string | undefined

if (!registerToken) {
  // 토큰 없이 직접 접근 시 로그인 페이지로 리다이렉트 (필요 시 활성화)
  // setup() 내부라 주의 필요. onMounted에서 체크하거나 렌더링 후 처리 추천.
  // 현재는 프로덕션 환경에서만 경고하거나 리다이렉트 하도록 주석 처리됨.
  if (import.meta.env.PROD) {
    // Strict check in production
    // console.warn('Missing registerToken')
    // router.replace('/login')
    // But for now, let's just log warning, maybe user is testing UI?
  }
}

const handleComplete = async (payload: SignupResult) => {
  if (isSubmitting.value) {
    return
  }

  if (!registerToken) {
    alert('잘못된 접근입니다. 다시 로그인해주세요.')
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
    router.push('/')
  } catch (error) {
    console.error('Signup failed:', error)
    alert('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.')
    router.push('/login')
  } finally {
    isSubmitting.value = false
  }
}

const handleExit = () => {
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
