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
import { isAuthenticated } from '@/services/authService'
import { getRegisterToken } from '@/services/registerTokenStore'

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
      path: '/', // 메인페이지
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
  ],
})

router.beforeEach((to) => {
  const authenticated = isAuthenticated()
  const registerToken = getRegisterToken()
  const isRegisterFlow = to.name === 'regist' && Boolean(registerToken)

  if (!authenticated && to.name !== 'login' && to.name !== 'oauth-callback' && !isRegisterFlow) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authenticated) {
    if (import.meta.env.DEV) {
      // TODO: remove dev override once auth flow is finalized.
      return true
    }
    return { name: 'home' }
  }

  return true
})

export default router
