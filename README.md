# TODO アプリ

フロントエンドとバックエンドを分離し、Todo を CRUD API 経由で操作する構成です。バックエンドの保存先には SQLite を使います。

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

## データ保存

- 実行時の Todo データは `backend/todos.sqlite` に保存されます
- SQLite の初期テーブル作成はアプリ起動時に自動で行われます
- 初回起動時のみサンプル Todo を投入します

## UML 図

参考: [UMLの８種類を解説（クラス図、シーケンス図、アクティビティ図など）](https://products.sint.co.jp/ober/blog/uml-type)

参考記事で紹介されている UML のうち、この Todo アプリでは「利用者が何をできるか」を整理するユースケース図、「主要な責務と依存関係」を示すクラス図、「Todo を追加するときの処理順序」を示すシーケンス図が特に有効です。

### ユースケース図

```mermaid
flowchart LR
    user[利用者]
    subgraph todoApp[TODO アプリ]
        view(一覧を見る)
        create(Todo を追加する)
        update(Todo を更新する)
        complete(Todo を完了/未完了にする)
        remove(Todo を削除する)
    end

    user --> view
    user --> create
    user --> update
    user --> complete
    user --> remove
```

### クラス図

```mermaid
classDiagram
    class Browser {
        +renderTodos(todos)
        +refreshTodos()
        +createTodo(text)
        +updateTodo(id, payload)
        +deleteTodo(id)
    }

    class RequestListener {
        +handleApiRequest(req, res, requestUrl, store)
        +handleStaticRequest(res, pathname)
    }

    class TodoStore {
        +list()
        +create(text)
        +update(id, updates)
        +remove(id)
        +close()
    }

    class SQLite {
        todos table
    }

    Browser --> RequestListener : HTTP /api/todos
    RequestListener --> TodoStore : uses
    TodoStore --> SQLite : persists
```

### シーケンス図

```mermaid
sequenceDiagram
    actor User as 利用者
    participant Frontend as frontend/script.js
    participant Server as backend/server.js
    participant Store as backend/todoStore.js
    participant DB as SQLite

    User->>Frontend: Todo を入力して送信
    Frontend->>Server: POST /api/todos { text }
    Server->>Store: create(text)
    Store->>DB: INSERT INTO todos
    DB-->>Store: lastInsertRowid
    Store->>DB: SELECT id, text, completed
    DB-->>Store: 追加済み Todo
    Store-->>Server: todo
    Server-->>Frontend: 201 Created { todo }
    Frontend->>Server: GET /api/todos
    Server->>Store: list()
    Store->>DB: SELECT id, text, completed
    DB-->>Store: todos
    Store-->>Server: todos
    Server-->>Frontend: 200 OK { todos }
    Frontend-->>User: 更新後の一覧を表示
```

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
