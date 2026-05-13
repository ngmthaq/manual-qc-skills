# Manual QA Skills

A set of Claude skills for a manual-QA workflow: take a requirement, analyze it, draft test
cases against a project-specific Excel convention, and file them as tickets in Jira / Linear /
GitHub. Designs in Figma are first-class inputs alongside tickets.

All four skills share the same persona — **Senior Manual QA Tester** — defined in
[INSTRUCTIONS.md](INSTRUCTIONS.md). Paste that file into your Claude project's **Project Instructions**
once so every skill picks it up.

---

## The Skills

The skills are designed to chain, but each runs standalone. Typical flow:

```
onboarding ─▶ analyze-requirement ─▶ draft-test-cases ─▶ create-test-cases
  (once,           (per ticket /         (produces an        (files tickets
   per project)     Figma URL)            .xlsx draft)        via MCP)
```

### [onboarding](onboarding/SKILL.md)

Run **once per project**. Upload a sample test-case Excel file; the skill analyzes its sheet
structure, columns, allowed values, and formatting (widths, fonts, fills, borders, merged
cells, data validation) and writes a `TEST_CASE_CONVENTION.md`. Upload that file to **Project
Knowledge** — the downstream skills read it to keep every generated spreadsheet pixel-perfect
against your team's template.

### [analyze-requirement](analyze-requirement/SKILL.md)

Takes a requirement from any source — raw text, Jira ticket, Linear issue, GitHub issue,
**Figma design URL**, or any combination — and produces a structured Markdown breakdown
(Summary, Scope, Functional, Non-Functional, Risks & Dependencies, Ambiguities). When a Figma
URL is supplied alongside a ticket, the analysis merges design context (screenshot + designer
annotations + visible elements + responsive frames) with the ticket text. Asks for approval,
then offers to hand off to `draft-test-cases`.

### [draft-test-cases](draft-test-cases/SKILL.md)

Consumes the approved analysis and produces a `.xlsx` draft matching
`TEST_CASE_CONVENTION.md` exactly. Covers happy path, edge cases, negative cases, NFR cases,
and risk-driven cases by default; when the analysis carries Figma context, additionally
covers visual states, responsive breakpoints, exact copy/labels, and accessibility cases
called out by designer annotations. Approval-gated — nothing is written until you say so.

### [create-test-cases](create-test-cases/SKILL.md)

Reads the `.xlsx` from `draft-test-cases` and files one ticket per row in Jira, Linear, or
GitHub via the matching MCP. Always does a dry-run first — you approve the full batch before
any ticket is created. Reports back ticket keys/URLs and optionally writes a
`{file}.tickets.json` sidecar.

---

## MCPs

These skills call out to MCP servers when the input is a URL or the output is a ticket:

| Source / target           | MCP server          | Used by                                                    |
| ------------------------- | ------------------- | ---------------------------------------------------------- |
| Jira tickets              | Atlassian Rovo MCP  | analyze-requirement, create-test-cases                     |
| Linear issues             | Linear MCP          | analyze-requirement, create-test-cases                     |
| GitHub issues             | GitHub MCP          | analyze-requirement, create-test-cases                     |
| Figma designs (read-only) | claude.ai Figma MCP | analyze-requirement (draft-test-cases consumes its output) |

No MCP is required to use raw-text input + `onboarding` + `draft-test-cases` — those work
purely on uploaded files. MCPs only become required at the edges: pulling from a ticketing
system, reading a Figma design, or pushing tickets back out.

---

## Setup

Two options:

**Guided (recommended).** Open [SETUP_PROMPT.md](SETUP_PROMPT.md), copy the prompt inside it
into a fresh chat in your Claude Project, and follow the step-by-step walkthrough. It covers
the repo clone, Project Instructions, all four skill uploads, MCP connector setup, and the
first `onboarding` run — gated on your confirmation at each step.

**Manual.**

1. Drop the contents of this folder into your Claude project (or wherever skills are loaded).
2. Open [INSTRUCTIONS.md](INSTRUCTIONS.md) and paste it into your project's **Project
   Instructions**.
3. Run `onboarding` once with your team's sample test-case Excel and upload the resulting
   `TEST_CASE_CONVENTION.md` to **Project Knowledge**.
4. Connect any MCPs you need (Atlassian Rovo, Linear, GitHub, Figma) in your Claude MCP
   settings. The skills surface clear "MCP not connected" messages when a needed server is
   missing, so you can wire them up incrementally.

---

## Repo Layout

```
manual-qc-skills/
├── INSTRUCTIONS.md              # Senior Manual QA Tester persona — paste into project instructions
├── SETUP_PROMPT.md              # Copy-paste install walkthrough for Claude Desktop / claude.ai
├── README.md
├── onboarding/
│   ├── SKILL.md
│   └── scripts/                 # analyze_excel.py
├── analyze-requirement/
│   └── SKILL.md
├── draft-test-cases/
│   ├── SKILL.md
│   └── scripts/                 # write_test_cases.py
└── create-test-cases/
    └── SKILL.md
```
