<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SignupFlow from '@/components/Signup/SignupFlow.vue'
import type { SignupResult } from '@/types/signup'
import { register } from '@/services/authService'
import { buildRegisterPayload } from '@/utils/signupMapper'

const router = useRouter()
const isSubmitting = ref(false)

const handleComplete = async (payload: SignupResult) => {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    const request = buildRegisterPayload(payload)
    console.log('[Signup] register request', request)
    const response = await register(request)
    console.log('[Signup] register response', response)
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
