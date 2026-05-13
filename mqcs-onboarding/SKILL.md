---
name: mqcs-onboarding
description: >
  Read an uploaded Excel file containing test case examples, analyze its structure and format, and
  store the extracted convention as a downloadable file the user can upload to Project Knowledge.
  Use this skill once at the start of a
  project when the user uploads a test case template or sample Excel file and wants future test case
  generation to follow that format. Triggers include: uploading an Excel file with test cases,
  "learn this format", "read this template", "onboard this test case file", or any request to
  establish a test case convention from an existing file.
---

# Onboarding Skill

> **Adopt the persona first.** Before doing anything else in this skill, load
> [references/persona.md](references/persona.md) to take on the Senior Manual QA Tester
> role and its Core Principles / What You Never Do rules.

---

Read an uploaded Excel test case file, extract its structure and conventions, and save them as a
downloadable `TEST_CASE_CONVENTION.md` file. The user uploads it once to **Project Knowledge** so
all subsequent test case generation follows the same format.

---

This is a single approval-gated workflow:

```text
Upload .xlsx  ->  Analyze template  ->  Draft convention  ->  Review and save
```

The detailed onboarding procedure is split into one reference file per step. Load only the
reference for the step you are currently executing.

| Step        | Input                        | Output                    |
| ----------- | ---------------------------- | ------------------------- |
| 1 — Read    | Uploaded `.xlsx` template    | Full workbook dump        |
| 2 — Analyze | Script output                | Extracted template facts  |
| 3 — Produce | Extracted template facts     | Draft convention markdown |
| 4 — Save    | Approved convention markdown | Saved convention file     |

---

## Workflow Guarantees

- **Analysis only.** Do not generate test cases during onboarding.
- **No invented structure.** Use only the columns, sheets, and conventions present in the file.
- **Explicit failure handling.** If the file is empty or has no recognizable structure, report what
  was found and ask the user for a more complete template.
- **Per-sheet fidelity.** If multiple sheets use different formats, document each sheet separately.
- **Machine-readable output.** Keep the convention document factual and precise because
  `mqcs-create-test-cases` consumes it downstream.

---

## Companion Files

- [references/persona.md](references/persona.md) — Senior Manual QA Tester persona. Load once at
  the start; rules apply throughout.
- [references/step-1-read.md](references/step-1-read.md) — locate the uploaded workbook and run
  the analysis script.
- [references/step-2-analyze.md](references/step-2-analyze.md) — extract sheet, column, row, and
  formatting conventions.
- [references/step-3-produce.md](references/step-3-produce.md) — draft the machine-readable
  `TEST_CASE_CONVENTION.md`.
- [references/step-4-save.md](references/step-4-save.md) — review with the user and save the final
  convention file.
- [scripts/analyze_excel.py](scripts/analyze_excel.py) — Excel content + formatting reader,
  invoked during onboarding.
