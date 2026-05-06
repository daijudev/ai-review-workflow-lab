import type { ReviewPriority, ReviewStatus } from '../../types'

interface StatusBadgeProps {
  status: ReviewStatus
}

const statusConfig: Record<ReviewStatus, { label: string; className: string }> = {
  pending: {
    label: '未対応',
    className: 'bg-yellow-100 text-yellow-800',
  },
  in_review: {
    label: 'レビュー中',
    className: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: '完了',
    className: 'bg-green-100 text-green-800',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: ReviewPriority
}

const priorityConfig: Record<ReviewPriority, { label: string; className: string }> = {
  high: {
    label: '高',
    className: 'bg-red-100 text-red-800',
  },
  medium: {
    label: '中',
    className: 'bg-orange-100 text-orange-800',
  },
  low: {
    label: '低',
    className: 'bg-gray-100 text-gray-600',
  },
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      優先度: {config.label}
    </span>
  )
}
