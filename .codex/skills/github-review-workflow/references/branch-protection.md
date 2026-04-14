# Branch Protection Patterns

## Temporary Bootstrap Pattern

Use this when CI checks should stay required, but review rules need a one-time relaxation for a bootstrap PR.

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

## Standard Pattern

Use this after workflows and CODEOWNERS are already active on the default branch.

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["gitleaks", "test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": false
  },
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

## Checks Before Enforcing

- The workflow file must be tracked by Git.
- The workflow must exist on the default branch before making its check required.
- Confirm real check names from PR runs instead of guessing.
- Self-approval is not allowed on your own PR.
