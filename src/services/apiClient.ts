import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { clearTokens, getAccessToken, setAccessToken } from '@/services/tokenStore'

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  withAuth?: boolean
  headers?: Record<string, string>
  body?: unknown
  query?: Record<string, string | number | boolean>
  acceptStatuses?: number[]
  errorMessage?: string
  skipGlobalError?: boolean
}

type ApiErrorPayload = {
  code?: number
  message?: string
}

type RefreshResponse = {
  code: number
  message: string
  data: {
    accessToken: string
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

const applyAuthHeader = (config: InternalAxiosRequestConfig, token: string) => {
  if (!token) {
    return
  }

  config.headers = AxiosHeaders.from(config.headers ?? {})
  config.headers.set('Authorization', `Bearer ${token}`)
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.withAuth) {
    applyAuthHeader(config, getAccessToken())
  }
  return config
})

let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async () => {
  const response = await apiClient.request<RefreshResponse, AxiosResponse<RefreshResponse>>({
    url: '/auth/refresh',
    method: 'POST',
    withAuth: true,
    skipAuthRefresh: true,
  })

  const accessToken = response.data?.data?.accessToken ?? ''
  if (!accessToken) {
    throw new Error('Token refresh failed.')
  }

  setAccessToken(accessToken)
  return accessToken
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const status = error.response?.status
    const request = error.config as InternalAxiosRequestConfig | undefined

    if (!request || status !== 401 || request.skipAuthRefresh || !request.withAuth) {
      return Promise.reject(error)
    }

    if (request._retry) {
      clearTokens()
      return Promise.reject(error)
    }

    request._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
      }
      const newToken = await refreshPromise
      refreshPromise = null

      applyAuthHeader(request, newToken)

      return apiClient.request(request)
    } catch (refreshError) {
      refreshPromise = null
      clearTokens()
      // 토큰 갱신 실패 시 로그인 페이지로 이동 (쿼리로 현재 경로 전달 가능)
      const currentPath = window.location.pathname
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      return Promise.reject(refreshError)
    }
  },
)

// Global Error Handler Interceptor (New)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // router instance 동적 import 또는 router/index.ts에서 가져오기
    // 순환 참조 방지를 위해 여기서 router를 직접 import
    const status = error.response?.status
    const config = error.config as InternalAxiosRequestConfig & { skipGlobalError?: boolean }

    // skipGlobalError 옵션이 있으면 리다이렉트 안 함
    if (config?.skipGlobalError) {
      return Promise.reject(error)
    }

    // 1. Network Error (서버 다운, 인터넷 연결 끊김 등)
    if (!error.response && error.code !== 'ERR_CANCELED') {
      window.location.href = '/error/network'
      return Promise.reject(error)
    }

    // 2. Server Error (5xx)
    if (status && status >= 500) {
      // 503 등 일시적 장애 포함하여 500 페이지로
      window.location.href = '/error/500'
      return Promise.reject(error)
    }

    // 3. Unauthorized (401)
    if (status === 401) {
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // 3. Forbidden (403)
    if (status === 403) {
      window.location.href = '/error/403'
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

export const apiFetch = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured.')
  }

  const {
    method = 'GET',
    withAuth = false,
    headers = {},
    body,
    query,
    acceptStatuses = [],
    errorMessage = 'Request failed.',
    skipGlobalError = false,
  } = options

  const requestHeaders = new AxiosHeaders({
    'Content-Type': 'application/json',
    ...headers,
  })

  const config: AxiosRequestConfig & { skipGlobalError?: boolean } = {
    url: path,
    method,
    headers: requestHeaders,
    params: query,
    data: body,
    withAuth,
    validateStatus: (status) =>
      Boolean(status && status >= 200 && status < 300) || acceptStatuses.includes(status ?? 0),
    skipGlobalError,
  }

  try {
    const response = await apiClient.request<T, AxiosResponse<T>>(config)

    if (response.status === 204 && acceptStatuses.includes(204)) {
      return { code: 204, message: 'No Content', data: [] } as T
    }

    return response.data
  } catch (err) {
    if (axios.isAxiosError<ApiErrorPayload>(err)) {
      const status = err.response?.status
      const errorPayload = err.response?.data as unknown
      const contentType = err.response?.headers?.['content-type']
      const payload =
        typeof errorPayload === 'object' && errorPayload !== null
          ? (errorPayload as ApiErrorPayload)
          : undefined
      const rawBody =
        typeof errorPayload === 'string'
          ? errorPayload.slice(0, 500)
          : errorPayload
            ? JSON.stringify(errorPayload).slice(0, 500)
            : undefined
      const headers = err.config?.headers as Record<string, string> | undefined
      const hasAuthHeader = Boolean(headers?.Authorization || headers?.authorization)
      console.warn('[apiFetch] request failed', {
        method,
        url: path,
        status,
        code: payload?.code,
        message: payload?.message,
        contentType,
        rawBody,
        hasAuthHeader,
      })
      const message = payload?.message || err.message || errorMessage || 'Request failed.'
      throw new Error(message)
    }

    const fallbackMessage = err instanceof Error ? err.message : errorMessage
    throw new Error(fallbackMessage || errorMessage)
  }
}
