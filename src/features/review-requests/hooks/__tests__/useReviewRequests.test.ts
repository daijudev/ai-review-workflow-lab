import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReviewRequests } from '../useReviewRequests'

describe('useReviewRequests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('初期状態はloading=trueで、データは空', () => {
    const { result } = renderHook(() => useReviewRequests())
    expect(result.current.isLoading).toBe(true)
    expect(result.current.requests).toHaveLength(0)
    expect(result.current.error).toBeNull()
  })

  it('800ms後にモックデータがロードされる', async () => {
    const { result } = renderHook(() => useReviewRequests())

    await act(async () => {
      vi.advanceTimersByTime(800)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.requests.length).toBeGreaterThan(0)
    expect(result.current.error).toBeNull()
  })

  it('addRequest で新しいレビュー依頼が先頭に追加される', async () => {
    const { result } = renderHook(() => useReviewRequests())

    await act(async () => {
      vi.advanceTimersByTime(800)
    })

    const initialCount = result.current.requests.length

    act(() => {
      result.current.addRequest({
        title: 'テスト用レビュー依頼',
        description: 'テスト説明',
        author: 'テストユーザー',
        reviewer: 'レビュアー',
        priority: 'medium',
        prUrl: 'https://github.com/org/repo/pull/999',
      })
    })

    expect(result.current.requests).toHaveLength(initialCount + 1)
    expect(result.current.requests[0].title).toBe('テスト用レビュー依頼')
    expect(result.current.requests[0].status).toBe('pending')
    expect(result.current.requests[0].id).toBeDefined()
  })

  it('updateStatus でステータスが更新される', async () => {
    const { result } = renderHook(() => useReviewRequests())

    await act(async () => {
      vi.advanceTimersByTime(800)
    })

    const firstRequest = result.current.requests[0]
    expect(firstRequest.status).toBe('pending')

    act(() => {
      result.current.updateStatus(firstRequest.id, 'in_review')
    })

    const updated = result.current.requests.find((r) => r.id === firstRequest.id)
    expect(updated?.status).toBe('in_review')
  })

  it('updateStatus で存在しないIDを指定しても他のデータは変わらない', async () => {
    const { result } = renderHook(() => useReviewRequests())

    await act(async () => {
      vi.advanceTimersByTime(800)
    })

    const before = result.current.requests.map((r) => r.status)

    act(() => {
      result.current.updateStatus('non-existent-id', 'completed')
    })

    const after = result.current.requests.map((r) => r.status)
    expect(after).toEqual(before)
  })

  it('retry を呼ぶと再ロードが始まる', async () => {
    const { result } = renderHook(() => useReviewRequests())

    await act(async () => {
      vi.advanceTimersByTime(800)
    })

    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.retry()
    })

    expect(result.current.isLoading).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(800)
    })

    expect(result.current.isLoading).toBe(false)
  })
})
