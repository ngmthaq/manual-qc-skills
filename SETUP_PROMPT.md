# Setup Prompt

A copy-paste prompt for **Claude Desktop** or **claude.ai** that walks you through installing
this skill suite into a Claude **Project**: the four skills, the persona instructions, the MCP
connectors, and the first onboarding run. The walkthrough is interactive — Claude waits for
your confirmation between each step rather than firing everything at once.

---

## How to use

1. Push this repo to GitHub and copy the repo URL.
2. Create a new **Project** in Claude Desktop or claude.ai.
3. Open a chat inside that Project.
4. Paste the prompt below as your first message, **replacing `<REPO_URL>`** with your GitHub
   URL.
5. Follow Claude's prompts.

---

## Prompt to paste

````text
I want to set up the Manual QA Skills suite from <REPO_URL> in this Claude project.
Walk me through installing it correctly, one step at a time. Do not skip ahead — wait for
me to confirm each step before moving on. If I tell you something failed at any step, stop
and help me troubleshoot before continuing.

Here is the setup script you must follow:

### Step 1 — Fetch the repo

Tell me the exact `git clone` command for `<REPO_URL>`, plus the alternative ZIP download
URL for users without git. Confirm that after extraction I should see these folders and files
at the repo root:

- `INSTRUCTIONS.md`
- `README.md`
- `onboarding/` (with SKILL.md + scripts/)
- `analyze-requirement/` (with SKILL.md)
- `draft-test-cases/` (with SKILL.md + scripts/)
- `create-test-cases/` (with SKILL.md)

Wait for me to confirm I have all six items locally before continuing.

### Step 2 — Paste INSTRUCTIONS.md into Project Instructions

Tell me to:
1. Open `INSTRUCTIONS.md` from the repo.
2. Copy its full contents.
3. Paste it into this project's **Custom Instructions** field (Project settings → Instructions).
4. Save.

Wait for me to confirm it is saved.

### Step 3 — Install the four skills

For each of the four skill folders, in this exact order — `onboarding`,
`analyze-requirement`, `draft-test-cases`, `create-test-cases` — tell me:

1. Zip the folder so the resulting archive contains a top-level `SKILL.md`
   (and `scripts/` / `references/` if present).
2. Upload the zip via the Skills panel:
   - **claude.ai**: Settings → Capabilities → Skills → Upload skill
   - **Claude Desktop**: Settings → Capabilities → Skills → Upload skill
3. Enable the skill for this project.

After each upload, wait for me to confirm before moving on to the next skill.

### Step 4 — Choose ticket systems and design tool

Ask me which of these I use. I may pick zero, one, or several:

- **Jira** (via Atlassian Rovo MCP)
- **Linear** (via Linear MCP)
- **GitHub** (via GitHub MCP)
- **Figma** (via the official Figma MCP)

### Step 5 — Enable each chosen MCP connector

For each MCP I picked in Step 4, tell me:

1. Exactly where to enable it (claude.ai Connectors panel, or Claude Desktop's MCP
   settings / `claude_desktop_config.json` location).
2. What URL or auth flow to expect.
3. A short sanity-check prompt I can send to prove the connector works. Examples:
   - Jira: "List my open Jira tickets."
   - Linear: "Show me the last 3 Linear issues assigned to me."
   - GitHub: "List open issues in <my repo>."
   - Figma: "Read the design at <a Figma URL I share>."

Wait for me to confirm each connector works before moving to the next one. If a sanity-check
fails, help me debug before continuing.

### Step 6 — First run: onboarding

Tell me to:
1. Upload my team's existing `.xlsx` test-case template into this chat.
2. Invoke the `onboarding` skill on it.

Then run onboarding end-to-end and produce `TEST_CASE_CONVENTION.md`.

### Step 7 — Install TEST_CASE_CONVENTION.md into Project Knowledge

Once onboarding produces the file, tell me to:
1. Download `TEST_CASE_CONVENTION.md` from the chat.
2. Upload it into this project's **Project Knowledge** / Files area.
3. Confirm when it appears in the project's knowledge list.

### Step 8 — Final verification and handoff

Print a short setup report covering:

- Skills installed: list the four with a check mark for each that succeeded.
- INSTRUCTIONS.md pasted into Project Instructions: yes/no.
- TEST_CASE_CONVENTION.md in Project Knowledge: yes/no.
- MCP connectors enabled: list the ones I chose plus their sanity-check status.

Then tell me how to start using the suite:

> Paste a Jira / Linear / GitHub ticket URL, or a Figma design URL, or both, and I'll invoke
> the **analyze-requirement** skill on it. From there I'll offer to draft test cases, and
> then to file them as tickets.

Stop after the report. Do not pre-run analyze-requirement until I give you input.
````

---

## Notes

- The walkthrough does *not* assume any specific MCP is already connected. Skipping Step 4
  (picking none) is fine — the skills will still work for raw text + Excel workflows; you can
  add MCPs later by re-running just Step 5.
- If you re-run this prompt later (e.g. after pulling repo updates), Claude will re-upload
  skills only where you confirm a change is needed; existing skills stay in place.
- The `<REPO_URL>` placeholder must be a public Git URL, or a private one your local `git`
  is authenticated to clone from.
