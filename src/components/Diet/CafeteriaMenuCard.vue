<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
import ImageWithFallback from './ImageWithFallback.vue'

type CafeteriaMenuItem = {
  corner: string
  main: string
  sub: string
  kcal: number
  protein?: number
  soldout?: boolean
  image?: string | null
}

defineProps<{
  menu: CafeteriaMenuItem
}>()
</script>

<template>
  <div
    class="flex gap-4 rounded-[24px] border border-[var(--gray-100)] bg-white p-5 shadow-sm"
    :class="menu.soldout ? 'opacity-60 grayscale' : ''"
  >
    <div class="min-w-0 flex-1">
      <div class="mb-1.5 flex items-center gap-2">
        <span
          class="rounded-md bg-[var(--gray-50)] px-2 py-0.5 text-[13px] font-bold text-[var(--gray-700)]"
        >
          {{ menu.corner }}
        </span>
        <span
          v-if="menu.soldout"
          class="rounded-full bg-[var(--gray-400)] px-2 py-0.5 text-[11px] font-bold text-white"
        >
          품절
        </span>
      </div>

      <h3 class="mb-1 text-[17px] font-bold leading-snug text-[var(--gray-900)]">
        {{ menu.main }}
      </h3>

      <p class="mb-3 line-clamp-2 text-[14px] leading-relaxed text-[var(--gray-500)]">
        {{ menu.sub }}
      </p>

      <div class="flex items-center gap-3">
        <span class="text-[13px] font-bold text-[var(--gray-800)]">
          {{ menu.kcal }} <span class="text-[11px] font-normal text-[var(--gray-500)]">kcal</span>
        </span>
        <span v-if="menu.protein !== undefined" class="h-3 w-px bg-[var(--gray-200)]" />
        <span v-if="menu.protein !== undefined" class="text-[12px] text-[var(--gray-500)]">
          단백질 {{ menu.protein }}g
        </span>
      </div>
    </div>

    <div
      v-if="menu.image"
      class="h-24 w-24 shrink-0 overflow-hidden rounded-[18px] bg-[var(--gray-100)]"
    >
      <ImageWithFallback :src="menu.image" :alt="menu.main" class="h-full w-full object-cover" />
    </div>
    <div
      v-else
      class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[var(--gray-100)] bg-[var(--gray-50)]"
    >
      <Calendar class="h-8 w-8 text-[var(--gray-300)]" />
    </div>
  </div>
</template>
