# Field Notes

公開研究ノート。Astro 7 + TypeScript + Content Collections / Markdown・MDX。

公開先は **https://hughman0909.github.io/notes/**、別サイトのポートフォリオは **https://hughman0909.github.io/portfolio/** です。GitHubリポジトリ名は `notes` を想定しています。

## 開発

Node.js 22.23.4以降を使用します。

```sh
npm install
npm run dev
```

開発URL: `http://127.0.0.1:4321/notes/`。全文検索は本番ビルド後に生成されます。

```sh
npm run check
npm run build
npm run preview
```

`build` は静的HTML生成、Pagefind索引生成、内部リンク・画像・サイトマップの存在確認まで行います。`npm test` で生成済み `dist` のリンクを再確認できます。

`package-lock.json` はGitに含めてください。CIは `npm ci` で固定された依存関係をインストールします。esbuildとsharpのインストールスクリプトは `package.json` の `allowScripts` でインストール済みバージョンに限定して許可しています。

## 記事の追加

```text
src/content/posts/my-research/
  index.md       # .mdx も利用可
  screenshot.png
```

```markdown
---
title: 調査ノートのタイトル
description: 記事の概要
date: 2026-11-18
type: article
tags: [Reverse Engineering, Obfuscation]
draft: false
---

## はじめに

記事本文。

![解析画面](./screenshot.png)
```

- `type: article` → `/notes/articles/my-research/`
- `type: writeup` → `/notes/writeups/my-research/`
- `draft: true` → 一覧・詳細・検索に出力しません。
- `sample: true` → `npm run dev` でのみ一覧・詳細に表示します。本番ビルド・検索・サイトマップからは除外します。
- スラッグはフォルダ名です。英小文字とハイフンを推奨します。
- タグページはタグから自動生成します。同じタグは表記を統一してください。
- 同梱の3記事は架空の説明用サンプルです。フォルダごとGitの対象外で、公開ビルドにも含めません。`npm run dev` で表示を確認できます。実記事は新しいフォルダに作成してください。
- 記事内リンクは `/notes/` を含めるか相対URLを使用します。MDXでは `import.meta.env.BASE_URL` も使えます。

### コード・数式・図

言語を指定したコードフェンスはShikiで着色され、コピーボタンが付きます。

数式は `$S_{t+1}$`、独立した数式は `$$ ... $$` で記述できます。

Mermaidは `mermaid` のコードフェンスを使います。図のある記事だけレンダラを読み込み、strictモードで表示します。JavaScriptが無効な場合はソースが残ります。GhidraやCFGの画像は記事と同じディレクトリに置き、相対パスで参照します。

## GitHub Pages公開

1. GitHubに `hughman0909/notes` リポジトリを作成します。
2. 本ディレクトリを `main` ブランチにpushします。
3. リポジトリの **Settings → Pages → Source → GitHub Actions** を選択します。
4. `Deploy Field Notes` ワークフローが成功すると `/notes/` に公開されます。

```sh
git init -b main
git add .
git commit -m "Build Field Notes research journal"
git remote add origin https://github.com/hughman0909/notes.git
git push -u origin main
```

GitHub CLIで認証が必要な場合は `gh auth login -h github.com` を実行してください。

別のリポジトリ名や独自ドメインを使う場合は `astro.config.mjs` の `site` / `base`、`scripts/check-build.mjs` の `base` を変更します。

## ポートフォリオとの接続

Field Notesのヘッダーとフッターからポートフォリオにリンク済みです。既存ポートフォリオのナビゲーションにも次のリンクを追加すると相互リンクになります。

```html
<a href="https://hughman0909.github.io/notes/">Field Notes ↗</a>
```

既存ポートフォリオ用の差分は `docs/portfolio-link.patch` に用意しています。ポートフォリオのリポジトリで `git apply /Users/hughman090/article_web/docs/portfolio-link.patch` を実行し、内容を確認してpushするとリンクを追加できます。

ポートフォリオのファイルはこのリポジトリには含めていません。背景 `#111418`、サーフェス `#20262C`、グリーン `#97B4A3` は既存CSSに合わせています。

## デザインと挙動

- ホームは図を置かず、巨大なタイポグラフィと余白で構成。スクロールに合わせて見出しが最大28px縦・24px横にゆっくり移動します。
- モバイルは1カラム、目次は折りたたみ。Heroのスクロール連動は停止し、本文の登場モーションは移動量を減らします。
- 記事一覧・本文の段落・画像は画面に入る際に一度だけ控えめに登場。読み進めている本文を継続して動かさず、コードや表は固定します。JavaScriptが無効でも全内容を表示します。
- `prefers-reduced-motion` でアニメーション・滑らかなスクロールを停止。
- 右側の目次、読み進捗、コードコピー、キーボード対応の画像拡大。
- `/` キーで検索、Escapeでダイアログを閉じます。
- SEOメタ情報、canonical、PNGのOGP、サイトマップを生成。
- Inter / Noto Sans JP / JetBrains MonoはGoogle Fontsから取得。接続不可時はシステムフォントを使います。

## この環境での検証状況

