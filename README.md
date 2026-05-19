# Manual QC Skills

A set of Claude skills for a manual-QA workflow: learn your test-case template once (by pasting
its header into chat), then take any requirement (text / Jira / Linear / GitHub / Figma) all the
way to created tickets in your tracker — with all artifacts produced as Markdown files.

All skills are prefixed `mqcs-` (Manual QC Skills) so they group together in the skill list and
don't collide with other skills you may have installed.

---

## Let claude install this repo

Copy this prompt and paste it into claude:

```
/skill-creator
Remove https://github.com/ngmthaq/manual-qc-skills repo from local if it existed.
Clone latest code from this repo, using main branch.
Read zip folder and find all zip files.
DO NOT unzip it, just convert these files to claude skills.

```


