# 🎉 TODO アプリ 最終課題

HTML、CSS、JavaScript で構成された Web ベースの TODO リストアプリです。**localStorage** を利用して、タスクをブラウザ内に保存できます。

## ✨ 主な機能

- ✅ 新しい TODO の追加
- ✅ TODO の完了切り替え / 元に戻す
- ✅ TODO の削除
- ✅ `localStorage` による**永続保存**（ページを再読み込みしても保持）
- ✅ シンプルでレスポンシブな UI

## 📁 プロジェクト構成

```
todo-example/
├── index.html      # メインの HTML 構造
├── style.css       # スタイルとアニメーション
├── todoLogic.js    # TODO 操作用のロジック
├── script.js       # コア機能と localStorage 処理
├── script.test.js  # Node.js 組み込みテスト
├── package.json    # テスト実行設定
└── README.md       # このファイル
```

## 🚀 実行方法

`index.html` をブラウザで直接開くか、ローカルサーバーを利用してください。

```bash
# Python3 を使う場合
python3 -m http.server 8000

# Node.js を使う場合
npx http-server .

# PHP を使う場合
php -S localhost:8000
```

アプリは `http://localhost:8000` で利用できます。

## ✅ テスト実行

Node.js が入っていれば、以下でテストを実行できます。

```bash
npm test
```

`todoLogic.js` に切り出した TODO の追加、完了切り替え、削除、空データ除外を検証しています。

## 🎨 UI デザインの特徴

- モダンなカード型レイアウト
- なめらかなトランジションとホバー効果
- 完了済み TODO を見分けやすい視覚表現
- モバイル表示にも対応したレスポンシブ設計
- 角丸を活かしたすっきりしたタイポグラフィ

## 💾 データ保存

データはすべて、ブラウザの `localStorage` に `todo_list_data` というキーで保存されます。

```javascript
const data = {
  "todos": [
    {
      "text": "Buy groceries",
      "completed": false
    },
    {
      "text": "Learn JavaScript",
      "completed": true
    }
  ]
};
```

## 📝 TODO リストの実装

アプリでは、TODO 項目をシンプルなオブジェクト配列で管理しています。

```javascript
const todos = [
  { text: "My first todo", completed: false },
  { text: "Learn web development", completed: true }
];
```

## 🛠️ 使用技術

- **HTML5** - セマンティックなマークアップ
- **CSS3** - Flexbox、トランジション、アニメーション
- **JavaScript（Vanilla）** - DOM 操作、localStorage API
- **フレームワーク不使用** - シンプルな構成

## 📜 ライセンス

このプロジェクトはオープンソースで、学習用途向けに公開されています。

---

TODO Team が作成しました。
