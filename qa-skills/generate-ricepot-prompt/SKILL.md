---
name: generate-ricepot-prompt
description: >
  Generate a new, complete RICE-POT-structured prompt (Role, Instructions, Context, Example,
  Parameters, Output, Tone) for any AI-generation task — test plans, test strategies, TRDs,
  CI workflows, code generators, or any other repeatable document/artifact prompt. Use this
  skill whenever the user says "create a RICE-POT prompt", "generate a RICE-POT prompt for X",
  "write me a prompt using RICE-POT", "build a RICE-POT prompt", or wants a new enterprise-grade,
  hallucination-resistant prompt but doesn't have one yet. Fills in all 7 sections from a
  blank template, matching the rigor (determinism, zero-hallucination, explicit "Do NOT"
  rules, placeholder policy) of this repo's existing RICE-POT prompts. Can also scaffold the
  result into a full portable qa-skills-style skill folder on request. Invoke proactively
  when a user describes a repeatable AI task and wants a reusable, structured prompt for it.
---

# Generate RICE-POT Prompt

Generates a brand-new prompt in the **RICE-POT** framework for any task the user wants an AI
tool to perform repeatably and reliably. RICE-POT stands for **R**ole, **I**nstructions,
**C**ontext, **E**xample, **P**arameters, **O**utput, **T**one — see
[../RICE_POT_FRAMEWORK.md](../RICE_POT_FRAMEWORK.md) for the framework breakdown. This skill
fills in [references/ricepot-blank-template.md](references/ricepot-blank-template.md) for the
user's specific task, calibrated to the quality bar shown in
[references/worked-examples.md](references/worked-examples.md).

## How This Skill Works

Two phases: **Clarify → Generate** (with an optional **Phase 3: Scaffold as a skill**).

### Phase 1: Clarify

Ask in one message:

```
Before I write the RICE-POT prompt, a few details:

1. **Task** — What should the resulting prompt make an AI generate? e.g., "a test plan for
   a REST API", "release notes from a changelog", "a page object class from a URL".

2. **Persona / expertise** — What role should the AI adopt? e.g., "Senior QA Lead",
   "Staff Backend Engineer", "Technical Writer with API docs experience".

3. **Required output structure** — The exact sections/fields/format the output must have,
   in order (this becomes the Instructions + Output sections). If you don't have one yet,
   I'll propose a structure and confirm it with you before writing the full prompt.

4. **Hard constraints** *(optional)* — Anything the AI must never do (invent data, skip
   sections, assume defaults, use casual tone, etc.). I'll always include a zero-hallucination
   / determinism baseline regardless.

5. **Context inputs** *(optional)* — What will be attached/pasted alongside the prompt each
   time it's used (a requirement doc, a cURL command, a URL, a template file)?
```

Wait for the response before generating. If the user has no output structure in mind yet
(point 3), propose one based on the task and get a one-line confirmation before writing the
full prompt — don't spend effort on a structure they'll reject.

### Phase 2: Generate

Read `references/ricepot-blank-template.md` and fill every section:

- **R — Role**: One sentence, specific seniority/expertise, matching the task's domain.
- **I — Instructions**: Numbered, ordered steps culminating in an explicit "Do NOT" list.
  Mirror the level of precision in the worked examples — exact section order, minimum
  counts/lengths where they matter, sub-structure call-outs (e.g., "X must appear as a
  sub-section of Y").
- **C — Context**: Background the AI needs plus what will be attached each run. Use
  `[INSERT ...]` placeholders for anything that varies per use, not the fixed instructions.
- **E — Example**: One concrete, illustrative snippet of the expected output at full quality
  — never a vague description of what an example would look like.
- **P — Parameters**: Always include, at minimum: determinism (same input → same output),
  traceability (every claim ties to provided input), the exact "Insufficient information to
  determine." / "Inference (low confidence)." policy, and a no-hallucination rule.
- **O — Output**: Exact format (Markdown/JSON/CSV/code), exact structure/section order,
  heading levels, table usage. No ambiguity about what "done" looks like.
- **T — Tone**: One or two sentences — technical register, prose vs. bullet balance,
  first-person policy.

Wrap the filled prompt in the same delivery shape as this repo's other RICE-POT prompts:
a short intro, the prompt itself inside a fenced code block, a "How to Use This Prompt"
section, and a "RICE-POT Framework Reference" table mapping each letter to its purpose in
the new prompt (see any file in `references/worked-examples.md` for the exact shape).

### Phase 3: Scaffold as a skill (offer, don't assume)

After delivering the prompt, ask if the user wants it packaged as a portable skill folder
matching this repo's convention — `qa-skills/<name>/SKILL.md` + `references/<name>-prompt.md`
— the same structure used for `generate-test-plan`, `generate-test-strategy`, and
`generate-trd`. If yes:
1. Pick a `kebab-case` skill name and slash command matching the task (e.g.
   `generate-release-notes`).
2. Write `SKILL.md` with YAML frontmatter (`name`, `description` covering trigger phrases)
   and a Clarify → Generate phase structure, mirroring the skills listed above.
3. Put the full RICE-POT prompt in `references/<name>-prompt.md` with a context header
   noting it's bundled with the new skill.
4. Add a row to the **Skill Inventory** table in the repo's `CLAUDE.md`.

## Hard Rules

- **Never skip a RICE-POT section** — all 7 must be present, even if brief.
- **Never invent** the task's domain specifics (API names, tools, team structure) — if the
  user didn't provide them, use `[INSERT ...]` placeholders, exactly like this repo's
  existing prompts.
- The **Parameters** section must always carry a zero-hallucination / determinism baseline,
  regardless of what the user asked for — this is non-negotiable across every RICE-POT prompt
  in this repo.
- Keep the **Output** section unambiguous enough that a different AI tool run on the same
  inputs produces a structurally identical result.

## Follow-up Options

After delivering the prompt, always offer:

```
What would you like next?
1. Package this as a portable skill folder (qa-skills/<name>/) → I'll scaffold SKILL.md + references/
2. Tighten a specific section (e.g., add stricter Output formatting, more Do NOT rules)
3. Generate a worked Example section from a real sample input, if you have one
```

## Reference Files

| File | Purpose | When to Load |
|---|---|---|
| `references/ricepot-blank-template.md` | The blank 7-section RICE-POT skeleton to fill in | Always — read before generating |
| `references/worked-examples.md` | Pointers to this repo's existing filled RICE-POT prompts, with notes on what each demonstrates | Read for calibration before writing Instructions/Parameters/Output |
