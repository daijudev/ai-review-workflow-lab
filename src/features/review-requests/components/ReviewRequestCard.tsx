import type { ReviewRequest, ReviewStatus } from '../../../types'
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge'

interface ReviewRequestCardProps {
  request: ReviewRequest
  onStatusChange: (id: string, status: ReviewStatus) => void
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const nextStatusOptions: Record<ReviewStatus, { label: string; value: ReviewStatus } | null> = {
  pending: { label: 'レビュー開始', value: 'in_review' },
  in_review: { label: '完了にする', value: 'completed' },
  completed: null,
}

export function ReviewRequestCard({ request, onStatusChange }: ReviewRequestCardProps) {
  const nextStatus = nextStatusOptions[request.status]

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-900 leading-snug">{request.title}</h2>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600 line-clamp-2">{request.description}</p>

      <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500">
        <div>
          <dt className="font-medium text-gray-700">実装者</dt>
          <dd>{request.author}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">レビュアー</dt>
          <dd>{request.reviewer}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">作成日</dt>
          <dd>{formatDate(request.createdAt)}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between">
        <a
          href={request.prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          aria-label={`${request.title} のPRを開く（外部リンク）`}
        >
          PRを開く →
        </a>

        {nextStatus && (
          <button
            type="button"
            onClick={() => onStatusChange(request.id, nextStatus.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            aria-label={`${request.title} を${nextStatus.label}`}
          >
            {nextStatus.label}
          </button>
        )}
      </div>
    </article>
  )
}
