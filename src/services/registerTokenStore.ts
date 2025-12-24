const REGISTER_TOKEN_KEY = 'register_token_v1'

export const setRegisterToken = (token: string) => {
  if (!token) {
    sessionStorage.removeItem(REGISTER_TOKEN_KEY)
    return
  }
  sessionStorage.setItem(REGISTER_TOKEN_KEY, token)
}

export const getRegisterToken = () => {
  return sessionStorage.getItem(REGISTER_TOKEN_KEY) ?? ''
}

export const clearRegisterToken = () => {
  sessionStorage.removeItem(REGISTER_TOKEN_KEY)
}
