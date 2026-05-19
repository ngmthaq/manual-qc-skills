# Step 1 — Get the Template Header from the User

**Do not ask for a file upload or file path.** The user provides the template by copying the
header row out of their Excel template and pasting the text into the chat.

> Prompt the user with something like:
>
> > "Please copy the **header row** from your Excel test case template and paste it here. You can
> > paste it as tab-separated values, comma-separated, or one column name per line — whichever is
> > easiest. If you can also paste **one or two sample test case rows** below the header, that
> > helps me infer data types, allowed values, and ID patterns."
>
> Wait for the user's reply before proceeding.

## Capturing what the user pasted

Treat whatever the user pastes as the raw source. Preserve it verbatim — including exact column
labels, casing, punctuation, and any sample row text. You will reference it from Step 2.

## When the pasted text is unusable

Ask the user to paste again (do not invent missing columns) if any of the following is true:

- The paste is empty or only contains a single ambiguous word.
- The paste does not look like column headers (e.g. it is a long prose paragraph).
- Columns are run together with no clear separator and you cannot confidently split them.
- The user pasted a screenshot instead of text. Politely ask for the text — image OCR is not part
  of this skill.

## Optional follow-up questions

If the header alone is not enough to infer key facts, you may ask **one** focused follow-up. Good
candidates:

- "What ID / numbering scheme do you use (e.g. `TC-001`, sequential integers)?"
- "Are any columns dropdowns with a fixed set of allowed values? If so, which values?"
- "Which columns are required vs. optional?"

Do not chain multiple rounds of questions — get what you can and proceed to Step 2 with what the
user has shared.
