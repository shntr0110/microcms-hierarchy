import { client } from '@/lib/microcms/microcms.ts'
import type { Entry, Page } from './type.ts'

/**
 * 全てのページを取得する
 * @param void
 * @returns {Promise<Page[]>} 全てのページデータ
 */
export const fetchAllPages = async (): Promise<Page[]> => {
  const limit = 100
  let offset = 0
  const allPages: Page[] = []

  while (true) {
    const res = await client.getList<Page>({
      endpoint: 'pages',
      queries: {
        limit,
        offset,
        fields: 'id,slug,parent.id'
      }
    })

    allPages.push(...res.contents)

    if (allPages.length >= res.totalCount) break
    offset += limit
  }

  return allPages
}

/**
 * 親ページのIDから子ページのマップを構築する
 * @param {Page[]} pages 全てのページデータ
 * @returns {Map<string | null, Page[]>} 親ページIDをキー、子ページ配列を値とするマップ
 */
export const buildChildrenMap = (pages: Page[]) => {
  const map = new Map<string | null, Page[]>()

  for (const page of pages) {
    const parentId = page.parent?.id ?? null
    const children = map.get(parentId) ?? []
    children.push(page)
    map.set(parentId, children)
  }

  return map
}

/**
 * 全てのページのパスを再帰的に生成する
 * @param {Map<string | null, Page[]>} childrenMap 親ページIDをキー、子ページ配列を値とするマップ
 * @param {string | null} parentId 現在の親ページID（デフォルトはnull(ルートレベル)）
 * @param {string[]} basePath 現在のパスのベース配列（デフォルトは空配列）
 * @returns {string[]} 全てのページのパス配列
 */
export const generateAllPathsFromMap = (
  childrenMap: Map<string | null, Page[]>,
  parentId: string | null = null,
  basePath: string[] = []
): Entry[] => {
  const children = childrenMap.get(parentId) ?? []
  const out: Entry[] = []
  for (const child of children) {
    const current = [...basePath, child.slug]
    out.push({ fullPath: current.join('/'), pageId: child.id })
    out.push(...generateAllPathsFromMap(childrenMap, child.id, current))
  }
  return out
}

/**
 * ページIDからページデータを取得する
 * @param {string} pageId ページID
 * @returns {Promise<Page>} ページのデータ
 */
export const getPageById = async (pageId: string): Promise<Page> => {
  return await client.getListDetail({ endpoint: 'pages', contentId: pageId })
}
