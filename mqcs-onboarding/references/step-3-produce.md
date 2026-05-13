# Step 3 — Produce the Convention Document

Write the extracted convention as a structured Markdown document. This is what will be saved as
`TEST_CASE_CONVENTION.md` and machine-read by the **draft-test-cases** skill. Use the format
below exactly — keep section names and table headers stable so draft-test-cases can parse it.

```markdown
# Test Case Convention

## Source File

- File name: <filename>
- Sheets analyzed: <list>

## Sheet Structure

<describe sheet layout and purpose of each sheet>

## Column Schema

| #   | Column Name | Type | Required | Allowed Values / Notes |
| --- | ----------- | ---- | -------- | ---------------------- |
| 1   | ...         | ...  | ...      | ...                    |

## Row Structure

- Header row: row <N>
- Grouping rows: <describe or "none">
- Test case rows: <describe>

## ID / Numbering Scheme

<describe the ID pattern, e.g. "TC-001 sequential" or "auto-incremented integer in column A">

## Text Patterns

<describe consistent phrasing in title / steps / expected result fields>

## Formatting Details

### Column widths

| Column | Width |
| ------ | ----- |
| A      | 12.0  |
| ...    | ...   |

### Header row styling

- Font: <name>, size <N>, bold=<bool>, italic=<bool>, color <#RRGGBB>
- Fill: <#RRGGBB or "none">
- Border: <style or "none">
- Alignment: horizontal=<>, vertical=<>, wrap_text=<bool>

### Data row styling

- Font: <name>, size <N>, bold=<bool>, italic=<bool>, color <#RRGGBB>
- Fill: <#RRGGBB or "none">
- Border: <style or "none">
- Alignment: horizontal=<>, vertical=<>, wrap_text=<bool>

### Grouping / section row styling

<describe if grouping rows exist, otherwise "none">

### Merged cells

- <range>: <purpose>
- ... or "none"

### Data validation (dropdowns)

| Cells | Type | Allowed values |
| ----- | ---- | -------------- |
| ...   | ...  | ...            |

### Colour coding meaning

<describe if applicable, otherwise "none">

## Example Row

<reproduce one representative test case row as a bullet list using exact column names>
```
