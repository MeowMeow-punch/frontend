import { apiFetch } from '@/services/apiClient'
import { mockCheckNickname, mockLogin, mockLogout, mockSearchGroups } from '@/mocks/auth'
import {
  clearAuthMode,
  clearTokens,
  getAccessToken,
  getAuthMode,
  getRefreshToken,
  isAuthenticated,
  setAuthMode,
  setTokens,
} from '@/services/tokenStore'

export type OAuthProvider = 'KAKAO' | 'NAVER' | 'GOOGLE'

export type LoginRequest = {
  oauthProvider: OAuthProvider
  authorizationCode: string
  redirectUri: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

// 200 OK 응답 데이터
export type LoginSuccessData = AuthTokens

// 404 Not Found 응답 데이터 (회원가입 필요)
export type LoginNeedRegisterData = {
  registerToken: string
}

export type LoginResponse = {
  code: number
  message: string
  data: LoginSuccessData | LoginNeedRegisterData
}

export type LoginResult =
  | { status: 'SUCCESS'; data: LoginSuccessData }
  | { status: 'NEED_REGISTER'; data: LoginNeedRegisterData }

export type BasicResponse = {
  code: number
  message: string
}

export type RegisterRequest = {
  registerToken: string
  nickname: string
  isMarketing: boolean
  gender: 'MALE' | 'FEMALE'
  height: number
  weight: number
  age: number
  allergies: string[]
  diseases: string[]
  status: 'SINGLE' | 'GROUP'
  groupId?: string
  focus: 'HEALTHY' | 'DIET' | 'MUSCLE'
  smokingStatus?: 'NONE' | 'SOMETIME' | 'OFTEN'
  drinkingStatus?: 'NONE' | 'SOMETIME' | 'OFTEN'
  meals: 'ONE' | 'TWO' | 'THREE' | 'ETC'
  activityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERYHIGH'
  targetWeight?: number
}

export type GroupOption = {
  groupId: number
  groupName: string
}

export type GroupSearchResponse = {
  code: number
  message: string
  data: GroupOption[]
}

export type UserProfileResponse = {
  code: number
  message: string
  data: {
    userProfile: {
      userId: string
      nickname: string
      focus: 'HEALTHY' | 'DIET' | 'MUSCLE'
      groupName?: string | null
      createdAt?: string
    }
    basicInfo: {
      age: number
      gender: 'MALE' | 'FEMALE'
      height: number
      weight: number
      allergies: string[]
    }
    activitySummary?: {
      streak?: {
        currentDays?: number
        totalRecordedDays?: number
      }
      weeklyDiet?: {
        recordedCount?: number
        targetCount?: number
      }
      goalWeight?: number | null
    }
  }
}

export type UpdateProfileRequest = {
  nickname?: string
  groupId?: string
  gender?: 'MALE' | 'FEMALE'
  height?: number
  weight?: number
  age?: number
  allergies?: string[]
  isMarketing?: boolean
}

export type UpdateDietRequest = {
  focus: 'HEALTHY' | 'DIET' | 'MUSCLE'
  meals: 'ONE' | 'TWO' | 'THREE' | 'ETC'
  activityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERYHIGH'
  isSmoking?: 'NONE' | 'SOMETIME' | 'OFTEN'
  isDrinking?: 'NONE' | 'SOMETIME' | 'OFTEN'
  targetWeight?: number
}

const AUTH_MOCK_OVERRIDE = import.meta.env.VITE_AUTH_MOCK
const SHOULD_USE_MOCK =
  AUTH_MOCK_OVERRIDE === 'true'
    ? true
    : AUTH_MOCK_OVERRIDE === 'false'
      ? false
      : import.meta.env.VITE_API_MOCK === 'true'

export { clearTokens, getAccessToken, getRefreshToken, isAuthenticated }

export const isAuthMockEnabled = () => SHOULD_USE_MOCK

const shouldUseMockAuth = () => SHOULD_USE_MOCK && getAuthMode() !== 'real'

type LoginOptions = {
  forceReal?: boolean
}

export const login = async (
  payload: LoginRequest,
  options: LoginOptions = {},
): Promise<LoginResult> => {
  // 새로운 인증 흐름에서 Mock 로그인은 완전히 지원되지 않을 수 있음 (최소한의 구현)
  if (!options.forceReal && SHOULD_USE_MOCK) {
    // 레거시 Mock 지원 - 백엔드 없이 테스트하기 위함
    // 완전한 Mock 지원을 위해서는 이 부분도 업데이트가 필요할 수 있음
    const response = await mockLogin({
      // 기존 Mock 페이로드에 맞게 조정 (필요 시 Mock 수정)
      oauthProvider: payload.oauthProvider,
      oauthId: 'mock-id-' + payload.authorizationCode,
      redirectUri: payload.redirectUri,
    } as any)

    // 레거시 Mock은 항상 성공 토큰을 반환한다고 가정
    const tokens = response.data as AuthTokens
    setTokens(tokens)
    setAuthMode('mock')
    return { status: 'SUCCESS', data: tokens }
  }

  const response = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    withAuth: false,
    body: payload,
    acceptStatuses: [404], // 404는 '회원가입 필요' 상태로 처리
    errorMessage: 'Login failed.',
  })

  // Case 200: 성공
  if (response.code === 200 && 'accessToken' in response.data) {
    const tokens = response.data as LoginSuccessData
    setTokens(tokens)
    setAuthMode('real')
    return { status: 'SUCCESS', data: tokens }
  }

  // Case 404: 회원가입 필요
  if (response.code === 404 && 'registerToken' in response.data) {
    return { status: 'NEED_REGISTER', data: response.data as LoginNeedRegisterData }
  }

  throw new Error(response.message || 'Login failed with unknown status.')
}

