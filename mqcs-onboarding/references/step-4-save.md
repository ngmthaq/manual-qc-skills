# Step 4 — Review and Save as a Project Knowledge File

Present the convention document to the user and ask them to confirm it looks correct.

Once confirmed, write the convention to a file in the sandbox outputs so the user can download it:

```python
convention_md = """<paste the full convention markdown here, exactly as displayed>"""
with open('/mnt/user-data/outputs/TEST_CASE_CONVENTION.md', 'w') as f:
    f.write(convention_md)
print("Saved: /mnt/user-data/outputs/TEST_CASE_CONVENTION.md")
```

Then tell the user:

> I've saved the convention as **TEST_CASE_CONVENTION.md**. To make it available to all future
> chats in this project:
>
> 1. Download the file from this chat.
> 2. Upload it into this Claude Project's **Project Knowledge**.
>
> Once it's in Project Knowledge, the **draft-test-cases** skill will read it automatically and
> apply this exact format when generating test cases.
