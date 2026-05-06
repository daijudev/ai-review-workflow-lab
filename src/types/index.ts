export type ReviewStatus = 'pending' | 'in_review' | 'completed'
export type ReviewPriority = 'low' | 'medium' | 'high'

export interface ReviewRequest {
  id: string
  title: string
  description: string
  author: string
  reviewer: string
  status: ReviewStatus
  priority: ReviewPriority
  createdAt: string
  prUrl: string
}

export interface CreateReviewRequestInput {
  title: string
  description: string
  author: string
  reviewer: string
  priority: ReviewPriority
  prUrl: string
}

export type ValidationErrors = Partial<Record<keyof CreateReviewRequestInput, string>>
