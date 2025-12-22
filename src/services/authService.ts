import { mockLogin, mockLogout } from '@/mocks/auth'

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

const ACCESS_TOKEN_KEY = 'auth_access_token_v1'
const REFRESH_TOKEN_KEY = 'auth_refresh_token_v1'
const AUTH_MOCK_OVERRIDE = import.meta.env.VITE_AUTH_MOCK
const SHOULD_USE_MOCK =
  AUTH_MOCK_OVERRIDE === 'true'
    ? true
    : AUTH_MOCK_OVERRIDE === 'false'
      ? false
      : import.meta.env.VITE_API_MOCK !== 'false'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const isAuthMockEnabled = () => SHOULD_USE_MOCK

const storeTokens = (tokens: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) ?? ''

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) ?? ''

export const isAuthenticated = () => Boolean(getAccessToken())

const parseJson = async <T>(response: Response, fallbackMessage: string) => {
  const data = (await response
    .json()
    .catch(() => ({ code: response.status, message: fallbackMessage }))) as T
  return data
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  if (SHOULD_USE_MOCK) {
    const response = await mockLogin(payload)
    storeTokens(response.data)
    return response
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured.')
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await parseJson<LoginResponse>(response, 'Login failed.')

  if (!response.ok) {
    throw new Error(data.message || 'Login failed.')
  }

  if (data.data?.accessToken) {
    storeTokens(data.data)
  }

  return data
}

export const logout = async (): Promise<BasicResponse> => {
  if (SHOULD_USE_MOCK) {
    const response = await mockLogout()
    clearTokens()
    return response
  }

  if (!API_BASE_URL) {
    clearTokens()
    return { code: 200, message: 'Logged out locally.' }
  }

  const accessToken = getAccessToken()

  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    })

    const data = await parseJson<BasicResponse>(response, 'Logout failed.')

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed.')
    }

    return data
  } finally {
    clearTokens()
  }
}
