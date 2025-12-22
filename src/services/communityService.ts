import { apiFetch } from '@/services/apiClient'
import type {
  CommunityCategoryPath,
  CommunityDetailResponse,
  CommunityListResponse,
  CommunitySearchResponse,
} from '@/types/community'

type EmptyListResponse = {
  code: number
  message: string
  data: []
}

const mapCategoryPath = (
  category: CommunityCategoryPath | null | undefined,
): CommunityCategoryPath => (category && category !== 'all' ? category : 'all')

const buildCursorQuery = (cursor?: string) => {
  if (!cursor) {
    return undefined
  }
  return { cursor }
}

export const fetchCommunityList = async (
  category: CommunityCategoryPath | null,
  cursor?: string,
): Promise<CommunityListResponse> => {
  const path = `/community/${mapCategoryPath(category)}`

  const response = await apiFetch<CommunityListResponse | EmptyListResponse>(path, {
    method: 'GET',
    withAuth: true,
    query: buildCursorQuery(cursor),
    acceptStatuses: [204],
    errorMessage: 'Community list fetch failed.',
  })

  if (Array.isArray((response as EmptyListResponse).data)) {
    return {
      code: response.code,
      message: response.message,
      data: {
        posts: [],
        pageInfo: {
          nextCursor: null,
          hasNext: false,
        },
      },
    }
  }

  return response as CommunityListResponse
}

export const fetchCommunityDetail = async (
  postId: number,
): Promise<CommunityDetailResponse['data']> => {
  const response = await apiFetch<CommunityDetailResponse>(`/community/${postId}`, {
    method: 'GET',
    withAuth: true,
    errorMessage: 'Community detail fetch failed.',
  })

  return response.data
}

export const fetchCommunitySearch = async (
  keyword: string,
  cursor?: string,
): Promise<CommunitySearchResponse> => {
  const trimmed = keyword.trim()
  const response = await apiFetch<CommunitySearchResponse>(`/community/search`, {
    method: 'GET',
    withAuth: true,
    query: { keyword: trimmed, ...buildCursorQuery(cursor) },
    acceptStatuses: [204],
    errorMessage: 'Community search failed.',
  })

  if (Array.isArray(response.data) || !response.data) {
    return {
      code: response.code,
      message: response.message,
      data: {
        searchNum: 0,
        posts: [],
        pageInfo: { nextCursor: null, hasNext: false },
      },
    }
  }

  return response
}
