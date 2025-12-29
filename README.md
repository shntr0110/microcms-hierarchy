# Astro テンプレート

このリポジトリは Astro ベースのプロジェクトテンプレートです。最新のウェブ開発ツールとベストプラクティスを組み合わせて、効率的な開発体験を提供します。

## 🚀 特徴

- [Astro](https://astro.build/) - 高速なウェブサイト構築のためのオールインワンフレームワーク
- [React](https://react.dev/) - UIコンポーネント構築のためのライブラリ
- [TypeScript](https://www.typescriptlang.org/) - 静的型付けによる安全なコーディング
- [Biome](https://biomejs.dev/) - 高速な JavaScript/TypeScript のリンター・フォーマッター
- [Markuplint](https://markuplint.dev/) - マークアップ言語のリンター
- [Stylelint](https://stylelint.io/) - CSS/SCSSのリンター
- [Prettier](https://prettier.io/) - コードフォーマッター

## 📋 ツール選定の理由

### Biome と Stylelint

Biomeのリンター・フォーマッターとして採用されていますが、SCSSのサポートが含まれていません。現状の社内の技術スタックにはSCSSが含まれているため、CSS/SCSSのリンターにはStylelintを採用しています。

### Biome と Prettier

Biomeは`.astro`ファイルのフロントマター部分のフォーマットにしか対応していません。そのため、HTML部分のフォーマットにはPrettierとprettier-plugin-astroプラグインを使用しています。

## 🚧 プロジェクト構造

```text
/
├── public/           # 静的アセット
├── src/              # ソースコード
│   ├── components/   # 再利用可能なコンポーネント
│   ├── layouts/      # レイアウトコンポーネント
│   └── pages/        # ページコンポーネント（ルーティング）
└── 設定ファイル      # 各種ツールの設定ファイル
```

## 🔧 コマンド

| コマンド                      | 説明                                                  |
| :---------------------------- | :---------------------------------------------------- |
| `npm install`                 | 依存関係をインストール                                |
| `npm run dev`                 | 開発サーバーを起動 (`localhost:4321`)                 |
| `npm run build`               | 本番用ビルドを `./dist/` に生成                       |
| `npm run preview`             | ビルドしたサイトをローカルでプレビュー                |
| `npm run lint`                | Biome を使用してコードをリント                        |
| `npm run lint:fix`            | Biome を使用してコードの問題を自動修正                |
| `npm run format`              | Biome を使用してコードをフォーマットチェック          |
| `npm run format:fix`          | Biome を使用してコードを自動フォーマット              |
| `npm run format:prettier`     | Prettier を使用して .astro ファイルをチェック         |
| `npm run format:prettier:fix` | Prettier を使用して .astro ファイルを自動フォーマット |
| `npm run lint:style`          | Stylelint を使用して SCSS/CSS をリント                |
| `npm run lint:style:fix`      | Stylelint を使用して SCSS/CSS の問題を自動修正        |
| `npm run lint:markup`         | Markuplint を使用してマークアップをリント             |
| `npm run lint:all`            | すべてのリンターとフォーマッターを実行                |
| `npm run lint:allfix`         | すべてのリンターとフォーマッターで問題を自動修正      |

## 🔍 品質管理ツール

- **Biome**: JavaScript と TypeScript のコードをリントおよびフォーマット
- **Stylelint**: SCSS と CSS のコードスタイルを強制
- **Markuplint**: HTML、JSX、.astro ファイルなどのマークアップを検証
- **Prettier**: .astro ファイルのフォーマットを担当

## 🧪 制作を始める

```bash
# リポジトリをクローン
git clone [repository-url]

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```
