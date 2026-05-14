# Phase 2 — Draft Test Cases to a Markdown File

Draft test cases from the approved Phase 1 analysis, get user approval on the table, then
produce a Markdown file containing the test case table — matching the column schema and
conventions in `TEST_CASE_CONVENTION.md` (stored in Project Knowledge). The resulting `.md`
file is the input to Phase 3 (file as tickets).

---

## Prerequisites

Before proceeding, verify both inputs are available:

1. **TEST_CASE_CONVENTION.md** — must be present in Project Knowledge (produced by the
   `mqcs-onboarding` skill and uploaded by the user). If you do not see it in the available
   project context, stop and tell the user:

   > I can't find `TEST_CASE_CONVENTION.md` in this project's knowledge. Please run the
   > **mqcs-onboarding** skill first by pasting your Excel test case template header, then
   > upload the generated `TEST_CASE_CONVENTION.md` file into Project Knowledge.

2. **Approved analysis** — the Phase 1 Markdown analysis the user just approved. Pass it
   through verbatim — do not regenerate or summarize it.

---

## Step 2.1 — Parse Both Inputs

### From TEST_CASE_CONVENTION.md (Project Knowledge)

Extract:

- **Column schema** — exact column names, order, types, allowed values
- **ID / numbering scheme** — pattern to use for each test case ID
- **Text patterns** — phrasing conventions for title, steps, expected result, etc.
- **User-Provided Notes** — any extra constraints the user volunteered during onboarding

The convention is text-only. It does not define spreadsheet styling — there is no formatting,
merged cells, column widths, or fonts to honour because Phase 2 writes a Markdown file, not
an Excel file.

### From the approved analysis

Map sections to test case content:

- **📋 Summary** → used for the filename and the file's top-level heading
- **⚙️ Functional Requirements** → primary source for happy path, validation, and business-rule test cases
- **🖼️ UI Requirements** → primary source for UI, visual, content, and interaction-state test cases
- **🔒 Non-Functional Requirements** → source for performance, security, usability, and responsive-behaviour test cases
- **🎯 Scope** → confirms coverage boundaries; do not write test cases for out-of-scope items
- **❓ Ambiguities & Questions** → flag in a note; do not generate cases for unresolved
  ambiguities
- **⚠️ Risks & Dependencies** → use to add edge case and negative test cases around risky areas

### From Figma design context (if present in the analysis)

Phase 1 may have merged a Figma design into the analysis. Telltale signs: the Summary mentions
a Figma design, the **🖼️ UI Requirements** section lists visible UI elements/states, the NFRs
reference responsive breakpoints or accessibility annotations, or the Risks/Ambiguities section
calls out design-vs-spec mismatches.

When present, extract and reuse it directly — **do not re-fetch from the Figma MCP**. The
analysis is the contract; this phase consumes it. From the design-derived content, mine:

- **Visible UI elements** (buttons, inputs, links, headings, error/empty/loading states)
- **Interaction states** (hover, focus, disabled, pressed, selected)
- **Responsive frames / breakpoints** mentioned in NFRs
- **Designer annotations** that act as acceptance criteria
- **Design tokens / theming** notes (colour, typography, spacing) if surfaced as NFRs

If you suspect the analysis is missing Figma content the user wanted included, stop and tell
them to re-run Phase 1 with the Figma URL — do not invoke the Figma MCP from this phase.

---

## Step 2.2 — Generate Test Cases

Generate a comprehensive set of test cases covering:

- **Happy path** — standard successful flows for each functional requirement
- **Edge cases** — boundary values, empty inputs, maximum lengths, zero values
- **Negative cases** — invalid input, missing required fields, unauthorised access
- **Non-functional cases** — one test case per relevant NFR (performance, security, etc.)
- **Risk-driven cases** — targeted cases for each risk or dependency identified

When the analysis includes **🖼️ UI Requirements** (often sourced from Figma design context),
additionally cover:

- **Visual states** — each interaction state visible in the design (default, hover, focus,
  disabled, pressed, selected, loading, empty, error)
- **Responsive behaviour** — one case per breakpoint frame called out in the NFRs
  (e.g. mobile / tablet / desktop layouts)
- **Copy and labels** — verify exact button labels, headings, error messages, and
  placeholder text match the design
