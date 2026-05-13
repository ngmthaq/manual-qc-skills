# Step 1 — Read the Excel File

The user will have uploaded an `.xlsx` file. It appears under `/mnt/user-data/uploads/`.

> First list that directory to locate the file. If no `.xlsx` is present, ask the user to upload
> one. If multiple are present, ask which one to onboard.

Run the analysis script (in this skill's `scripts/` folder) with the path to the uploaded file:

```bash
python scripts/analyze_excel.py /mnt/user-data/uploads/<filename>.xlsx
```

The script prints both content (via pandas) and formatting (via openpyxl) for **every sheet** —
including merged cells, column widths, row heights, fonts, fills, borders, alignment, and data
validation. All of these are required by the downstream **draft-test-cases** skill, so do not
skip running this script.
