<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Utensils, Users, User, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const navItems = [
  { id: 'home', label: '홈', to: '/home', icon: Home },
  { id: 'diet', label: '식단', to: '/diet', icon: Utensils },
  { id: 'community', label: '커뮤니티', to: '/community', icon: Users },
  { id: 'mypage', label: '마이페이지', to: '/mypage', icon: User },
]

const activePath = computed(() => route.path)

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-[var(--gray-200)] bg-white">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="rounded-lg bg-[var(--main-300)] p-1.5">
            <Utensils class="h-5 w-5 text-white" :stroke-width="2.5" />
          </div>
          <span
            class="text-[var(--gray-900)]"
            style="font-family: JalnanGothic, Pretendard, sans-serif; font-size: 1.25rem"
          >
            픽<span style="color: #00c73c">잇</span>
          </span>
        </RouterLink>

        <div class="flex items-center gap-2">
          <div v-if="isLoggedIn" class="flex gap-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.id"
              :to="item.to"
              class="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors"
              :class="
                activePath === item.to
                  ? 'bg-[var(--gray-100)] text-[var(--gray-900)]'
                  : 'text-[var(--gray-600)] hover:text-[var(--gray-900)]'
              "
            >
              <component :is="item.icon" class="h-4 w-4" />
              <span class="hidden sm:inline">{{ item.label }}</span>
            </RouterLink>
          </div>
          <div v-else>
            <button
              @click="goToLogin"
              class="flex items-center gap-2 rounded-lg bg-[var(--main-300)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--main-400)]"
            >
              <span class="hidden sm:inline">로그인</span>
              <LogIn class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
