<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="landing-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <div class="hero-content">
          <div class="text-area animate-slide-up">
            <h1 class="main-title">
              식단 관리,<br />
              <span class="highlight">그 이상을 경험하세요.</span>
            </h1>
            <p class="sub-title">
              삼성 웰스토리 메뉴 연동으로 간편한 기록부터<br />
              AI 영양 코칭까지, 픽잇이 도와드릴게요.
            </p>
            <div class="cta-group">
              <button class="btn-primary large" @click="router.push('/login')">시작하기</button>
            </div>
          </div>
          <div class="image-area animate-fade-in delay-200">
            <!-- Abstract 3D Element Placeholder -->
            <div class="floating-obj circle"></div>
            <div class="floating-obj pill"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Section -->
    <section class="features">
      <div class="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <div class="feature-row animate-slide-up delay-300">
          <div class="feature-text">
            <h2>오늘의 웰스토리 메뉴,<br />AI가 딱 맞게 분석해드려요.</h2>
            <p>
              복잡한 영양 계산은 그만. 식판 사진이나 메뉴 선택만으로<br />칼로리부터 탄단지 비율까지
              한눈에 확인하세요.
            </p>
          </div>
          <div class="feature-visual bg-1">🤖 📝 🍎</div>
        </div>

        <div class="feature-row reverse animate-slide-up delay-400">
          <div class="feature-text">
            <h2>매일 고민되는 점심 메뉴,<br />랜덤 추천으로 즐겁게.</h2>
            <p>
              무엇을 먹을지 고민하지 마세요.<br />재미있는 메뉴 추천 기능으로 식사 시간이 기다려질
              거예요.
            </p>
          </div>
          <div class="feature-visual bg-2">🎲 🍱 ✨</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-view {
  overflow-x: hidden;
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;
}

/* Hero Section */
.hero {
  background-color: #f9fafb; /* Toss Light Grey */
  padding: 120px 0 100px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-title {
  font-size: 64px; /* Massive Title */
  line-height: 1.25;
  font-weight: 800; /* Extra Bold */
  color: #191f28; /* Toss Black */
  margin-bottom: 32px;
  letter-spacing: -0.02em;
}

.highlight {
  /* Green Gradient */
  background: linear-gradient(90deg, #00c73c 0%, #4ade80 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sub-title {
  font-size: 20px;
  line-height: 1.6;
  color: #4e5968; /* Toss Dark Grey */
  margin-bottom: 56px;
  font-weight: 500;
}

.cta-group {
  display: flex;
  align-items: center;
  gap: 24px;
}

.btn-primary.large {
  padding: 18px 48px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background-color: #00c73c; /* Main Green */
  border-radius: 30px; /* Pillow shape */
  box-shadow: 0 10px 20px rgba(0, 199, 60, 0.25);
  transition:
    transform 0.2s,
    background-color 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary.large:hover {
  background-color: #00b035;
  transform: translateY(-2px);
}

.btn-primary.large:active {
  transform: translateY(0);
}

.btn-text.secondary {
  font-size: 18px;
  color: #6b7684;
  font-weight: 600;
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-text.secondary:hover {
  color: #191f28;
}

/* Abstract Visuals */
.image-area {
  position: relative;
  width: 400px;
  height: 400px;
}

.floating-obj {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.circle {
  width: 300px;
  height: 300px;
  background: #00c73c; /* Main Green */
  top: 0;
  right: 0;
}

.pill {
  width: 200px;
  height: 200px;
  background: #3b82f6; /* Blue 500 */
  bottom: 0;
  left: 40px;
  animation-delay: -3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

/* Feature Sections */
.features {
  background-color: #ffffff;
  padding: 160px 0;
}

.feature-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 180px;
  gap: 80px;
}

.feature-row.reverse {
  flex-direction: row-reverse;
}

.feature-row:last-child {
  margin-bottom: 0;
}

.feature-text h2 {
  font-size: 48px;
  font-weight: 700;
  color: #191f28;
  line-height: 1.3;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}

.feature-text p {
  font-size: 20px;
  color: #6b7684;
  line-height: 1.6;
}

.feature-visual {
  flex: 1;
  height: 480px;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.feature-visual:hover {
  transform: translateY(-8px);
}

.bg-1 {
  background-color: #e5f9eb;
} /* Light Green */
.bg-2 {
  background-color: #f2f4f6;
} /* Light Grey */

/* Animation Classes */
.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.8s ease-out forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Utilities for animation delay */
.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.3s;
}
.delay-400 {
  animation-delay: 0.4s;
}

.clickable-banner {
  cursor: pointer;
}

.clickable-banner:hover .feature-text h2 {
  color: #00c73c; /* Hover Highlight */
  transition: color 0.3s;
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 0;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .main-title {
    font-size: 40px;
  }

  .sub-title {
    font-size: 16px;
    margin-bottom: 32px;
  }

  .cta-group {
    justify-content: center;
    margin-bottom: 40px;
  }

  .image-area {
    width: 100%;
    height: 300px;
    margin-top: 20px;
  }

  .circle {
    width: 200px;
    height: 200px;
    right: 50%;
    transform: translateX(50%);
  }

  .pill {
    width: 120px;
    height: 120px;
    left: 50%;
    transform: translateX(-50%);
  }

  .features {
    padding: 80px 0;
  }

  .feature-row {
    flex-direction: column;
    gap: 40px;
    margin-bottom: 100px;
    text-align: center;
  }

  .feature-row.reverse {
    flex-direction: column;
  }

  .feature-visual {
    width: 100%;
    height: 300px;
    font-size: 60px;
  }

  .feature-text h2 {
    font-size: 32px;
  }
}
</style>
