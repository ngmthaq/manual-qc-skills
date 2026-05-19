---
name: mqcs-execute-test-cases
description: >
  Execute test cases produced by the mqcs-create-test-cases skill against a live system.
  Reads the approved Markdown test case file as the source of truth, then runs each test
  automatically: API test cases via the Postman MCP, browser/UI test cases via the Control
  Chrome MCP. Records Pass / Fail / Blocked per row and writes an execution-result Markdown
  file with evidence. Use when the user wants to run, automate, or record results for a
  test case suite. Triggers on: "run test cases", "execute tests", "automate QA", "run the
  test cases against", "test the API", "execute in browser", or any request to validate a
  feature against an existing test case file.
---

# Execute Test Cases Skill

> **Adopt the persona first.** Before doing anything else, load
> [references/persona.md](references/persona.md) to take on the Senior Manual QA Tester
> role and its Core Principles / What You Never Do rules. The persona applies to every phase.

---

A three-phase workflow that takes the approved test-case Markdown file through automated
execution and produces an evidence-backed result report:

```
Phase 1: Classify        ─▶    Phase 2: Execute      ─▶    Phase 3: Report
(.md → execution plan)         (plan → run via MCP)        (runs → result .md + summary)
```

Each phase is **approval-gated** — never auto-advance. The user can enter at any phase if
they already have the upstream artifact.

| Phase        | Inputs                                | Output                             |
| ------------ | ------------------------------------- | ---------------------------------- |
| 1 — Classify | Approved `.md` + TEST_CASE_CONVENTION | Approved execution plan (Markdown) |
| 2 — Execute  | Execution plan + Postman/Chrome MCPs  | Raw result records + evidence      |
| 3 — Report   | Result records                        | Result `.md` + summary in chat     |

---

## Prerequisites

- **Source `.md`** — the test case Markdown file produced by `mqcs-create-test-cases`. This
  is the **single source of truth**; never alter it. If no file is present, tell the user:

  > I need a test case Markdown file. Run the **mqcs-create-test-cases** skill first to
  > produce one, then come back here with the `.md` file to execute.

- **TEST_CASE_CONVENTION.md** — must be present in Project Knowledge. Required to understand
  column semantics (title, steps, expected result, type, etc.). If missing, stop and direct
  the user to run `mqcs-onboarding`.

- **MCPs** — at least one of:
  - **Postman MCP** — required for API test cases.
  - **Control Chrome MCP** — required for browser/UI test cases.

  If a test case's type requires an MCP that is not connected, mark it `Blocked` and note the
  reason. Never silently skip it.

---

## Pick the Starting Phase

- **Has `.md` but no execution plan** → start at Phase 1.
- **Has an approved execution plan** → skip to Phase 2.
- **Has raw result records but no report** → skip to Phase 3.

If ambiguous, ask once; do not assume.

---

## Phase Hand-Off Rules

### After Phase 1 (plan approved)

> ✅ **Execution plan approved.** Want me to start executing the tests now (Phase 2)?
>
> - Reply **"yes"** to proceed.
> - Reply **"no"** to stop here.

If yes, load `references/execute.md`. If no, stop.

### After Phase 2 (all tests run)

> ✅ **Execution complete.** Want me to generate the results report now (Phase 3)?
>
> - Reply **"yes"** to proceed.
> - Reply **"no"** to stop here — results are saved in memory and you can resume later.

If yes, load `references/report.md`. If no, stop.

### Never auto-advance

Approval of one phase is **not** approval of the next. Always ask the hand-off question.

---

## Cross-Phase Guarantees

- **Source `.md` is read-only.** Never write back to it. All results go into a separate
  output file.
- **TEST_CASE_CONVENTION.md is the column key.** Never infer column meanings; always derive
  them from the convention.
- **Pass approved artifacts verbatim.** The execution plan produced in Phase 1 is consumed
  unchanged by Phase 2. Do not regenerate or summarise.
- **Evidence is mandatory for every result.** A result without evidence (response body,
  screenshot, error message, or explicit "not observable" note) is never written.
- **Blocked ≠ Fail.** A test that cannot run due to missing MCP, missing environment variable,
  or unresolvable pre-condition is `Blocked`, not `Failed`. Record the reason.
- **Stop on unrecoverable errors.** If an MCP call fails and cannot be retried, surface the
  error to the user and ask whether to skip, retry, or abort the phase.

---

## Companion Files

- [references/persona.md](references/persona.md) — Senior Manual QA Tester persona. Load
  once at start; rules apply throughout.
- [references/classify.md](references/classify.md) — full procedure for Phase 1.
- [references/execute.md](references/execute.md) — full procedure for Phase 2 (Postman + Chrome).
- [references/report.md](references/report.md) — full procedure for Phase 3.