Astro 7.4.12 / MDX 8.1.6 / Mermaid 12.3.0 / KaTeX 0.18.10への更新を確認済みです。型チェックは22ファイルでエラー・警告0件、KaTeX回帰テスト2件は成功しました。本番ビルドは12ページの静的生成、3記事のPagefind索引生成、内部リンク・アセット165件の検証に成功しています。ブラウザ表示は未検証です。

ユーザー提供の更新後の監査結果では、picomatch由来の14件のhighが残っています。criticalは報告されていません。picomatchには確認時点で公式修正版がないため未解決です。`npm audit fix --force` はAstro 5.3.0へのダウングレードを提案するので実行しません。

GitHub CLIの既存認証が無効だったため、リポジトリ作成・push・公開は未実施です。

参考: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) / [Astro GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

## 依存関係のセキュリティ更新

Astroを `^7.4.12`、対応するMDXを `^8.1.6`、Mermaidを `^12.3.0` に変更しました。Astro 7の既定Markdownパイプライン変更に対応し、`@astrojs/markdown-remark` の `unified()` を明示しています。Zodは `astro/zod` から読み込みます。既存の空白処理を維持するため `compressHTML: true` を指定しています。

KaTeXは修正版の `^0.18.2` に更新済みです。旧バージョンで失敗していた継承された `trust` に対するセキュリティ回帰テストは、更新後の0.18.10で成功しています。rehype-katexとmicromark-extension-mathが旧KaTeXを要求するため、一時的に `overrides.katex: "$katex"` で依存先も同じバージョンに統一します。これは上流の指定範囲外の更新を含むため、以下の回帰テストと数式を含むサンプル記事のビルドを確認してください。監査レポートを隠す設定は追加していません。

```sh
npm install
npm install-scripts ls
npm run check
node --test tests/math.test.mjs
npm run build
npm audit
```

更新されたesbuild・sharpなどが新たにインストールスクリプトの許可を求めた場合は、`npm install-scripts ls` で対象バージョンを確認してから、そのパッケージだけを許可してください。旧バージョンへの許可が自動で新バージョンにも適用されることはありません。

更新後の `package-lock.json` を `package.json` と一緒にコミットしてください。CIはこのロックで `npm ci` を実行します。

picomatchのGHSA-fc5q-39xc-vjpfは確認時点で修正版がありません。Astro以外に `@astrojs/check` からも依存するため、Astroを更新するだけで監査が0件になるとは限りません。本サイトには外部入力のglobを受け付ける機能がなく、GitHub Pagesには生成された静的ファイルのみを公開しますが、ビルド依存としては残り得ます。再監査結果に基づいて継続対応します。

参考: [Astro 7移行ガイド](https://docs.astro.build/en/guides/upgrade-to/v7/) / [KaTeX修正版](https://github.com/advisories/GHSA-238p-pmpm-9mq7) / [picomatchの未修正アドバイザリ](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)

## 外部掲載のWriteup

Zennなどで公開済みの記事は、本文を転載せず `externalUrl` を指定して登録できます。

```yaml
---
title: 外部に掲載したWriteup
description: 記事の紹介
date: 2026-11-18
type: writeup
tags: [CTF, Reverse Engineering]
externalUrl: https://zenn.dev/your-account/articles/your-article
---
```

ホーム・Writeups・タグ一覧から掲載先に直接移動し、外部サイト名と矢印を表示します。外部記事用のローカル詳細ページは生成せず、外部記事の本文は全文検索の対象にしません。URLはHTTPSのみ受け付けます。

PortfolioのGit履歴にあったZennの2本（SECCON Beginners CTF 2026 / FFRI × NFLabs. Cybersecurity Challenge 2026）を登録済みです。公開日はZenn上の公開日を使用しています。

リンクはNotes内（`/notes/` 配下）なら同じタブ、Zenn・GitHub・Portfolioなど外部の掲載先なら新しいタブで開きます。Markdown本文の外部リンクにもビルド時に `target="_blank"` と `rel="noopener noreferrer"` を付与します。

## 公開しないファイル

`.gitignore` で同梱サンプル3フォルダ、`src/content/posts/sample*/`、`.env`・`.env.*`（例示ファイルを除く）、鍵ファイル、ローカル設定、生成物を除外しています。`sample: true` の記事はフォルダ名に関係なく公開ビルドから除外し、`npm run dev` でのみ表示します。

未公開の原稿・画像・メモはルートの `private/` または `drafts/` に置いてください。これらはGit対象外で、記事の読込元や公開アセットのディレクトリにも含まれません。`public/` の内容はそのまま配信されるので、非公開ファイルを置かないでください。

`draft: true` はページ生成を止める設定で、Gitへの登録は止めません。`.gitignore` も任意のファイルの秘密情報を自動判定するものではなく、`git add -f` では無視設定を上書きできます。すでに追跡・公開したファイルや過去の履歴から情報を消す機能もありません。この作業ディレクトリにはまだGitリポジトリがないため、既存の追跡解除は行っていません。

Hero下部の「LATEST NOTE」は、公開時は下書きとサンプルを除いた最新記事を1件表示します。開発時はサンプルも表示対象になります。外部記事は新しいタブ、Notes内の記事は同じタブで開きます。
