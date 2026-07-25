---
name: git-ship
description: >
  Stage, branch, commit, and push a git change with a generated Conventional Commits
  message and kebab-case branch name. Use whenever the user says "git ship", "ship this",
  "commit and push", "commit my changes", "create a commit", "push my work", "ship my
  changes", "write a commit message for this", "stage and commit", "push to a new branch",
  or wants to commit what they have been working on and push it to a remote branch.
  Discovers the diff silently, classifies the change by conventional commit type
  (feat/fix/chore/refactor/test/docs/style/perf/ci), infers the scope from affected
  directories, generates a commit title + body + branch name, presents the full preview
  for user approval, then executes stage → branch → commit → push. Warns and stops if
  sensitive files (.env, *.key, *.pem, credentials.*) are detected. Works in any git
  repository — not project-specific. Invoke proactively whenever the user describes
  wanting to save or ship their current work.
---

# Git Ship

A one-command git workflow: analyze your changes, generate a Conventional Commits message
and branch name, get your approval, then stage → branch → commit → push.

## How This Skill Works

Four phases: **Discover → Analyze → Generate → Execute**

Never touch git state (stage, branch, commit, push) before the user approves the preview
in Phase 3. All discovery and analysis is read-only.

---

## Phase 1: Discover

Run all four commands silently. Do not display the raw output to the user.

```
git status
git diff HEAD
git diff --cached
git log --oneline -10
git remote -v
```

**Early exits — stop immediately and report if:**

- The working directory is not inside a git repository → report the git error and stop.
- `git status` shows a clean working tree (nothing staged, nothing modified, no untracked
  files) → report "Nothing to commit — the working tree is clean." and stop.

---

## Phase 2: Analyze

### Sensitive File Check (always first)

Scan the file paths from `git status` for any of these patterns before doing anything else:

| Pattern | Examples |
|---|---|
| `.env`, `.env.*` | `.env`, `.env.local`, `.env.production` |
| `*.key` | `private.key`, `server.key` |
| `*.pem` | `cert.pem`, `ca.pem` |
| `credentials.*` | `credentials.json`, `credentials.yaml` |
| `secrets.*` | `secrets.json`, `secrets.toml` |
| `*.p12`, `*.pfx` | Any PKCS12 keystore |
| `id_rsa`, `id_ed25519`, `id_ecdsa` | SSH private keys |
| `*.secret`, `*_secret.*` | Any file with "secret" in the name |

If any match is found, display this warning and wait for the user's response before
continuing:

```
SENSITIVE FILE DETECTED

The following files look like they may contain secrets or credentials:
  - [list each matching file]

These will NOT be staged or committed. To proceed:
  Option A — Add them to .gitignore and run /git-ship again.
  Option B — Type exactly: "I confirm these files are safe to commit"
             and I will include them with a second warning before staging.

All other changed files will be included normally.
```

### Conventional Commit Type

Determine the primary type from the diff content. When multiple types apply, pick the one
covering the most changed lines. Ties between `feat` and `fix`: prefer `fix`.

| Signal in diff / file paths | Type |
|---|---|
| New user-facing capability, new endpoint, new feature flag | `feat` |
| Bug fix, corrected logic, resolving broken behavior | `fix` |
| Build config, dependencies, tooling, scripts, CI config files | `chore` |
| Internal restructure with no behavior change (rename, extract) | `refactor` |
| New or updated test files, test data, test helpers only | `test` |
| README, SKILL.md, CLAUDE.md, comments, docstrings, changelog | `docs` |
| Whitespace, indentation, semicolons — no logic change | `style` |
| Performance improvement, caching, query optimization | `perf` |
| `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, etc. | `ci` |

### Scope Detection

1. Collect all file paths reported by `git status` (staged + unstaged + untracked).
2. Strip filenames; keep only the first path segment (top-level directory).
3. Pick the segment appearing most often. Break ties alphabetically.
4. If all changed files sit at the repository root (no subdirectory), use `root`.
5. Sanitize: lowercase, spaces/underscores → hyphens, strip leading dots.

Examples:

| Changed files | Scope |
|---|---|
| `qa-skills/git-ship/SKILL.md` | `qa-skills` |
| `src/auth/login.ts`, `src/auth/logout.ts` | `auth` |
| `README.md`, `CLAUDE.md` | `root` |
| `restassured-skills/ra-lookup/SKILL.md` | `restassured-skills` |

---

## Phase 3: Generate

### Commit Title

Format: `type(scope): short imperative description`

- Imperative mood: "add", "fix", "update", "remove" — not "added", "fixing", "adds"
- Max 72 characters total (type + scope + colon-space + description)
- All lowercase except proper nouns (REST, TestNG, Java, etc.)
- No trailing period

### Commit Body

3–6 lines in this order:

```
[blank line separating title from body — required by git convention]
What changed — the concrete change made (not a repeat of the title)
Why it changed — the motivation or problem being solved
Any important context, caveats, or follow-up items (omit if none)
```

### Branch Name

Format: `type/scope-short-description`

- All lowercase, hyphens only (no underscores, no extra slashes)
- Short description: 3–5 words hyphenated, derived from the commit title
- Max 50 characters total
- Never use `main`, `master`, `develop`, or `release` as the branch name

Examples:
- `feat/auth-add-oauth-login`
- `fix/qa-skills-broken-reference-link`
- `docs/root-update-readme-install-steps`
- `chore/restassured-bump-testng-version`

### Confirmation Preview

Show this block and wait. Do not stage or touch git until the user approves.

```
Here is what I will commit and push:

  BRANCH      type/scope-short-description

  COMMIT      type(scope): short imperative description

              What changed — the concrete change made
              Why it changed — the motivation or problem being solved
              [optional additional context]

  STAGE       file1.md
              file2.ts
              [list every file to be staged, one per line]

  REMOTE      origin → https://github.com/user/repo.git
              (or "No remote configured — push will be skipped")

