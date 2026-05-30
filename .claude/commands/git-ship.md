---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git remote:*), Bash(git branch:*), Bash(git add:*), Bash(git checkout:*), Bash(git commit:*), Bash(git push:*)
description: Analyze git changes, generate a Conventional Commits message and branch name, show a preview for approval, then stage → branch → commit → push. Works in any git repository.
---

## Repository state

Git status:
!`git status`

Changes (staged + unstaged):
!`git diff HEAD`

Already staged:
!`git diff --cached`

Recent commits (commit style reference):
!`git log --oneline -10`

Remote:
!`git remote -v`

## Your task

Run the git-ship workflow on the repository state above.

### Step 1 — Safety check

Scan the file list from git status for sensitive file patterns:
`.env`, `.env.*`, `*.key`, `*.pem`, `credentials.*`, `secrets.*`, `*.p12`, `*.pfx`, `id_rsa`, `id_ed25519`, `id_ecdsa`, `*.secret`, `*_secret.*`

If any match: warn the user, exclude those files, and wait before continuing.

If the working tree is clean (nothing staged, modified, or untracked): report "Nothing to commit — the working tree is clean." and stop.

### Step 2 — Classify the change type

Pick the dominant type from the diff. When ambiguous between `feat` and `fix`, prefer `fix`.

| Signal | Type |
|---|---|
| New feature / endpoint / capability | `feat` |
| Bug fix / broken behavior corrected | `fix` |
| Build config, deps, tooling, scripts | `chore` |
| Rename / restructure, no behavior change | `refactor` |
| Test files / test data only | `test` |
| README, docs, comments, SKILL.md | `docs` |
| Whitespace / formatting only | `style` |
| Performance improvements | `perf` |
| CI pipeline files (.github/, Jenkinsfile) | `ci` |

### Step 3 — Detect scope

Take all changed file paths from git status. Strip filenames; keep the top-level directory. Use the directory containing the most changed files. If all files are at the repo root, use `root`. Sanitize: lowercase, spaces/underscores → hyphens.

### Step 4 — Generate and show a preview

**Do not touch git until the user approves.** Show this block and wait:

```
Here is what I will commit and push:

  BRANCH      type/scope-short-description

  COMMIT      type(scope): short imperative description

              What changed (concrete change made)
              Why it changed (motivation or problem solved)

  STAGE       file1
              file2
              [one file per line]

  REMOTE      origin → [url]   or   "No remote — push will be skipped"

Shall I proceed? (yes / no / edit)
```

- **yes / y / go / ship / ok** → execute Step 5
- **no / n / stop** → stop, do nothing, confirm "No changes made."
- **edit** or any change request → update and re-show the preview; wait again

### Step 5 — Execute (after approval only)

Run in order:

```bash
# Stage files by name — never git add . or git add -A
git add path/to/file1 path/to/file2 ...

# Create branch — if name exists, append -2, -3, etc.
git checkout -b type/scope-short-description

# Commit with conventional message + co-author trailer
git commit -m "$(cat <<'EOF'
type(scope): short imperative description

What changed (concrete)
Why it changed (motivation)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"

# Push — skip if no remote was found
git push -u origin type/scope-short-description
```

If a pre-commit hook fails: show the full hook output, stop, do not use `--no-verify`.

If no remote: skip push and tell the user: `git push -u origin type/scope-short-description`

### Step 6 — Summary

```
Shipped.

  Branch   type/scope-short-description
  Commit   [7-char SHA]  type(scope): short imperative description
  Remote   Pushed to origin/type/scope-short-description

What's next?
  1. Open a PR — run: gh pr create --base main
  2. View commit — run: git show HEAD
  3. Ship again — run /git-ship
```

## Rules (non-negotiable)

- Never push to `main`, `master`, `develop`, or `release` — always a new branch
- Never `git add .` or `git add -A` — stage files by explicit path only
- Never `--no-verify` — if a hook fails, stop and report
- Never `--force` unless the user explicitly types "force push"
- Never `git commit --amend` — always create a new commit
- Branch name: `type/scope-short-desc` — all lowercase, hyphens only, max 50 chars
- Commit title: imperative mood, max 72 chars, no trailing period
