export type StoredTokens = {
  accessToken: string
  refreshToken: string
}

export type AuthMode = 'mock' | 'real'

const ACCESS_TOKEN_KEY = 'auth_access_token_v1'
const REFRESH_TOKEN_KEY = 'auth_refresh_token_v1'
const AUTH_MODE_KEY = 'auth_mode_v1'

export const setTokens = (tokens: StoredTokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) ?? ''

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) ?? ''

export const isAuthenticated = () => Boolean(getAccessToken())

export const setAuthMode = (mode: AuthMode) => {
  localStorage.setItem(AUTH_MODE_KEY, mode)
}

export const getAuthMode = (): AuthMode | '' => {
  const value = localStorage.getItem(AUTH_MODE_KEY)
  return value === 'mock' || value === 'real' ? value : ''
}

export const clearAuthMode = () => {
  localStorage.removeItem(AUTH_MODE_KEY)
}
