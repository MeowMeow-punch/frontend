import type { BasicResponse, LoginRequest, LoginResponse } from '@/services/authService'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockLogin = async (payload: LoginRequest): Promise<LoginResponse> => {
  await wait(350)

  const stamp = Date.now()

  return {
    code: 200,
    message: 'Login success',
    data: {
      accessToken: `mock-access-${payload.oauthProvider}-${stamp}`,
      refreshToken: `mock-refresh-${stamp}`,
    },
  }
}

export const mockLogout = async (): Promise<BasicResponse> => {
  await wait(150)

  return {
    code: 200,
    message: 'Logout success',
  }
}
