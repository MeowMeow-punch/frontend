export type StoredTokens = {
  accessToken: string
  refreshToken: string
}

const ACCESS_TOKEN_KEY = 'auth_access_token_v1'
const REFRESH_TOKEN_KEY = 'auth_refresh_token_v1'

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
