# Step 3 — Produce the Convention Document

Write the extracted convention as a structured Markdown document. This is what will be saved as
`TEST_CASE_CONVENTION.md` and machine-read by the **draft-test-cases** skill. Use the format
below exactly — keep section names and table headers stable so draft-test-cases can parse it.

Because the user pasted plain text rather than sharing the original template file, this
convention captures **column schema and text conventions only**. Do not invent formatting,
styling, or cell-level validation details — downstream skills produce Markdown files, not
spreadsheets, so styling has no consumer anyway.

```markdown
# Test Case Convention

## Source

- Provided by: user-pasted header text
- Template name (if user said): <name or "not specified">

## Column Schema

| #   | Column Name | Type | Required | Allowed Values / Notes |
| --- | ----------- | ---- | -------- | ---------------------- |
| 1   | ...         | ...  | ...      | ...                    |

## ID / Numbering Scheme

<describe the ID pattern the user showed, e.g. "TC-001 sequential", or "not specified">

## Text Patterns

<describe consistent phrasing in title / steps / expected result fields that the user
demonstrated, or "not specified">

## Example Row

<reproduce one representative test case row, if the user pasted one, as a bullet list using exact
column names. If the user did not paste a sample row, write "not provided">

## User-Provided Notes

<any extra context the user volunteered in chat that does not fit the sections above, or "none">
```
