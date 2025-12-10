<script setup lang="ts">
import { useRouter } from 'vue-router'
import SignupFlow from '@/components/Signup/SignupFlow.vue'

const router = useRouter()

const handleComplete = () => {
  router.push('/')
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="signup-shell bg-white">
    <SignupFlow @complete="handleComplete" @back="handleBack" />
  </div>
</template>

<style scoped>
.signup-shell {
  min-height: 100vh;
  background-color: #ffffff;
}
</style>
