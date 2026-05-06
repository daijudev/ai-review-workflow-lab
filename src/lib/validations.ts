import type { CreateReviewRequestInput, ValidationErrors } from '../types'

export function validateTitle(title: string): string | null {
  if (!title.trim()) return 'タイトルを入力してください'
  if (title.trim().length < 5) return 'タイトルは5文字以上で入力してください'
  if (title.trim().length > 100) return 'タイトルは100文字以内で入力してください'
  return null
}

export function validatePrUrl(url: string): string | null {
  if (!url.trim()) return 'PR URLを入力してください'
  try {
    const parsed = new URL(url.trim())
    if (!parsed.hostname.includes('github.com')) {
      return 'GitHub のURLを入力してください'
    }
  } catch {
    return '正しいURLの形式で入力してください'
  }
  return null
}

export function validateReviewer(reviewer: string): string | null {
  if (!reviewer.trim()) return 'レビュアーを入力してください'
  return null
}

export function validateAuthor(author: string): string | null {
  if (!author.trim()) return '実装者を入力してください'
  return null
}

export function validateReviewRequest(
  input: Partial<CreateReviewRequestInput>
): ValidationErrors {
  const errors: ValidationErrors = {}

  const titleError = validateTitle(input.title ?? '')
  if (titleError) errors.title = titleError

  const prUrlError = validatePrUrl(input.prUrl ?? '')
  if (prUrlError) errors.prUrl = prUrlError

  const reviewerError = validateReviewer(input.reviewer ?? '')
  if (reviewerError) errors.reviewer = reviewerError

  const authorError = validateAuthor(input.author ?? '')
  if (authorError) errors.author = authorError

  return errors
}
