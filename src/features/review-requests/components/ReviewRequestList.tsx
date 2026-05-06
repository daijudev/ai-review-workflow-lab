import type { ReviewRequest, ReviewStatus } from '../../../types'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ReviewRequestCard } from './ReviewRequestCard'

interface ReviewRequestListProps {
  requests: ReviewRequest[]
  isLoading: boolean
  error: Error | null
  onStatusChange: (id: string, status: ReviewStatus) => void
  onRetry: () => void
  onCreateNew: () => void
}

function LoadingSkeleton() {
  return (
    <div aria-label="読み込み中" aria-busy="true">
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-4 animate-pulse rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-3 flex justify-between">
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
          <div className="mb-4 space-y-2">
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-4/5 rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ReviewRequestList({
  requests,
  isLoading,
  error,
  onStatusChange,
  onRetry,
  onCreateNew,
}: ReviewRequestListProps) {
  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
      >
        <p className="mb-3 text-sm font-medium text-red-800">
          データの読み込みに失敗しました
        </p>
        <p className="mb-4 text-sm text-red-600">{error.message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          再試行する
        </button>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        title="レビュー依頼がありません"
        description="新しいレビュー依頼を作成して、チームとのレビューを始めましょう。"
        action={{ label: 'レビュー依頼を作成する', onClick: onCreateNew }}
      />
    )
  }

  return (
    <ul className="space-y-4">
      {requests.map((request) => (
        <li key={request.id}>
          <ReviewRequestCard request={request} onStatusChange={onStatusChange} />
        </li>
      ))}
    </ul>
  )
}
