---
name: mqcs-onboarding
description: >
  Read an uploaded Excel file containing test case examples, analyze its structure and format, and
  store the extracted convention as a downloadable file the user can upload to Project Knowledge.
  Use this skill once at the start of a
  project when the user uploads a test case template or sample Excel file and wants future test case
  generation to follow that format. Triggers include: uploading an Excel file with test cases,
  "learn this format", "read this template", "onboard this test case file", or any request to
  establish a test case convention from an existing file.
---

# Onboarding Skill

Read an uploaded Excel test case file, extract its structure and conventions, and save them as a
downloadable `TEST_CASE_CONVENTION.md` file. The user uploads it once to **Project Knowledge** so
all subsequent test case generation follows the same format.

---

## Step 1 — Read the Excel File

The user will have uploaded an `.xlsx` file. It appears under `/mnt/user-data/uploads/`.

> First list that directory to locate the file. If no `.xlsx` is present, ask the user to upload
> one. If multiple are present, ask which one to onboard.

Run the analysis script (in this skill's `scripts/` folder) with the path to the uploaded file:

```bash
python scripts/analyze_excel.py /mnt/user-data/uploads/<filename>.xlsx
```

The script prints both content (via pandas) and formatting (via openpyxl) for **every sheet** —
including merged cells, column widths, row heights, fonts, fills, borders, alignment, and data
validation. All of these are required by the downstream **draft-test-cases** skill, so do not
skip running this script.

---

## Step 2 — Analyze the Format

From the pandas output (content) and openpyxl output (formatting), extract:

### Sheet structure

- How many sheets are there, and what does each represent?
- Is there one sheet per feature, one per test type, or a flat list?

### Column schema

For each column:

- **Column name / header** (exact label as written)
- **Data type**: text, number, dropdown/enum, date, boolean
- **Purpose**: what kind of information goes in this column
- **Required or optional**: infer from whether sample rows leave it blank
- **Allowed values / enum**: from data validation rules or observed values (e.g. Pass/Fail, High/Medium/Low)

### Row structure

- Header row index
- Grouping rows (section headers, merged cells, category rows) — describe if present
- Example/sample test case rows

### Formatting (from openpyxl output)

- Column widths per column
- Row heights for non-default rows (especially header and grouping rows)
- Header row styling: font (name/size/bold/italic/color), fill colour, border, alignment
- Data row styling: same attributes
- Grouping / section row styling: same attributes (if grouping rows exist)
- Merged cell ranges
- Data validation rules (which cells, what allowed values)
- Colour coding meaning (e.g. red = failed, yellow = blocked) — infer from observed patterns

### Notable patterns

- ID / numbering scheme (e.g. TC-001, sequential integers)
- Formulas in the file
- Calculated or derived fields
- Mandatory prefix/suffix patterns in text fields
- Consistent vocabulary in steps/expected results (e.g. "Verify that…", "Given / When / Then")

---

## Step 3 — Produce the Convention Document

Write the extracted convention as a structured Markdown document. This is what will be saved as
`TEST_CASE_CONVENTION.md` and machine-read by the **draft-test-cases** skill. Use the format
below exactly — keep section names and table headers stable so draft-test-cases can parse it.

---

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

---

## Step 4 — Save as a Project Knowledge File

Present the convention document to the user and ask them to confirm it looks correct.

Once confirmed, write the convention to a file in the sandbox outputs so the user can download it:

```python
convention_md = """<paste the full convention markdown here, exactly as displayed>"""
with open('/mnt/user-data/outputs/TEST_CASE_CONVENTION.md', 'w') as f:
    f.write(convention_md)
print("Saved: /mnt/user-data/outputs/TEST_CASE_CONVENTION.md")
```

Then tell the user:

> I've saved the convention as **TEST_CASE_CONVENTION.md**. To make it available to all future
> chats in this project:
>
> 1. Download the file from this chat.
> 2. Upload it into this Claude Project's **Project Knowledge**.
>
> Once it's in Project Knowledge, the **draft-test-cases** skill will read it automatically and
> apply this exact format when generating test cases.

---

## Output Rules

- Do not generate any test cases during onboarding — analysis only.
- Do not guess or invent column names. Use only what is present in the file.
- If the file is empty or has no recognizable structure, report what was found and ask the user to
  provide a more complete template.
- If multiple sheets have different formats, document each sheet's schema separately.
- Keep the convention document factual and precise — it will be machine-read by another skill.
