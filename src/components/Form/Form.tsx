'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'
import styles from './Form.module.scss'

/**  電話番号のバリデーション関数
 * @param {string | undefined} value - バリデーション対象の電話番号
 * @returns {boolean} - 有効な電話番号であればtrue、そうでなければfalse
 * @description
 * 空の値は許可し、有効な電話番号形式（日本の形式）をチェックします。
 * 日本の電話番号形式に対応
 */
const validatePhoneNumber = (value: string | undefined) => {
  if (!value) return true // 空の値は許可
  return isValidPhoneNumber(value, 'JP') // 有効な電話番号かどうかをチェック
}

export default function ContactForm() {
  type Inputs = z.infer<typeof formSchema>
  const formSchema = z.object({
    name: z.string().min(1, '名前は必須です'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    message: z.string().optional(),
    phone: z.string().refine(validatePhoneNumber, {
      message: '有効な電話番号を入力してください'
    }),
    agreement: z.boolean().refine((val) => val === true, {
      message: 'プライバシーポリシーに同意する必要があります'
    }),
    subject: z.enum(['採用', 'メディア依頼', 'その他お問い合わせ'], {
      errorMap: () => ({ message: 'ご用件を選択してください' })
    })
  })
  const [serverSideError, setServerSideError] = useState<string | null>(null)
  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const phoneId = useId()
  const agreementId = useId()
  const nameErrorId = useId()
  const emailErrorId = useId()
  const messageErrorId = useId()
  const phoneErrorId = useId()
  const agreementErrorId = useId()
  const subjectId = useId()
  const radioId01 = useId()
  const radioId02 = useId()
  const radioId03 = useId()
  const radioErrorId = useId()
  const emailExampleId = useId()
  const phoneExampleId = useId()

  const formRef = useRef<HTMLFormElement>(null)
  const formUrl = import.meta.env.PUBLIC_HYPERFORM_ENDPOINT
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      phone: '',
      agreement: false
    }
  })

  /** フォーム送信時の処理
   * @param {Inputs} data - フォームからの入力データ
   * @returns {void}
   * @description
   * 入力データをコンソールに出力します。
   */
  const onSubmit: SubmitHandler<Inputs> = () => {
    if (formRef.current) {
      formRef.current.submit()
    }
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('status')
    setServerSideError(query)
  }, [])

  return (
    <>
      {serverSideError && serverSideError === 'invalid' && (
        <div className={styles.error}>
          <p>エラーが発生しました。</p>
        </div>
      )}
      <div className={styles.formWrap}>
        <form action={formUrl} method="post" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div className={styles.formGroup}>
            <label htmlFor={nameId}>名前</label>
            <input
              id={nameId}
              {...register('name')}
              aria-describedby={errors.name ? nameErrorId : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
              className={styles.input}
            />
            {errors.name && (
              <span className={styles.error} id={nameErrorId} role="alert" aria-live="polite">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={emailId}>メールアドレス</label>
            <p id={emailExampleId}>例：info@example.com</p>
            <input
              id={emailId}
              {...register('email')}
              aria-describedby={`${emailExampleId} ${errors.email ? emailErrorId : ''}`}
              className={styles.input}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <span className={styles.error} id={emailErrorId} role="alert" aria-live="polite">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={phoneId}>電話番号</label>
            <p id={phoneExampleId}>例：080-0000-0000</p>
            <input
              id={phoneId}
              type="tel"
              {...register('phone')}
              aria-describedby={`${phoneExampleId} ${errors.phone ? phoneErrorId : ''}`}
              className={styles.input}
              aria-invalid={errors.phone ? 'true' : 'false'}
            />
            {errors.phone && (
              <span className={styles.error} id={phoneErrorId} role="alert" aria-live="polite">
                {errors.phone.message}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={messageId}>メッセージ</label>
            <textarea
              id={messageId}
              {...register('message')}
              aria-describedby={errors.message && messageErrorId}
              className={styles.textarea}
              aria-invalid={errors.message ? 'true' : 'false'}
            />
            {errors.message && (
              <span className={styles.error} id={messageErrorId} role="alert" aria-live="polite">
                {errors.message.message}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <p id={subjectId}>ご用件</p>
            <div
              role="radiogroup"
              aria-labelledby={`${subjectId} ${errors.subject ? radioErrorId : ''}`}
              aria-invalid={errors.subject ? 'true' : 'false'}
            >
              <label htmlFor={radioId01} className={styles.radioLabel}>
                <input {...register('subject')} type="radio" value="採用" id={radioId01} />
                採用
              </label>
              <label htmlFor={radioId02} className={styles.radioLabel}>
                <input {...register('subject')} type="radio" value="メディア依頼" id={radioId02} />
                メディア依頼
              </label>
              <label htmlFor={radioId03} className={styles.radioLabel}>
                <input {...register('subject')} type="radio" value="その他お問い合わせ" id={radioId03} />
                その他お問い合わせ
              </label>
              {errors.subject && (
                <span className={styles.error} id={radioErrorId} role="alert" aria-live="polite">
                  {errors.subject.message}
                </span>
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkBoxLabel}>
              <input
                type="checkbox"
                {...register('agreement')}
                name="agreement"
                id={agreementId}
                aria-describedby={errors.agreement && agreementErrorId}
                aria-invalid={errors.agreement ? 'true' : 'false'}
              />
              プライバシーポリシーに同意する
            </label>
            <span className={styles.error} id={agreementErrorId}>
              {errors.agreement?.message}
            </span>
          </div>
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            送信
          </button>
        </form>
      </div>
    </>
  )
}
