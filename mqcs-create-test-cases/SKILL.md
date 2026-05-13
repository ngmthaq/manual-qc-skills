---
name: mqcs-create-test-cases
description: >
  End-to-end manual-QA flow in three approval-gated phases: (1) analyze a requirement from raw
  text, Jira / Linear / GitHub tickets, and/or Figma designs into a structured Markdown
  breakdown; (2) draft test cases against the project's TEST_CASE_CONVENTION.md and write them
  to an Excel file; (3) file each test case as a ticket in Jira, Linear, or GitHub via the
  matching MCP. Use when the user wants to turn a requirement into test cases or tickets. Each
  phase requires explicit user approval before the next starts, and the user can enter the flow
  at any phase if they already have the upstream artifact. Requires TEST_CASE_CONVENTION.md in
  Project Knowledge (produced by the mqcs-onboarding skill) for phases 2 and 3, and a connected
  ticket-system MCP for phase 3.
---

# Create Test Cases Skill

> **Adopt the persona first.** Before doing anything else in this skill, load
> [references/persona.md](references/persona.md) to take on the Senior Manual QA Tester
> role and its Core Principles / What You Never Do rules. The persona applies to every phase.

---

A three-phase workflow that takes a requirement all the way to filed tickets:

```
Phase 1: Analyze          ─▶      Phase 2: Draft      ─▶    Phase 3: File
(requirement → analysis)          (analysis → xlsx)         (xlsx → tickets via MCP)
```

Each phase is **approval-gated** — never auto-advance. The user can also enter the flow at
any phase if they already have the upstream artifact (a finished analysis, or a drafted
`.xlsx`).

The detailed procedure for each phase lives in a separate reference file. Load only the
reference for the phase you are currently executing — do not pre-load all three.

| Phase       | Inputs                                   | Output                           |
| ----------- | ---------------------------------------- | -------------------------------- |
| 1 — Analyze | Raw text / ticket URL / Figma URL        | Approved Markdown analysis       |
| 2 — Draft   | Approved analysis + TEST_CASE_CONVENTION | Approved `.xlsx` test case draft |
| 3 — File    | Drafted `.xlsx` + connected MCP          | Created tickets + report         |

---

## Pick the Starting Phase

Choose based on what the user supplied:

- **Requirement (raw text, ticket URL, Figma URL, or any mix)** → start at Phase 1.
- **An already-approved analysis pasted into the chat** → skip to Phase 2.
- **A drafted `.xlsx` test case file** → skip to Phase 3.

If the user's intent is ambiguous (e.g. they paste a ticket URL but also mention "file
tickets"), ask once which phase they want to start in; do not assume the full flow.

---

## Phase Hand-Off Rules

After finishing each phase, hand off only with explicit user opt-in:

### After Phase 1 (analysis approved)

Ask:

> ✅ **Analysis approved.** Want me to draft test cases from this now (Phase 2)?
>
> - Reply **"yes"** and I'll proceed to draft test cases.
> - Reply **"no"** and I'll stop here.

If yes, load `references/draft.md` and proceed using the approved analysis verbatim. If no,
stop the turn.

### After Phase 2 (xlsx written)

Tell the user:

> The draft is saved as **{filename}**. Want me to file these as tickets in Jira / Linear /
> GitHub now (Phase 3)?
>
> - Reply **"yes"** and I'll proceed (a connected MCP is required).
> - Reply **"no"** and I'll stop here — you can come back later and run Phase 3 against this
>   file.

If yes, load `references/file.md` and proceed. If no, stop the turn.

### Never auto-advance

Approval of one phase is **not** approval of the next. Even if the user was enthusiastic, ask
the hand-off question before moving forward.

---

## Cross-Phase Guarantees

These rules apply across every phase — keep them in mind regardless of which reference is
loaded:

- **Approval gates are non-skippable.** No Excel file is written, no ticket is created, no
  analysis is auto-passed downstream without explicit user approval.
- **Pass approved artifacts through verbatim.** When advancing phases in the same session,
  use the exact approved analysis / approved test case list — do not regenerate or summarize.
- **Don't re-fetch from MCPs unnecessarily.** Phase 2 reads design context from the Phase 1
  analysis; it does not re-call the Figma MCP. Phase 3 reads from the `.xlsx`; it does not
  re-call the source ticket MCP.
- **Pixel-perfect convention compliance.** Phases 2 and 3 read `TEST_CASE_CONVENTION.md` from
  Project Knowledge. If it is missing, stop and direct the user to run the `mqcs-onboarding`
  skill.
- **Out-of-scope items get no test cases.** Items the analysis marks as out of scope or as
  unresolved ambiguities never reach Phase 2 output.

---

## Companion Files

- [references/persona.md](references/persona.md) — Senior Manual QA Tester persona. Load
  once at the start; rules apply throughout.
- [references/analyze.md](references/analyze.md) — full procedure for Phase 1.
- [references/draft.md](references/draft.md) — full procedure for Phase 2.
- [references/file.md](references/file.md) — full procedure for Phase 3.
- [scripts/write_test_cases.py](scripts/write_test_cases.py) — Excel writer invoked by Phase 2.
  See its module docstring for the spec JSON schema.
