---
name: analyze-requirement
description: >
  Analyze software requirements from any source — raw text, Jira tickets, Linear issues, GitHub
  issues, and/or Figma designs — and produce a structured breakdown covering summary, scope,
  functional requirements, non-functional requirements, ambiguities, and risks. A Figma URL can
  be supplied on its own or alongside a ticket; when both are given the analysis merges the
  ticket text with the design context (screenshot + annotations + design-context hints). Use
  when the user wants to understand or clarify a requirement, not write test cases.
---

# Requirement Analyst Skill

Analyze a requirement from any source and produce a structured breakdown that clarifies intent,
constraints, and completeness — targeted at anyone picking up the work (developer, QA, PO).

---

## Step 1 — Identify and Fetch the Input

The user may supply **one or more** sources. Treat them as additive — for example, a Jira
ticket _plus_ a Figma URL is a single combined requirement, not two separate analyses. Fetch
every source provided, then merge them in Step 2.

Determine what kinds of input were provided:

### Raw text

The user pasted a requirement, user story, or feature description directly. Use it as-is.

### Jira ticket (URL or issue key like `PROJECT-123`)

Use the **Atlassian Rovo MCP** to fetch the ticket. Retrieve:

- Summary / title
- Description
- Acceptance criteria (if present)
- Labels, components, priority
- Linked issues or dependencies

### Linear issue (URL or issue key like `TEAM-123`)

Linear URLs look like `https://linear.app/<workspace>/issue/<TEAM-123>/<slug>`. Issue keys share
the `TEAM-123` shape with Jira — if the source is ambiguous, ask the user which system the key
belongs to before fetching.

Use the **Linear MCP** to fetch the issue. Retrieve:

- Title
- Description (Markdown body)
- Status / state, priority, estimate
- Labels, team, project, cycle
- Assignee and creator
- Sub-issues, parent issue, blocking/blocked-by relations
- Linked attachments (designs, specs, PRs) and references

Also fetch the issue's **comments** when present — Linear discussions frequently contain
clarifications and acceptance criteria that are not in the body.

### GitHub issue (URL or `#123` / `owner/repo#123`)

Use the **GitHub MCP** to fetch the issue. Retrieve:

- Title
- Body / description
- Labels
- Linked PRs or referenced issues

### Figma design (URL to figma.com)

A Figma URL can stand alone as the requirement, or be combined with any of the ticket sources
above. Use the **claude.ai Figma MCP** to fetch the design.

**Parse the URL first** — extract `fileKey` and `nodeId`:

- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` → convert `-` to `:` in the nodeId
- `figma.com/design/:fileKey/branch/:branchKey/:fileName` → use `branchKey` as the fileKey
- `figma.com/board/:fileKey/:fileName?node-id=:nodeId` → FigJam file; use `get_figjam` instead
  of `get_design_context`, and pass the original board URL as `figjamUrl`
- `figma.com/slides/:fileKey/...` or `figma.com/make/:makeFileKey/...` → handle accordingly

**Then fetch design context + screenshot** (the two-tool default for this skill):

1. `get_design_context` with `nodeId` and `fileKey` — returns code (reference only, not used
   here), contextual hints, design-token references, and any **designer annotations**.
2. `get_screenshot` with the same `nodeId` and `fileKey` — for visual sanity-check of the UI
   being analyzed.

From the Figma response, extract for the analysis:

- **Visible UI elements and copy** — buttons, fields, headings, labels, error/empty states
- **Interaction states** if visible — hover/focus/disabled/loading variants, modals, dropdowns
- **Designer annotations** — frequently contain acceptance criteria, validation rules,
  edge-case behaviour, or "see also" links to other frames that aren't in the ticket
- **Responsive / breakpoint frames** if present — feed into Non-Functional Requirements
- **Layout structure** — flows between frames (entry point → success / error)

Do **not** transcribe code from `get_design_context` into the analysis — its code output is for
implementation, not for requirements. Use only the descriptive content (annotations, hints,
visible copy).

If the user provides a URL or ticket ID but no MCP tool is available, ask them to paste the content manually.

---

## Step 2 — Produce the Analysis

Output a single Markdown document with the following sections in order. Use `##` headings and bullet
points throughout. Be concise but complete.

**Merging multiple sources.** When a Figma design is combined with a ticket source, weave the
two together rather than splitting them:

