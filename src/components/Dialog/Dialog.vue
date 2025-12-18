<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => {
  emit('update:modelValue', false)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="close" />

      <div
        class="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-lg"
      >
        <button
          type="button"
          class="absolute right-4 top-4 rounded-md p-1.5 text-[var(--gray-500)] transition hover:bg-[var(--gray-100)] hover:text-[var(--gray-800)]"
          @click="close"
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </button>

        <div
          v-if="$slots.title || $slots.description"
          class="flex flex-col gap-2 text-center sm:text-left"
        >
          <h2 v-if="$slots.title" class="text-lg text-[var(--gray-900)]" style="font-weight: 600">
            <slot name="title" />
          </h2>
          <p
            v-if="$slots.description"
            class="text-sm text-[var(--gray-600)]"
            style="font-weight: 400"
          >
            <slot name="description" />
          </p>
        </div>

        <div class="mt-4">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>
