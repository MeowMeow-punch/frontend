import { createRouter, createWebHistory } from 'vue-router'
// 1. 뷰 컴포넌트 임포트
import HomeView from '@/views/HomeView/HomeView.vue'
import AboutView from '@/views/AboutView/AboutView.vue'
import SignupView from '@/views/SignupView/SignupView.vue'
import LoginView from '@/views/LoginView/LoginView.vue'
import CommunityView from '@/views/CommunityView/CommunityView.vue'
import DietView from '@/views/DietView/DietView.vue'
import DietRecordView from '@/views/DietView/DietRecordView.vue'
import DietCafeteriaView from '@/views/DietView/DietCafeteriaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideNav: true },
    },
    {
      path: '/regist', // 회원가입
      name: 'regist',
      component: SignupView,
      meta: { hideNav: true },
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
      component: AboutView,
    },
    {
      path: '/diet',
      name: 'diet', // 식단 페이지
      component: DietView,
    },
    {
      path: '/diet/record',
      name: 'diet-record',
      component: DietRecordView,
    },
    {
      path: '/diet/cafeteria',
      name: 'diet-cafeteria',
      component: DietCafeteriaView,
    },
  ],
})

export default router
