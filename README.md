# AZ State Wastewater Sequencing Dashboard

A production-ready, single-page HTML wastewater genomic surveillance dashboard converted from a Python Dash/Plotly application into a browser-only app.

## Features

- Open `index.html` directly in a browser; no Python backend or local server required.
- Drag and drop CSV, TSV, TXT, XLSX, or XLS files.
- Validates the expected wastewater sequencing columns.
- Recreates the original dashboard plots:
  - Nextclade weekly proportional stacked bars
  - Pango weekly proportional stacked bars
  - PCR target average concentration log trend with Q1, median, and Q3 reference lines
  - Freyja specimen-level stacked abundance bars with coverage labels
- Supports multi-WWTP selection and side-by-side comparison.
- Uses stable colors for variants across all charts.
- Adds linked legend highlighting across all variant-based charts.

## Expected columns

The app expects the same core columns used by the original Python script:

```text
specimen_id
nextclade_lineage
pango_lineage
lineages
abundances
sample_collect_date
pcr_target_avg_conc_log
sample_location_specify
wwtp_name
freyja_coverage
```

The `lineages` and `abundances` columns may be Python-style list strings, for example:

```text
['JN.1','KP.2']
[0.65,0.35]
```

## Run locally

Option 1: open directly:

```text
index.html
```

Option 2: run a lightweight static server for local testing:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Add `index.html`, `style.css`, `script.js`, and optionally `sample_data.tsv`.
3. Commit and push the files.
4. Go to repository **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and root folder `/`.
7. Save. GitHub will provide a public Pages URL.

## Notes

This app uses Plotly.js, PapaParse, and SheetJS from CDNs. For a fully offline version, download those libraries and update the script tags in `index.html` to point to local files.

## Troubleshooting column validation

If the app says required columns are missing even though the file appears correct:

- Confirm the file extension matches the delimiter: use `.tsv` for tab-delimited files and `.csv` for comma-delimited files.
- Make sure the first row is the header row.
- Check for hidden characters, copied Excel smart quotes, or extra spaces in column names. The app now strips common hidden characters and normalizes spaces, dashes, periods, and casing.
- Review the app's error message. It lists the exact detected headers so you can compare them with the expected columns.

Common aliases are accepted. For example, `pcr_target_avg_conc_log10`, `site`, `sample_date`, `coverage`, and `freyja_abundances` are mapped to the canonical fields used internally.


## Parser troubleshooting

Build `2026-07-01-column-parser-v4` includes a stricter TSV parser that forces tab delimiters for `.tsv`, decodes UTF-16 TSV exports from Excel, strips hidden null/BOM characters from headers, and prints detected headers when validation fails. If your browser still shows the older missing-column message without a `Parser build` line, hard-refresh the page or use the cache-busted `index.html` script tag.
