<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login, type OAuthProvider } from '@/services/authService'
import { setRegisterToken } from '@/services/registerTokenStore'
import { useModalStore } from '@/stores/modalStore'

const route = useRoute()
const router = useRouter()
const modalStore = useModalStore()

onMounted(async () => {
  const provider = route.params.provider as string
  const code = route.query.code as string

  if (!provider || !code) {
    await modalStore.openAppModal({
      title: '잘못된 접근',
      content: '잘못된 접근입니다.',
      type: 'error',
    })
    router.replace('/login')
    return
  }

  // Naver State 검증 (CSRF 방지)
  if (provider === 'naver') {
    const urlState = route.query.state as string
    const savedState = sessionStorage.getItem('naver_oauth_state')

    if (!urlState || urlState !== savedState) {
      console.error('[OAuthCallback] State mismatch', { urlState, savedState })
      await modalStore.openAppModal({
        title: '보안 경고',
        content: '잘못된 접근입니다. (State 불일치)',
        type: 'error',
      })
      sessionStorage.removeItem('naver_oauth_state')
      router.replace('/login')
      return
    }

    // 검증 성공 시 사용한 State 파기
    sessionStorage.removeItem('naver_oauth_state')
  }

  try {
    const capsProvider = provider.toUpperCase() as OAuthProvider
    // 주의: redirectUri는 카카오 로그인 요청 시 보낸 값과 정확히 일치해야 합니다.
    const redirectUri = `${window.location.origin}/oauth/callback/${provider}`

    console.log('[OAuthCallback] Requesting login...', { provider: capsProvider, code })

    const result = await login({
      oauthProvider: capsProvider,
      authorizationCode: code,
      redirectUri,
    })

    if (result.status === 'SUCCESS') {
      console.log('[OAuthCallback] Login success')
      router.replace('/home')
    } else if (result.status === 'NEED_REGISTER') {
      console.log('[OAuthCallback] Need registration', result.data)
      setRegisterToken(result.data.registerToken)
      router.replace('/regist')
    }
  } catch (error) {
    console.error('[OAuthCallback] Login failed', error)
    await modalStore.openAppModal({
      title: '로그인 실패',
      content: '로그인 처리에 실패했습니다.\n다시 시도해주세요.',
      type: 'error',
    })
    router.replace('/login')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white">
    <div class="text-center">
      <div
        class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#00C73C]"
      ></div>
      <p class="text-gray-600">로그인 처리 중입니다...</p>
    </div>
  </div>
</template>
