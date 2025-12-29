/**
 * 指定された要素以外の要素に対して inert 属性を設定し、元に戻す関数を返す
 * @param element - inert属性を設定しない要素
 * @returns inert属性を元に戻すための関数
 */

const setInert = (element: HTMLElement): (() => void) => {
  const undos: Array<() => void> = []

  crawlSiblingsUp(element, (sibling: HTMLElement) => {
    if (!sibling.inert) {
      sibling.setAttribute('inert', '')
      undos.push(() => {
        sibling.removeAttribute('inert')
      })
    }
  })

  return () => {
    while (undos.length > 0) {
      const undo = undos.pop()
      if (undo) undo()
    }
  }
}

/**
 * 指定された要素の兄弟要素に対してコールバック関数を実行し、再帰的に親要素まで処理を行う
 * @param element - 処理の起点となる要素
 * @param callback - 兄弟要素に対して実行するコールバック関数
 */
const crawlSiblingsUp = (element: HTMLElement, callback: (sibling: HTMLElement) => void): void => {
  if (element.isSameNode(document.body) || !element.parentNode) return

  for (const sibling of Array.from(element.parentNode.children)) {
    if (sibling.isSameNode(element)) {
      crawlSiblingsUp(element.parentNode as HTMLElement, callback)
    } else {
      callback(sibling as HTMLElement)
    }
  }
}

export { setInert, crawlSiblingsUp }
