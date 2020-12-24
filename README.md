# FEAPMaster概要
基本情報技術者試験(FE)・応用情報技術者試験(AP)の問題を対戦形式で学べるウェブサイト


# リリース版
https://feapmaster.web.app/


# 開発環境構築 (Windows)

## 準備/手順1: git インストール
https://git-scm.com/downloads

## 準備/手順2: Node.js インストール
https://nodejs.org/ja/

## 準備/手順3: GitHubからソースファイルをダウンロード

・ターミナルで以下のコマンドを入力

```sh
git clone "https://github.com/ikei6256/feapmaster.git"
```

## 準備/手順4: パッケージインストール

・ターミナルで以下のコマンドを入力 ( カレントディレクトリ: feapmaster )

```sh
npm install
```

## 実行: 開発サーバを起動

・ターミナルで以下のコマンドを入力 ( カレントディレクトリ: feapmaster )

```sh
npm run serve
```

・コンソールに表示されたアドレスをブラウザで開く ( 例:  http://localhost:8080/ )
