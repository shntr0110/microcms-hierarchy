/**
 * アコーディオンコンポーネントの設定オプション
 */
export type DetailsDisclosureOptions = {
  /**
   * アニメーションの持続時間（ミリ秒）
   * @default 300
   */
  duration?: number

  /**
   * アニメーションのイージング関数
   * @default 'ease-out'
   */
  easing?: string

  /**
   * 印刷時にすべてのアコーディオンを開くかどうか
   * @default false
   */
  printAll?: boolean
}
