import debounce from '@/scripts/utils/debounce.js'
import { setInert } from '@/scripts/utils/setInert.js'
import throttle from '@/scripts/utils/throttle.js'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import styles from './Drawer.module.css'

/**
 * 要素とその祖先要素に対してObserverを適用する関数
 *
 * @param element - 監視対象の要素
 * @param observer - 使用するObserver
 * @param config - Observerの設定（ResizeObserverの場合はnull）
 * @param maxDepth - 遡る親要素の最大深さ
 */
function observeElementAndParents<T extends ResizeObserver | MutationObserver | IntersectionObserver>(
  element: HTMLElement | null,
  observer: T,
  config: T extends ResizeObserver
    ? null
    : T extends IntersectionObserver
      ? IntersectionObserverInit
      : MutationObserverInit,
  maxDepth = 10
): void {
  if (!element) return

  // 要素自体を監視
  if (observer instanceof ResizeObserver) {
    observer.observe(element)
  } else if (observer instanceof MutationObserver) {
    observer.observe(element, config as MutationObserverInit)
  } else if (observer instanceof IntersectionObserver) {
    observer.observe(element)
  }

  // 必要な親要素も監視（最大深さまで）
  let parent = element.parentElement
  let depth = 0

  while (parent && depth < maxDepth) {
    if (observer instanceof ResizeObserver) {
      observer.observe(parent)
    } else if (observer instanceof MutationObserver) {
      observer.observe(parent, config as MutationObserverInit)
    }
    // IntersectionObserverは親要素に対しては適用しない

    parent = parent.parentElement
    depth++
  }
}

/**
 * フォーカスを要素に設定する関数
 * Safari18.4以降のfocusVisibleオプションに対応
 *
 * @param element - フォーカスを設定する要素
 */
const setFocusWithoutIndicator = (element: HTMLElement | null): void => {
  if (!element || !('focus' in element) || typeof element.focus !== 'function') return

  try {
    // TypeScriptの型システムでは対応していないプロパティなので、型を明示的に定義
    interface FocusOptions {
      focusVisible?: boolean
    }
    ;(element.focus as (options?: FocusOptions) => void)({ focusVisible: false })
  } catch (_error) {
    // フォールバック: 古いブラウザでは通常のfocusを実行
    element.focus()
  }
}

/**
 * 要素が実際に表示されているかを再帰的に確認する関数
 *
 * 自身または祖先要素が display:none, visibility:hidden, opacity:0 のいずれかであれば
 * 非表示とみなす
 *
 * @param element - 確認する要素
 * @returns 要素が表示されていればtrue、非表示ならfalse
 */
const isElementVisible = (element: HTMLElement | null): boolean => {
  // 要素が存在しない場合
  if (!element) return false

  // コンピューテッドスタイルを取得
  const style = window.getComputedStyle(element)

  // 非表示条件をチェック
  if (style.display === 'none' || style.visibility === 'hidden' || Number.parseInt(style.opacity, 10) === 0) {
    return false
  }

  // 親要素をチェック (documentまたはドキュメントボディに到達するまで)
  if (
    element.parentElement &&
    element.parentElement !== document.documentElement &&
    element.parentElement !== document.body
  ) {
    return isElementVisible(element.parentElement)
  }

  // すべてのチェックをパスしたら表示されている
  return true
}

/**
 * ドロワーメニューの状態を管理するためのカスタムフック
 *
 * @returns ドロワーメニューの状態管理オブジェクト
 */
const useDrawerState = () => {
  const [isOpened, setIsOpened] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const undoInertRef = useRef<(() => void) | null>(null)

  /**
   * 背景固定の切り替え
   * FirefoxではscrollingElementに`overflow: clip`が機能しないため`hidden`を使用
   * @param fixed - 固定するかどうか
   */
  const toggleBackfaceFixed = useCallback((fixed: boolean) => {
    const scrollingElement = document.scrollingElement as HTMLElement
    if (!scrollingElement) return

    const scrollBarSize = window.innerWidth - document.documentElement.clientWidth
    const isFirefox = navigator.userAgent.includes('Firefox')

    scrollingElement.style.borderInlineEnd = fixed ? `${scrollBarSize}px solid transparent` : ''
    scrollingElement.style.overflow = fixed ? (isFirefox ? 'hidden' : 'clip') : ''
  }, [])

  /**
   * メニューの表示状態を切り替える
   * @param open - 開くかどうか
   */
  const toggleMenu = useCallback(
    (open: boolean) => {
      setIsOpened(open)
      const body = bodyRef.current

      if (open) {
        if (body) {
          body.removeAttribute('hidden')
        }

        // ドロワー要素以外にinert属性を設定
        requestAnimationFrame(() => {
          if (containerRef.current) {
            undoInertRef.current = setInert(containerRef.current)
          }
        })

        toggleBackfaceFixed(true)
      } else {
        if (body) {
          body.setAttribute('hidden', '')
        }

        // inert属性を元に戻す
        requestAnimationFrame(() => {
          if (undoInertRef.current) {
            undoInertRef.current()
            undoInertRef.current = null
          }
        })

        toggleBackfaceFixed(false)
      }
    },
    [toggleBackfaceFixed]
  )

  /**
   * 要素の表示状態を確認し、必要に応じてメニューを閉じる
   */
  const checkVisibility = useCallback(() => {
    if (!containerRef.current) return

    // 要素またはその祖先が非表示になった場合はメニューを閉じる
    if (!isElementVisible(containerRef.current) && isOpened) {
      console.log('Closing as the drawer menu has been hidden.')
      toggleMenu(false)
    }
  }, [isOpened, toggleMenu])

  return {
    isOpened,
    containerRef,
    bodyRef,
    buttonRef,
    undoInertRef,
    toggleMenu,
    checkVisibility
  }
}

