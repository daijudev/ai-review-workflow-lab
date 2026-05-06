# サンプルPRレビュー事例

このドキュメントは、AIセルフレビューの実際の運用を示すサンプル事例です。
「レビュー依頼作成フォームの実装」というPRを題材に、AIセルフレビューの効果を具体的に示します。

---

## 前提

| 項目 | 内容 |
|------|------|
| PRタイトル | レビュー依頼作成フォームを実装する |
| 実装者 | 田中 太郎 |
| レビュアー | 佐藤 花子 |
| PRの規模 | 変更5ファイル、追加120行、削除5行 |

---

## 1. どんなPRを想定したか

このPRは、レビュー依頼管理アプリに「新規レビュー依頼作成フォーム」を追加する実装です。

実装した機能：
- タイトル・説明・実装者・レビュアー・優先度・PR URLを入力できるフォーム
- 必須項目のバリデーション
- フォーム送信後に一覧へ反映

---

## 2. AIレビュー前の状態（意図的に残した不足点）

以下は「AIレビュー前の初期実装」のサンプルコードです。
このコードにはいくつかの問題が含まれており、AIレビューで検出されることを想定しています。

```tsx
// ❌ AIレビュー前の実装（問題あり）
export function ReviewRequestFormBefore() {
  const [form, setForm] = useState({
    title: '',
    prUrl: '',
    reviewer: '',
    author: '',
    priority: 'medium',
    description: '',
  })
  const [errors, setErrors] = useState({} as any) // ❌ any を使用

  const handleChange = (e: any) => { // ❌ any を使用
    setForm({ ...form, [e.target.name]: e.target.value })
    // ❌ エラーのクリアがない（入力しても前のエラーが残る）
  }

  const handleSubmit = (e: any) => { // ❌ any を使用
    e.preventDefault()
    // ❌ バリデーションがインライン実装（テスト不可・再利用不可）
    const newErrors: any = {}
    if (!form.title) newErrors.title = 'タイトルを入力してください'
    if (!form.reviewer) newErrors.reviewer = 'レビュアーを入力してください'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    // ❌ 二重送信防止がない
    console.log('submit', form) // ❌ console.log が残っている
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {/* ❌ label が input と関連付けられていない */}
        <label>タイトル</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        {/* ❌ エラーに role="alert" がない */}
        {errors.title && <span>{errors.title}</span>}
      </div>
      <div>
        <label>PR URL</label>
        {/* ❌ prUrl のバリデーションがない */}
        <input
          name="prUrl"
          value={form.prUrl}
          onChange={handleChange}
        />
      </div>
      {/* ❌ aria-required / aria-invalid がない */}
      <button type="submit">作成する</button>
    </form>
  )
}
```

---

## 3. AIが指摘したこと

`frontend-review.md` と `accessibility-review.md` のプロンプトを使用してClaude Codeにレビューを依頼しました。

### AIの指摘一覧

| # | 重要度 | 指摘内容 | 対応方針 |
|---|--------|---------|---------|
| 1 | 高 | `any` の使用: `errors`, `handleChange`, `handleSubmit` の型が `any` になっている | **修正する** |
| 2 | 高 | フォームアクセシビリティ: `<label>` の `htmlFor` と `<input>` の `id` が関連付けられていない | **修正する** |
| 3 | 高 | バリデーション関数がインライン実装になっており、テストできない・再利用できない | **修正する** |
| 4 | 中 | エラーメッセージに `role="alert"` がなく、スクリーンリーダーに通知されない | **修正する** |
| 5 | 中 | 入力時にそのフィールドのエラーをクリアしていない（UXの問題） | **修正する** |
| 6 | 中 | PR URLのバリデーションがない（フォーマットチェック・GitHub URLチェック） | **修正する** |
| 7 | 中 | 二重送信防止が実装されていない（送信中にボタンを非活性にする） | **修正する** |
| 8 | 低 | `console.log` がコードに残っている | **修正する** |
| 9 | 低 | フォームのリセット処理が送信成功後にない | **修正する** |
| 10 | 低 | 必須項目の表示（`*` マーク）がスクリーンリーダーに読み上げられない | **修正する** |

---

## 4. 指摘を受けて修正したこと

### 修正1: `any` の排除と型安全化

```tsx
// Before
const [errors, setErrors] = useState({} as any)
const handleChange = (e: any) => { ... }

// After
const [errors, setErrors] = useState<ValidationErrors>({})
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => { ... }
```

### 修正2: バリデーション関数を `src/lib/validations.ts` に切り出し

バリデーションロジックを独立したファイルに移動し、単体テストを追加しました。

```ts
// src/lib/validations.ts
export function validateTitle(title: string): string | null { ... }
export function validatePrUrl(url: string): string | null { ... }
export function validateReviewRequest(input): ValidationErrors { ... }
```

### 修正3: フォームアクセシビリティの改善

