# Branch Protection Patterns

## この repo の恒久設定

この repo では required checks は維持しつつ、review 必須は恒久的に要求しません。

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["gitleaks", "test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": false
}
```

## 適用前の確認

- workflow ファイルはローカルにあるだけでなく Git で追跡されている必要があります。
- required check にする前に、対象 workflow が default branch 上に存在している必要があります。
- check 名は推測せず、実際の PR 実行結果から確認します。
- review は任意で使えますが、merge blocker にはしません。
