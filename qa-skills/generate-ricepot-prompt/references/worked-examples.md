<!-- Context: This is a reference index for the `/generate-ricepot-prompt` skill
(qa-skills/generate-ricepot-prompt/). It points at this repo's existing filled RICE-POT
prompts so the skill can calibrate tone, precision, and structure before writing a new one —
it does not duplicate their content. -->

# Worked RICE-POT Prompt Examples

Read one or two of these — whichever is closest to the new task's domain — before drafting a
new prompt. They show the calibration bar for each RICE-POT section.

| Example | Path | What it demonstrates |
|---|---|---|
| Test Plan generator | [`../../generate-test-plan/references/rice-pot-test-plan-prompt.md`](../../generate-test-plan/references/rice-pot-test-plan-prompt.md) | Very long, highly enumerated **Instructions** (15 numbered steps + minimum-count rules), a **Context** section with real placeholder conventions (`[INSERT ...]`), and an **Output** section that locks down heading levels and table usage precisely. |
| Test Strategy generator | [`../../generate-test-strategy/references/rice-pot-test-strategy-prompt.md`](../../generate-test-strategy/references/rice-pot-test-strategy-prompt.md) | **Instructions** that reference an external template file as the authoritative structure (rather than inlining it), and a **Parameters** section with the standard "Insufficient information to determine." / "Inference (low confidence)" policy. |
| CI Workflow generator | [`../../create-ci-workflow/references/RICE-POT-PROMPT.md`](../../create-ci-workflow/references/RICE-POT-PROMPT.md) | A **Role** and **Instructions** pair built for a code-generation task (YAML) rather than a document — shows how RICE-POT adapts when the Output is a config file instead of prose/Markdown sections. |
| BRS → TRD generator | [`../../generate-trd/references/brs-to-trd-prompt.md`](../../generate-trd/references/brs-to-trd-prompt.md) | The strictest zero-hallucination framing in this repo — every "Do NOT invent" rule is paired with a mandatory `TBD-XX` fallback, useful as a model when the new prompt's domain has a lot of unknowns per run. |

## What to borrow from all of them

- Every one of these prompts pairs each hard rule with a concrete fallback (a placeholder
  format, a TBD convention, or an "Insufficient information to determine." response) — never
  just "don't do X" with no instruction for what to do instead.
- **Output** sections are never left to interpretation: exact section order, exact heading
  levels, exact table columns.
- **Example** sections show one fully realized snippet, not a description of a snippet.
- All four end with a short "How to Use" note and a RICE-POT letter-to-purpose reference
  table — keep that closing shape for consistency across this repo's prompts.
