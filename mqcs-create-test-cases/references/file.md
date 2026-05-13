# Phase 3 — File Test Cases as Tickets

Read the draft Excel file produced in Phase 2 and create one ticket per test case row in the
user's chosen ticket system (Jira / Linear / GitHub) via the appropriate MCP. Always do a
dry-run with the user before any ticket is created, and always print the resulting ticket URLs
back.

---

## Prerequisites

Before proceeding, verify all three inputs are available:

1. **Draft Excel file** — produced by Phase 2. If not produced in the current session, look in
   `/mnt/user-data/uploads/` and `/mnt/user-data/outputs/` for `.xlsx` files. If multiple are
   present, ask which one. If none, tell the user:

   > I need a drafted test case Excel file. Run Phase 2 (Draft) first to produce one, then
   > come back to this phase to file the tickets.

2. **TEST_CASE_CONVENTION.md** — must be present in Project Knowledge so column meanings are
   known. If absent, tell the user:

   > I can't find `TEST_CASE_CONVENTION.md` in Project Knowledge. Run **mqcs-onboarding**
   > first so I know which columns mean title, steps, expected result, priority, etc.

3. **A connected ticket-system MCP** — at least one of:
   - **Atlassian Rovo MCP** (Jira)
   - **Linear MCP**
   - **GitHub MCP**

   If none is connected, stop and tell the user:

   > No ticket-system MCP is connected. Connect one of **Atlassian Rovo (Jira)**, **Linear**,
   > or **GitHub** in your MCP settings and re-run this phase. I will not create tickets
   > without one of these MCPs available.

   If more than one is connected, ask the user which target system to use.

---

## Step 3.1 — Read the Draft File

Load the `.xlsx` with pandas/openpyxl. For each sheet that contains test cases:

- Identify the header row from TEST_CASE_CONVENTION.md.
- Skip grouping rows and empty rows.
- Build an in-memory list of test-case records, each keyed by the exact column names from the
  convention.

Do not modify the Excel file. Treat it as read-only input.

---

## Step 3.2 — Ask the User for Destination Settings

Confirm with the user before any ticket is created:

### Common to every target

- **Target system**: Jira / Linear / GitHub (skip the prompt if only one MCP is connected).
- **Dry-run vs. real run**: default to dry-run on the first pass.
- **Parent / epic / tracking issue** (optional): if present, every created ticket is linked
  to it.
- **Labels to apply** (optional): in addition to any derived from the Type / Module / Feature
  columns, always add `qa-test-case` so the tickets are easy to bulk-find later.

### Jira-specific

- **Project key** (e.g. `PROJ`)
- **Issue type** — default to `Test` if it exists in the project, otherwise `Task`. Ask if
  unsure. Never silently fall back.
- **Components** (optional)
- **Fix version** (optional)

### Linear-specific

- **Team key** (e.g. `QA`)
- **Project / cycle** (optional)
- **Workflow state** — default to `Backlog`. Ask before overriding.

### GitHub-specific

- **Repository** in `owner/repo` form
- **Milestone** (optional)
- **Assignees** (optional)

---

## Step 3.3 — Map Columns → Ticket Fields

Use TEST_CASE_CONVENTION.md to identify which Excel columns hold which information. The default
mapping is:

| Excel column intent          | Ticket field (Jira / Linear / GitHub)                               |
| ---------------------------- | ------------------------------------------------------------------- |
| Title / Summary / Test Name  | `summary` (Jira) / `title` (Linear, GitHub)                         |
| Pre-condition / Setup        | First section of description: `### Pre-condition`                   |
| Steps / Test Steps           | Second section: `### Steps` as a numbered Markdown list             |
| Expected Result              | Third section: `### Expected Result`                                |
| Notes / Remarks              | Fourth section: `### Notes`                                         |
| Priority                     | `priority` field; map values per "Priority value translation" below |
| Type / Category              | Added as a label, lowercase-kebab (e.g. `regression`, `edge-case`)  |
| Module / Feature / Area      | Added as a label, lowercase-kebab                                   |
| Test Case ID (e.g. `TC-001`) | Prepended to the title in brackets, e.g. `[TC-001] User can log in` |

If the convention defines columns that don't fit any of the slots above, append them as a final
`### Additional Fields` block at the bottom of the description using a `**Column**: value` list.

### Priority value translation

Map convention priority values to each target's vocabulary. If the convention's values already
match the target's, pass them through unchanged.

