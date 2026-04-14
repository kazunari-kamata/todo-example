# Repository Agents

## Repo-Local Skill

This repository includes a repo-local skill at `.codex/skills/github-review-workflow/`.

Use `$github-review-workflow` when working on:

- GitHub Actions workflow changes
- README updates related to CI or review settings
- `gitleaks` hook setup
- `.github/CODEOWNERS` changes
- pull request creation and GitHub check inspection
- branch protection alignment

## Notes

- Check tracked workflow files with `git ls-tree --name-only -r HEAD .github/workflows`.
- If a file exists locally but is missing from Git status, verify ignore rules with `git check-ignore -v <path>`.
- In this environment, hidden paths such as `.github/...` and `.codex/...` may require `git add -f`.
