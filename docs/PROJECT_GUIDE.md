# 프로젝트 구조/흐름 가이드

이 문서는 빠른 온보딩과 작업 위치 파악을 위한 요약입니다.

## 기술 스택

- Vue 3 + TypeScript + Vite
- Vue Router
- Tailwind CSS + CSS 변수 기반 디자인 토큰
- lucide-vue-next 아이콘
- 패키지 매니저: pnpm

## 디렉터리 맵

- `src/main.ts`: 앱 엔트리, App 마운트
- `src/App.vue`: 전역 레이아웃, NavBar + RouterView, `route.meta.hideNav` 처리
- `src/router/index.ts`: 라우팅 정의
- `src/style.css`: 전역 스타일, 컬러 토큰/폰트
- `src/views/`: 페이지 단위 화면
- `src/components/`: 재사용 UI 컴포넌트
- `src/composables/useDietStore.ts`: 식단 상태/로컬 스토리지 관리
- `src/types/`: 도메인 타입 정의 (`diet.ts`)
- `src/utils/`: 도메인 유틸리티 (`dietUtils.ts`)
- `vite.config.ts`: `@` 경로 별칭 설정

## 라우팅 요약

- `/login` → `LoginView` (NavBar 숨김)
- `/regist` → `SignupView` (NavBar 숨김)
- `/` → `HomeView`
- `/community` → `CommunityView`
- `/mypage` → `MyPageView`
- `/diet` → `DietView`
- `/diet/record` → `DietRecordView`
- `/diet/cafeteria` → `DietCafeteriaView`

## 식단 데이터 흐름

- `useDietStore`는 `localStorage`의 `diet_meals_v1` 키를 사용합니다.
- 기본 더미 데이터를 제공하고(`getDefaultMeals`), 이후 변경을 감지해 저장합니다.
- `MealData` 구조는 `src/types/diet.ts`에서 정의합니다.
- 홈 추천 식단 선택 시 `setDraftMeal` → `/diet/record` 이동으로 이어집니다.
- 기록 화면에서 신규 저장 또는 수정 시 `upsertMeal`로 갱신합니다.

## 화면별 요약

- `HomeView`: 배너/영양 카드/AI 인사이트/추천 식단 카드. 추천 식단 클릭 시 기록 화면으로 이동.
- `DietView`: 선택 날짜 기준 요약, 기록 리스트, 상세 모달, 구내식당 요약 탭.
- `DietRecordView`: 식단 기록 생성/수정. `route.query.id`가 있으면 수정 모드.
- `DietCafeteriaView`: 주간(월~금) 구내식당 메뉴 카드 리스트.
- `CommunityView`: 전문가 칼럼 리스트, 카테고리/검색 필터.
- `CommunityDetail`: 칼럼 상세 + 공유 모달 + 관련 글.
- `LoginView`: 소셜 로그인 UI(동작은 더미 라우팅).
- `SignupView`/`SignupFlow`: 다단계 회원가입 플로우, 목표/소속에 따라 단계 분기.
- `MyPageView`: 프로필 요약 + 하위 설정 페이지 전환.
- `EditGoal`: 목표 수정 플로우(회원가입 스텝 재사용).
- `EditProfile`: 개인정보 설정 폼.
- `PrivacyPolicy`: 개인정보 처리방침 콘텐츠.
- `NotificationSettings`: 알림 설정 페이지(현재 라우팅/연결 없음).
- `AboutView`: 소개 페이지(간단한 플레이스홀더).

## 주요 컴포넌트 위치

- `components/NavBar/NavBar.vue`: 상단 내비게이션
- `components/Dialog/Dialog.vue`: 모달 다이얼로그
- `components/Layouts/SignupLayout.vue`: 회원가입/목표 수정 레이아웃
- `components/Diet/*`: 식단 관련 UI 카드/이미지/캘린더
- `components/Home/*`: 홈 대시보드 카드/배너
- `components/Signup/*`: 회원가입 각 단계

## 스타일/설정

- 전역 컬러 토큰은 `src/style.css`의 CSS 변수로 관리합니다.
- `@` 별칭은 `src` 경로로 매핑됩니다(`vite.config.ts`).
- Tailwind 스캔 경로는 `tailwind.config.js`에 정의되어 있습니다.

## 참고 메모

- README에 언급된 Pinia/Vitest/ESLint는 현재 의존성 목록에는 없습니다.
- 더미 데이터가 많아 API 연동 전환 포인트를 지정하기 좋습니다.
