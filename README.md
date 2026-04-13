# TODO アプリ

フロントエンドとバックエンドを分離し、Todo を CRUD API 経由で操作する構成に変更しました。

## 構成

```text
todo-example/
├── backend/
│   ├── server.js
│   ├── server.test.js
│   ├── todoStore.js
│   └── todoStore.test.js
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── package.json
└── README.md
```

## API

- `GET /api/todos` : Todo 一覧取得
- `POST /api/todos` : Todo 追加
- `PUT /api/todos/:id` : Todo 更新
- `DELETE /api/todos/:id` : Todo 削除

## 実行方法

```bash
npm start
```

`http://localhost:3000` にアクセスすると、`frontend/` の画面が表示されます。

## テスト

```bash
npm test
```

`todoStore` の単体テストと、CRUD API の疎通テストを実行します。
