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
      return Promise.reject(refreshError)
    }
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
  } = options

  const requestHeaders = new AxiosHeaders({
    'Content-Type': 'application/json',
    ...headers,
  })

  const config: AxiosRequestConfig = {
    url: path,
    method,
    headers: requestHeaders,
    params: query,
    data: body,
    withAuth,
    validateStatus: (status) =>
      Boolean(status && status >= 200 && status < 300) || acceptStatuses.includes(status ?? 0),
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
