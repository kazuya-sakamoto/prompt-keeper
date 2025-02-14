# prompt-keeper

コードファイルに紐づけて AI プロンプトを管理する CLI ツール。

## インストール

```bash
npm install -g prompt-keeper
```

## 使用方法

### プロンプトの追加

```bash
prompt-keeper set <ファイルパス> <プロンプト> [オプション]
```

#### オプション

- `-m, --model <model>`: AI モデルを指定（例：gpt-4）

#### 例

```bash
# モデル指定あり
prompt-keeper set ./src/MyComponent.tsx "Reactでカウンターコンポーネントを実装して" --model gpt-4

# モデル指定なし
prompt-keeper set ./src/MyComponent.tsx "Reactでフォームコンポーネントを実装して"
```

### 生成されるファイル

指定したコードファイルと同じディレクトリに、`{ファイル名}.prompt.json`という形式でプロンプトファイルが生成されます。

例：`MyComponent.tsx` → `MyComponent.prompt.json`

```json
{
  "file": "src/MyComponent",
  "prompts": [
    {
      "id": "uuid",
      "prompt": "Reactでカウンターコンポーネントを実装して",
      "model": "gpt-4",
      "createdAt": "2025-02-14T15:00:45.008Z",
      "version": 1
    }
  ]
}
```

## 特徴

- 📝 コードファイルごとにプロンプト履歴を管理
- 🔢 バージョン管理機能
- 🤖 AI モデルの指定が可能
- 🔍 プロンプトをコードと別ファイルで管理

## ライセンス

ISC
