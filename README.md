# Manual QA Skills

A pair of Claude skills for a manual-QA workflow: learn your test-case Excel template once,
then take any requirement (text / Jira / Linear / GitHub / Figma) all the way to filed tickets
in your tracker.

All skills are prefixed `mqcs-` (Manual QC Skills) so they group together in the skill list and
don't collide with other skills you may have installed.

---

### [mqcs-onboarding](mqcs-onboarding/SKILL.md)

Run **once per project**. Upload a sample test-case Excel file; the skill analyzes its sheet
structure, columns, allowed values, and formatting (widths, fonts, fills, borders, merged
cells, data validation) and writes a `TEST_CASE_CONVENTION.md`. Upload that file to **Project
Knowledge** — `mqcs-create-test-cases` reads it to keep every generated spreadsheet
pixel-perfect against your team's template.

### [mqcs-create-test-cases](mqcs-create-test-cases/SKILL.md)

End-to-end, three approval-gated phases:

1. **Analyze** — takes a requirement from any source (raw text, Jira / Linear / GitHub ticket,
   Figma design URL, or any combination) and produces a structured Markdown breakdown
   (Summary, Scope, Functional, Non-Functional, Risks & Dependencies, Ambiguities). When a
   Figma URL is supplied alongside a ticket, the analysis merges design context (screenshot +
   designer annotations + visible elements + responsive frames) with the ticket text.
2. **Draft** — consumes the approved analysis and writes a `.xlsx` matching
   `TEST_CASE_CONVENTION.md` exactly. Covers happy path, edge cases, negative cases, NFR cases,
   risk-driven cases — plus visual states, responsive breakpoints, exact copy/labels, and
   accessibility cases when the analysis carries Figma context.
3. **File** — pushes one ticket per row into Jira, Linear, or GitHub via the matching MCP.
   Always does a dry-run first; reports back ticket keys/URLs and optionally writes a
   `{file}.tickets.json` sidecar.

Each phase requires explicit user approval before the next starts, and the user can enter the
flow at any phase if they already have the upstream artifact (an approved analysis, or a
drafted `.xlsx`).

Phase-by-phase procedure lives in [mqcs-create-test-cases/references/](mqcs-create-test-cases/references/);
the top-level [SKILL.md](mqcs-create-test-cases/SKILL.md) is the slim orchestrator.

---

## MCPs

`mqcs-create-test-cases` calls out to MCP servers when the input is a URL or the output is a
ticket:

| Source / target           | MCP server          | Used in phase                |
| ------------------------- | ------------------- | ---------------------------- |
| Jira tickets              | Atlassian Rovo MCP  | Analyze (read), File (write) |
| Linear issues             | Linear MCP          | Analyze (read), File (write) |
| GitHub issues             | GitHub MCP          | Analyze (read), File (write) |
| Figma designs (read-only) | claude.ai Figma MCP | Analyze (read)               |

No MCP is required to use raw-text input + `mqcs-onboarding` + the Draft phase — those work
purely on uploaded files. MCPs only become required at the edges: pulling from a ticketing
system, reading a Figma design, or pushing tickets back out.
