import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    withAuth?: boolean
    skipAuthRefresh?: boolean
    _retry?: boolean
  }
}
