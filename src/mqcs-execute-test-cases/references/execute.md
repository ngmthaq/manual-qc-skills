# Phase 2 — Execute Test Cases via Postman and Chrome MCPs

Execute every test case in the approved execution plan. For each test case, run it via the
appropriate MCP, capture the result and evidence, and store a structured result record.
Never alter the source `.md`.

---

## Prerequisites

Verify before executing anything:

1. The approved execution plan from Phase 1 is loaded into context.
2. **Postman MCP** is connected (required for `postman`-classified tests).
3. **Control Chrome MCP** is connected (required for `chrome`-classified tests).
4. Environment settings from Phase 1 are in context (base URLs, auth).

If any `postman` or `chrome` test exists but its required MCP is not connected, immediately
flag those tests as `Blocked` (with reason: `"Required MCP not connected"`) before starting.
Do not wait until the test is reached.

---

## Result Record Structure

For every test case executed, produce one result record:

```json
{
  "tc_id": "TC-001",
  "title": "...",
  "execution_method": "postman | chrome | manual",
  "status": "Pass | Fail | Blocked",
  "actual_result": "...",
  "evidence": "...",
  "blocked_reason": "... (only when status is Blocked)",
  "fail_reason": "... (only when status is Fail)"
}
```

Store all result records in-memory throughout this phase. They are the input to Phase 3.

---

## Execution Order

Run `postman` tests first, then `chrome` tests. Within each group, follow the order from the
execution plan. This minimises MCP context-switching overhead.

---

## Step 2.1 — Execute API Tests (Postman MCP)

For each test case with `execution_method: postman`:

### Parse the test steps

From the **Steps** column, extract:

- HTTP method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- Path (relative to the base URL resolved in Phase 1, e.g. `/users/123`)
- Request headers (if specified in steps)
- Request body (if specified in steps — may be JSON, form data, or none)
- Query parameters (if specified)

If any of these cannot be determined from the steps text, mark the test `Blocked` with reason:
`"Steps do not contain enough information to construct the request."` Do not guess.

### Construct the request

Merge with environment settings from Phase 1:

- Full URL: `{base_url}{path}`
- Auth header: derived from the auth method/value from Phase 1 (e.g. `Authorization: Bearer {token}`)

### Check for an existing Postman collection

Before constructing a raw request, check if the user supplied a Postman collection or
environment ID in Phase 1. If yes:

1. Use `Postman:getCollection` to retrieve it.
2. Search for a request matching the test case's method + path.
3. If found, execute using the collection request as the base and override environment variables
   as needed.
4. If not found, fall through to constructing the request manually.

### Execute via Postman MCP

Use the Postman MCP to create and run the request. Follow this sequence:

1. **Create or reuse a collection** — if no collection was supplied, create a temporary one:
   ```
   Postman:createCollection → name: "mqcs-execute-{date}"
   ```
2. **Add the request** to the collection:
   ```
   Postman:createCollectionRequest → method, url, headers, body
   ```
3. **Create a mock or run directly** — use whatever Postman MCP tool is available to execute
   the request and capture the response. Prefer direct execution if available; fall back to
   creating a mock to inspect the expected behaviour.

Capture from the response:

- HTTP status code
- Response body (truncate to 2 000 characters if too long; note truncation)
- Response time (ms) if available

### Evaluate against the expected result

From the **Expected Result** column of the source `.md`, compare:

- Expected HTTP status code (if stated, e.g. `200 OK`, `404 Not Found`)
- Expected response fields (if stated, e.g. `"status": "active"`)
- Expected error messages (if stated)

Evaluation rules:

- If the expected result is **fully met** → `status: Pass`
- If any stated expectation is not met → `status: Fail`; record `fail_reason` with the
  discrepancy (expected vs. actual)
- If the request could not be constructed or the MCP returned an error → `status: Blocked`;
  record `blocked_reason`

### Evidence for API tests

Set `evidence` to a concise summary:

```
HTTP {status_code} — {first 200 chars of response body or "empty body"}
```

Example:

```
HTTP 200 — {"id": 42, "status": "active", "email": "user@example.com", ...}
```

---

