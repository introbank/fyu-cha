introbank
========

## Setup

```bash
npm install
npm run build
npm start
```
## 仕組み

react componentをサーバサイドとクライアントサイドで使い回すisomorphicな実装。

リクエストが来たらサーバ側(`app.js`)でreact componentをレンダリングしつつ、
クライアント側のjs(`app/*.js`)に必要なパラメータを渡し、
同じコードで実行できるようにしている。

`npm run build`はgulpでクライアント側のjsを生成している。

## サンプル

performerのサンプルURL: http://localhost:5000/performers/aina_BiSH

編集ボタンは2回押さないと効き始めない。

profileのサンプルURL: http://localhost:5000/profile/shogo