export const logout = async (): Promise<BasicResponse> => {
  const useMock = shouldUseMockAuth()
  if (useMock) {
    const response = await mockLogout()
    clearTokens()
    clearAuthMode()
    return response
  }

  try {
    return await apiFetch<BasicResponse>('/auth/logout', {
      method: 'POST',
      withAuth: true,
      errorMessage: 'Logout failed.',
    })
  } finally {
    clearTokens()
    clearAuthMode()
  }
}

export const withdraw = async (): Promise<BasicResponse> => {
  // Mock logic not strictly required unless user asks, but safety check
  if (shouldUseMockAuth()) {
    // For mock, just behave like logout + success
    clearTokens()
    clearAuthMode()
    return { code: 200, message: '회원탈퇴 성공 (Mock)' }
  }

  try {
    const response = await apiFetch<BasicResponse>('/auth/delete', {
      method: 'DELETE',
      withAuth: true,
      errorMessage: 'Withdraw failed.',
    })
    return response
  } finally {
    // 성공 여부와 관계없이 세션 정리? 혹은 성공 시에만?
    // 보통 탈퇴 API 호출 후에는 로컬 세션도 날리는 게 안전함.
    clearTokens()
    clearAuthMode()
  }
}

export const checkNickname = async (nickname: string): Promise<BasicResponse> => {
  if (shouldUseMockAuth()) {
    return mockCheckNickname(nickname)
  }

  return apiFetch<BasicResponse>('/user/nickname', {
    method: 'GET',
    withAuth: true,
    query: { nickname },
    acceptStatuses: [409],
    errorMessage: 'Nickname check failed.',
  })
}

export const searchGroups = async (keyword: string): Promise<GroupOption[]> => {
  const trimmed = keyword.trim()
  if (!trimmed) {
    return []
  }

  if (shouldUseMockAuth()) {
    const data = await mockSearchGroups(trimmed)
    return Array.isArray(data.data) ? data.data : []
  }

  return apiFetch<GroupSearchResponse>('/user/groupSearch', {
    method: 'GET',
    withAuth: true,
    query: { keyword: trimmed },
    acceptStatuses: [204],
    errorMessage: 'Group search failed.',
  }).then((res) => (Array.isArray(res.data) ? res.data : []))
}

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  return apiFetch<UserProfileResponse>('/user', {
    method: 'GET',
    withAuth: true,
    errorMessage: 'User profile fetch failed.',
  })
}

export const updateProfile = async (payload: UpdateProfileRequest): Promise<BasicResponse> => {
  return apiFetch<BasicResponse>('/user', {
    method: 'PATCH',
    withAuth: true,
    body: payload,
    acceptStatuses: [409],
    errorMessage: 'Profile update failed.',
  })
}

export const updateDiet = async (payload: UpdateDietRequest): Promise<BasicResponse> => {
  return apiFetch<BasicResponse>('/user/diet', {
    method: 'PATCH',
    withAuth: true,
    body: payload,
    errorMessage: 'Diet update failed.',
  })
}

export const register = async (payload: RegisterRequest): Promise<LoginSuccessData> => {
  const response = await apiFetch<LoginResponse>('/auth/regist', {
    method: 'POST',
    withAuth: false,
    body: payload,
    errorMessage: 'Signup failed.',
  })

  if (response.code === 201 && 'accessToken' in response.data) {
    const tokens = response.data as LoginSuccessData
    setTokens(tokens)
    return tokens
  }

  throw new Error(response.message || 'Signup failed.')
}
