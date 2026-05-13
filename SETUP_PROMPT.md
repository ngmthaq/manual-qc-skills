# Setup Prompt

A copy-paste prompt for **Claude Desktop** or **claude.ai** that installs this skill suite
**at the user (account) level**, so it is available in every chat across every project. The
walkthrough is interactive — Claude waits for your confirmation between each step rather
than firing everything at once.

> **No skill-zip upload required.** Claude fetches each `SKILL.md` and every companion file
> the skill ships with (whatever subfolders are present — scripts, references, templates,
> etc.) directly from GitHub raw URLs, then registers each one as a permanent skill in your
> account via the built-in **`/skill-creator`** flow. End result: skills are available in
> every chat across every project, with no per-session reload.

---

## How to use

1. Decide which Claude **Project** will host your QA work (create one if needed). The
   skills register at the user level so they work everywhere, but the per-product
   test-case convention lives inside this Project.
2. Open a chat inside that Project.
3. Paste the prompt below as your first message.
4. Follow Claude's prompts. When Claude asks you to run `/skill-creator`, type the slash
   command in the input box exactly as instructed.

---

## Prompt to paste

````md
I want to install the Manual QA Skills suite from https://github.com/ngmthaq/manual-qc-skills
at the **user (account) level**, so every chat across every project picks it up. Use the
built-in **`/skill-creator`** flow to register each skill — do not ask me to upload zip
files. Walk me through it one step at a time. Do not skip ahead — wait for me to confirm
each step before moving on. If I tell you something failed at any step, stop and help me
troubleshoot before continuing.

Here is the setup script you must follow:

### Step 1 — Register every skill via `/skill-creator`

The repo ships **two skills**, both prefixed `mqcs-` so they group together in the skill list.
Register them in this order (so prerequisites come first):

1. **`mqcs-onboarding`** — one-time test-case Excel template learner. Files to fetch:
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-onboarding/SKILL.md`
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-onboarding/references/persona.md`
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-onboarding/scripts/analyze_excel.py`

2. **`mqcs-create-test-cases`** — end-to-end flow: analyze requirement → draft `.xlsx` → file
   tickets via MCP. Depends on `mqcs-onboarding`'s output (`TEST_CASE_CONVENTION.md`). Files
   to fetch:
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-create-test-cases/SKILL.md`
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-create-test-cases/references/persona.md`
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-create-test-cases/references/analyze.md`
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-create-test-cases/references/draft.md`
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-create-test-cases/references/file.md`
   - `https://raw.githubusercontent.com/ngmthaq/manual-qc-skills/main/mqcs-create-test-cases/scripts/write_test_cases.py`

You have web access — fetch these directly. Do **not** ask me to clone the repo or upload zip
files.

For each skill, do the following:

1. **Prepare a self-contained skill body.** Start from the fetched `SKILL.md`. For every
   companion file the procedure references by relative path — whether it's a script (e.g.
   `scripts/write_test_cases.py`) or a reference doc (e.g. `references/analyze.md`) —
   inline that file's content into the body under a `## Companion Files` section as a
   fenced code block tagged with the relative path. Then rewrite the procedure so that:
   - Scripts are written to a temp path before being executed.
   - Reference docs are read from the inlined fenced blocks instead of the `references/`
     folder, so the skill remains runnable without external file access.
   Inline only the files listed above for this skill — do not invent companion files.
2. **Tell me to type `/skill-creator`** in the chat input. Wait for `/skill-creator` to
   activate.
3. **Walk me through `/skill-creator` for this skill**, supplying the values you prepared:
   - **Name**: the exact skill name — `mqcs-onboarding` or `mqcs-create-test-cases`. Keep
     the `mqcs-` prefix verbatim.
   - **Description**: the exact `description:` value from the SKILL.md frontmatter.
   - **Instructions / body**: the self-contained body you prepared above. Paste it for me
     to copy into whatever input `/skill-creator` asks for.
   - **Scope**: choose **user / account level** (available in all projects). Tell me which
     toggle or option corresponds to this in the `/skill-creator` UI.
