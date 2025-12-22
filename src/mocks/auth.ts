import type {
  BasicResponse,
  GroupSearchResponse,
  LoginRequest,
  LoginResponse,
} from '@/services/authService'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const NICKNAME_STORAGE_KEY = 'mock_nicknames_v1'

const getStoredNicknames = () => {
  const raw = localStorage.getItem(NICKNAME_STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

const normalizeNickname = (value: string) => value.trim().toLowerCase()

const MOCK_GROUPS = [
  { groupId: 1, groupName: 'SSAFY Seoul Campus' },
  { groupId: 2, groupName: 'SSAFY Daejeon Campus' },
  { groupId: 3, groupName: 'SSAFY Gumi Campus' },
  { groupId: 4, groupName: 'SSAFY Busan Campus' },
]

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

export const mockCheckNickname = async (nickname: string): Promise<BasicResponse> => {
  await wait(150)

  const trimmed = nickname.trim()
  if (!trimmed) {
    return {
      code: 400,
      message: 'Invalid nickname.',
    }
  }

  const storedNicknames = getStoredNicknames()
  const normalized = normalizeNickname(trimmed)
  const isDuplicate = storedNicknames.some((item) => normalizeNickname(item) === normalized)

  if (isDuplicate) {
    return {
      code: 409,
      message: 'Nickname already in use.',
    }
  }

  return {
    code: 200,
    message: 'Nickname available.',
  }
}

export const mockSearchGroups = async (keyword: string): Promise<GroupSearchResponse> => {
  await wait(200)

  const trimmed = keyword.trim().toLowerCase()
  const matches = MOCK_GROUPS.filter((group) => group.groupName.toLowerCase().includes(trimmed))

  return {
    code: 200,
    message: 'Group search success',
    data: matches,
  }
}