## Step 2.2 — Execute Browser Tests (Control Chrome MCP)

For each test case with `execution_method: chrome`:

### Parse the test steps

From the **Steps** column, extract a sequence of actions. Common patterns to recognise:

| Step text pattern                          | Chrome action                                                   |
| ------------------------------------------ | --------------------------------------------------------------- |
| "Navigate to / Open / Go to {url or path}" | `open_url` with full URL                                        |
| "Click {element}"                          | `execute_javascript` with `document.querySelector(...).click()` |
| "Type {value} into {field}"                | `execute_javascript` to set `.value` and dispatch `input` event |
| "Select {option} from {dropdown}"          | `execute_javascript` to set `select.value`                      |
| "Submit / Press {button}"                  | `execute_javascript` to click the submit element                |
| "Verify / Check that {text} is visible"    | `get_page_content` and check for the text                       |
| "Wait for {element / page}"                | `execute_javascript` with a short polling loop (max 5s)         |
| "Take a screenshot"                        | `get_page_content` and record the visible text as evidence      |

If a step cannot be mapped to a Chrome action, mark the test `Blocked` with reason:
`"Step cannot be automated: {step text}."`

### Pre-condition: login / session setup

If Phase 1 resolved a login pre-condition, execute it **once** before the first Chrome test
(not before every test). Use `open_url` to navigate to the login page, then automate the
credential entry and submit.

If login fails, set **all** remaining chrome tests to `Blocked: "Login pre-condition failed"`
and surface the error to the user before continuing to Phase 3.

### Execute via Control Chrome MCP

Run each step in sequence:

1. `open_url` — navigate to the starting URL (base URL + path from steps, or absolute URL).
2. Execute each subsequent step action via `execute_javascript` or the appropriate Chrome
   MCP tool.
3. After the final step, capture page content via `get_page_content` to verify the expected
   result.

### Evaluate against the expected result

From the **Expected Result** column:

- If the expected result describes **visible text or element**: check `get_page_content` for
  the stated string.
- If the expected result describes a **URL / page navigation**: check the current URL via
  `execute_javascript: window.location.href`.
- If the expected result describes an **error message**: check for the message text in page
  content.

Evaluation rules:

- All observable expectations met → `status: Pass`
- Any observable expectation not met → `status: Fail`; record `fail_reason`
- Step execution error or MCP failure → `status: Blocked`; record `blocked_reason`

### Evidence for browser tests

Set `evidence` to the first 500 characters of page content returned by `get_page_content`
after the final step, prefixed with the current URL:

```
URL: https://staging.example.com/dashboard
Content: Welcome, Alice. Your account is active. [Logout] ...
```

---

## Step 2.3 — Manual Tests

For every test case with `execution_method: manual`, create a result record:

```json
{
  "tc_id": "...",
  "status": "Blocked",
  "blocked_reason": "Manual test — requires human tester. Not executed automatically."
}
```

---

## Step 2.4 — Progress Updates

After every 5 test cases (or after each test if total ≤ 10), print a brief progress line:

```
▶ TC-001 [postman] → Pass
▶ TC-002 [chrome] → Fail — expected "Welcome" not found in page content
▶ TC-003 [manual] → Blocked — requires human tester
```

Do not wait until all tests are done before showing any output. Keep the user informed.

---

## Error Handling

| Error type                | Action                                                                         |
| ------------------------- | ------------------------------------------------------------------------------ |
| MCP rate limit / throttle | Retry with exponential backoff: 1s, 2s, 4s (max 3 attempts), then mark Blocked |
| MCP auth failure          | Stop the phase, surface the error, ask user to reconnect the MCP               |
| Unresolvable step text    | Mark that test Blocked with the problematic step quoted                        |
| Network timeout           | Mark that test Blocked with reason "Network timeout"                           |

Never silently swallow errors. Every error becomes a `Blocked` record with a clear reason.

---

## Output Rules

- Never alter the source `.md`.
- Never mark a test `Pass` without verifying the full expected result.
- Never infer or guess request parameters that are not stated in the test steps.
- The result records produced here are passed verbatim to Phase 3 — do not summarise them.
