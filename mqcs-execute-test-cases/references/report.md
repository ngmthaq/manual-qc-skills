# Phase 3 — Report Execution Results

Consume the result records from Phase 2, produce a results Excel file that mirrors the source
`.xlsx` with status columns appended, and render a human-readable summary in chat.

---

## Prerequisites

- All result records from Phase 2 are in memory (or a JSON sidecar file if the session was
  resumed).
- The source `.xlsx` is available (same file used in Phase 1).
- `TEST_CASE_CONVENTION.md` is available in Project Knowledge.

---

## Step 3.1 — Build the Result Dataset

Merge result records from Phase 2 back onto the test cases from the source `.xlsx` by
matching `tc_id`. For every row in the source:

- If a result record exists → use its `status`, `actual_result`, `evidence`, and any reason fields.
- If no result record exists (e.g. row was skipped due to abort) → set `status: Blocked`,
  `blocked_reason: "Not reached — execution aborted before this test case."`.

The merged dataset becomes the rows for the result Excel sheet.

---

## Step 3.2 — Write the Result Excel File

### Filename

Format: `{source_basename}-results.xlsx`

- Derive from the source file's basename (strip the `.xlsx` extension, append `-results.xlsx`).
- Example: `13-5-2026-14-30-15-user-login-with-sso-results.xlsx`

### Sheet structure

The result Excel file contains **two sheets**:

#### Sheet 1 — Results

Copy every column from the source `.xlsx` in the exact original order. Then append these
additional columns at the right:

| Column name           | Content                                                                         |
| --------------------- | ------------------------------------------------------------------------------- |
| `Execution Method`    | `postman`, `chrome`, or `manual`                                                |
| `Status`              | `Pass`, `Fail`, or `Blocked`                                                    |
| `Actual Result`       | What actually happened (from result record `actual_result`)                     |
| `Evidence`            | Truncated response body or page content snippet (from result record `evidence`) |
| `Fail / Block Reason` | Combined `fail_reason` or `blocked_reason` when applicable; empty for Pass      |

Apply row-level background fill to the `Status` column cell only:

| Status  | Fill colour (hex)        |
| ------- | ------------------------ |
| Pass    | `#C6EFCE` (light green)  |
| Fail    | `#FFC7CE` (light red)    |
| Blocked | `#FFEB9C` (light yellow) |

All other formatting (header style, column widths, borders) must match the source file's
convention — derive from `TEST_CASE_CONVENTION.md`.

#### Sheet 2 — Summary

A small summary block (no table header — just key-value pairs and a chart data block):

```
Execution Summary
-----------------
Source file:       {source filename}
Executed on:       {date and time}
Total test cases:  {N}
Pass:              {count} ({pct}%)
Fail:              {count} ({pct}%)
Blocked:           {count} ({pct}%)

Postman (API):     {count} total  |  {pass} Pass  |  {fail} Fail  |  {blocked} Blocked
Chrome (Browser):  {count} total  |  {pass} Pass  |  {fail} Fail  |  {blocked} Blocked
Manual (skipped):  {count} total  |  all Blocked
```

### Excel generation

Use the same `scripts/write_test_cases.py` pattern established by `mqcs-create-test-cases`
if it supports the column-append model. Otherwise, write a short inline openpyxl script:

```python
import openpyxl, json
from openpyxl.styles import PatternFill

STATUS_FILLS = {
    "Pass":    PatternFill("solid", fgColor="C6EFCE"),
    "Fail":    PatternFill("solid", fgColor="FFC7CE"),
    "Blocked": PatternFill("solid", fgColor="FFEB9C"),
}

# Load source workbook, copy to result workbook, add columns, apply fills.
# Write to /mnt/user-data/outputs/{result_filename}
```

After writing, call `present_files` with the output path so the user can download it.

---

## Step 3.3 — Render the Chat Summary

After presenting the file, print a summary table directly in chat:

```md
## Execution Results

| Status     | Count | %      |
| ---------- | ----- | ------ |
| ✅ Pass    | {N}   | {pct}% |
| ❌ Fail    | {N}   | {pct}% |
| ⚠️ Blocked | {N}   | {pct}% |
| **Total**  | {N}   | 100%   |

### Failed Tests

| TC ID  | Title | Reason                                    |
| ------ | ----- | ----------------------------------------- |
| TC-003 | ...   | Expected "200 OK", got "401 Unauthorized" |

...

### Blocked Tests

| TC ID  | Title | Reason                              |
| ------ | ----- | ----------------------------------- |
| TC-007 | ...   | Manual test — requires human tester |

...

(Blocked section omitted if count is 0)
```

---

## Step 3.4 — Offer Follow-Up Actions

After the summary, offer:

> **What would you like to do next?**
>
> - Reply **"report failures"** to create tickets for all failed tests via the ticket-system MCP
>   (requires Jira / Linear / GitHub MCP — runs the mqcs-create-test-cases Phase 3 flow for
>   failures only).
> - Reply **"retry blocked"** to re-attempt Blocked tests after you've resolved the blocker.
> - Reply **"done"** to stop here.

### If "report failures" is chosen

Do not start immediately. Ask:

1. Which ticket system (Jira / Linear / GitHub)?
2. Which project / team / repo?
3. Should each ticket link back to the original test case ticket (if one exists)?

Then load `mqcs-create-test-cases`'s `references/ticket.md` and execute Phase 3 for the failed
rows only, treating each failed test case as the source of truth.

### If "retry blocked" is chosen

Ask the user what changed (new MCP? Updated credentials? Manual step now resolved?). Then
re-run Phase 2 for blocked tests only, using the same execution plan. Merge the new results
into the existing result set and regenerate the report.

---

## Output Rules

- Never alter the source `.xlsx`.
- The result file is a new file — it does not replace the source.
- Never mark a test `Pass` if its result record lacks evidence.
- If a failed test's `fail_reason` is empty (shouldn't happen, but defensive), set it to
  `"Execution produced a non-passing status with no recorded reason — manual review required."`.
- Always present the file before printing the chat summary so the user can download immediately.
