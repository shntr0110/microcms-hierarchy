import type React from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import style from './BaseDetailsDisclosure.module.scss'
import type { DetailsDisclosureOptions } from './types.ts'
import { defaultOptions, handleAfterPrint, handleBeforePrint, handleClick, isAnimating } from './utils.ts'

/**
 * BaseDetailsDisclosureのプロパティ
 * アコーディオンコンポーネントの設定とコンテンツを定義します
 */
export interface BaseDetailsDisclosureProps {
  /** アコーディオンの要約部分（クリック可能な見出し部分） */
  summary: React.ReactNode

  /** アコーディオンの内容部分（開閉する本文部分） */
  children: React.ReactNode

  /**
   * アコーディオンのグループ名
   * 同じname属性を持つアコーディオンは一つだけ開くように連動します
   */
  name?: string

  /**
   * アコーディオンのオプション
   * アニメーション時間やイージング、印刷時の動作などをカスタマイズできます
   */
  options?: DetailsDisclosureOptions

  /**
   * アコーディオンの初期状態
   * trueの場合は開いた状態、falseの場合は閉じた状態で初期化されます
   * @default false
   */
  defaultOpen?: boolean

  /**
   * その他のHTMLDetailsElement属性
   * data-*属性やaria-*属性など、任意の追加属性を渡すことができます
   */
  [key: string]: unknown
}

/**
 * ベースとなるアコーディオンコンポーネント
 * アニメーション付きの開閉機能を持ったdetails/summary要素を提供します
 *
 * @component
 * @example
 * ```tsx
 * <BaseDetailsDisclosure
 *   summary="アコーディオンのタイトル"
 *   name="group1"
 *   options={{ duration: 400, printAll: true }}
 * >
 *   アコーディオンの内容
 * </BaseDetailsDisclosure>
 * ```
 *
 * @remarks
 * - 同じname属性を持つアコーディオン間では、一つを開くと他は自動的に閉じます
 * - Web Animations APIを使用したスムーズな開閉アニメーションを提供します
 * - options.printAllがtrueの場合、印刷時に自動的にすべてのアコーディオンが開きます
 */
export const BaseDetailsDisclosure = forwardRef<HTMLDetailsElement, BaseDetailsDisclosureProps>(
  ({ summary, children, name, options = {}, defaultOpen = false, ...props }, ref) => {
    const detailsRef = useRef<HTMLDetailsElement | null>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const mergedOptions = { ...defaultOptions, ...options }

    /**
     * 外部から渡されたrefと内部のrefを統合します
     *
     * @param node - マウントされたdetails要素
     */
    const combinedRef = (node: HTMLDetailsElement) => {
      if (node) {
        detailsRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }
    }

    /**
     * summaryのクリックイベントハンドラ
     * イベントをキャプチャして独自のアニメーション処理を適用します
     *
     * @param event - Reactのマウスイベント
     */
    const onSummaryClick = (event: React.MouseEvent) => {
      if (!detailsRef.current || !panelRef.current) return

      handleClick(event.nativeEvent, detailsRef.current, panelRef.current, mergedOptions, name || null)
    }

    /**
     * 印刷関連のイベントリスナーを設定します
     */
    useEffect(() => {
      const details = detailsRef.current
      const panel = panelRef.current

      if (!details || !panel) return

      // 印刷関連のイベントリスナー
      if (mergedOptions.printAll) {
        const detailsName = name || null
        const beforePrintHandler = () => handleBeforePrint(details, detailsName)
        const afterPrintHandler = () => handleAfterPrint(details, detailsName)

        window.addEventListener('beforeprint', beforePrintHandler)
        window.addEventListener('afterprint', afterPrintHandler)

        return () => {
          window.removeEventListener('beforeprint', beforePrintHandler)
          window.removeEventListener('afterprint', afterPrintHandler)
        }
      }
    }, [name, mergedOptions.printAll])

    return (
      <div className={style.BaseDetailsDisclosure}>
        <details className={style._body} ref={combinedRef} name={name} open={defaultOpen} {...props}>
          <summary className={style._summary} onClick={onSummaryClick}>
            {summary}
          </summary>
          <div ref={panelRef}>
            <div className={style._content}>{children}</div>
          </div>
        </details>
      </div>
    )
  }
)

// displayName設定
BaseDetailsDisclosure.displayName = 'BaseDetailsDisclosure'

export type { DetailsDisclosureOptions } from './types.ts'
export { useDetailsDisclosure } from './useDetailsDisclosure.ts'
export default BaseDetailsDisclosure
