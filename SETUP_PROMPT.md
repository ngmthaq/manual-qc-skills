# Setup Prompt

A copy-paste prompt for **Claude Desktop** or **claude.ai** that walks you through installing
this skill suite into a Claude **Project**: the four skills, the persona instructions, the MCP
connectors, and the first onboarding run. The walkthrough is interactive — Claude waits for
your confirmation between each step rather than firing everything at once.

---

## How to use

1. Create a new **Project** in Claude Desktop or claude.ai.
2. Open a chat inside that Project.
3. Paste the prompt below as your first message.
4. Follow Claude's prompts.

---

## Prompt to paste

````md
I want to set up the Manual QA Skills suite from https://github.com/ngmthaq/manual-qc-skills in this Claude project.
Walk me through installing it correctly, one step at a time. Do not skip ahead — wait for
me to confirm each step before moving on. If I tell you something failed at any step, stop
and help me troubleshoot before continuing.

Here is the setup script you must follow:

### Step 1 — Fetch the repo and discover its contents

Tell me the exact `git clone` command for `https://github.com/ngmthaq/manual-qc-skills`, plus
the alternative ZIP download URL for users without git.

Then, **read the repo yourself** (browse the GitHub URL directly) and list back to me:

- The top-level files (e.g. `INSTRUCTIONS.md`, `README.md`).
- Every top-level folder that contains a `SKILL.md` — those are the skills to install.

Do not hard-code the skill list — derive it from what is actually in the repo at the time of
setup. If the repo's contents change later, this same prompt should still work.

Wait for me to confirm I see the same set locally before continuing.

### Step 2 — Paste INSTRUCTIONS.md into Project Instructions

Tell me to:
1. Open `INSTRUCTIONS.md` from the repo.
2. Copy its full contents.
3. Paste it into this project's **Custom Instructions** field (Project settings → Instructions).
4. Save.

Wait for me to confirm it is saved.

### Step 3 — Install every skill found in the repo

Use the skill list you discovered in Step 1 (every top-level folder containing a `SKILL.md`).
If a skill's `SKILL.md` declares prerequisites on another skill in its description, install
prerequisites first; otherwise any order is fine.

For each skill folder, tell me:

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

- Skills installed: list every skill you discovered in Step 1 with a check mark for each
  that succeeded.
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
- The repo URL baked into the prompt above is public; if you fork it, swap the URL in both
  the "How to use" preamble and the `## Prompt to paste` block.
