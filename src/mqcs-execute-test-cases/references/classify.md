# Phase 1 — Classify Test Cases into an Execution Plan

Read the source `.md` test case file, classify every test case by execution method
(API / Browser / Manual), resolve environment details, and produce an execution plan the user
can approve before any test runs.

---

## Step 1.1 — Load the Source File

Locate the `.md`:

1. Check if the file was produced in the current session.
2. If not, scan `/mnt/user-data/uploads/` and `/mnt/user-data/outputs/` for `.md` files
   whose names match the `mqcs-create-test-cases` naming pattern (`d-m-y-h-i-s-*.md`).
3. If multiple candidates are found, list them and ask the user which one to execute.
4. If none are found, stop with the prerequisite message from `SKILL.md`.

Read the file as plain text and parse the Markdown table. Use `TEST_CASE_CONVENTION.md` from
Project Knowledge to identify, by column name:

- The column that contains the test case **ID** (e.g. `TC-001`)
- The column that contains the **Title / Test Name**
- The column that contains **Steps** (or pre-condition + steps combined)
- The column that contains **Expected Result**
- The column that contains **Type / Category** (e.g. `API`, `UI`, `Functional`)
- The column that contains **Priority**
- Any column that might indicate the **HTTP method**, **endpoint**, or **URL** (if convention
  defines one)

Parsing rules for the table:

- Locate the header row by matching pipe-separated column names against the convention.
- Skip the `| --- | --- | ... |` separator row and any blank lines.
- Each remaining row is one test case. Split on `|`, trim whitespace from each cell.
- Inside a cell, restore line breaks by replacing `<br>` with `\n`, and un-escape `\|` back
  to `|` so multi-line steps survive intact.
- Build an in-memory list of test-case records keyed by exact column names.

---

## Step 1.2 — Classify Each Test Case

For each test case, assign an **Execution Method** based on the following rules (in priority
order):

| Rule | Condition                                                                            | Execution Method |
| ---- | ------------------------------------------------------------------------------------ | ---------------- |
| 1    | Type column value is `API` or `Backend` or contains the word "API" or "endpoint"     | `postman`        |
| 2    | Steps mention an HTTP method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) or a URL path | `postman`        |
| 3    | Type column value is `UI` or `Frontend` or `Browser`                                 | `chrome`         |
| 4    | Steps mention clicking, navigating, typing in a field, or any visible UI action      | `chrome`         |
| 5    | None of the above apply                                                              | `manual`         |

For `manual` cases, also set a **Skip Reason**: `"No automated execution method detected —
requires human tester."` These will appear in the plan but will not be executed by any MCP.

---

## Step 1.3 — Resolve Environment Settings

Collect, from the user, any values needed to run the tests. Ask once in a single consolidated
block — do not ask per test case.

### API (Postman) settings

- **Base URL** — the root URL for all API calls (e.g. `https://api.staging.example.com`)
- **Auth method** — Bearer token / API key / Basic / None
- **Auth value** — the actual token or key (treat as sensitive; do not echo back in full)
- **Postman Collection / Environment** — if the user already has a Postman collection or
  environment they want to import/use, ask for the collection ID or URL

### Browser (Chrome) settings

- **Base URL** — root URL for all browser navigation (e.g. `https://staging.example.com`)
- **Auth / login pre-condition** — if tests require a logged-in session, ask for credentials
  or a session token. Note: credentials are used only for this session; do not store them.
- **Viewport** — default to `1280x800` unless the test cases specify a breakpoint

If the user says "use defaults" or "don't ask", proceed with placeholders and flag them as
`⚠️ unresolved` in the plan.

---

## Step 1.4 — Produce the Execution Plan

Output a Markdown document structured as follows:

```md
# Execution Plan

**Source file:** {filename}
**Total test cases:** {N}
**API (Postman):** {count}
**Browser (Chrome):** {count}
**Manual (skipped):** {count}

---

## Environment

- **API Base URL:** {value or ⚠️ unresolved}
- **API Auth:** {method} — {masked value or ⚠️ unresolved}
- **Browser Base URL:** {value or ⚠️ unresolved}
- **Browser Viewport:** {value}

---

## Test Case Execution Map

| TC ID  | Title | Type (from source) | Execution Method | Notes / Pre-conditions     |
| ------ | ----- | ------------------ | ---------------- | -------------------------- |
| TC-001 | ...   | API                | postman          | Requires auth header       |
| TC-002 | ...   | UI                 | chrome           | Requires logged-in session |
| TC-003 | ...   | Functional         | manual           | No automated method        |

...
```

---

## Step 1.5 — Ask for Approval

Present the plan and ask:

> ✅ **Execution plan ready.** {N} tests will run automatically ({api} via Postman, {browser}
> via Chrome). {manual} manual tests will be skipped.
>
> Please review the plan above.
>
> - Reply **"approved"** to proceed.
> - Reply with any row corrections (e.g. _"TC-005 should use Chrome, not Postman"_) and I
>   will revise.

Repeat revision loop until approved. Do not start execution until explicit approval.

---

## Output Rules

- Never begin execution in this phase.
- Never alter the source `.md`.
- If `TEST_CASE_CONVENTION.md` does not define a Type column, classify by heuristic (rules 2
  and 4 above) and note in the plan that type classification was inferred.
- If a test case has no steps and no type, classify as `manual` and flag in the Notes column.
