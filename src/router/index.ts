import { createRouter, createWebHistory } from 'vue-router'
// 1. 뷰 컴포넌트 임포트
import HomeView from '@/views/HomeView/HomeView.vue'
import SignupView from '@/views/SignupView/SignupView.vue'
import LoginView from '@/views/LoginView/LoginView.vue'
import CommunityView from '@/views/CommunityView/CommunityView.vue'
import MyPageView from '@/views/MyPageView/MyPageView.vue'
import DietView from '@/views/DietView/DietView.vue'
import DietRecordView from '@/views/DietView/DietRecordView.vue'
import DietCafeteriaView from '@/views/DietView/DietCafeteriaView.vue'
import MenuRecommendationView from '@/views/MenuRecommendationView.vue'
import { isAuthenticated } from '@/services/authService'
import { getRegisterToken } from '@/services/registerTokenStore'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/oauth/callback/:provider',
      name: 'oauth-callback',
      component: () => import('@/views/LoginView/OAuthCallback.vue'),
      meta: { hideNav: true, guestOnly: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideNav: true, guestOnly: true },
    },
    {
      path: '/regist', // 회원가입
      name: 'regist',
      component: SignupView,
      meta: { hideNav: true, guestOnly: true },
    },
    {
      path: '/', // 랜딩 페이지 (시작 화면)
      name: 'landing',
      component: () => import('@/views/LandingView/LandingView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/home', // 메인 홈 (로그인 후)
      name: 'home',
      component: HomeView,
    },
    {
      path: '/community',
      name: 'community', // 커뮤니티
      component: CommunityView,
    },
    {
      path: '/mypage',
      name: 'mypage', // 마이페이지
      component: MyPageView,
      meta: { requiresAuth: true },
    },
    {
      path: '/diet',
      name: 'diet', // 식단 페이지
      component: DietView,
      meta: { requiresAuth: true },
    },
    {
      path: '/diet/record',
      name: 'diet-record',
      component: DietRecordView,
      meta: { requiresAuth: true },
    },
    {
      path: '/diet/cafeteria',
      name: 'diet-cafeteria',
      component: DietCafeteriaView,
      meta: { requiresAuth: true },
    },
    {
      path: '/menu-recommendation',
      name: 'menu-recommendation',
      component: MenuRecommendationView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // 라우트 이동 시마다 스토어 상태 갱신 (쿠키/스토리지 확인)
  authStore.updateAuthStatus()

  const authenticated = authStore.isLoggedIn
  const isGuestOnly = to.meta.guestOnly
  const requiresAuth = to.meta.requiresAuth
  // 일부 라우트는 명시적 requiresAuth가 없을 수 있으므로 기존 whitelist 로직을 보완하여 처리하거나
  // 혹은 모든 라우트에 meta를 다는 것이 좋으나, 여기서는 기존 whitelist 로직을 requiresAuth로 대체 가능한지 확인 필요.
  // 현재 라우트 정의상 requiresAuth가 있는 것과 없는 것이 혼재됨.
  // 안전을 위해, requiresAuth가 true인 경우와 guestOnly인 경우를 우선 처리.

  // 1. 이미 로그인한 사용자가 Guest 페이지(로그인/회원가입/랜딩) 접근 시 -> 홈으로
  if (authenticated && isGuestOnly) {
    return next({ name: 'home' })
  }

  // 2. 비로그인 사용자가 인증 필요 페이지 접근 시 -> 로그인으로
  if (!authenticated && requiresAuth) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // 3. 그 외 (공개 페이지 및 기타) -> 허용
  next()
})

export default router
