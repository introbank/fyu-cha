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

performerのサンプルURL: http://localhost:5000/performers/3062547956
