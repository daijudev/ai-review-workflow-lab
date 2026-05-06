import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewRequestList } from '../ReviewRequestList'
import type { ReviewRequest } from '../../../../types'

const mockRequests: ReviewRequest[] = [
  {
    id: '1',
    title: 'テスト用PR：認証機能実装',
    description: '認証機能を実装しました。',
    author: '田中 太郎',
    reviewer: '佐藤 花子',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-05-01T10:00:00Z',
    prUrl: 'https://github.com/org/repo/pull/1',
  },
  {
    id: '2',
    title: 'テスト用PR：ページネーション実装',
    description: 'ページネーションを実装しました。',
    author: '鈴木 次郎',
    reviewer: '田中 太郎',
    status: 'in_review',
    priority: 'medium',
    createdAt: '2024-05-02T10:00:00Z',
    prUrl: 'https://github.com/org/repo/pull/2',
  },
]

const defaultProps = {
  requests: [],
  isLoading: false,
  error: null,
  onStatusChange: vi.fn(),
  onRetry: vi.fn(),
  onCreateNew: vi.fn(),
}

describe('ReviewRequestList', () => {
  describe('loading状態', () => {
    it('isLoading=trueの場合、スケルトンUIを表示する', () => {
      render(<ReviewRequestList {...defaultProps} isLoading={true} />)
      expect(screen.getByLabelText('読み込み中')).toBeInTheDocument()
    })

    it('isLoading=trueの場合、レビュー依頼カードを表示しない', () => {
      render(
        <ReviewRequestList {...defaultProps} isLoading={true} requests={mockRequests} />
      )
      expect(screen.queryByText('テスト用PR：認証機能実装')).not.toBeInTheDocument()
    })
  })

  describe('error状態', () => {
    it('errorがある場合、エラーメッセージを表示する', () => {
      const error = new Error('ネットワークエラーが発生しました')
      render(<ReviewRequestList {...defaultProps} error={error} />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('ネットワークエラーが発生しました')).toBeInTheDocument()
    })

    it('再試行ボタンをクリックするとonRetryが呼ばれる', async () => {
      const user = userEvent.setup()
      const onRetry = vi.fn()
      const error = new Error('エラー')
      render(<ReviewRequestList {...defaultProps} error={error} onRetry={onRetry} />)

      await user.click(screen.getByRole('button', { name: '再試行する' }))
      expect(onRetry).toHaveBeenCalledOnce()
    })
  })

  describe('empty状態', () => {
    it('requestsが空の場合、空状態メッセージを表示する', () => {
      render(<ReviewRequestList {...defaultProps} requests={[]} />)
      expect(screen.getByText('レビュー依頼がありません')).toBeInTheDocument()
    })

    it('empty状態のCTAボタンをクリックするとonCreateNewが呼ばれる', async () => {
      const user = userEvent.setup()
      const onCreateNew = vi.fn()
      render(<ReviewRequestList {...defaultProps} requests={[]} onCreateNew={onCreateNew} />)

      await user.click(screen.getByRole('button', { name: 'レビュー依頼を作成する' }))
      expect(onCreateNew).toHaveBeenCalledOnce()
    })
  })

  describe('データあり状態', () => {
    it('requestsがある場合、各タイトルを表示する', () => {
      render(<ReviewRequestList {...defaultProps} requests={mockRequests} />)
      expect(screen.getByText('テスト用PR：認証機能実装')).toBeInTheDocument()
      expect(screen.getByText('テスト用PR：ページネーション実装')).toBeInTheDocument()
    })

    it('requestsがある場合、リストアイテムが正しい数表示される', () => {
      render(<ReviewRequestList {...defaultProps} requests={mockRequests} />)
      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(mockRequests.length)
    })

    it('ステータス変更ボタンをクリックするとonStatusChangeが呼ばれる', async () => {
      const user = userEvent.setup()
      const onStatusChange = vi.fn()
      render(
        <ReviewRequestList
          {...defaultProps}
          requests={mockRequests}
          onStatusChange={onStatusChange}
        />
      )

      await user.click(
        screen.getByRole('button', { name: 'テスト用PR：認証機能実装 をレビュー開始' })
      )
      expect(onStatusChange).toHaveBeenCalledWith('1', 'in_review')
    })
  })
})
