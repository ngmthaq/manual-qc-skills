# Step 2 — Analyze the Format

From the pandas output (content) and openpyxl output (formatting), extract:

## Sheet structure

- How many sheets are there, and what does each represent?
- Is there one sheet per feature, one per test type, or a flat list?

## Column schema

For each column:

- **Column name / header** (exact label as written)
- **Data type**: text, number, dropdown/enum, date, boolean
- **Purpose**: what kind of information goes in this column
- **Required or optional**: infer from whether sample rows leave it blank
- **Allowed values / enum**: from data validation rules or observed values (e.g. Pass/Fail,
  High/Medium/Low)

## Row structure

- Header row index
- Grouping rows (section headers, merged cells, category rows) — describe if present
- Example/sample test case rows

## Formatting

- Column widths per column
- Row heights for non-default rows, especially header and grouping rows
- Header row styling: font (name/size/bold/italic/color), fill colour, border, alignment
- Data row styling: same attributes
- Grouping / section row styling: same attributes, if grouping rows exist
- Merged cell ranges
- Data validation rules: which cells and what values are allowed
- Colour coding meaning (e.g. red = failed, yellow = blocked), inferred from observed patterns

## Notable patterns

- ID / numbering scheme (e.g. TC-001, sequential integers)
- Formulas in the file
- Calculated or derived fields
- Mandatory prefix/suffix patterns in text fields
- Consistent vocabulary in steps/expected results (e.g. "Verify that…", "Given / When / Then")
