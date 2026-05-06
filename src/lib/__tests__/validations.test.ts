import { describe, it, expect } from 'vitest'
import {
  validateTitle,
  validatePrUrl,
  validateReviewer,
  validateAuthor,
  validateReviewRequest,
} from '../validations'

describe('validateTitle', () => {
  it('空文字の場合はエラーを返す', () => {
    expect(validateTitle('')).toBe('タイトルを入力してください')
  })

  it('スペースのみの場合はエラーを返す', () => {
    expect(validateTitle('   ')).toBe('タイトルを入力してください')
  })

  it('4文字の場合はエラーを返す', () => {
    expect(validateTitle('1234')).toBe('タイトルは5文字以上で入力してください')
  })

  it('5文字の場合はnullを返す', () => {
    expect(validateTitle('12345')).toBeNull()
  })

  it('100文字の場合はnullを返す', () => {
    expect(validateTitle('a'.repeat(100))).toBeNull()
  })

  it('101文字の場合はエラーを返す', () => {
    expect(validateTitle('a'.repeat(101))).toBe('タイトルは100文字以内で入力してください')
  })

  it('有効なタイトルの場合はnullを返す', () => {
    expect(validateTitle('ユーザー認証機能の実装')).toBeNull()
  })
})

describe('validatePrUrl', () => {
  it('空文字の場合はエラーを返す', () => {
    expect(validatePrUrl('')).toBe('PR URLを入力してください')
  })

  it('GitHubのURLではない場合はエラーを返す', () => {
    expect(validatePrUrl('https://gitlab.com/org/repo/pull/1')).toBe(
      'GitHub のURLを入力してください'
    )
  })

  it('不正なURL形式の場合はエラーを返す', () => {
    expect(validatePrUrl('not-a-url')).toBe('正しいURLの形式で入力してください')
  })

  it('有効なGitHub PR URLの場合はnullを返す', () => {
    expect(validatePrUrl('https://github.com/org/repo/pull/42')).toBeNull()
  })
})

describe('validateReviewer', () => {
  it('空文字の場合はエラーを返す', () => {
    expect(validateReviewer('')).toBe('レビュアーを入力してください')
  })

  it('有効な値の場合はnullを返す', () => {
    expect(validateReviewer('佐藤 花子')).toBeNull()
  })
})

describe('validateAuthor', () => {
  it('空文字の場合はエラーを返す', () => {
    expect(validateAuthor('')).toBe('実装者を入力してください')
  })

  it('有効な値の場合はnullを返す', () => {
    expect(validateAuthor('田中 太郎')).toBeNull()
  })
})

describe('validateReviewRequest', () => {
  it('すべて空の場合は4つのエラーを返す', () => {
    const errors = validateReviewRequest({
      title: '',
      prUrl: '',
      reviewer: '',
      author: '',
    })
    expect(Object.keys(errors)).toHaveLength(4)
    expect(errors.title).toBeDefined()
    expect(errors.prUrl).toBeDefined()
    expect(errors.reviewer).toBeDefined()
    expect(errors.author).toBeDefined()
  })

  it('すべて有効な場合はエラーなし', () => {
    const errors = validateReviewRequest({
      title: 'ユーザー認証機能の実装',
      prUrl: 'https://github.com/org/repo/pull/1',
      reviewer: '佐藤 花子',
      author: '田中 太郎',
      description: '説明文',
      priority: 'high',
    })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('タイトルのみエラーの場合はtitleのみエラーを返す', () => {
    const errors = validateReviewRequest({
      title: '',
      prUrl: 'https://github.com/org/repo/pull/1',
      reviewer: '佐藤 花子',
      author: '田中 太郎',
    })
    expect(errors.title).toBeDefined()
    expect(errors.prUrl).toBeUndefined()
    expect(errors.reviewer).toBeUndefined()
    expect(errors.author).toBeUndefined()
  })
})