| Convention example | Jira    | Linear     | GitHub label |
| ------------------ | ------- | ---------- | ------------ |
| Critical / P0      | Highest | Urgent (1) | `p0`         |
| High / P1          | High    | High (2)   | `p1`         |
| Medium / P2        | Medium  | Medium (3) | `p2`         |
| Low / P3           | Low     | Low (4)    | `p3`         |

GitHub has no priority field, so priority is always emitted as a `p0`/`p1`/`p2`/`p3` label
there.

---

## Step 3.4 — Present the Dry-Run for Approval

Render a Markdown table to the chat with one row per test case, showing exactly what will be
created. Columns:

| #   | TC ID | Title (after `[TC-xxx]` prefix) | Labels | Priority | Parent | Target |
| --- | ----- | ------------------------------- | ------ | -------- | ------ | ------ |

Above the table, restate the target system, project/team/repo, issue type, and parent. Below
the table, show a **single full sample ticket body** (description Markdown) for row 1, so the
user can sanity-check the description formatting before approving the whole batch.

Then ask:

> ✅ **{N} tickets ready to create in {Target} → {Project/Team/Repo}.**
>
> - Reply **"approved"** to create them.
> - Reply with row numbers and changes to revise (e.g. _"row 4 priority is wrong, should be High"_,
>   _"drop rows 7 and 12"_).
> - Reply **"export only"** to skip ticket creation and just save the rendered payloads to a
>   JSON file you can review.

Do not call any MCP write tool before explicit approval.

---

## Step 3.5 — Create the Tickets

Once approved:

1. Iterate the rows in order. For each row, call the appropriate MCP tool:
   - **Jira (Atlassian Rovo MCP)**: create issue with project, issue type, summary,
     description, priority, labels, components, fix version, and parent link if any.
   - **Linear MCP**: create issue with team, title, description, priority, labels, state,
     project/cycle, and parent link if any.
   - **GitHub MCP**: create issue with title, body, labels (including priority label),
     milestone, assignees. Use a task-list checkbox in the parent tracking issue if one was
     given (see Step 3.6).

2. **Stop on first failure.** Do not silently skip. Tell the user which row failed, the error
   from the MCP, and ask whether to retry, skip, or abort. This keeps partial batches
   debuggable.

3. **Rate limiting**: if the MCP responds with a rate-limit or throttling error, wait and
   retry that single row with exponential backoff (1s, 2s, 4s, max 3 tries) before surfacing.

4. **Capture the returned ticket key/URL** for every successful creation.

---

## Step 3.6 — Wire Up Parent Linking (if requested)

If the user supplied a parent / epic / tracking issue:

- **Jira**: set the new issue's `parent` field (or "Epic Link" custom field on older instances)
  to the parent key at creation time.
- **Linear**: set `parentId` to the parent's UUID at creation time.
- **GitHub**: after all child issues are created, edit the parent issue body to append a
  `## Test Cases` section containing a Markdown task list of links to every created child.
  Do this in **one** edit at the end, not one edit per child.

---

## Step 3.7 — Report Back

Once the batch finishes (or aborts), print a final report:

```
✅ Created {N} / {M} tickets in {Target}

| TC ID  | Title                           | Ticket          |
| ------ | ------------------------------- | --------------- |
| TC-001 | User can log in with SSO        | PROJ-1234       |
| TC-002 | SSO login rejects expired token | PROJ-1235       |
| ...    |                                 |                 |

❌ Failed: {row numbers + error summaries}, or "none"

Parent: {parent key/URL or "none"}
```

Then offer:

> Save this report as a JSON sidecar next to the source Excel? (yes/no)

If yes, write `{excel_basename}.tickets.json` to `/mnt/user-data/outputs/` containing the array
of `{tc_id, title, ticket_key, ticket_url, status}` records.

---

## Output Rules

- Never create tickets before explicit approval.
- Never invent column meanings — derive them from TEST_CASE_CONVENTION.md. If a needed slot
  (title / steps / expected result) cannot be located in the convention, stop and ask the user
  which column to use.
- Never silently skip rows. Either include them or surface the reason.
- Never alter the source Excel file.
- If the user pivots mid-flow (e.g. "actually let's send these to Linear instead"), restart at
  Step 3.2 — destination changes invalidate the previous dry-run.
- Always add the `qa-test-case` label so the batch can be re-found and bulk-edited later.
