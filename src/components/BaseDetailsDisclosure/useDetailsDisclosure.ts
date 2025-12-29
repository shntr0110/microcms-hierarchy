import { useCallback, useMemo, useRef } from 'react'
import type { DetailsDisclosureOptions } from './types.ts'
import { defaultOptions, handleAfterPrint, handleBeforePrint, handleClick } from './utils.ts'

type InitializedElements = {
  summary: HTMLElement | null
  detailsContent: HTMLElement | null
}

/**
 * 既存のdetails要素にアコーディオン機能を追加するためのフック
 * @param options アコーディオンのオプション
 * @returns 初期化関数を含むオブジェクト
 */
export const useDetailsDisclosure = (options: DetailsDisclosureOptions = {}) => {
  // オプションをメモ化して再レンダリング時に同じ参照を保持する
  const mergedOptions = useMemo(() => {
    return { ...defaultOptions, ...options }
  }, [options])
  const initializedDetailsRef = useRef<Map<HTMLDetailsElement, InitializedElements>>(new Map())

  /**
   * 指定されたdetails要素から関連要素を取得
   */
  const getRelatedElements = useCallback((details: HTMLDetailsElement): InitializedElements => {
    // キャッシュされた要素がある場合はそれを返す
    if (initializedDetailsRef.current.has(details)) {
      return initializedDetailsRef.current.get(details) as InitializedElements
    }

    const summary = details.querySelector('summary') as HTMLElement
    const detailsContent = summary?.nextElementSibling as HTMLElement

    // 取得した要素をキャッシュ
    initializedDetailsRef.current.set(details, { summary, detailsContent })

    return { summary, detailsContent }
  }, [])

  /**
   * クリックイベントハンドラを設定
   */
  const setupClickHandler = useCallback(
    (details: HTMLDetailsElement, summary: HTMLElement, detailsContent: HTMLElement) => {
      const detailsName = details.getAttribute('name') || null

      const clickHandler = (event: MouseEvent) => {
        handleClick(event, details, detailsContent, mergedOptions, detailsName)
      }

      // 既存のイベントリスナーを削除（重複を防ぐ）
      summary.removeEventListener('click', clickHandler, false)
      // 新しいイベントリスナーを追加
      summary.addEventListener('click', clickHandler, false)

      return clickHandler
    },
    // mergedOptionsはuseMemoで安定した参照を持つためそのまま依存配列に含めることができる
    [mergedOptions]
  )

  /**
   * 印刷イベントハンドラを設定
   */
  const setupPrintHandlers = useCallback(
    (details: HTMLDetailsElement) => {
      if (!mergedOptions.printAll) return { beforePrintHandler: null, afterPrintHandler: null }

      const detailsName = details.getAttribute('name') || null

      const beforePrintHandler = () => handleBeforePrint(details, detailsName)
      const afterPrintHandler = () => handleAfterPrint(details, detailsName)

      window.addEventListener('beforeprint', beforePrintHandler)
      window.addEventListener('afterprint', afterPrintHandler)

      return { beforePrintHandler, afterPrintHandler }
    },
    // printAllプロパティのみを依存配列に含める
    [mergedOptions.printAll]
  )

  /**
   * details要素を初期化する関数
   * @param details 初期化する詳細要素
   */
  const initializeDetailsDisclosure = useCallback(
    (details: HTMLDetailsElement): (() => void) => {
      if (!details) {
        console.error('initializeDetailsDisclosure: Details element is not found.')
        return () => {
          // クリーンアップ不要
        }
      }

      const { summary, detailsContent } = getRelatedElements(details)

      if (!summary || !detailsContent) {
        console.error('initializeDetailsDisclosure: Elements required for initializeDetailsDisclosure are not found.')
        return () => {
          // クリーンアップ不要
        }
      }

      // クリックハンドラの設定
      const clickHandler = setupClickHandler(details, summary, detailsContent)

      // 印刷ハンドラの設定
      const { beforePrintHandler, afterPrintHandler } = setupPrintHandlers(details)

      // クリーンアップ関数を返す
      return () => {
        summary.removeEventListener('click', clickHandler, false)

        if (beforePrintHandler) {
          window.removeEventListener('beforeprint', beforePrintHandler)
        }

        if (afterPrintHandler) {
          window.removeEventListener('afterprint', afterPrintHandler)
        }

        initializedDetailsRef.current.delete(details)
      }
    },
    [getRelatedElements, setupClickHandler, setupPrintHandlers]
  )

  return { initializeDetailsDisclosure }
}

export default useDetailsDisclosure
