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

import { MOCK_COMMUNITY_DATA, MOCK_COMMUNITY_SUMMARIES } from '@/data/communityDummy'

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

  try {
    const response = await apiFetch<CommunityListResponse>('/community', {
      method: 'GET',
      withAuth: true,
      query,
      acceptStatuses: [204],
      errorMessage: 'Community list fetch failed.',
    })

    const data = response.data
    // Check if real data exists
    if (
      data &&
      typeof data === 'object' &&
      'posts' in data &&
      Array.isArray(data.posts) &&
      data.posts.length > 0
    ) {
      return data
    }
  } catch (e) {
    console.warn('[Community] API failed, falling back to dummy data', e)
  }

  // Fallback to dummy data
  // Filter by category
  let filtered = MOCK_COMMUNITY_SUMMARIES
  if (params.category !== 'ALL') {
    filtered = filtered.filter((item) => item.category === params.category)
  }

  // Pagination logic simulation
  const size = params.size ?? 10
  let startIndex = 0
  if (params.cursorId) {
    const cursorIdNum = Number(params.cursorId)
    const cursorIndex = filtered.findIndex((item) => (item.postId ?? item.id) === cursorIdNum)
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1
    }
  }

  const sliced = filtered.slice(startIndex, startIndex + size)
  const nextItem = filtered[startIndex + size]
  const nextCursor = nextItem ? String(nextItem.postId ?? nextItem.id) : null

  return {
    posts: sliced,
    pageInfo: {
      nextCursor,
      hasNext: !!nextItem,
    },
  }
}

export const getCommunityDetail = async (communityId: number) => {
  try {
    const response = await apiFetch<CommunityDetailResponse>(`/community/${communityId}`, {
      method: 'GET',
      withAuth: true,
      errorMessage: 'Community detail fetch failed.',
    })

    if (response.data && response.data.post) {
      return response.data
    }
  } catch (e) {
    console.warn('[Community] Detail API failed, falling back to dummy data', e)
  }

  // Fallback
  const post = MOCK_COMMUNITY_DATA.find((p) => p.postId === communityId)
  if (!post) {
    throw new Error('Community post not found (dummy)')
  }

  // Related posts simulation (randomly pick 2 others)
  const relatedPosts = MOCK_COMMUNITY_SUMMARIES.filter((p) => (p.postId ?? p.id) !== communityId)
    .slice(0, 2)
    .map((p) => ({
      id: p.postId,
      postId: p.postId,
      title: p.title,
      thumbnailUrl: p.thumbnailUrl,
      category: p.category,
      previewText: p.previewText,
    }))

  return {
    post,
    relatedPosts,
  }
}

export const searchCommunity = async (keyword: string) => {
  try {
    const response = await apiFetch<CommunitySearchResponse>('/community/search', {
      method: 'GET',
      withAuth: true,
      query: { keyword },
      errorMessage: 'Community search failed.',
    })

    if (response.data && response.data.posts) {
      return response.data
    }
  } catch (e) {
    console.warn('[Community] Search API failed, falling back to dummy data')
  }

  // Search dummy data
  const lowerKeyword = keyword.toLowerCase()
  const matched = MOCK_COMMUNITY_DATA.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerKeyword) ||
      p.content.toLowerCase().includes(lowerKeyword),
  )

  return {
    searchNum: matched.length,
    posts: matched.map((p) => ({
      postId: p.postId,
      title: p.title,
      thumbnailUrl: p.thumbnailUrl,
      category: p.category,
      readingtime: Math.ceil(p.content.length / 500) + '분',
      previewText: p.content.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...',
      writer: p.writer,
      likes: p.likes,
      createdAt: p.createdAt,
    })),
  }
}

export const updateCommunityLike = async (communityId: number, isLiked: boolean) => {
  return apiFetch<{ code: number; message: string }>(`/community/${communityId}/like`, {
    method: 'POST',
    withAuth: true,
    body: { isLiked },
    errorMessage: 'Community like update failed.',
  })
}
