import { useState } from 'react'
import type { CreateReviewRequestInput, ValidationErrors } from '../../../types'
import { validateReviewRequest } from '../../../lib/validations'
import { Button } from '../../../components/ui/Button'

interface ReviewRequestFormProps {
  onSubmit: (input: CreateReviewRequestInput) => void
  onCancel: () => void
}

const INITIAL_FORM: CreateReviewRequestInput = {
  title: '',
  description: '',
  author: '',
  reviewer: '',
  priority: 'medium',
  prUrl: '',
}

interface FieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
        {required && <span className="sr-only">（必須）</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export function ReviewRequestForm({ onSubmit, onCancel }: ReviewRequestFormProps) {
  const [form, setForm] = useState<CreateReviewRequestInput>(INITIAL_FORM)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // 入力時にそのフィールドのエラーをクリア
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateReviewRequest(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    // 本番ではここでAPIを呼ぶ（今はモック）
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSubmit(form)
    setForm(INITIAL_FORM)
    setErrors({})
    setIsSubmitting(false)
  }

  const inputClass = (hasError: boolean) =>
    `block w-full rounded-md border px-3 py-2 text-sm shadow-sm
     focus:outline-none focus:ring-2 focus:ring-indigo-500
     ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500'}`

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="レビュー依頼作成フォーム">
      <div className="space-y-4">
        <Field id="title" label="タイトル" required error={errors.title}>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="例: ユーザー認証機能の実装"
            className={inputClass(!!errors.title)}
            aria-required="true"
            aria-describedby={errors.title ? 'title-error' : undefined}
            aria-invalid={!!errors.title}
          />
        </Field>

        <Field id="description" label="説明">
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="実装内容・レビューしてほしいポイントを記載してください"
            className={inputClass(false)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field id="author" label="実装者" required error={errors.author}>
            <input
              id="author"
              name="author"
              type="text"
              value={form.author}
              onChange={handleChange}
              placeholder="例: 田中 太郎"
              className={inputClass(!!errors.author)}
              aria-required="true"
              aria-describedby={errors.author ? 'author-error' : undefined}
              aria-invalid={!!errors.author}
            />
          </Field>

          <Field id="reviewer" label="レビュアー" required error={errors.reviewer}>
            <input
              id="reviewer"
              name="reviewer"
              type="text"
              value={form.reviewer}
              onChange={handleChange}
              placeholder="例: 佐藤 花子"
              className={inputClass(!!errors.reviewer)}
              aria-required="true"
              aria-describedby={errors.reviewer ? 'reviewer-error' : undefined}
              aria-invalid={!!errors.reviewer}
            />
          </Field>
        </div>

        <Field id="priority" label="優先度">
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClass(false)}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </Field>

        <Field id="prUrl" label="PR URL" required error={errors.prUrl}>
          <input
            id="prUrl"
            name="prUrl"
            type="url"
            value={form.prUrl}
            onChange={handleChange}
            placeholder="https://github.com/org/repo/pull/123"
            className={inputClass(!!errors.prUrl)}
            aria-required="true"
            aria-describedby={errors.prUrl ? 'prUrl-error' : undefined}
            aria-invalid={!!errors.prUrl}
          />
        </Field>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          作成する
        </Button>
      </div>
    </form>
  )
}
