---
name: mqcs-onboarding
description: >
  Ask the user to paste the header row (and optionally a sample row) from their Excel test case
  template into chat, analyze its structure, and store the extracted convention as a downloadable
  file the user can upload to Project Knowledge. Use this skill once at the start of a project
  when the user wants future test case generation to follow an existing template's format.
  Triggers include: "learn this format", "read this template", "onboard this test case file", or
  any request to establish a test case convention from an existing file. Never expect a file
  upload or file path — always ask the user to copy and paste the template's header text.
---

# Onboarding Skill

> **Adopt the persona first.** Before doing anything else in this skill, load
> [references/persona.md](references/persona.md) to take on the Senior Manual QA Tester
> role and its Core Principles / What You Never Do rules.

---

Ask the user to paste the header row from their Excel test case template directly into chat,
extract the column schema and conventions from that text, and save them as a downloadable
`TEST_CASE_CONVENTION.md` file. The user uploads that convention file once to
**Project Knowledge** so all subsequent test case generation follows the same format.

> **Never ask for a file upload or file path.** The user provides the template by copying the
> header row (and optionally one or two sample test case rows) out of Excel and pasting the text
> into the chat. Work only from what the user pastes.

---

This is a single approval-gated workflow:

```text
Ask for pasted header  ->  Analyze header text  ->  Draft convention  ->  Review and save
```

The detailed onboarding procedure is split into one reference file per step. Load only the
reference for the step you are currently executing.

| Step        | Input                         | Output                    |
| ----------- | ----------------------------- | ------------------------- |
| 1 — Read    | User-pasted header (+ sample) | Captured raw text         |
| 2 — Analyze | Captured raw text             | Extracted template facts  |
| 3 — Produce | Extracted template facts      | Draft convention markdown |
| 4 — Save    | Approved convention markdown  | Saved convention file     |

---

## Workflow Guarantees

- **Analysis only.** Do not generate test cases during onboarding.
- **No invented structure.** Use only the columns and conventions present in the text the user
  pasted. Do not guess at fields, styling, or formatting the user did not share.
- **Explicit failure handling.** If the pasted text is empty, ambiguous, or has no recognizable
  header row, report what was found and ask the user to paste a clearer header (and optionally a
  sample row).
- **Machine-readable output.** Keep the convention document factual and precise because
  `mqcs-create-test-cases` consumes it downstream.

---

## Companion Files

- [references/persona.md](references/persona.md) — Senior Manual QA Tester persona. Load once at
  the start; rules apply throughout.
- [references/step-1-read.md](references/step-1-read.md) — ask the user to paste the template
  header (and optionally a sample row) into chat.
- [references/step-2-analyze.md](references/step-2-analyze.md) — extract column schema and
  conventions from the pasted text.
- [references/step-3-produce.md](references/step-3-produce.md) — draft the machine-readable
  `TEST_CASE_CONVENTION.md`.
- [references/step-4-save.md](references/step-4-save.md) — review with the user and save the final
  convention file.
