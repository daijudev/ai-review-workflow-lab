import { useState } from 'react'
import { useReviewRequests } from './features/review-requests/hooks/useReviewRequests'
import { ReviewRequestList } from './features/review-requests/components/ReviewRequestList'
import { ReviewRequestForm } from './features/review-requests/components/ReviewRequestForm'
import { Button } from './components/ui/Button'
import type { CreateReviewRequestInput } from './types'

export default function App() {
  const { requests, isLoading, error, addRequest, updateStatus, retry } = useReviewRequests()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleSubmit = (input: CreateReviewRequestInput) => {
    addRequest(input)
    setIsFormOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Review Request Manager</h1>
              <p className="text-xs text-gray-500">AIレビュー運用実践リポジトリ</p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} aria-expanded={isFormOpen}>
              + 新規作成
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {isFormOpen && (
          <section
            aria-label="レビュー依頼作成"
            className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-base font-semibold text-gray-900">新しいレビュー依頼</h2>
            <ReviewRequestForm onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
          </section>
        )}

        <section aria-label="レビュー依頼一覧">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              レビュー依頼一覧
              {!isLoading && !error && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({requests.length}件)
                </span>
              )}
            </h2>
          </div>

          <ReviewRequestList
            requests={requests}
            isLoading={isLoading}
            error={error}
            onStatusChange={updateStatus}
            onRetry={retry}
            onCreateNew={() => setIsFormOpen(true)}
          />
        </section>
      </main>
    </div>
  )
}
