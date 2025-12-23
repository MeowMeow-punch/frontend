import { apiFetch } from '@/services/apiClient'

export type CommunityCategory = 'DIET' | 'EXERCISE' | 'NUTRIENT' | 'DISEASE'
export type CommunityCategoryValue = CommunityCategory | 'EXCERCISE' | string

export type CommunitySummary = {
  id?: number
  postId?: number
  category: CommunityCategoryValue
  title: string
  previewText: string
  thumbnailUrl?: string | null
  likes: number
  writer: string
  readingTime?: number | string
  createdAt: string
}

export type CommunityListResponse = {
  code: number
  message: string
  data: {
    posts: CommunitySummary[]
    pageInfo: {
      nextCursor: string | null
      hasNext: boolean
    }
  }
}

export type CommunityDetailPost = {
  postId: number
  title: string
  category: CommunityCategoryValue
  createdAt: string
  likes: number
  thumbnailUrl?: string | null
  writer: string
  content: string
  isLiked: boolean
}

export type CommunityRelatedPost = {
  id?: number
  postId?: number
  title: string
  thumbnailUrl?: string | null
  category: CommunityCategoryValue
  previewText: string
}

export type CommunityDetailResponse = {
  code: number
  message: string
  data: {
    post: CommunityDetailPost
    relatedPosts: CommunityRelatedPost[]
  }
}

export type CommunitySearchPost = {
  postId: number
  title: string
  thumbnailUrl?: string | null
  category: CommunityCategoryValue
  readingTime?: number | string
  previewText: string
  writer: string
  likes: number
  createdAt: string
}

export type CommunitySearchResponse = {
  code: number
  message: string
  data: {
    searchNum: number
    posts: CommunitySearchPost[]
  }
}

const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? ''

const normalizeBase = (base: string) => (base.endsWith('/') ? base.slice(0, -1) : base)
const normalizePath = (path: string) => (path.startsWith('/') ? path.slice(1) : path)

export const resolveCommunityImageUrl = (path?: string | null) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  if (!IMAGE_BASE_URL) return path
  return `${normalizeBase(IMAGE_BASE_URL)}/${normalizePath(path)}`
}

export const getCommunityList = async (params: {
  category: string
  cursorId?: string | null
  size?: number
}) => {
  const query: Record<string, string | number> = { category: params.category }
  if (params.cursorId) {
    query.cursorId = params.cursorId
  }
  if (params.size !== undefined) {
    query.size = params.size
  }

  const response = await apiFetch<CommunityListResponse>('/community', {
    method: 'GET',
    withAuth: true,
    query,
    acceptStatuses: [204],
    errorMessage: 'Community list fetch failed.',
  })

  const data = response.data
  if (!data || typeof data !== 'object' || !('posts' in data)) {
    return { posts: [], pageInfo: { nextCursor: null, hasNext: false } }
  }

  return data
}

export const getCommunityDetail = async (communityId: number) => {
  const response = await apiFetch<CommunityDetailResponse>(`/community/${communityId}`, {
    method: 'GET',
    withAuth: true,
    errorMessage: 'Community detail fetch failed.',
  })

  return response.data
}

export const searchCommunity = async (keyword: string) => {
  const response = await apiFetch<CommunitySearchResponse>('/community/search', {
    method: 'GET',
    withAuth: true,
    query: { keyword },
    errorMessage: 'Community search failed.',
  })

  return response.data
}

export const updateCommunityLike = async (communityId: number, isLiked: boolean) => {
  return apiFetch<{ code: number; message: string }>(`/community/${communityId}/like`, {
    method: 'POST',
    withAuth: true,
    body: { isLiked },
    errorMessage: 'Community like update failed.',
  })
}
