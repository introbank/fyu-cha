introbank
========

## Setup

```bash
npm install
npm start
```

## 仕組み

react componentをサーバサイドとクライアントサイドで使い回すisomorphicな実装。

リクエストが来たらサーバ側(`app.js`)でreact componentをレンダリングしつつ、
クライアント側のjs(`app/*.js`)に必要なパラメータを渡し、
同じコードで実行できるようにしている。

`npm run postinstall`はgulpでクライアント側のjsを生成している。

## 開発スタイル

reactのファイルを変更していく場合は、
`npm start`でnodeを動かしつつ、
`npm run watch`を別で動かし続け、componentsディレクトリ内のファイル変更を監視・自動ビルドしておくと楽。

`npm run watch`は、componentsディレクトリ内のファイルに変更があった場合に自動でビルドを行う。

`npm run build:top`
`npm run build:artist`
`npm run build:group`
は、個別にreact.jsからjsファイルに変換する。

## .scss->.css のコンパイル方法

Sassのインストール
```bash
sudo gem install sass
```

Sassのコンパイル
```bash
sass --watch hogehoge.scss
```
