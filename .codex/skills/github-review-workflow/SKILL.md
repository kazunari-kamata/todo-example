---
name: github-review-workflow
description: Use when this repository needs GitHub Actions setup or repair, README synchronization, gitleaks hook support, CODEOWNERS updates, PR creation, and branch protection alignment.
---

# GitHub Review Workflow

## Overview

This repo-local skill is a checklist for repeatable GitHub workflow changes in this repository. Use it when code changes also require CI, documentation, PR, or review-policy work.

## Use This Skill For

- Adding or fixing `.github/workflows/*.yml`
- Updating README after CI or review-policy changes
- Making `gitleaks`-based pre-commit checks usable locally
- Adding or updating `.github/CODEOWNERS`
- Creating PRs and checking GitHub Actions status
- Aligning branch protection with the checks that actually exist

## Workflow

1. Inspect current state first.
   - Check `git status --short --branch`.
   - Check which workflow files are tracked with `git ls-tree --name-only -r HEAD .github/workflows`.
   - Read `README.md`, `package.json`, and existing workflow files before editing.
   - For this repo, also check `playwright.config.js`, `tests/`, and `backend/*.test.js`.

2. Treat local files and tracked files as different things.
   - If a workflow exists locally but not on GitHub, verify with `git check-ignore -v <path>`.
   - In this environment, global git ignore rules may hide `.github/...` files.
   - If needed, use `git add -f` for `.github/workflows/test.yml` or `.github/CODEOWNERS`.

3. Keep docs aligned with the repo.
   - Update README structure listings when files or directories are added.
   - Add a short section for GitHub Actions behavior.
   - Add a short section for review policy when CODEOWNERS or branch protection changes.

4. Validate before commit.
   - Run local tests when feasible.
   - For browser tests, distinguish real failures from sandbox port restrictions.
   - Run `gitleaks protect --staged --redact --no-banner` before commit.
   - In this repo, the expected local checks are usually `npm test` and `npm run test:e2e`.

5. Prefer resilient local secret scanning.
   - Inspect `.githooks/pre-commit` and `git config --get core.hooksPath`.
   - If `gitleaks` is not globally installed, support a repo-local binary such as `.tools/bin/gitleaks`.

6. Only require checks that GitHub can already see.
   - Confirm workflows with `gh workflow list`.
   - Confirm PR checks with `gh pr checks <pr>` or `gh pr view <pr> --json statusCheckRollup`.
   - Do not require a check name in branch protection until it has run on GitHub.

7. Handle bootstrap PRs carefully.
   - If review rules block the PR that introduces review infrastructure, a temporary relaxation may be needed.
   - Restore the stricter branch protection immediately after merge.

## Node And Playwright Notes

- Prefer a current stable Node version in GitHub Actions.
- If the repo uses Playwright, install the browser explicitly in CI.
- Keep workflow steps separate enough that failed phases are obvious:
  - dependency install
  - browser install
  - unit and API tests
  - E2E tests
- If E2E requires a local web server, check whether sandbox restrictions are the reason for failure before changing application code.

## PR Template

Use a short body like this and adapt only what changed.

```md
## Summary
- add or update GitHub Actions workflows
- update README to match the repository and CI behavior
- align review or hook settings if needed

## Verification
- `npm test`
- `npm run test:e2e`
- `gitleaks protect --staged --redact --no-banner`

## Review Points
- workflow names match required checks
- README reflects actual tracked files and behavior
- review policy changes match branch protection
```

## `gh` Command Examples

- Create branch: `git checkout -b <branch-name>`
- Push branch: `git push -u origin <branch-name>`
- Create PR: `gh pr create --base main --head <branch-name> --draft --title "<title>" --body-file <file>`
- Mark ready: `gh pr ready <pr-number>`
- Check PR status: `gh pr checks <pr-number>`
- Inspect merge blockers: `gh pr view <pr-number> --json mergeStateStatus,reviewDecision,statusCheckRollup`
- List workflows: `gh workflow list`
- List runs for a branch: `gh run list --branch <branch-name>`
- Merge PR: `gh pr merge <pr-number> --merge`

## Preferred Commands

- `git status --short --branch`
- `git check-ignore -v <path>`
- `git ls-tree --name-only -r HEAD .github/workflows`
- `gh workflow list`
- `gh run list --branch <branch>`
- `gh pr checks <pr>`
- `gh pr view <pr> --json mergeStateStatus,reviewDecision,statusCheckRollup`

## Reference

- See [references/branch-protection.md](references/branch-protection.md) for branch protection payload examples used in this repo.
