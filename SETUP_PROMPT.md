# Setup Prompt

A copy-paste prompt for **Claude Desktop** or **claude.ai** that walks you through setting up
this skill suite inside a Claude **Project**: the persona instructions, the skill procedures
(fetched directly from GitHub — no zip upload needed), the MCP connectors, and the first
onboarding run. The walkthrough is interactive — Claude waits for your confirmation between
each step rather than firing everything at once.

> **No skill-zip upload required.** Claude fetches each `SKILL.md` and every companion
> file the skill ships with (whatever subfolders are present — scripts, references,
> templates, examples, etc.) directly from GitHub raw URLs, and treats them as a loaded
> skill for the rest of the session. The trade-off: skill state is per-chat — open a new
> chat in the same Project and paste this prompt again to reload. To make the load
> persistent across chats, paste the setup prompt into the Project's **Custom Instructions**
> so every new chat starts pre-loaded.

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

### Step 1 — Discover the repo's contents

**Read the repo yourself directly from GitHub** — you have web access; use it. Fetch the
repository tree at `https://github.com/ngmthaq/manual-qc-skills` (the GitHub API endpoint
`https://api.github.com/repos/ngmthaq/manual-qc-skills/git/trees/main?recursive=1` is the
most reliable way) and list back to me:

- The top-level files (expect at least `INSTRUCTIONS.md` and `README.md`).
- Every top-level folder that contains a `SKILL.md` — those are the skills to load.
- For each skill folder, list **every** file inside it (including everything under any
  subdirectory at any depth — e.g. `scripts/`, `references/`, `templates/`, or anything
  else the skill ships with). Do not enumerate subfolder names ahead of time; just walk
  whatever the repo tree contains.

Do not hard-code the skill list — derive it from what is actually in the repo at fetch time.
If the repo's contents change later, this same prompt should still work.

I do **not** need to clone the repo locally — you will fetch files directly from GitHub on
my behalf. Confirm the discovered list with me before continuing.

### Step 2 — Load INSTRUCTIONS.md into the Project

Fetch the raw content of `INSTRUCTIONS.md` from GitHub:

```
https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/INSTRUCTIONS.md
```

Display the full content back to me in a single fenced code block, then tell me to:

1. Copy the contents from the code block.
2. Paste them into this project's **Custom Instructions** field (Project settings →
   Instructions).
3. Save.

Wait for me to confirm it is saved before continuing.

### Step 3 — Load every skill into this session

Use the skill list you discovered in Step 1 (every top-level folder containing a `SKILL.md`).
If a skill's `SKILL.md` declares prerequisites on another skill in its description, load
prerequisites first; otherwise any order is fine.

For each skill folder, do the following yourself — do **not** ask me to upload anything:

1. Fetch the raw `SKILL.md` from
   `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/<skill-folder>/SKILL.md`
   and read its full content.
2. Fetch **every other file** in that skill folder (recursively, at any depth) using the
   same raw URL pattern. Do not filter by subfolder name — whatever the skill ships with
   (`scripts/`, `references/`, `templates/`, or anything else) becomes part of the loaded
   skill. Keep the file contents in context so you can write them to the sandbox or use
   them when the skill is later invoked and its procedure refers to them.
3. Register the fetched `SKILL.md` as an active skill procedure for the rest of this session
   under the skill's folder name. When I later say "run X", "use X", or "invoke X" for any
   registered name, follow that skill's `SKILL.md` exactly, using its companion files
   wherever the procedure references them by relative path.

After all skills are loaded, print a short table listing each loaded skill, the count of
companion files fetched alongside it, and a one-line summary of what it does (from its
`description:` frontmatter). Wait for me to confirm before continuing.

> **Persistence note.** Anything loaded this way lives only in this chat session. To make
> the skills available in every new chat in this Project, after Step 8 also tell me to paste
> *this entire prompt* into the Project's **Custom Instructions** (appended after
> `INSTRUCTIONS.md`), so each new chat re-runs the load automatically.

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

- Skills loaded into this session: list every skill you discovered in Step 1 with a check
  mark for each whose `SKILL.md` and companion files were successfully fetched.
- INSTRUCTIONS.md pasted into Project Instructions: yes/no.
- TEST_CASE_CONVENTION.md in Project Knowledge: yes/no.
- MCP connectors enabled: list the ones I chose plus their sanity-check status.

Also remind me — once, briefly — that the skills are session-scoped: if I want them
auto-loaded in future chats, paste this whole setup prompt at the end of the Project's
Custom Instructions (right after INSTRUCTIONS.md).

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
- If you re-run this prompt later (e.g. after pushing repo updates), Claude re-fetches each
  `SKILL.md` from GitHub, so changes propagate automatically — no re-upload needed.
- Skills loaded by this prompt are **session-scoped**. To persist them across chats in the
  same Project, paste this whole prompt into the Project's Custom Instructions (after
  `INSTRUCTIONS.md`); each new chat will then auto-load.
- The repo URL baked into the prompt above is public; if you fork it, swap the URL in both
  the "How to use" preamble and the `## Prompt to paste` block.
