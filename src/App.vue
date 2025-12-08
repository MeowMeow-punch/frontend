<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/NavBar.vue' // 방금 만든 컴포넌트 임포트
</script>

<template>
  <header>
    <NavBar />
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
/* 전역 스타일이 필요하면 여기에 작성 (Tailwind를 쓰면 거의 필요 없음) */
</style>
