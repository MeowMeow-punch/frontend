import { createRouter, createWebHistory } from 'vue-router'
// 1. 뷰 컴포넌트 임포트
import HomeView from '@/views/HomeView/HomeView.vue'
import AboutView from '@/views/AboutView/AboutView.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('import.meta.env.BASE_URL'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: AboutView,
    },
    {
      path: '/regist', // 회원가입
      name: 'regist',
      component: AboutView,
    },
    {
      path: '/', // 메인페이지
      name: 'home',
      component: HomeView,
    },
    {
      path: '/community',
      name: 'community', // 커뮤니티
      component: AboutView,
    },
    {
      path: '/mypage',
      name: 'mypage', // 마이페이지
      component: AboutView,
    },
    {
      path: '/diet',
      name: 'diet', // 식단 페이지
      component: AboutView,
    },
  ],
})

export default router
