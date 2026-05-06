import { useState, useEffect } from 'react'
import type { ReviewRequest, ReviewStatus, CreateReviewRequestInput } from '../../../types'

const MOCK_REQUESTS: ReviewRequest[] = [
  {
    id: '1',
    title: 'ユーザー認証機能の実装（JWT + Refresh Token）',
    description:
      'JWTを使ったログイン・ログアウト機能を実装しました。Refresh Tokenの管理方法について、セキュリティ観点でご確認ください。',
    author: '田中 太郎',
    reviewer: '佐藤 花子',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-05-01T10:00:00Z',
    prUrl: 'https://github.com/example/repo/pull/42',
  },
  {
    id: '2',
    title: 'レビュー依頼一覧ページのページネーション実装',
    description:
      '一覧画面に無限スクロールを追加しました。Intersection Observer APIを使っています。パフォーマンスへの影響を確認してください。',
    author: '鈴木 次郎',
    reviewer: '田中 太郎',
    status: 'in_review',
    priority: 'medium',
    createdAt: '2024-05-02T14:30:00Z',
    prUrl: 'https://github.com/example/repo/pull/43',
  },
  {
    id: '3',
    title: 'フォームバリデーションの共通化',
    description: '各フォームに散在していたバリデーションロジックをカスタムhooksに集約しました。',
    author: '山田 花子',
    reviewer: '鈴木 次郎',
    status: 'completed',
    priority: 'low',
    createdAt: '2024-04-28T09:00:00Z',
    prUrl: 'https://github.com/example/repo/pull/40',
  },
]

interface UseReviewRequestsReturn {
  requests: ReviewRequest[]
  isLoading: boolean
  error: Error | null
  addRequest: (input: CreateReviewRequestInput) => void
  updateStatus: (id: string, status: ReviewStatus) => void
  retry: () => void
}

export function useReviewRequests(): UseReviewRequestsReturn {
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      if (cancelled) return
      // 本番ではここでAPIを呼ぶ
      setRequests(MOCK_REQUESTS)
      setIsLoading(false)
    }, 800)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [retryCount])

  const addRequest = (input: CreateReviewRequestInput) => {
    const newRequest: ReviewRequest = {
      id: crypto.randomUUID(),
      ...input,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setRequests((prev) => [newRequest, ...prev])
  }

  const updateStatus = (id: string, status: ReviewStatus) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
  }

  const retry = () => {
    setRetryCount((c) => c + 1)
  }

  return { requests, isLoading, error, addRequest, updateStatus, retry }
}
