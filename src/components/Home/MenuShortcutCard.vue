<script setup lang="ts">
const props = withDefaults(
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
    class="cursor-pointer rounded-2xl border border-[var(--gray-200)] bg-white p-6 transition-colors hover:border-[#00C73C]"
    @click="emit('click')"
  >
    <div class="mb-3 flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gray-100)]">
        <span class="text-sm text-[var(--gray-600)]">🍽️</span>
      </div>
      <span class="rounded-md bg-[#E5F9EB] px-2 py-0.5 text-[11px] font-bold text-[#00C73C]">
        {{ chip }}
      </span>
    </div>
    <div class="mb-1 flex items-center justify-between">
      <h3 class="text-[16px] font-bold text-[var(--gray-900)]">{{ label }}</h3>
      <span class="text-[var(--gray-400)]">→</span>
    </div>
    <p class="mb-4 text-[13px] text-[var(--gray-500)]">{{ subtitle }}</p>
    <p class="text-[12px] font-medium text-[var(--gray-400)]">SSAFY 14기 · 23명</p>
  </div>
</template>