```tsx
// Before
<label>タイトル</label>
<input name="title" value={form.title} onChange={handleChange} />

// After
<label htmlFor="title">
  タイトル
  <span aria-hidden="true">*</span>
  <span className="sr-only">（必須）</span>
</label>
<input
  id="title"
  name="title"
  aria-required="true"
  aria-invalid={!!errors.title}
  aria-describedby={errors.title ? 'title-error' : undefined}
  value={form.title}
  onChange={handleChange}
/>
{errors.title && (
  <p id="title-error" role="alert">{errors.title}</p>
)}
```

### 修正4: 二重送信防止の追加

```tsx
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  await submitToApi(form)
  setIsSubmitting(false)
}

<Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
  作成する
</Button>
```

### 修正5: 入力時のエラークリア

```tsx
const handleChange = (e: ...) => {
  const { name, value } = e.target
  setForm((prev) => ({ ...prev, [name]: value }))
  // 入力したフィールドのエラーをクリア
  if (errors[name as keyof ValidationErrors]) {
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }
}
```

---

## 5. 対応しなかった指摘と理由

今回の事例では、AIの指摘はすべて対応しました。
ただし、以下のような「対応しない判断」が発生するケースも示します。

| 指摘内容 | 対応しなかった理由 |
|---------|-----------------|
| （仮）フォームライブラリ（React Hook Form等）への移行を推奨 | このPRのスコープ外。ライブラリ導入はチームで別途議論が必要。別タスク化した |
| （仮）Zodによるスキーマバリデーションへの移行を推奨 | 現時点では手動バリデーションで十分。将来的に検討する |

> **ポイント**: 「対応しない」という判断は、理由を明記すれば問題ありません。
> AIの提案をすべて実装することが目的ではなく、チームにとって最善の判断をすることが大切です。

---

## 6. 人間レビュアーへの確認事項

AIで解決しきれなかった以下の点を、人間レビュアーに確認依頼しました。

### 確認1: バリデーションの仕様確認

```
タイトルのバリデーションを「5文字以上・100文字以内」としましたが、
これはプロダクト仕様として正しいでしょうか？
仕様書に記載が見当たらなかったため、確認をお願いします。
```

### 確認2: PR URLのバリデーション範囲

```
現在「github.com のURLのみ受け付ける」バリデーションを実装していますが、
GitLab等の他のプラットフォームも考慮すべきでしょうか？
```

### 確認3: エラー表示のタイミング

```
現在、バリデーションエラーは「送信時」に表示し、「入力するとクリア」する実装にしました。
「フォーカスを外した時（onBlur）」にバリデーションを走らせる実装の方が好ましいでしょうか？
UX観点でのご意見をお願いします。
```

---

## 7. レビュー往復回数の変化

### AIセルフレビュー導入前（推定）

```
実装完了 → PRを作成 → レビュー依頼
    ↓
レビュアーが指摘（any 使用・アクセシビリティ・バリデーション不足等）
    ↓
修正 → 再レビュー依頼
    ↓
追加指摘（二重送信・エラークリア）
    ↓
修正 → 再レビュー依頼
    ↓
マージ

往復回数: 3回
マージまでの期間: 3〜5日
```

### AIセルフレビュー導入後（今回）

```
実装完了
    ↓
AIセルフレビュー実施（30分）→ 10件の指摘を検出・修正
    ↓
PRを作成（AIレビュー結果・対応内容をテンプレートに記載）
    ↓
レビュアーが仕様・設計の確認に集中
    ↓
軽微な修正（バリデーション仕様の確認）
    ↓
マージ

往復回数: 1回
マージまでの期間: 1〜2日
```

### 効果のまとめ

| 指標 | 導入前 | 導入後 | 改善 |
|------|--------|--------|------|
| レビュー往復回数 | 3回 | 1回 | -66% |
| マージまでの期間 | 3〜5日 | 1〜2日 | -60% |
| AIが検出した問題 | - | 10件 | - |
| 人間レビュアーが追加指摘 | - | 1件（仕様確認） | - |

---

## 8. この事例から学べること

### AIが得意なこと

- 型安全性の問題（`any` の使用・型定義の不備）
- アクセシビリティの基本的なルール（label・ARIA属性）
- コーディング規約（console.log の残存等）
- UXの問題（エラーのクリア・二重送信防止）

### AIが苦手なこと（人間が判断すべきこと）

- バリデーションの仕様（「何文字以上か」はプロダクト判断）
- 対応するプラットフォームの範囲（ビジネス要件）
- UXのトレードオフ（onBlur vs onSubmit のバリデーション）

### 運用のポイント

1. **AIレビューはPRを出す前に実施する**（後からではなく、事前に問題を潰す）
2. **AIの指摘をPRテンプレートに残す**（レビュアーがAIレビューを信頼できるようにする）
3. **対応しない指摘には必ず理由を書く**（「AIが言ったから全部修正」ではなく、チームの判断として残す）
4. **人間レビュアーへの質問を明確にする**（仕様・設計の判断をレビュアーに委ねる）
