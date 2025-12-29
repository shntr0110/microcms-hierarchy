import type { Config } from '@markuplint/ml-config'

// markuplintを使用するための必須Node.jsバージョンは v18.18.0以上なため、”fnm use v20.12.0 ”コマンドを使用してNode.jsのバージョンを変更してください。

// Markuplint FAQ: https://markuplint.dev/ja/docs/guides/faq

const config: Config = {
  // 推奨プリセットにはすべての基本プリセット（https://markuplint.dev/ja/docs/guides/presets#base-presets）が含まれています。かつ、markuplint:recommended以外の推奨プリセットにはそれぞれ固有のルールセット（https://markuplint.dev/ja/docs/guides/presets#syntax-specific-presets）を持っています。
  // 基本プリセット：
  // markuplint:a11y
  // markuplint:html-standard
  // markuplint:performance
  // markuplint:rdfa
  // markuplint:security
  extends: ['markuplint:recommended'],

  // プラグインをつかうことでHTML以外の構文にも適用できます。
  parser: {
    '.astro$': '@markuplint/astro-parser',
    '.[jt]sx$': '@markuplint/jsx-parser'
  },
  // スペックプラグインが必要な理由は、例えばネイティブのHTML要素にはkey属性は存在しないが、ReactやVueを使うときにはその固有の属性をつかうことが推奨されているから。（https://markuplint.dev/ja/docs/guides/besides-html#why-need-the-spec-plugins）
  specs: {
    '.[jt]sx$': '@markuplint/react-spec'
  },

  // ルールの詳細一覧（https://markuplint.dev/ja/docs/rules）
  // ルールの除外設定（https://markuplint.dev/ja/docs/guides/ignoring-code）
  // 推奨プリセットに含まれているかつ、trueものは省略
  rules: {
    // --- markuplint:recommended-react 固有のルール ---
    // id属性が動的でない場合に警告する。
    'no-hard-code-id': false,
    // 特殊文字の参照（例: &amp;）を強制する。
    'character-reference': true,

    // --- Jamstackテンプレートのルール ---
    //属性名が大文字小文字のどちらかに統一されていないと警告
    'case-sensitive-attr-name': false,
    // 存在しない属性であったり、無効な型の値だった場合に警告
    'invalid-attr': true,
    // 属性値が引用符で囲われていない場合に警告
    'attr-value-quotes': false,
    // 指定された規則に則ったクラス名でなければ警告
    'class-naming': false,
    // 空のパルパブルコンテンツ要素があれば警告(https://markuplint.dev/ja/docs/rules/no-empty-palpable-content)
    'no-empty-palpable-content': false,
    // 	タグ名が小文字に統一されていないと警告（外来要素は対象外）。
    'case-sensitive-tag-name': 'lower',
    // label要素にコントロールがない場合に警告。関連付けられていないラベルを見つけるために使用する。また、label要素に関連付けられるのは最初のコントロールのみであるため、その後にコントロールがある場合は警告。
    'label-has-control': false,
    // 指定された属性が要素に影響を与えることができない（つまり無意味である）場合は警告
    'ineffective-attr': false,
    // イベントハンドラ属性を指定すると警告。Reactでは必須なのでfalseに設定。
    'no-use-event-handler-attr': false,
    // 箇条書き文字”・”がテキストノードの先頭にある場合は、リスト要素を使用するように警告。リストとして解釈されることを期待する文字などを以下に指定する。
    'use-list': [],
    // 属性にデフォルト値を指定したときに警告
    'no-default-value': false
  },

  // 部分的なルールの適用：（https://markuplint.dev/ja/docs/guides/applying-rules#applying-to-some）
  // セレクタの理解：（https://markuplint.dev/ja/docs/guides/selectors）
  // セレクタをnodeRulesプロパティに設定して、構造の一部にのみルールを適用できます。
  nodeRules: [],
  // セレクタをchildNodeRulesプロパティに設定して、構造の一部にのみルールを適用できます。childNodeRulesは対象要素の子要素（inheritanceを設定すれば子孫も含む）に対して適用されます。
  childNodeRules: []
}

export default config
