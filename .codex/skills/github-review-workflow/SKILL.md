---
name: github-review-workflow
description: このリポジトリで GitHub Actions の追加や修正、README 同期、gitleaks hook 対応、CODEOWNERS 更新、PR 作成、branch protection の整合調整が必要なときに使います。
---

# GitHub Review Workflow

## Overview

この repo-local skill は、このリポジトリで繰り返し発生する GitHub 運用変更のチェックリストです。コード修正だけでなく、CI、ドキュメント、PR、保護設定の見直しが絡む作業で使います。

## この Skill を使う場面

- `.github/workflows/*.yml` の追加や修正
- CI や review 設定変更に合わせた README 更新
- `gitleaks` を使う pre-commit check のローカル整備
- `.github/CODEOWNERS` の追加や更新
- PR 作成と GitHub Actions 状態確認
- 実在する checks に合わせた branch protection の調整

## Workflow

1. まず現状を確認する。
   - `git status --short --branch` を確認します。
   - `git ls-tree --name-only -r HEAD .github/workflows` で追跡中の workflow を確認します。
   - 編集前に `README.md`、`package.json`、既存 workflow を読みます。
   - この repo では `playwright.config.js`、`tests/`、`backend/*.test.js` も確認します。

2. ローカルにあることと Git 管理されていることを分けて考える。
   - ローカルにはあるのに GitHub に無い workflow は `git check-ignore -v <path>` で確認します。
   - この環境では global ignore により `.github/...` が見落とされることがあります。
   - 必要なら `.github/workflows/test.yml` や `.github/CODEOWNERS` を `git add -f` します。

3. ドキュメントを repo の実態に合わせる。
   - ファイルやディレクトリ追加時は README の構成一覧を更新します。
   - GitHub Actions の挙動を短く説明する節を追加します。
   - CODEOWNERS や branch protection を変えたら運用説明も更新します。

4. commit 前に検証する。
   - 実行可能なローカルテストを回します。
   - ブラウザテストはアプリ不具合と sandbox 制約を分けて考えます。
   - `gitleaks protect --staged --redact --no-banner` を実行します。
   - この repo では通常 `npm test` と `npm run test:e2e` を想定します。

5. secret scan はローカルでも継続できる形を優先する。
   - `.githooks/pre-commit` と `git config --get core.hooksPath` を確認します。
   - `gitleaks` がグローバルに無ければ `.tools/bin/gitleaks` のような repo-local バイナリを使えるようにします。

6. GitHub が認識している check だけを必須化する。
   - `gh workflow list` で workflow を確認します。
   - `gh pr checks <pr>` や `gh pr view <pr> --json statusCheckRollup` で PR checks を確認します。
   - 実行実績のない check 名を branch protection に要求しません。

7. この repo では review 必須を恒久的に要求しない。
   - branch protection は required checks を中心に組みます。
   - `required_pull_request_reviews` は恒久的に `null` を前提にします。
   - review 運用は任意で行い、merge blocker にはしません。

## Node / Playwright メモ

- GitHub Actions では current stable の Node.js を優先します。
- Playwright を使う repo では CI で browser を明示インストールします。
- workflow 手順は失敗箇所が分かる粒度に分けます。
  - dependency install
  - browser install
  - unit / API tests
  - E2E tests
- E2E でローカル web server が必要な場合は、コード変更前に sandbox 制約の可能性を確認します。

## PR 本文テンプレート

次のような短い本文をベースにし、変更内容に合わせて調整します。

```md
## Summary
- GitHub Actions workflow を追加または更新
- README を repo の構成や CI 挙動に合わせて更新
- 必要なら hook や保護設定も整合させる

## Verification
- `npm test`
- `npm run test:e2e`
- `gitleaks protect --staged --redact --no-banner`

## Review Points
- workflow 名が required checks と一致しているか
- README が実際の tracked files と挙動を反映しているか
- 保護設定の変更が GitHub 設定と一致しているか
```

## `gh` Command Examples

- ブランチ作成: `git checkout -b <branch-name>`
- push: `git push -u origin <branch-name>`
- PR 作成: `gh pr create --base main --head <branch-name> --draft --title "<title>" --body-file <file>`
- ready 化: `gh pr ready <pr-number>`
- PR 状態確認: `gh pr checks <pr-number>`
- merge blocker 確認: `gh pr view <pr-number> --json mergeStateStatus,reviewDecision,statusCheckRollup`
- workflow 一覧: `gh workflow list`
- branch ごとの runs 一覧: `gh run list --branch <branch-name>`
- PR マージ: `gh pr merge <pr-number> --merge`

## よく使うコマンド

- `git status --short --branch`
- `git check-ignore -v <path>`
- `git ls-tree --name-only -r HEAD .github/workflows`
- `gh workflow list`
- `gh run list --branch <branch>`
- `gh pr checks <pr>`
- `gh pr view <pr> --json mergeStateStatus,reviewDecision,statusCheckRollup`

## Reference

- この repo で使う branch protection の例は [references/branch-protection.md](references/branch-protection.md) を参照します。
