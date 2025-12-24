<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description: string
  icon: Component
  iconColorClass?: string
}>()
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-[var(--gray-50)] px-6 text-center"
  >
    <!-- Icon Area -->
    <div class="mb-6 flex items-center justify-center">
      <component
        :is="icon"
        class="h-24 w-24"
        :class="iconColorClass || 'text-[var(--gray-300)]'"
        :stroke-width="1.5"
      />
    </div>

    <!-- Text Area -->
    <h1 class="mb-2 whitespace-pre-line text-2xl font-bold text-[var(--gray-900)]">
      {{ title }}
    </h1>
    <p class="mb-10 whitespace-pre-line text-[17px] leading-relaxed text-[var(--gray-600)]">
      {{ description }}
    </p>

    <!-- Action Buttons -->
    <div class="flex w-full max-w-xs flex-col gap-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style scoped>
@media (max-height: 700px) {
  .min-h-screen {
    padding-bottom: 80px;
  }
}
</style>
