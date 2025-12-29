import debounce from '@/scripts/utils/debounce.js'

/**
 * viewportを一定サイズ以下では固定する
 *
 * @see https://zenn.dev/tak_dcxi/articles/690caf6e9c4e26
 */

const initializeViewport = () => {
  const debouncedResize = debounce(handleResize)
  window.addEventListener('resize', debouncedResize, false)
  debouncedResize()
}

const handleResize = () => {
  const minWidth = 375
  const value = minWidth < window.outerWidth ? 'width=device-width,initial-scale=1' : `width=${minWidth}`
  const viewport = document.querySelector('meta[name="viewport"]')
  if (viewport && viewport.getAttribute('content') !== value) {
    viewport.setAttribute('content', value)
  }
}

export default initializeViewport
