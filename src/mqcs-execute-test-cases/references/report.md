# Phase 3 — Report Execution Results

Consume the result records from Phase 2, produce a results Markdown file that mirrors the
source `.md` with status columns appended, and render a human-readable summary in chat.

---

## Prerequisites

- All result records from Phase 2 are in memory (or a JSON sidecar file if the session was
  resumed).
- The source `.md` is available (same file used in Phase 1).
- `TEST_CASE_CONVENTION.md` is available in Project Knowledge.

---

## Step 3.1 — Build the Result Dataset

Merge result records from Phase 2 back onto the test cases parsed from the source `.md` by
matching `tc_id`. For every row in the source:

- If a result record exists → use its `status`, `actual_result`, `evidence`, and any reason fields.
- If no result record exists (e.g. row was skipped due to abort) → set `status: Blocked`,
  `blocked_reason: "Not reached — execution aborted before this test case."`.

The merged dataset becomes the rows for the result Markdown table.

---

## Step 3.2 — Write the Result Markdown File

### Filename

Format: `{source_basename}-results.md`

- Derive from the source file's basename (strip the `.md` extension, append `-results.md`).
- Example: `13-5-2026-14-30-15-user-login-with-sso-results.md`

### File structure

The result `.md` is a single Markdown document with two sections: **Results** (a table) and
**Summary** (key-value block).

#### Section 1 — Results

Reproduce every column from the source `.md` in the exact original order. Then append these
additional columns at the right:

| Column name           | Content                                                                         |
| --------------------- | ------------------------------------------------------------------------------- |
| `Execution Method`    | `postman`, `chrome`, or `manual`                                                |
| `Status`              | `✅ Pass`, `❌ Fail`, or `⚠️ Blocked` (emoji + label, one cell)                 |
| `Actual Result`       | What actually happened (from result record `actual_result`)                     |
| `Evidence`            | Truncated response body or page content snippet (from result record `evidence`) |
| `Fail / Block Reason` | Combined `fail_reason` or `blocked_reason` when applicable; empty for Pass      |

Use the same Markdown-table conventions as Phase 2 of `mqcs-create-test-cases`:

- Join multi-line cell content with `<br>`.
- Escape literal `|` characters in cell content as `\|`.
- Preserve the source's column order and exact column names; do not rename them.

There is no per-cell fill colour in Markdown — the emoji prefix in the `Status` column
(`✅` / `❌` / `⚠️`) is the visual marker.

#### Section 2 — Summary

Below the table, append a fenced text block (no table — just key-value lines):

```text
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

### File body template

The complete result file should look like:

```markdown
# Execution Results — <requirement summary>

_Source file_: <source filename>
_Executed on_: <ISO 8601 datetime>
_Total_: <N> test cases

## Results

| <Col 1 from source> | ... | <Col K from source> | Execution Method | Status | Actual Result | Evidence | Fail / Block Reason |
| ------------------- | --- | ------------------- | ---------------- | ------ | ------------- | -------- | ------------------- |
| ...                 | ... | ...                 | ...              | ...    | ...           | ...      | ...                 |

## Summary

` ` ` text
Execution Summary

---

...
` ` `
```

### Writing the file

Write to `/mnt/user-data/outputs/`:

```python
from pathlib import Path

output_path = Path("/mnt/user-data/outputs") / f"{source_basename}-results.md"
output_path.write_text(markdown_body)
print(f"Saved: {output_path}")
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

- Never alter the source `.md`.
- The result file is a new `.md` file — it does not replace the source.
- Never mark a test `Pass` if its result record lacks evidence.
- If a failed test's `fail_reason` is empty (shouldn't happen, but defensive), set it to
  `"Execution produced a non-passing status with no recorded reason — manual review required."`.
- Always present the file before printing the chat summary so the user can download immediately.
