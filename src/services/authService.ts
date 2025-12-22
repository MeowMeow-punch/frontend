import { apiFetch } from '@/services/apiClient'
import { mockCheckNickname, mockLogin, mockLogout, mockSearchGroups } from '@/mocks/auth'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  setTokens,
} from '@/services/tokenStore'

export type OAuthProvider = 'KAKAO' | 'NAVER' | 'GOOGLE'

export type LoginRequest = {
  oauthProvider: OAuthProvider
  oauthId: string
  redirectUri: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type LoginResponse = {
  code: number
  message: string
  data: AuthTokens
}

export type BasicResponse = {
  code: number
  message: string
}

export type RegisterRequest = {
  oauthProvider: OAuthProvider
  oauthId: string
  nickname: string
  isMarketing: boolean
  gender: 'MALE' | 'FEMALE'
  height: number
  weight: number
  age: number
  allergies: string[]
  diseases: string[]
  status: 'SINGLE' | 'GROUP'
  groupId: number | null
  focus: 'HEALTHY' | 'DIET' | 'MUSCLE'
  isSmoking?: 'NONE' | 'SOMETIME' | 'OFTEN'
  isDrinking?: 'NONE' | 'SOMETIME' | 'OFTEN'
  meals?: 'ONE' | 'TWO' | 'THREE' | 'ETC'
  activityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERYHIGH'
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

const AUTH_MOCK_OVERRIDE = import.meta.env.VITE_AUTH_MOCK
const SHOULD_USE_MOCK =
  AUTH_MOCK_OVERRIDE === 'true'
    ? true
    : AUTH_MOCK_OVERRIDE === 'false'
      ? false
      : import.meta.env.VITE_API_MOCK !== 'false'

export { clearTokens, getAccessToken, getRefreshToken, isAuthenticated }

export const isAuthMockEnabled = () => SHOULD_USE_MOCK

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  if (SHOULD_USE_MOCK) {
    const response = await mockLogin(payload)
    setTokens(response.data)
    return response
  }

  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    withAuth: false,
    body: payload,
    errorMessage: 'Login failed.',
  })

  setTokens(data.data)
  return data
}

export const logout = async (): Promise<BasicResponse> => {
  if (SHOULD_USE_MOCK) {
    const response = await mockLogout()
    clearTokens()
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
  }
}

export const checkNickname = async (nickname: string): Promise<BasicResponse> => {
  if (SHOULD_USE_MOCK) {
    return mockCheckNickname(nickname)
  }

  return apiFetch<BasicResponse>('/user/nickname', {
    method: 'GET',
    withAuth: false,
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

  if (SHOULD_USE_MOCK) {
    const data = await mockSearchGroups(trimmed)
    return Array.isArray(data.data) ? data.data : []
  }

  const data = await apiFetch<GroupSearchResponse>('/user/groupSearch', {
    method: 'GET',
    withAuth: true,
    query: { keyword: trimmed },
    acceptStatuses: [204],
    errorMessage: 'Group search failed.',
  })

  return Array.isArray(data.data) ? data.data : []
}

export const register = async (payload: RegisterRequest): Promise<LoginResponse> => {
  const data = await apiFetch<LoginResponse>('/auth/regist', {
    method: 'POST',
    withAuth: false,
    body: payload,
    errorMessage: 'Signup failed.',
  })

  setTokens(data.data)
  return data
}