/**
 * ドロワーメニューコンポーネント
 *
 * ヘッダー部分に配置するハンバーガーメニューで、クリックするとドロワーメニューが開く
 * ESCキーやページ内リンク(#始まり)をクリックした際は自動的に閉じる
 *
 * ## 機能
 * - ハンバーガーボタンをクリックしてドロワーメニューの開閉
 * - ESCキーでメニューを閉じる
 * - ページ内リンク(#始まり)クリック時にメニューを閉じる
 * - メニュー表示時は背景スクロールを固定
 * - メニュー表示時はinert属性を使用して他の要素との相互作用を無効化
 * - 表示状態の変化を監視（IntersectionObserver, MutationObserver）して、親要素が非表示の時はメニューを閉じる
 *
 * ## アクセシビリティ対応
 * - aria-haspopup, aria-expanded, aria-controlsを使用したメニューの状態管理
 * - キーボード操作（ESCキー）でのメニュー閉じる機能
 * - メニュー表示時の背面コンテンツを不活性化（inert属性使用）
 *
 * @returns Reactコンポーネント
 */
const Drawer = () => {
  const uuid = useId()
  const { isOpened, containerRef, bodyRef, buttonRef, undoInertRef, toggleMenu, checkVisibility } = useDrawerState()

  /**
   * ボタンクリック時の処理
   * @param event - イベントオブジェクト
   */
  const handleButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      toggleMenu(!isOpened)

      // フォーカスを設定
      setFocusWithoutIndicator(buttonRef.current)
    },
    [isOpened, toggleMenu, buttonRef]
  )

  /**
   * キーダウン時の処理
   * @param event - キーボードイベント
   */
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (isOpened && event.key === 'Escape') {
        toggleMenu(false)

        // フォーカスを設定
        setFocusWithoutIndicator(buttonRef.current)
      }
    },
    [isOpened, toggleMenu, buttonRef]
  )

  /**
   * リンククリック時の処理（ページ内リンクの場合はドロワーを閉じる）
   *
   * @param event - マウスイベント
   */
  const handleLinkClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')

      if (link?.href?.includes('#')) {
        // ページ内リンク（#で始まるもの）がクリックされた場合
        toggleMenu(false)
      }
    },
    [toggleMenu]
  )

  // イベントリスナーの設定
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)

    // ドロワー内のリンククリックイベントリスナーを設定
    if (bodyRef.current) {
      bodyRef.current.addEventListener('click', handleLinkClick)
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown)

      // リンククリックイベントリスナーを解除
      if (bodyRef.current) {
        bodyRef.current.removeEventListener('click', handleLinkClick)
      }

      // クリーンアップ
      if (undoInertRef.current) {
        undoInertRef.current()
      }
    }
  }, [handleKeydown, handleLinkClick, bodyRef, undoInertRef])

  // 表示状態の監視設定
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // デバウンスされた表示状態チェック
    const debouncedVisibilityCheck = debounce(() => {
      checkVisibility()
    })

    // スロットリングされた表示状態チェック（定期的な確認用）
    const throttledVisibilityCheck = throttle(500, () => {
      if (isOpened) {
        checkVisibility()
      }
    })

    /**
     * IntersectionObserverの設定
     * 要素の可視性を直接検出できる
     */
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        // 要素が不可視状態になったらチェック
        if (entries.some((entry) => !entry.isIntersecting)) {
          debouncedVisibilityCheck()
        }
      },
      {
        // 少しでも見えなくなったら検出するための閾値設定
        threshold: 0
      }
    )

    // 要素の可視性を監視
    intersectionObserver.observe(container)

    // MutationObserverの設定 (スタイル変更を検出)
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'style' ||
            mutation.attributeName === 'class' ||
            mutation.attributeName === 'hidden')
        ) {
          debouncedVisibilityCheck()
          break
        }
      }
    })

    // コンポーネント自身と祖先要素のスタイル変更を監視
    const observerConfig = {
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden']
    }

    // コンポーネントとその親要素を監視
    observeElementAndParents(container, mutationObserver, observerConfig as MutationObserverInit, 10)

    // 定期的なチェック (他の検出方法でカバーできない変更のためのセーフティネット)
    const intervalId = window.setInterval(throttledVisibilityCheck, 500)

    // クリーンアップ
    return () => {
      window.clearInterval(intervalId)
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [containerRef, checkVisibility, isOpened])

  return (
    <div className={styles.root} ref={containerRef}>
      <button
        className={styles.button}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpened}
        aria-controls={uuid}
        ref={buttonRef}
        onClick={handleButtonClick}
        aria-label="メニュー"
      >
        <span aria-hidden="true" />
      </button>
      <div id={uuid} className={styles.body} ref={bodyRef} hidden={isOpened ? undefined : true}>
        <div className={styles.sidebar}>
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <a className={styles.link} href="/">
                リンクテキスト
              </a>
            </li>
            <li className={styles.menuItem}>
              <a className={styles.link} href="/">
                リンクテキスト
              </a>
            </li>
            <li className={styles.menuItem}>
              <a className={styles.link} href="/">
                リンクテキスト
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Drawer
