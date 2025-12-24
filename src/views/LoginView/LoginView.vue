<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { OAuthProvider } from '@/services/authService'

const router = useRouter()
const isSubmitting = ref(false)

const handleLogin = async (provider: OAuthProvider) => {
  if (isSubmitting.value) {
    return
  }

  if (provider === 'KAKAO') {
    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID
    if (!clientId) {
      alert('카카오 클라이언트 ID가 설정되지 않았습니다.')
      console.error('VITE_KAKAO_CLIENT_ID is missing in .env')
      return
    }

    // 개발 환경과 배포 환경의 Redirect URI 일치 필요
    const redirectUri = `${window.location.origin}/oauth/callback/kakao`
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`

    console.log('[Login] Redirecting to Kakao:', url)
    window.location.href = url
    return
  }

  if (provider === 'GOOGLE') {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      alert('구글 클라이언트 ID가 설정되지 않았습니다.')
      console.error('VITE_GOOGLE_CLIENT_ID is missing in .env')
      return
    }

    const redirectUri = `${window.location.origin}/oauth/callback/google`

    // CSRF 방지를 위한 State 생성
    const state = Array.from(window.crypto.getRandomValues(new Uint32Array(1)))
      .map((n) => n.toString(36))
      .join('')

    sessionStorage.setItem('google_oauth_state', state)

    // 구글 로그인 URL 구성
    const scope = 'email profile openid'
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`

    console.log('[Login] Redirecting to Google:', url)
    window.location.href = url
    return
  }

  if (provider === 'NAVER') {
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID
    if (!clientId) {
      alert('네이버 클라이언트 ID가 설정되지 않았습니다.')
      console.error('VITE_NAVER_CLIENT_ID is missing in .env')
      return
    }

    const redirectUri = `${window.location.origin}/oauth/callback/naver`

    // CSRF 방지를 위한 State 생성 (Client-Side)
    const state = Array.from(window.crypto.getRandomValues(new Uint32Array(1)))
      .map((n) => n.toString(36))
      .join('')

    sessionStorage.setItem('naver_oauth_state', state)

    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`

    console.log('[Login] Redirecting to Naver:', url)
    window.location.href = url
    return
  }

  alert('준비 중인 기능입니다.')
}

const handleSignup = () => {
  router.push('/regist')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white px-4">
    <div class="w-full max-w-md">
      <div class="mb-12 text-center">
        <div class="mb-6 flex justify-center">
          <div class="rounded-3xl bg-[var(--main-300)] p-5 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-14 w-14 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v.01M12 12v.01M12 18v.01M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
        </div>
        <h1
          class="text-foreground mb-3 text-5xl"
          style="font-family: JalnanGothic, Pretendard, sans-serif"
        >
          <span>픽</span>
          <span style="color: #00c73c">잇</span>
        </h1>
        <p class="text-lg text-[var(--gray-600)]">고민 없는 식단, AI가 책임진다.</p>
      </div>

      <div class="space-y-3">
        <button
          type="button"
          @click="handleLogin('KAKAO')"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
          class="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-[#000000] shadow-none transition hover:bg-[#FEE500]/90"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.477 0 0 3.58 0 8c0 2.86 1.889 5.37 4.723 6.78l-.917 3.36c-.066.243.196.447.414.323l3.867-2.633C8.69 15.94 9.338 16 10 16c5.523 0 10-3.58 10-8s-4.477-8-10-8z"
              fill="#000000"
            />
          </svg>
          <span>카카오 로그인</span>
        </button>

        <button
          type="button"
          @click="handleLogin('GOOGLE')"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
          class="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-[var(--gray-300)] bg-white text-slate-900 shadow-none transition hover:bg-slate-50"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
              fill="#4285F4"
            />
            <path
              d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
              fill="#34A853"
            />
            <path
              d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
              fill="#FBBC05"
            />
            <path
              d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z"
              fill="#EA4335"
            />
          </svg>
          <span>구글 로그인</span>
        </button>

        <button
          type="button"
          @click="handleLogin('NAVER')"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
          class="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#03C75A] text-white shadow-none transition hover:bg-[#03C75A]/90"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.6 10.8L6.4 0H0v20h6.4V9.2L13.6 20H20V0h-6.4v10.8z" fill="#FFFFFF" />
          </svg>
          <span>네이버 로그인</span>
        </button>
      </div>

      <div class="pt-8 text-center">
        <p class="text-muted-foreground">
          계정이 없으신가요?
          <button
            type="button"
            @click="handleSignup"
            class="text-[var(--main-300)] transition hover:underline"
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