4. Wait for me to confirm `/skill-creator` reported success before moving to the next skill.

After both skills are registered, print a short table listing each skill, the count of
companion files inlined, and a one-line summary of what it does (from its `description:`
frontmatter). Wait for me to confirm before continuing.

### Step 2 — Choose ticket systems and design tool

Ask me which of these I use. I may pick zero, one, or several:

- **Jira** (via Atlassian Rovo MCP)
- **Linear** (via Linear MCP)
- **GitHub** (via GitHub MCP)
- **Figma** (via the official Figma MCP)

### Step 3 — Enable each chosen MCP connector

For each MCP I picked in Step 2, tell me:

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

### Step 4 — First run: mqcs-onboarding

Tell me that the convention I am about to produce is **project-specific** (each product /
team may use a different Excel test-case template), so I should run `mqcs-onboarding` from
inside the Claude **Project** I plan to use it in. Then walk me through:

1. Switching into (or creating) the target Project, since user-level skills are available
   in every project but the convention output belongs to one project.
2. Uploading my team's existing `.xlsx` test-case template into a chat inside that project.
3. Invoking the `mqcs-onboarding` skill on the uploaded file.

Run mqcs-onboarding end-to-end and produce `TEST_CASE_CONVENTION.md`.

### Step 5 — Install TEST_CASE_CONVENTION.md into Project Knowledge

Once mqcs-onboarding produces the file, tell me to:
1. Download `TEST_CASE_CONVENTION.md` from the chat.
2. Upload it into that project's **Project Knowledge** / Files area (not the user-level
   Personalization — conventions stay project-scoped).
3. Confirm when it appears in the project's knowledge list.

If I plan to use these skills against multiple products with different test-case templates,
remind me that I will run `mqcs-onboarding` once per project and upload each project's own
`TEST_CASE_CONVENTION.md` into that project's Knowledge.

### Step 6 — Final verification and handoff

Print a short setup report covering:

- Skills registered (user-level): `mqcs-onboarding` and `mqcs-create-test-cases`, with a
  check mark for each that `/skill-creator` confirmed as installed.
- TEST_CASE_CONVENTION.md in target Project's Knowledge: yes/no, and which project.
- MCP connectors enabled: list the ones I chose plus their sanity-check status.

Confirm once, briefly, that the skills are now permanent — every new chat I open across
every project will have them available — and that there is nothing to reload per session.

Then tell me how to start using the suite:

> Paste a Jira / Linear / GitHub ticket URL, a Figma design URL, raw requirement text, an
> already-approved analysis, or a drafted `.xlsx` — and I'll invoke the
> **mqcs-create-test-cases** skill, entering at whichever phase matches what you gave me
> (analyze → draft → file). Each phase is approval-gated.

Stop after the report. Do not pre-run mqcs-create-test-cases until I give you input.
````

---

## Notes

- The walkthrough does *not* assume any specific MCP is already connected. Skipping Step 2
  (picking none) is fine — the skills will still work for raw text + Excel workflows; you can
  add MCPs later by re-running just Step 3.
- **Skills are installed at user (account) level via `/skill-creator`** — no per-session
  reload, no per-project reinstall. They appear in every chat across every project.
- **`TEST_CASE_CONVENTION.md` is project-scoped** because each product may use a different
  Excel template. Run `mqcs-onboarding` once per project and upload that project's own
  convention to its Project Knowledge.
- **Updating after a repo push.** Re-run this prompt; for each changed skill, tell Claude
  to update the existing `/skill-creator` entry instead of creating a duplicate (most
  `/skill-creator` UIs let you edit a previously created skill in place).
- The repo URL baked into the prompt above is public; if you fork it, swap the URL in both
  the "How to use" preamble and the `## Prompt to paste` block.