- **Accessibility** — cases derived from designer annotations: keyboard navigation,
  focus order, ARIA labels, contrast, screen reader announcements (only what the design
  or NFRs explicitly call out — don't invent generic a11y cases)
- **Design-token compliance** — only if the convention has a column where this fits and
  the NFRs reference specific tokens; otherwise skip

Treat these as additive to the functional set, not replacements. If the convention has a
**Type / Category** column, use the value that best fits (e.g. `UI`, `Visual`, `Responsive`,
`Accessibility`) — pick from the convention's allowed values, do not invent new ones.

Apply the TEST_CASE_CONVENTION text patterns strictly:

- Use the exact phrasing style found in the convention (e.g. "Verify that…", "Given / When / Then")
- Use only allowed values for enum columns (e.g. Priority, Status, Type)
- Apply the ID / numbering scheme from the convention starting from TC-001 (or whatever the
  scheme specifies)
- Do not invent column names or add columns not in the convention

---

## Step 2.3 — Present for Approval

Display the generated test cases as a Markdown table in the chat using the exact column names
from the convention. Show all columns.

After the table, display:

---

> ✅ **{N} test cases generated.** Please review the list above.
>
> - Reply **"approved"** to write the Markdown file.
> - Or give feedback on specific rows or sections and I will revise before writing.

---

### Handling feedback (revision loop)

If the user provides feedback:

- Apply only the changes requested — do not regenerate unaffected rows
- Re-display the full updated table
- Ask for approval again
- Repeat until the user replies with "approved" or equivalent confirmation

Do not write any file until explicit approval is received.

---

## Step 2.4 — Write the Markdown File

Once approved, write a Markdown file containing the test cases as a Markdown table.

### Filename

Format: `d-m-y-h-i-s-<requirement-summary>.md`

- Use today's date in `d-m-y-h-i-s` format (e.g. `13-5-2026-14-30-15`)
- Derive `<requirement-summary>` from the **📋 Summary** section of the approved analysis: take
  the first 5–7 significant words, lowercase, hyphen-separated, strip punctuation
- Example: `13-5-2026-14-30-15-user-login-with-sso.md`

### File contents

The file is a plain Markdown document with exactly this structure:

```markdown
# Test Cases — <requirement summary, title-cased>

_Source analysis_: <one-line restatement of the analysis Summary>
_Generated_: <date the file is written, ISO 8601>
_Convention_: TEST*CASE_CONVENTION.md
\_Total*: <N> test cases

| <Col 1> | <Col 2> | ... | <Col K> |
| ------- | ------- | --- | ------- |
| ...     | ...     | ... | ...     |
```

Translation rules from TEST_CASE_CONVENTION.md into the file:

- **Columns**: use the column names in the **exact order** from the Column Schema table. Do
  not rename, reorder, add, or drop columns.
- **Table header separator**: one `---` cell per column. Left-align by default; use `:---:` /
  `---:` only if the convention's Text Patterns explicitly call for centered or right-aligned
  values.
- **Rows**: one row per approved test case, keyed by the exact column names. Apply the ID
  numbering scheme from the convention (e.g. starting at `TC-001`). Write enum values exactly
  as the convention lists them — do not paraphrase.
- **Multi-line cell content**: if a step list or expected result needs multiple lines inside
  a single cell, join them with `<br>` so the Markdown table stays single-row-per-test-case.
  Preserve the user's phrasing — do not collapse semantically distinct steps.
- **Pipes inside text**: escape literal `|` characters in cell content as `\|`.

Write the file to `/mnt/user-data/outputs/`:

```python
from datetime import datetime
now = datetime.now()
filename = f"{now.day}-{now.month}-{now.year}-{now.hour}-{now.minute}-{now.second}-<requirement-summary>.md"
output_path = f"/mnt/user-data/outputs/{filename}"

with open(output_path, "w") as f:
    f.write(markdown_body)
print(f"Saved: {output_path}")
```

After saving, present the filename to the user and proceed to the Phase 2 → Phase 3 hand-off
question defined in `SKILL.md`.

---

## Output Rules

- Never write the Markdown file before receiving explicit user approval.
- Never add columns or change column order vs. the TEST_CASE_CONVENTION.
- Never generate test cases for out-of-scope items or unresolved ambiguities.
- If TEST_CASE_CONVENTION is ambiguous about a text pattern (e.g. step phrasing), pick the
  closest pattern present in the convention's examples rather than inventing a new one.
- The revision loop has no fixed limit — keep iterating until the user approves.
