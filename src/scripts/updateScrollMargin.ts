/**
 * ヘッダーの高さを監視して、スクロールマージン用のCSS変数に設定する関数
 * `scroll-margin-block-start`に設定してヘッダーの高さを考慮する
 * ヘッダーのpositionがfixedまたはstickyの場合のみ高さを設定し、
 * それ以外の場合は0pxを設定する
 */

const updateScrollMargin = (): void => {
  const handleObserver = new ResizeObserver((entries) => {
    const header = entries[0]
    if (!header?.contentBoxSize) return

    const headerStyle = window.getComputedStyle(header.target)
    const position = headerStyle.position

    // positionがfixedまたはstickyの場合のみ、実際の高さを設定
    if (position === 'fixed' || position === 'sticky') {
      const blockSize = header.borderBoxSize ? (header.borderBoxSize[0] as ResizeObserverSize).blockSize : 0
      document.documentElement.style.setProperty('--scroll-margin-block', `${blockSize}px`)
      return
    }

    // それ以外の場合は0pxを設定
    document.documentElement.style.setProperty('--scroll-margin-block', '0px')
  })

  const header = document.querySelector('#header')

  if (header instanceof HTMLElement) handleObserver.observe(header)
}

export default updateScrollMargin