Shall I proceed? (yes / no / edit)
```

Handle responses:

- **yes / y / go / ship / ok / proceed / looks good** → continue to Phase 4.
- **no / n / stop / cancel** → stop, change nothing, confirm "No changes made."
- **edit** or any correction request → update the message or branch name, re-show the
  preview in full, and wait again. Never execute until the user explicitly approves.

---

## Phase 4: Execute

After approval, execute these steps in order. Confirm each step to the user as it
completes.

### Step 1 — Stage

Stage each file by name. Never use `git add -A` or `git add .`.

```bash
git add path/to/file1 path/to/file2 ...
```

- Include all modified, added, and untracked files shown in Phase 1.
- Exclude any sensitive files not confirmed by the user (Phase 2).
- If the user confirmed sensitive files with the exact phrase, include them and display
  a second warning: "Staging [filename] — confirmed by user as safe."

### Step 2 — Create Branch

```bash
git checkout -b type/scope-short-description
```

Edge cases:
- **Branch already exists** → append `-2`, then `-3`, etc., until the name is free.
  Inform the user: "Branch `type/scope-desc` already exists — using `type/scope-desc-2`."
- **Detached HEAD** → warn the user: "You are in detached HEAD state. The new branch
  will be created from the current commit ([SHA]). Proceeding." Then run the command.

### Step 3 — Commit

```bash
git commit -m "$(cat <<'EOF'
type(scope): short imperative description

What changed — the concrete change made
Why it changed — the motivation or problem being solved
[optional additional context]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

If a pre-commit hook fails: display the hook output in full, stop, and report
"Pre-commit hook failed — no commit was made. Fix the issues above and run /git-ship again."
Never retry with `--no-verify`.

### Step 4 — Push

If a remote was found in Phase 1:
```bash
git push -u origin type/scope-short-description
```

If no remote was configured: skip push and tell the user:
```
No remote configured — push skipped.
To push manually: git push -u origin type/scope-short-description
```

### Step 5 — Summary

Report the final outcome:

```
Shipped.

  Branch   type/scope-short-description
  Commit   [first 7 chars of SHA]  type(scope): short imperative description
  Remote   Pushed to origin/type/scope-short-description
           (or "Push skipped — no remote configured")

What's next?
  1. Open a pull request — run: gh pr create --base main
  2. View the commit — run: git show HEAD
  3. Ship another change — run /git-ship again
```

---

## Safety Rules

These rules cannot be overridden by the user mid-session:

1. **Sensitive files**: Never stage `.env`, `*.key`, `*.pem`, `credentials.*`, `secrets.*`,
   `*.p12`, `*.pfx`, SSH private keys, or `*.secret` files without the explicit
   confirmation phrase "I confirm these files are safe to commit". Even then, display
   a second warning at staging time.

2. **Protected branches**: Never push to `main`, `master`, `develop`, or `release` directly.
   Always create a new branch. The commit target is always the new branch only.

3. **No force push**: Never use `--force` or `--force-with-lease` unless the user
   explicitly types "force push" in their message. Even then, confirm once more before
   executing.

4. **No hook bypass**: Never use `--no-verify`. If a hook fails, surface the output and
   stop. The user must fix the issue and re-run `/git-ship`.

5. **No amend**: Never use `git commit --amend`. A failed commit followed by a fix must
   create a new commit, not amend the previous one.

6. **Named staging only**: Always stage files by explicit path. Never use `git add -A`,
   `git add .`, or `git add *`. Unintended files (build artifacts, IDE configs, OS files)
   must never be silently included.

---

## Portability Note

This skill has no dependency on any specific language, framework, or project structure.
It works in any git repository.

To use it in another project, copy this directory:

```
restassured-skills/git-ship/SKILL.md  →  <other-project>/.claude/skills/git-ship/SKILL.md
```

The `/git-ship` command becomes available immediately in that project.
