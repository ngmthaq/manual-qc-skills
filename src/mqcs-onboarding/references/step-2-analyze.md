# Step 2 — Analyze the Pasted Header

Work only from the text the user pasted in Step 1. Do not invent columns, types, or values that
were not in the paste or in the user's follow-up answers.

## Column schema

For each column the user pasted, extract:

- **Column name / header** — exact label, preserving casing, punctuation, and spacing.
- **Column order** — the left-to-right order the user pasted.
- **Inferred data type** — text, number, dropdown/enum, date, boolean. Mark as "unknown" if you
  cannot tell from the header label or sample row.
- **Purpose** — a short description of what the column holds, inferred from the label (e.g.
  "Steps", "Expected Result", "Priority").
- **Required or optional** — only mark "required" if the user said so or it is clearly load-
  bearing (e.g. `ID`, `Title`). Otherwise leave as "unknown".
- **Allowed values / enum** — only if the user provided them (in a sample row or follow-up
  answer). Do not guess values for dropdown columns.

## Sample row (if provided)

If the user pasted one or more sample rows along with the header:

- Use them to refine inferred data types and allowed values.
- Capture one representative row verbatim for the "Example Row" section of the convention.

## ID / numbering scheme

If a sample row or the user's follow-up answer reveals a clear ID pattern (e.g. `TC-001`,
sequential integers, feature-prefixed codes), capture it. Otherwise mark as "not specified".

## Text patterns

Only note text patterns the user actually demonstrated (e.g. steps written as
"Given / When / Then", expected results starting with "Verify that…"). Do not impose a phrasing
convention that the user did not show.

## What you do NOT analyze

The user is pasting plain text, so the following are **out of scope** for this skill and must not
appear in the convention document:

- Column widths, row heights
- Fonts, fill colours, borders, alignment, wrap settings
- Merged cell ranges
- Data validation rules at the cell level
- Colour coding semantics
- Formulas or calculated fields

If the user explicitly mentions any of these in chat, capture them as free-text notes under a
"User-Provided Notes" section, but do not fabricate values.
