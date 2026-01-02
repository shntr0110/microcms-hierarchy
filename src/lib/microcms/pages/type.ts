export type Page = {
  id: string
  title?: string
  slug: string
  parent?: {
    id: string
    title: string
    slug: string
  } | null
}

export type Entry = {
  fullPath: string
  pageId: string
}
