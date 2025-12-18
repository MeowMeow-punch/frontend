<script setup lang="ts">
import { ChevronRight, Users } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    label: string
    subtitle: string
    chip?: string
  }>(),
  { chip: 'NEW' },
)

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div
    class="group cursor-pointer rounded-2xl border border-[var(--gray-200)] bg-white p-6 transition-colors hover:border-[#00C73C]"
    @click="emit('click')"
  >
    <div class="mb-3 flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gray-100)]">
        <Users class="h-4 w-4 text-[var(--gray-600)]" />
      </div>
      <span
        class="rounded-md bg-[var(--main-100)] px-2 py-0.5 text-[11px] font-bold text-[var(--main-300)]"
      >
        {{ chip }}
      </span>
    </div>
    <div class="mb-1 flex items-center justify-between">
      <h3
        class="text-[16px] font-bold text-[var(--gray-900)] transition-colors group-hover:text-[#00C73C]"
      >
        {{ label }}
      </h3>
      <ChevronRight class="h-4 w-4 text-[var(--gray-400)] group-hover:text-[#00C73C]" />
    </div>
    <p class="mb-4 text-[13px] text-[var(--gray-500)]">{{ subtitle }}</p>
    <p class="text-[12px] font-medium text-[var(--gray-400)]">SSAFY 14기 · 23명</p>
  </div>
</template>
