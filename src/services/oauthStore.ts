import type { OAuthProvider } from '@/services/authService'

const OAUTH_ID_PREFIX = 'mock_oauth_id_v1_'

const buildKey = (provider: OAuthProvider) => `${OAUTH_ID_PREFIX}${provider.toLowerCase()}`

export const getStoredOAuthId = (provider: OAuthProvider) => {
  return localStorage.getItem(buildKey(provider)) ?? ''
}

export const setStoredOAuthId = (provider: OAuthProvider, oauthId: string) => {
  localStorage.setItem(buildKey(provider), oauthId)
}

export const getOrCreateOAuthId = (provider: OAuthProvider) => {
  const stored = getStoredOAuthId(provider)
  if (stored) {
    return stored
  }

  const generated = `mock-${provider.toLowerCase()}-${Date.now()}`
  setStoredOAuthId(provider, generated)
  return generated
}

export const clearStoredOAuthId = (provider: OAuthProvider) => {
  localStorage.removeItem(buildKey(provider))
}
