export type CommunityCategoryCode = 'DIET' | 'EXERISE' | 'NUTRIENT' | 'DISEASE'

export type CommunityCategoryPath = 'all' | 'diet' | 'exerise' | 'nutrient' | 'disease'

export type CommunityPostSummary = {
  postId: number
  title: string
  thumbnailUrl: string
  category: CommunityCategoryCode
  readingTime?: number
  previewText: string
  writer: string
  createdAt: string
  likes?: number
  views?: number
}

export type CommunityPageInfo = {
  nextCursor: string | null
  hasNext: boolean
}

export type CommunityListResponse = {
  code: number
  message: string
  data: {
    posts: CommunityPostSummary[]
    pageInfo: CommunityPageInfo
  }
}

export type CommunityDetailPost = {
  postId: number
  title: string
  category: CommunityCategoryCode | string
  createdAt: string
  likes: number
  thumbnailUrl: string
  writer: string
  content: string
  isLiked: boolean
}

export type CommunityRelatedPost = {
  postId: number
  title: string
  thumbnailUrl: string
  category: CommunityCategoryCode
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

export type CommunitySearchResponse = {
  code: number
  message: string
  data: {
    searchNum: number
    posts: CommunityPostSummary[]
    pageInfo: CommunityPageInfo
  }
}
