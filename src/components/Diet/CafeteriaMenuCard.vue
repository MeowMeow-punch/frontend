<script setup lang="ts">
import { Calendar, Plus, Loader2 } from 'lucide-vue-next'
import ImageWithFallback from './ImageWithFallback.vue'

type CafeteriaMenuItem = {
  corner: string
  main: string
  sub: string
  kcal: number
  carbs?: number
  protein?: number
  fat?: number
  soldout?: boolean
  image?: string | null
}

defineProps<{
  menu: CafeteriaMenuItem
  showAddButton?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'add'): void
}>()
</script>

<template>
  <div
    class="flex items-center gap-4 rounded-[24px] border border-[var(--gray-200)] bg-white p-4 transition-all hover:border-[#00C73C]"
    :class="menu.soldout ? 'opacity-60 grayscale' : ''"
  >
    <!-- Image Section (Left) -->
    <div
      v-if="menu.image"
      class="h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-[var(--gray-100)]"
    >
      <ImageWithFallback :src="menu.image" :alt="menu.main" class="h-full w-full object-cover" />
    </div>
    <div
      v-else
      class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[var(--gray-100)] bg-[var(--gray-50)]"
    >
      <Calendar class="h-8 w-8 text-[var(--gray-300)]" />
    </div>

    <!-- Content Section (Center) -->
    <div class="min-w-0 flex-1 py-1">
      <div class="mb-1 flex items-center gap-2">
        <span class="rounded-[6px] bg-[#E5F9EB] px-2 py-0.5 text-[12px] font-bold text-[#00C73C]">
          {{ menu.corner }}
        </span>
        <span
          v-if="menu.soldout"
          class="rounded-full bg-[var(--gray-400)] px-2 py-0.5 text-[11px] font-bold text-white"
        >
          품절
        </span>
        <span class="text-[13px] text-[var(--gray-500)]">{{ menu.kcal }} kcal</span>
      </div>

      <h3 class="mb-1 truncate text-[16px] font-bold leading-snug text-[var(--gray-900)]">
        {{ menu.main }}
      </h3>

      <div class="mb-1 flex items-center gap-1.5">
        <span
          v-if="menu.carbs !== undefined"
          class="rounded-[4px] bg-[var(--gray-50)] px-1.5 py-0.5 text-[11px] text-[var(--gray-500)]"
        >
          탄 {{ menu.carbs }}g
        </span>
        <span
          v-if="menu.protein !== undefined"
          class="rounded-[4px] bg-[var(--gray-50)] px-1.5 py-0.5 text-[11px] text-[var(--gray-500)]"
        >
          단 {{ menu.protein }}g
        </span>
        <span
          v-if="menu.fat !== undefined"
          class="rounded-[4px] bg-[var(--gray-50)] px-1.5 py-0.5 text-[11px] text-[var(--gray-500)]"
        >
          지 {{ menu.fat }}g
        </span>
      </div>

      <p class="truncate text-[13px] text-[var(--gray-400)]">
        {{ menu.sub }}
      </p>
    </div>

    <!-- Add Button (Right) -->
    <button
      v-if="showAddButton && !menu.soldout"
      type="button"
      :disabled="disabled"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gray-100)] bg-white text-[var(--gray-300)] transition-all hover:bg-[#E5F9EB] hover:text-[#00C73C] disabled:cursor-not-allowed disabled:bg-[var(--gray-50)] disabled:text-[var(--gray-300)]"
      @click.stop="emit('add')"
    >
      <Loader2 v-if="disabled" class="h-5 w-5 animate-spin" />
      <Plus v-else class="h-5 w-5" />
    </button>
  </div>
</template>
