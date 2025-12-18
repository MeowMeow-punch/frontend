<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  src: string | null
  alt: string
  class?: string
}>()

const hasError = ref(false)

watch(
  () => props.src,
  () => {
    hasError.value = false
  },
)

const resolvedSrc = computed(() => {
  if (hasError.value) return null
  return props.src
})
</script>

<template>
  <img
    v-if="resolvedSrc"
    :src="resolvedSrc"
    :alt="alt"
    :class="props.class"
    loading="lazy"
    @error="hasError = true"
  />
  <div v-else :class="props.class" aria-hidden="true" />
</template>
