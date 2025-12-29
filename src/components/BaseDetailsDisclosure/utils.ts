import type { DetailsDisclosureOptions } from './types.ts'

/**
 * アニメーション中かどうかを示すグローバルフラグ
 */
export let isAnimating = false

/**
 * 開閉状態を保存する属性名
 */
export const openStatusAttribute = 'data-open-status'

/**
 * デフォルトのアコーディオンオプション
 */
export const defaultOptions: DetailsDisclosureOptions = {
  duration: 300,
  easing: 'ease-out',
  printAll: false
}

/**
 * アコーディオン開閉のアニメーション処理
 */
export const toggleAccordion = (
  details: HTMLDetailsElement,
  panel: HTMLElement,
  options: DetailsDisclosureOptions,
  detailsName: string | null,
  show: boolean
): void => {
  if (details.open === show) return
  isAnimating = true

  if (detailsName) details.removeAttribute('name')

  if (show) details.open = true

  panel.style.overflow = 'clip'
  panel.style.willChange = 'max-block-size'
  const { blockSize } = window.getComputedStyle(panel)
  const keyframes = show
    ? [{ maxBlockSize: '0' }, { maxBlockSize: blockSize }]
    : [{ maxBlockSize: blockSize }, { maxBlockSize: '0' }]

  const isPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const animationOptions = {
    duration: isPrefersReduced ? 0 : Math.max(0, options.duration || 0),
    easing: options.easing
  }

  const onAnimationEnd = () => {
    requestAnimationFrame(() => {
      panel.style.overflow = ''
      panel.style.willChange = ''
      if (!show) details.open = false
      if (detailsName) details.setAttribute('name', detailsName)
      isAnimating = false
    })
  }

  requestAnimationFrame(() => {
    const animation = panel.animate(keyframes, animationOptions)
    animation.addEventListener('finish', onAnimationEnd)
  })
}

/**
 * 他のアコーディオンを閉じる
 */
export const hideOtherAccordions = (
  details: HTMLDetailsElement,
  options: DetailsDisclosureOptions,
  detailsName: string | null
): void => {
  if (!detailsName) return

  const otherDetails = document.querySelector(`details[name="${detailsName}"][open]`) as HTMLDetailsElement

  if (!otherDetails || otherDetails === details) return

  const otherPanel = otherDetails.querySelector('summary + *') as HTMLElement
  if (!otherPanel) return

  toggleAccordion(otherDetails, otherPanel, options, detailsName, false)
}

/**
 * クリックイベント処理
 */
export const handleClick = (
  event: MouseEvent,
  details: HTMLDetailsElement,
  panel: HTMLElement,
  options: DetailsDisclosureOptions,
  detailsName: string | null
): void => {
  event.preventDefault()
  if (isAnimating) return

  toggleAccordion(details, panel, options, detailsName, !details.open)

  if (details.open) {
    hideOtherAccordions(details, options, detailsName)
  }
}

/**
 * 印刷前処理
 */
export const handleBeforePrint = (details: HTMLDetailsElement, detailsName: string | null): void => {
  if (!details) return

  details.setAttribute(openStatusAttribute, String(details.open))
  if (detailsName) details.removeAttribute('name')
  details.open = true
}

/**
 * 印刷後処理
 */
export const handleAfterPrint = (details: HTMLDetailsElement, detailsName: string | null): void => {
  if (!details) return

  if (detailsName) details.setAttribute('name', detailsName)
  details.open = details.getAttribute(openStatusAttribute) === 'true'
  details.removeAttribute(openStatusAttribute)
}