- **Summary** — one paragraph covering both; note that a design exists ("A Figma design for
  the SSO login screen accompanies this requirement.").
- **Scope** — design frames define what's in scope visually; ticket text defines functional
  scope. If the design shows states the ticket doesn't mention (e.g. an "account locked"
  modal), flag them as in-scope additions or as Ambiguities depending on intent.
- **Functional Requirements** — derive from ticket _plus_ every visible interactive element
  and state in the design. Designer annotations count as functional requirements.
- **Non-Functional Requirements** — pull from the design: responsive breakpoint frames,
  accessibility annotations, color/contrast notes, animation/transition specs.
- **Risks & Dependencies** — call out design-vs-spec mismatches as risks; reference design
  dependencies (component libraries, design-token versions) if the design notes them.
- **Ambiguities & Questions** — any element shown in the design but unspecified in the
  ticket (or vice-versa) is an ambiguity worth surfacing.

---

```md
# 📋 Summary

One short paragraph. What is the goal of this requirement? What user problem does it solve?
Include: feature area, affected user roles, and the high-level expected behaviour.

---

# 🎯 Scope

Bullets covering:

- **In scope**: what this requirement explicitly covers
- **Out of scope**: what is explicitly excluded (if inferable)

---

# ⚙️ Functional Requirements

What the system must **do**. Each bullet is a discrete, verifiable behaviour derived from the
requirement. Use present-tense statements ("The system must…" / "Users can…").

Group into sub-sections if the requirement spans multiple flows or user roles.

---

# 🔒 Non-Functional Requirements

What the system must **be**. Cover only what is stated or strongly implied by the requirement.
Omit categories that are not relevant rather than leaving them empty.

Common categories to consider (use only what applies):

- **Performance**: response times, throughput, concurrency limits
- **Security**: authentication, authorization, data sensitivity, input validation
- **Usability**: accessibility, language/i18n, responsive behaviour
- **Reliability**: error handling, fallback behaviour, data integrity
- **Compatibility**: browser support, platform constraints, API version constraints

---

# ⚠️ Risks & Dependencies

Bullets covering:

- **Risks**: things likely to cause bugs, regressions, or scope creep
- **Dependencies**: other tickets, services, APIs, feature flags, or data states this work depends on

If none, write: _No risks or dependencies identified._

---

# ❓ Ambiguities & Questions

Bullets listing anything that is unclear, contradictory, or underspecified in the requirement.
Frame each as a direct question to ask the PO or developer before work begins.

If nothing is ambiguous, write: _No ambiguities identified._
If there are ambiguities, ask the user to clarify before proceeding.
```

---

## Step 3 - Ask User For Approval

Present the analysis to the user and ask:

> "Here is the analysis I produced based on the requirement. Do you approve it as-is, or do you want to modify anything?"

- **Approve**: output the final Markdown document in full, then proceed to Step 4.
- **Modify**: apply the requested changes, re-display the document, and ask for approval again.
  Repeat until approved.

---

## Step 4 — Offer to Draft Test Cases

Once the analysis is approved, offer the next step in the QA flow. Ask the user:

> ✅ **Analysis approved.** Want me to run the **draft-test-cases** skill now to turn this into
> a test case spreadsheet?
>
> - Reply **"yes"** and I'll hand the approved analysis straight to `draft-test-cases`.
> - Reply **"no"** and I'll stop here — you can paste this analysis into `draft-test-cases`
>   later whenever you're ready.

Behaviour:

- If the user says **yes**: invoke the **draft-test-cases** skill, passing the full approved
  Markdown analysis as its input. Do not regenerate or summarize the analysis — pass it through
  verbatim so `draft-test-cases` sees the same content the user just approved.
- If the user says **no** (or anything non-affirmative): stop. Do not invoke the skill. Remind
  them once that `draft-test-cases` is the intended next step, then end the turn.
- If the user wants the **create-test-cases** (MCP ticket-filing) skill instead, tell them
  that one consumes the `.xlsx` produced by `draft-test-cases`, so they need to run
  `draft-test-cases` first.

Never invoke `draft-test-cases` without explicit user confirmation in this step — even if Step
3 was approved enthusiastically. Approval of the analysis is not approval of the hand-off.

---

## Output Rules

- Always output all six sections, even if some are brief.
- Do not add commentary before or after the Markdown document.
- Do not wrap the output in a code fence — output raw Markdown.
- If the source ticket is very thin, still produce all sections and flag gaps in the Ambiguities section.
- Use plain language. Avoid implementation jargon unless it came from the source.
