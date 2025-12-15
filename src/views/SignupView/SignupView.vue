<script setup lang="ts">
import { useRouter } from 'vue-router'
import SignupFlow from '@/components/Signup/SignupFlow.vue'

const router = useRouter()

const handleComplete = (payload: unknown) => {
  console.log('[Signup] complete payload', payload)
  router.push('/')
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
