<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type BannerTheme = 'green' | 'purple'

export interface Banner {
  id: number
  title: string
  subtitle: string
  buttonText: string
  route: string
  theme: BannerTheme
  available: boolean
  comingSoon?: string
}

const props = defineProps<{
  banners: Banner[]
}>()

const emit = defineEmits<{
  (e: 'navigate', route: string): void
}>()

const TRANSITION_DURATION_MS = 400
const SWIPE_THRESHOLD_PX = 50
const BANNER_AUTOPLAY_INTERVAL_MS = 15000

const currentBannerIndex = ref(0)
const isTransitioning = ref(false)
const touchStart = ref(0)
const touchEnd = ref(0)
const dragStart = ref(0)
const dragEnd = ref(0)
let timerId: number | undefined

const fallbackBanner: Banner = {
  id: 0,
  title: '',
  subtitle: '',
  buttonText: '',
  route: '/',
  theme: 'green',
  available: false,
}

const currentBanner = computed<Banner>(
  () => props.banners[currentBannerIndex.value] ?? props.banners[0] ?? fallbackBanner,
)

const goToBanner = (index: number) => {
  if (isTransitioning.value || props.banners.length === 0) return
  isTransitioning.value = true
  currentBannerIndex.value = (index + props.banners.length) % props.banners.length
  window.setTimeout(() => {
    isTransitioning.value = false
  }, TRANSITION_DURATION_MS)
}

const goToPreviousBanner = () => goToBanner(currentBannerIndex.value - 1)
const goToNextBanner = () => goToBanner(currentBannerIndex.value + 1)

const handleTouchStart = (e: TouchEvent) => {
  const firstTouch = e.touches[0]
  if (!firstTouch) return
  touchStart.value = firstTouch.clientX
}

const handleTouchMove = (e: TouchEvent) => {
  const firstTouch = e.touches[0]
  if (!firstTouch) return
  touchEnd.value = firstTouch.clientX
}

const handleTouchEnd = () => {
  if (!touchStart.value || !touchEnd.value) return
  const distance = touchStart.value - touchEnd.value
  handleSwipe(distance)
  touchStart.value = 0
  touchEnd.value = 0
}

const handleMouseDown = (e: MouseEvent) => {
  dragStart.value = e.clientX
  dragEnd.value = e.clientX
}

const handleMouseMove = (e: MouseEvent) => {
  if (!dragStart.value) return
  dragEnd.value = e.clientX
}

const handleMouseUp = () => {
  if (!dragStart.value || !dragEnd.value) {
    dragStart.value = 0
    dragEnd.value = 0
    return
  }
  const distance = dragStart.value - dragEnd.value
  handleSwipe(distance)
  dragStart.value = 0
  dragEnd.value = 0
}

const handleMouseLeave = () => {
  dragStart.value = 0
  dragEnd.value = 0
}

const handleSwipe = (distance: number) => {
  if (Math.abs(distance) > SWIPE_THRESHOLD_PX) {
    distance > 0 ? goToNextBanner() : goToPreviousBanner()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goToPreviousBanner()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    goToNextBanner()
  }
}

onMounted(() => {
  timerId = window.setInterval(() => {
    goToNextBanner()
  }, BANNER_AUTOPLAY_INTERVAL_MS)
})

onBeforeUnmount(() => {
  if (timerId) {
    window.clearInterval(timerId)
  }
})
</script>

<template>
  <div
    class="relative mb-8 flex min-h-[220px] cursor-grab select-none flex-col justify-center overflow-hidden rounded-[26px] p-7 active:cursor-grabbing md:mb-10 md:p-9"
    tabindex="0"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
    @keydown="handleKeydown"
  >
    <div
      v-for="(banner, index) in banners"
      :key="banner.id"
      :class="[
        'absolute inset-0 transition-opacity duration-500 ease-in-out',
        index === currentBannerIndex ? 'z-10 opacity-100' : 'z-0 opacity-0',
      ]"
    >
      <div v-if="banner.theme === 'green'" class="absolute inset-0 overflow-hidden bg-[#E8F9EC]">
        <div
          class="absolute right-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-[#B2F2BB] opacity-60 blur-[80px]"
        />
        <div
          class="animate_float absolute right-[5%] top-[15%] rotate-[15deg] text-[100px] drop-shadow-xl"
        >
          🥗
        </div>
        <div
          class="animate_float_delayed absolute bottom-[15%] right-[25%] -rotate-[15deg] text-[60px] opacity-90 drop-shadow-lg"
        >
          🥑
        </div>
      </div>

      <div
        v-else-if="banner.theme === 'purple'"
        class="absolute inset-0 overflow-hidden bg-[#F3F0FF]"
      >
        <div
          class="absolute left-[20%] top-[-10%] h-[400px] w-[400px] rounded-full bg-[#E9E4FF] blur-[80px]"
        />
        <div
          class="animate_float absolute right-[10%] top-[15%] rotate-[5deg] text-[90px] drop-shadow-xl"
        >
          🔥
        </div>
        <div
          class="animate_float_delayed absolute right-[25%] top-[10%] -rotate-[10deg] text-[50px] opacity-80 drop-shadow-lg"
        >
          👟
        </div>
      </div>
    </div>

    <div class="relative z-20 flex max-w-[70%] flex-col items-start">
      <div class="mb-6">
        <h2 class="mb-2 text-[24px] font-bold leading-[1.3] tracking-tight md:text-[28px]">
          {{ currentBanner.title }}
        </h2>
        <p class="text-[15px] font-medium leading-relaxed text-gray-600">
          {{ currentBanner.subtitle }}
        </p>
      </div>

      <button
        class="inline-flex h-[42px] items-center gap-1.5 rounded-[14px] px-5 text-[14px] font-bold transition-all active:scale-95"
        :class="
          currentBanner.available
            ? 'bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg'
            : 'cursor-not-allowed bg-gray-200 text-gray-400'
        "
        :disabled="!currentBanner.available"
        @click="currentBanner.available ? emit('navigate', currentBanner.route) : undefined"
      >
        {{ currentBanner.buttonText }}
        <span v-if="currentBanner.available" class="text-white/90">→</span>
      </button>
    </div>

    <div
      v-if="currentBanner && !currentBanner.available"
      class="absolute right-6 top-6 z-20 rounded-full border border-white/50 bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur-md"
    >
      <span class="text-[12px] font-bold tracking-tight text-gray-600">
        {{ currentBanner.comingSoon }}
      </span>
    </div>

    <div
      class="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/40 p-1.5 backdrop-blur-sm"
    >
      <button
        v-for="(_, index) in banners"
        :key="index"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="index === currentBannerIndex ? 'w-4 bg-gray-800' : 'w-1.5 bg-gray-400/50'"
        @click.stop="() => goToBanner(index)"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate_float {
  animation: float 8s ease-in-out infinite;
}

.animate_float_delayed {
  animation: float 10s ease-in-out infinite 1s;
}
</style>
