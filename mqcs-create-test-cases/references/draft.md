# Phase 2 — Draft Test Cases to Excel

Draft test cases from the approved Phase 1 analysis, get user approval on the table, then
produce a pixel-perfect Excel file matching the `TEST_CASE_CONVENTION.md` stored in Project
Knowledge. The resulting `.xlsx` is the input to Phase 3 (file as tickets).

---

## Prerequisites

Before proceeding, verify both inputs are available:

1. **TEST_CASE_CONVENTION.md** — must be present in Project Knowledge (produced by the
   `mqcs-onboarding` skill and uploaded by the user). If you do not see it in the available
   project context, stop and tell the user:

   > I can't find `TEST_CASE_CONVENTION.md` in this project's knowledge. Please run the
   > **mqcs-onboarding** skill first by uploading your Excel test case template, then upload
   > the generated `TEST_CASE_CONVENTION.md` file into Project Knowledge.

2. **Approved analysis** — the Phase 1 Markdown analysis the user just approved. Pass it
   through verbatim — do not regenerate or summarize it.

---

## Step 2.1 — Parse Both Inputs

### From TEST_CASE_CONVENTION.md (Project Knowledge)

Extract:

- Sheet structure (names, layout, purpose)
- Column schema (exact column names, order, types, allowed values)
- Header row index
- Grouping row structure (if any)
- ID / numbering scheme
- Text patterns and phrasing conventions
- All formatting details: merged cells, column widths, row heights, colours (fill, font),
  borders, fonts, font sizes, bold/italic flags, alignment, wrap text settings

### From the approved analysis

Map sections to test case content:

- **📋 Summary** → used for the filename and sheet title (if applicable)
- **⚙️ Functional Requirements** → primary source for happy path and functional test cases
- **🔒 Non-Functional Requirements** → source for performance, security, usability test cases
- **🎯 Scope** → confirms coverage boundaries; do not write test cases for out-of-scope items
- **❓ Ambiguities & Questions** → flag in a note; do not generate cases for unresolved
  ambiguities
- **⚠️ Risks & Dependencies** → use to add edge case and negative test cases around risky areas

### From Figma design context (if present in the analysis)

Phase 1 may have merged a Figma design into the analysis. Telltale signs: the Summary mentions
a Figma design, the Functional Requirements list visible UI elements/states, the NFRs reference
responsive breakpoints or accessibility annotations, or the Risks/Ambiguities section calls out
design-vs-spec mismatches.

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

When the analysis includes Figma design context, additionally cover:

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
> - Reply **"approved"** to write the Excel file.
> - Or give feedback on specific rows or sections and I will revise before writing.

---

### Handling feedback (revision loop)

If the user provides feedback:

- Apply only the changes requested — do not regenerate unaffected rows
- Re-display the full updated table
- Ask for approval again
- Repeat until the user replies with "approved" or equivalent confirmation

Do not write any Excel file until explicit approval is received.

---

## Step 2.4 — Write the Excel File

Once approved, produce the Excel file pixel-perfect against the TEST_CASE_CONVENTION.

### Filename

Format: `d-m-y-h-i-s-<requirement-summary>.xlsx`

- Use today's date in `d-m-y-h-i-s` format (e.g. `13-5-2026-14-30-15`)
- Derive `<requirement-summary>` from the **📋 Summary** section of the approved analysis: take
  the first 5–7 significant words, lowercase, hyphen-separated, strip punctuation
- Example: `13-5-2026-14-30-15-user-login-with-sso.xlsx`

### Excel generation approach

Do **not** write openpyxl code inline. Build a single JSON spec describing every sheet, then
run `scripts/write_test_cases.py` (in this skill's folder) to produce the `.xlsx`. The script
handles columns, widths, header/data styling, borders, fills, fonts, merged cells, and data
validation.

Translation rules from TEST_CASE_CONVENTION.md into the spec:

- **Sheets**: one entry per sheet in the convention, in the exact order and with exact names.
- **header_row**: from the convention's Row Structure section.
- **columns**: column names in exact order from the Column Schema table.
- **column_widths**: from the Formatting Details → Column widths table, keyed by Excel letter.
- **header_style / data_style**: from the corresponding Formatting Details sections. Use
  `"none"` or `null` for absent fills/borders.
- **merged_cells**: ranges from the Merged cells section, or omit/empty.
- **data_validations**: convert each Data validation row to `{cells, type: "list", values: [...]}`.
- **rows**: one dict per approved test case, keyed by the exact column names. Apply the ID
  numbering scheme from the convention (e.g. starting at `TC-001`). Write enum values exactly
  as the convention lists them — do not paraphrase. Insert grouping rows at their correct
  positions if the convention defines any.

The output filename is `d-m-y-h-i-s-<requirement-summary>.xlsx` in `/mnt/user-data/outputs/`:

```python
from datetime import datetime
now = datetime.now()
filename = f"{now.day}-{now.month}-{now.year}-{now.hour}-{now.minute}-{now.second}-<requirement-summary>.xlsx"
output_path = f"/mnt/user-data/outputs/{filename}"
```

Then write the spec to a temp JSON file and run the script:

```bash
python scripts/write_test_cases.py /tmp/spec.json
```

See `scripts/write_test_cases.py` for the full spec JSON schema and accepted style fields.
After the script reports the saved path, present the file to the user.

---

## Output Rules

- Never write the Excel file before receiving explicit user approval.
- Never add columns, sheets, or formatting not present in the TEST_CASE_CONVENTION.
- Never generate test cases for out-of-scope items or unresolved ambiguities.
- If TEST_CASE_CONVENTION is ambiguous about a formatting detail, replicate the closest
  observable pattern from the mqcs-onboarding source file rather than inventing something new.
- The revision loop has no fixed limit — keep iterating until the user approves.
