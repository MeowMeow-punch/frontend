<script setup lang="ts">
import { RouterLink } from 'vue-router'
import imgLogo from '@/assets/logo.svg'
import imgCommunity from '@/assets/IconCommunity.svg'
import imgDiet from '@/assets/IconDiet.svg'
import imgMypage from '@/assets/IconMypage.svg'
import imgHome from '@/assets/IconHome.svg'

// React(Shadcn UI)의 navigationMenuTriggerStyle을 Tailwind 기본 색상으로 변환
// bg-background -> bg-white
// hover:bg-accent -> hover:bg-slate-100
// text-accent-foreground -> text-slate-900
const linkBaseClass =
  'group inline-flex h-9 w-max items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-slate-700'
</script>

<template>
  <nav class="border-b border-slate-200 bg-white p-4 shadow-sm">
    <div class="container mx-auto flex items-center justify-between">
      <div class="text-xl font-bold text-slate-900">
        <RouterLink to="/" class="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img :src="imgLogo" alt="MyLogo" class="h-8 w-auto" />
        </RouterLink>
      </div>

      <ul class="flex list-none items-center justify-center gap-1">
        <li>
          <RouterLink to="/" :class="linkBaseClass" active-class="bg-slate-100 text-slate-900">
            <img :src="imgHome" alt="홈" class="h-5 w-5" />
            <span>홈</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/diet" :class="linkBaseClass" active-class="bg-slate-100 text-slate-900">
            <img :src="imgDiet" alt="식단" class="h-5 w-5" />
            <span>식단</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/community"
            :class="linkBaseClass"
            active-class="bg-slate-100 text-slate-900"
          >
            <img :src="imgCommunity" alt="커뮤니티" class="h-5 w-5" />
            <span>커뮤니티</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/mypage"
            :class="linkBaseClass"
            active-class="bg-slate-100 text-slate-900"
          >
            <img :src="imgMypage" alt="마이페이지" class="h-5 w-5" />
            <span>마이페이지</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
