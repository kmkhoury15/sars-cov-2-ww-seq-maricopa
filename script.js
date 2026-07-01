/*
  AZ State Wastewater Sequencing Dashboard
  Browser-only rewrite of the original Dash/Python Plotly app.

  Required source columns from the Python script:
    specimen_id, nextclade_lineage, pango_lineage, lineages, abundances,
    sample_collect_date, pcr_target_avg_conc_log,
    sample_location_specify, wwtp_name, freyja_coverage
*/

const APP_VERSION = "2026-07-01-checkbox-tabs-v5";

const REQUIRED_COLUMNS = [
  "specimen_id",
  "nextclade_lineage",
  "pango_lineage",
  "lineages",
  "abundances",
  "sample_collect_date",
  "pcr_target_avg_conc_log",
  "sample_location_specify",
  "wwtp_name",
  "freyja_coverage"
];

const COLUMN_ALIASES = {
  specimen_id: ["specimen_id", "specimen", "sample_id", "sampleid", "sample", "id"],
  nextclade_lineage: ["nextclade_lineage", "nextclade", "nextclade_clade", "nextclade_clade_label", "clade"],
  pango_lineage: ["pango_lineage", "pango", "lineage_pango", "pangolin_lineage", "pangolin", "lineage"],
  lineages: ["lineages", "freyja_lineages", "freyja_lineage", "freyja_lineage_list"],
  abundances: ["abundances", "freyja_abundances", "freyja_abundance", "freyja_abundance_list"],
  sample_collect_date: ["sample_collect_date", "collection_date", "date", "sample_date", "collect_date", "sample_collection_date"],
  pcr_target_avg_conc_log: [
    "pcr_target_avg_conc_log",
    "pcr_target_avg_conc_log10",
    "pcr_target_avg_conc_log_10",
    "pcr_log_conc",
    "pcr_target_log_conc",
    "log_conc",
    "log10_conc",
    "pcr_target_avg_conc"
  ],
  sample_location_specify: ["sample_location_specify", "sample_location", "location", "sample_loc", "sampling_location", "location_specify"],
  wwtp_name: ["wwtp_name", "wwtp", "site", "treatment_plant", "plant", "facility", "wwtp_site", "wwtpname"],
  freyja_coverage: ["freyja_coverage", "coverage", "freyja_cov", "freyja_depth", "depth", "mean_coverage"]
};

const SAMPLE_DATA = `specimen_id\tnextclade_lineage\tpango_lineage\tlineages\tabundances\tsample_collect_date\tpcr_target_avg_conc_log\tsample_location_specify\twwtp_name\tfreyja_coverage
SP-001\t23A\tXBB.1.5\t['XBB.1.5','BQ.1']\t[0.82,0.18]\t2025-01-06\t5.42\tInfluent\tArea 1 WRF\t120.5
SP-002\t23A\tXBB.1.5\t['XBB.1.5','JN.1']\t[0.64,0.36]\t2025-01-13\t5.61\tInfluent\tArea 1 WRF\t98.3
SP-003\t23I\tJN.1\t['JN.1','XBB.1.5']\t[0.71,0.29]\t2025-01-20\t5.86\tInfluent\tArea 1 WRF\t133.7
SP-004\t23I\tJN.1\t['JN.1','KP.2']\t[0.59,0.41]\t2025-01-27\t5.74\tInfluent\tArea 1 WRF\t141.2
SP-005\t24A\tKP.2\t['KP.2','JN.1']\t[0.68,0.32]\t2025-02-03\t5.91\tInfluent\tArea 1 WRF\t115.9
SP-006\t23A\tXBB.1.5\t['XBB.1.5','JN.1']\t[0.54,0.46]\t2025-01-06\t4.92\tInfluent\tArea 2 WRF\t89.4
SP-007\t23I\tJN.1\t['JN.1','XBB.1.5']\t[0.73,0.27]\t2025-01-13\t5.04\tInfluent\tArea 2 WRF\t91.7
SP-008\t23I\tJN.1\t['JN.1','KP.2']\t[0.61,0.39]\t2025-01-20\t5.33\tInfluent\tArea 2 WRF\t100.0
SP-009\t24A\tKP.2\t['KP.2','JN.1']\t[0.77,0.23]\t2025-01-27\t5.38\tInfluent\tArea 2 WRF\t126.8
SP-010\t24A\tKP.2\t['KP.2','LB.1']\t[0.66,0.34]\t2025-02-03\t5.52\tInfluent\tArea 2 WRF\t130.1
SP-011\t23I\tJN.1\t['JN.1','KP.2']\t[0.58,0.42]\t2025-01-13\t4.88\tSecondary\tArea 3 WRF\t77.8
SP-012\t24A\tKP.2\t['KP.2','JN.1']\t[0.62,0.38]\t2025-01-20\t5.12\tSecondary\tArea 3 WRF\t84.9
SP-013\t24A\tKP.2\t['KP.2','LB.1']\t[0.72,0.28]\t2025-01-27\t5.28\tSecondary\tArea 3 WRF\t90.4
SP-014\t24B\tLB.1\t['LB.1','KP.2']\t[0.57,0.43]\t2025-02-03\t5.47\tSecondary\tArea 3 WRF\t93.2`;

const PALETTE = [
  "#2E91E5", "#E15F99", "#1CA71C", "#FB0D0D", "#DA16FF", "#222A2A",
  "#B68100", "#750D86", "#EB663B", "#511CFB", "#00A08B", "#FB00D1",
  "#FC0080", "#B2828D", "#6C7C32", "#778AAE", "#862A16", "#A777F1",
  "#620042", "#1616A7", "#DA60CA", "#6C4516", "#0D2A63", "#AF0038",
  "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462",
  "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f",
  "#636EFA", "#EF553B", "#00CC96", "#AB63FA", "#FFA15A", "#19D3F3",
  "#FF6692", "#B6E880", "#FF97FF", "#FECB52"
];

const state = {
  rawRows: [],
  rows: [],
  variants: [],
  colorMap: {},
  selectedVariants: new Set(),
  activeChartTab: "nextclade",
  activeFileName: null,
  warnings: []
};

const els = {
  dropZone: document.getElementById("drop-zone"),
  fileInput: document.getElementById("file-input"),
  fileStatus: document.getElementById("file-status"),
  messageBox: document.getElementById("message-box"),
  controlsPanel: document.getElementById("controls-panel"),
  summaryPanel: document.getElementById("summary-panel"),
  chartsPanel: document.getElementById("charts-panel"),
  plotsPanel: document.getElementById("plots-panel"),
  siteCheckboxList: document.getElementById("site-checkbox-list"),
  locationCheckboxList: document.getElementById("location-checkbox-list"),
  chartTabs: document.getElementById("chart-tabs"),
  startDate: document.getElementById("start-date"),
  endDate: document.getElementById("end-date"),
  comparisonToggle: document.getElementById("comparison-toggle"),
  dimToggle: document.getElementById("dim-toggle"),
  selectAllSitesBtn: document.getElementById("select-all-sites-btn"),
  clearSitesBtn: document.getElementById("clear-sites-btn"),
  resetFiltersBtn: document.getElementById("reset-filters-btn"),
  clearHighlightBtn: document.getElementById("clear-highlight-btn"),
  loadSampleBtn: document.getElementById("load-sample-btn"),
  summaryCards: document.getElementById("summary-cards"),
  variantLegend: document.getElementById("variant-legend")
};

const plotConfig = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: ["lasso2d", "select2d"]
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  if (!window.Plotly || !window.Papa || !window.XLSX) {
    showMessage(
      "One or more browser dependencies did not load. Check your internet connection or vendor Plotly.js, PapaParse, and SheetJS locally.",
      "error"
    );
  }

  els.dropZone.addEventListener("click", () => els.fileInput.click());
  els.dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      els.fileInput.click();
    }
  });
  els.fileInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) handleFile(file);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.remove("is-dragover");
    });
  });

  els.dropZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  els.loadSampleBtn.addEventListener("click", loadSampleData);

  els.siteCheckboxList.addEventListener("change", (event) => {
    if (!event.target.matches('input[type="checkbox"]')) return;
    refreshLocationOptions();
    renderDashboard();
  });
  els.locationCheckboxList.addEventListener("change", (event) => {
    if (!event.target.matches('input[type="checkbox"]')) return;
    renderDashboard();
  });
  els.chartTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-chart-tab]");
    if (!button) return;
    state.activeChartTab = button.dataset.chartTab;
    updateChartTabs();
    renderDashboard();
  });

  els.startDate.addEventListener("change", renderDashboard);
  els.endDate.addEventListener("change", renderDashboard);
  els.comparisonToggle.addEventListener("change", renderDashboard);
  els.dimToggle.addEventListener("change", renderDashboard);

  els.selectAllSitesBtn.addEventListener("click", () => {
    setAllCheckboxesChecked(els.siteCheckboxList, true);
    refreshLocationOptions();
    renderDashboard();
  });
  els.clearSitesBtn.addEventListener("click", () => {
    setAllCheckboxesChecked(els.siteCheckboxList, false);
    refreshLocationOptions();
    renderDashboard();
  });
  els.resetFiltersBtn.addEventListener("click", resetFilters);
  els.clearHighlightBtn.addEventListener("click", () => {
    clearVariantSelections();
    renderDashboard();
  });
}

async function handleFile(file) {
  clearMessage();
  state.activeFileName = file.name;

  try {
    const rows = await parseUploadedFile(file);
    loadRows(rows, file.name);
  } catch (error) {
    console.error(error);
    showMessage(error.message || "Unable to parse this file.", "error");
  }
}

function loadSampleData() {
  Papa.parse(SAMPLE_DATA, {
    header: true,
    delimiter: "\t",
    skipEmptyLines: "greedy",
    complete: (results) => loadRows(results.data, "sample_data.tsv"),
    error: (error) => showMessage(error.message, "error")
  });
}

function parseUploadedFile(file) {
  const extension = file.name.split(".").pop().toLowerCase();

  if (["xlsx", "xls"].includes(extension)) {
    return parseExcelFile(file);
  }

  if (["csv", "tsv", "txt"].includes(extension)) {
    return parseDelimitedFile(file);
  }

  throw new Error("Unsupported file type. Please upload a CSV, TSV, TXT, XLSX, or XLS file.");
}

function parseDelimitedFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const extension = file.name.split(".").pop().toLowerCase();
        const text = decodeTextArrayBuffer(event.target.result);
        const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        const firstNonEmptyLine = (normalizedText.split("\n").find((line) => line.trim()) || "");
        const delimiter = chooseDelimiter(extension, firstNonEmptyLine);

        Papa.parse(normalizedText, {
          header: true,
          skipEmptyLines: "greedy",
          dynamicTyping: false,
          delimiter,
          transformHeader: cleanHeaderName,
          complete: (results) => {
            if (results.errors && results.errors.length) {
              const fatalError = results.errors.find((err) => err.type === "Delimiter" || err.type === "Quotes");
              if (fatalError) {
                reject(new Error(`CSV/TSV parsing error: ${fatalError.message}`));
                return;
              }
            }
            const parsedRows = results.data || [];
            parsedRows.__detectedDelimiter = delimiter === "\t" ? "tab" : delimiter || "auto";
            resolve(parsedRows);
          },
          error: (error) => reject(error)
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Unable to read the uploaded text file."));
    reader.readAsArrayBuffer(file);
  });
}

function decodeTextArrayBuffer(buffer) {
  const bytes = new Uint8Array(buffer);

  // UTF-16 TSV files exported from Excel are common. If they are decoded as
  // UTF-8, the header becomes s\0p\0e\0c\0i\0m\0e\0n... and every required
  // column appears missing. Decode BOM-marked or null-byte-heavy files safely.
  if (bytes.length >= 2) {
    if (bytes[0] === 0xff && bytes[1] === 0xfe) {
      return new TextDecoder("utf-16le").decode(buffer);
    }
    if (bytes[0] === 0xfe && bytes[1] === 0xff) {
      return new TextDecoder("utf-16be").decode(buffer);
    }
  }

  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder("utf-8").decode(buffer);
  }

  const probeLength = Math.min(bytes.length, 512);
  let evenNulls = 0;
  let oddNulls = 0;
  for (let i = 0; i < probeLength; i += 1) {
    if (bytes[i] === 0) {
      if (i % 2 === 0) evenNulls += 1;
      else oddNulls += 1;
    }
  }

  // ASCII characters in UTF-16LE usually have null bytes in odd positions;
  // UTF-16BE usually has null bytes in even positions.
  if (oddNulls > probeLength * 0.18 && oddNulls > evenNulls * 3) {
    return new TextDecoder("utf-16le").decode(buffer);
  }
  if (evenNulls > probeLength * 0.18 && evenNulls > oddNulls * 3) {
    return new TextDecoder("utf-16be").decode(buffer);
  }

  return new TextDecoder("utf-8").decode(buffer);
}

function chooseDelimiter(extension, firstLine) {
  const cleanLine = String(firstLine || "").replace(/^\uFEFF/, "").replace(/\u0000/g, "");
  const tabCount = (cleanLine.match(/\t/g) || []).length;
  const commaCount = (cleanLine.match(/,/g) || []).length;
  const semicolonCount = (cleanLine.match(/;/g) || []).length;

  if (extension === "tsv") return "\t";
  if (extension === "csv") return ",";
  if (tabCount > 0 && tabCount >= commaCount && tabCount >= semicolonCount) return "\t";
  if (commaCount > 0 && commaCount >= semicolonCount) return ",";
  if (semicolonCount > 0) return ";";
  return "\t";
}

function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "array", cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) throw new Error("The workbook does not contain any sheets.");
        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });
        const rows = rawRows.map((row) => {
          const cleaned = {};
          Object.entries(row).forEach(([key, value]) => {
            cleaned[cleanHeaderName(key)] = value;
          });
          return cleaned;
        });
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Unable to read the Excel file."));
    reader.readAsArrayBuffer(file);
  });
}

function loadRows(rawRows, fileName) {
  if (!rawRows || !rawRows.length) {
    throw new Error("The uploaded file did not contain any data rows.");
  }

  const { rows, warnings } = canonicalizeRows(rawRows);
  const preparedRows = prepareRows(rows);
  const invalidDateCount = rows.length - preparedRows.length;

  if (!preparedRows.length) {
    throw new Error("No usable rows were found after date parsing. Check sample_collect_date values.");
  }

  state.rawRows = rawRows;
  state.rows = preparedRows;
  state.activeFileName = fileName;
  state.warnings = [...warnings];
  if (invalidDateCount > 0) {
    state.warnings.push(`${invalidDateCount} row(s) were skipped because sample_collect_date could not be parsed.`);
  }

  state.variants = collectVariants(preparedRows);
  state.colorMap = buildColorMap(state.variants);
  clearVariantSelections();

  hydrateControls();
  setPanelsEnabled(true);
  els.fileStatus.textContent = `Loaded ${preparedRows.length.toLocaleString()} rows from ${fileName}`;
  els.fileStatus.classList.add("success");

  if (state.warnings.length) {
    showMessage(`Loaded with warning(s):\n- ${state.warnings.join("\n- ")}`, "warning");
  } else {
    showMessage("File loaded successfully. The dashboard has been generated below.", "info");
  }

  renderDashboard();
}

function canonicalizeRows(rawRows) {
  const sourceColumns = collectSourceColumns(rawRows);
  const normalizedSourceMap = new Map();

  sourceColumns.forEach((col) => {
    const normalized = normalizeColumnName(col);
    if (normalized && !normalizedSourceMap.has(normalized)) {
      normalizedSourceMap.set(normalized, col);
    }
  });

  const resolved = {};
  const aliasWarnings = [];
  const missing = [];

  REQUIRED_COLUMNS.forEach((target) => {
    const aliases = COLUMN_ALIASES[target] || [target];
    const foundAlias = aliases.find((alias) => normalizedSourceMap.has(normalizeColumnName(alias)));
    if (!foundAlias) {
      missing.push(target);
      return;
    }
    const sourceName = normalizedSourceMap.get(normalizeColumnName(foundAlias));
    resolved[target] = sourceName;
    if (normalizeColumnName(sourceName) !== normalizeColumnName(target)) {
      aliasWarnings.push(`Mapped input column "${sourceName}" to expected column "${target}".`);
    }
  });

  if (missing.length) {
    throw new Error(formatMissingColumnError(missing, sourceColumns));
  }

  const rows = rawRows.map((row) => {
    const clean = {};
    REQUIRED_COLUMNS.forEach((target) => {
      clean[target] = row[resolved[target]];
    });
    return clean;
  });

  return { rows, warnings: aliasWarnings };
}

function collectSourceColumns(rawRows) {
  const columns = new Set();
  rawRows.slice(0, 50).forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      if (key !== "__parsed_extra") columns.add(key);
    });
  });
  return [...columns];
}

function formatMissingColumnError(missing, sourceColumns) {
  const detected = sourceColumns.length ? sourceColumns.join(", ") : "No header columns detected";
  const delimiterHint = sourceColumns.length === 1 && /\t/.test(sourceColumns[0])
    ? "\n\nThe uploaded file looks tab-delimited, but the header was read as one column. Save the file as .tsv and try again, or check that the first row uses real tab characters."
    : "";

  const aliasText = missing.map((target) => {
    const aliases = COLUMN_ALIASES[target] || [target];
    return `- ${target}: accepted names include ${aliases.join(", ")}`;
  }).join("\n");

  return (
    `Missing required column(s): ${missing.join(", ")}.\n\n` +
    `Parser build: ${APP_VERSION}.\n\n` +
    `Detected columns: ${detected}.\n\n` +
    `Expected canonical columns: ${REQUIRED_COLUMNS.join(", ")}.\n\n` +
    `Accepted aliases for the missing column(s):\n${aliasText}` +
    delimiterHint
  );
}

function cleanHeaderName(name) {
  return String(name || "")
    .replace(/^\uFEFF/, "")
    .replace(/\u0000/g, "")
    .replace(/[\u200B-\u200D\u2060]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim()
    .replace(/^[\'"]|[\'"]$/g, "")
    .trim();
}

function normalizeColumnName(name) {
  return cleanHeaderName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function prepareRows(rows) {
  return rows
    .map((row, idx) => {
      const date = parseDate(row.sample_collect_date);
      if (!date) return null;

      const lineages = parseListLike(row.lineages).map((value) => String(value).trim()).filter(Boolean);
      const abundances = parseListLike(row.abundances).map(parseNumber).filter((value) => Number.isFinite(value));
      const pcrValue = parseNumber(row.pcr_target_avg_conc_log);
      const coverage = parseNumber(row.freyja_coverage);

      return {
        ...row,
        __rowIndex: idx,
        specimen_id: safeString(row.specimen_id),
        nextclade_lineage: safeString(row.nextclade_lineage),
        pango_lineage: safeString(row.pango_lineage),
        sample_location_specify: safeString(row.sample_location_specify),
        wwtp_name: safeString(row.wwtp_name),
        lineages,
        abundances,
        pcr_target_avg_conc_log: pcrValue,
        freyja_coverage: coverage,
        __date: date,
        __dateISO: formatISODate(date),
        __week: weekStartMonday(date),
        __weekISO: formatISODate(weekStartMonday(date))
      };
    })
    .filter(Boolean);
}

function safeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function parseNumber(value) {
  if (value === null || value === undefined || value === "") return NaN;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/,/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function parseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  }

  const text = safeString(value);
  if (!text) return null;

  const isoLike = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoLike) {
    const [, year, month, day] = isoLike.map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  const slashLike = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashLike) {
    let [, month, day, year] = slashLike.map(Number);
    if (year < 100) year += 2000;
    return new Date(Date.UTC(year, month - 1, day));
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
}

function formatISODate(date) {
  return date.toISOString().slice(0, 10);
}

function weekStartMonday(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

function parseListLike(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];

  const text = String(value).trim();
  if (!text || text.toLowerCase() === "nan" || text.toLowerCase() === "none") return [];

  try {
    return JSON.parse(text);
  } catch (_) {
    // Python list strings commonly use single quotes. This handles simple lineage labels.
    try {
      const jsonish = text
        .replace(/\bNone\b/g, "null")
        .replace(/\bnan\b/gi, "null")
        .replace(/'/g, '"');
      return JSON.parse(jsonish);
    } catch (__) {
      // Fallback: remove brackets and split on commas/semicolons.
      return text
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(/[;,]/)
        .map((part) => part.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    }
  }
}

function collectVariants(rows) {
  const variants = new Set();
  rows.forEach((row) => {
    if (row.nextclade_lineage) variants.add(row.nextclade_lineage);
    if (row.pango_lineage) variants.add(row.pango_lineage);
    row.lineages.forEach((lineage) => {
      if (lineage) variants.add(lineage);
    });
  });
  return [...variants].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function buildColorMap(variants) {
  const map = {};
  variants.forEach((variant) => {
    const index = stableHash(variant) % PALETTE.length;
    map[variant] = PALETTE[index];
  });
  return map;
}

function stableHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function hydrateControls() {
  const sites = uniqueSorted(state.rows.map((row) => row.wwtp_name).filter(Boolean));
  const defaultSelected = sites.length ? [sites[0]] : [];
  renderCheckboxList(els.siteCheckboxList, sites, {
    name: "wwtp",
    selectedValues: defaultSelected,
    emptyText: "No WWTP values found."
  });

  const dates = state.rows.map((row) => row.__date).sort((a, b) => a - b);
  const minDate = formatISODate(dates[0]);
  const maxDate = formatISODate(dates[dates.length - 1]);
  [els.startDate, els.endDate].forEach((input) => {
    input.min = minDate;
    input.max = maxDate;
  });
  els.startDate.value = minDate;
  els.endDate.value = maxDate;

  refreshLocationOptions();
  setControlsDisabled(false);
  updateChartTabs();
}

function setPanelsEnabled(enabled) {
  els.controlsPanel.classList.toggle("is-disabled", !enabled);
  els.summaryPanel.classList.toggle("is-disabled", !enabled);
  els.chartsPanel.classList.toggle("is-disabled", !enabled);
}

function setControlsDisabled(disabled) {
  [
    els.startDate,
    els.endDate,
    els.comparisonToggle,
    els.dimToggle,
    els.selectAllSitesBtn,
    els.clearSitesBtn,
    els.clearHighlightBtn
  ].forEach((el) => {
    el.disabled = disabled;
  });

  setCheckboxGroupDisabled(els.siteCheckboxList, disabled);
  setCheckboxGroupDisabled(els.locationCheckboxList, disabled || !els.locationCheckboxList.querySelector("input"));
  Array.from(els.chartTabs.querySelectorAll("button")).forEach((button) => {
    button.disabled = disabled;
  });
}

function refreshLocationOptions() {
  const selectedSites = getCheckedValues(els.siteCheckboxList);
  const locationRows = selectedSites.length
    ? state.rows.filter((row) => selectedSites.includes(row.wwtp_name))
    : state.rows;
  const previousSelected = new Set(getCheckedValues(els.locationCheckboxList));
  const locations = uniqueSorted(locationRows.map((row) => row.sample_location_specify).filter(Boolean));
  renderCheckboxList(els.locationCheckboxList, locations, {
    name: "sample-location",
    selectedValues: [...previousSelected].filter((value) => locations.includes(value)),
    emptyText: selectedSites.length ? "No sample locations found for selected WWTPs." : "Select a WWTP to show sample locations."
  });
  setCheckboxGroupDisabled(els.locationCheckboxList, !state.rows.length || !locations.length);
}

function renderCheckboxList(container, values, { name, selectedValues = [], emptyText = "No values found." } = {}) {
  container.innerHTML = "";
  const selected = new Set(selectedValues);

  if (!values.length) {
    const empty = document.createElement("p");
    empty.className = "checkbox-empty";
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }

  values.forEach((value) => {
    const label = document.createElement("label");
    label.className = "check-option";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = name || "checkbox-option";
    input.value = value;
    input.checked = selected.has(value);

    const text = document.createElement("span");
    text.textContent = value;

    label.appendChild(input);
    label.appendChild(text);
    container.appendChild(label);
  });
}

function setCheckboxGroupDisabled(container, disabled) {
  container.classList.toggle("is-disabled", disabled);
  Array.from(container.querySelectorAll('input[type="checkbox"]')).forEach((input) => {
    input.disabled = disabled;
  });
}

function resetFilters() {
  if (!state.rows.length) return;

  setAllCheckboxesChecked(els.siteCheckboxList, false);
  const firstSite = els.siteCheckboxList.querySelector('input[type="checkbox"]');
  if (firstSite) firstSite.checked = true;

  refreshLocationOptions();
  setAllCheckboxesChecked(els.locationCheckboxList, false);

  const dates = state.rows.map((row) => row.__date).sort((a, b) => a - b);
  els.startDate.value = formatISODate(dates[0]);
  els.endDate.value = formatISODate(dates[dates.length - 1]);
  els.comparisonToggle.checked = true;
  els.dimToggle.checked = true;
  clearVariantSelections();
  state.activeChartTab = "nextclade";
  updateChartTabs();
  renderDashboard();
}

function setAllCheckboxesChecked(container, checked) {
  Array.from(container.querySelectorAll('input[type="checkbox"]')).forEach((input) => {
    if (!input.disabled) input.checked = checked;
  });
}

function getCheckedValues(container) {
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
}

function updateChartTabs() {
  Array.from(els.chartTabs.querySelectorAll("[data-chart-tab]")).forEach((button) => {
    const isActive = button.dataset.chartTab === state.activeChartTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function hasVariantSelection() {
  return state.selectedVariants instanceof Set && state.selectedVariants.size > 0;
}

function isVariantSelected(variant) {
  return state.selectedVariants instanceof Set && state.selectedVariants.has(variant);
}

function toggleVariantSelection(variant) {
  if (!(state.selectedVariants instanceof Set)) state.selectedVariants = new Set();
  if (state.selectedVariants.has(variant)) {
    state.selectedVariants.delete(variant);
  } else {
    state.selectedVariants.add(variant);
  }
}

function clearVariantSelections() {
  if (!(state.selectedVariants instanceof Set)) state.selectedVariants = new Set();
  state.selectedVariants.clear();
}

function renderDashboard() {
  if (!state.rows.length) return;

  const selectedSites = getCheckedValues(els.siteCheckboxList);
  if (!selectedSites.length) {
    renderSummary([]);
    renderVariantLegend();
    els.plotsPanel.innerHTML = `
      <div class="empty-state">
        <h2>No WWTP selected</h2>
        <p>Select at least one wastewater treatment plant to generate plots.</p>
      </div>`;
    return;
  }

  const filteredRows = getFilteredRows();
  renderSummary(filteredRows);
  renderVariantLegend();

  if (!filteredRows.length) {
    els.plotsPanel.innerHTML = `
      <div class="empty-state">
        <h2>No rows match the selected filters</h2>
        <p>Adjust the WWTP, sample location, or date range filters.</p>
      </div>`;
    return;
  }

  const useComparison = els.comparisonToggle.checked && selectedSites.length > 1;
  const groups = useComparison
    ? selectedSites.map((site) => ({
        key: site,
        label: site,
        rows: filteredRows.filter((row) => row.wwtp_name === site)
      }))
    : [{
        key: "combined",
        label: selectedSites.length > 1 ? `Combined view: ${selectedSites.length} WWTPs` : selectedSites[0],
        rows: filteredRows
      }];

  const globalScales = computeGlobalScales(filteredRows);
  els.plotsPanel.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "site-grid";
  els.plotsPanel.appendChild(grid);

  groups.forEach((group, groupIndex) => {
    const card = buildSiteCard(group, groupIndex);
    grid.appendChild(card);
    renderGroupPlots(group, groupIndex, globalScales, useComparison);
  });
}

function getFilteredRows() {
  const selectedSites = new Set(getCheckedValues(els.siteCheckboxList));
  const selectedLocations = new Set(getCheckedValues(els.locationCheckboxList));
  const start = els.startDate.value ? parseDate(els.startDate.value) : null;
  const end = els.endDate.value ? parseDate(els.endDate.value) : null;

  return state.rows.filter((row) => {
    if (selectedSites.size && !selectedSites.has(row.wwtp_name)) return false;
    if (selectedLocations.size && !selectedLocations.has(row.sample_location_specify)) return false;
    if (start && row.__date < start) return false;
    if (end && row.__date > end) return false;
    return true;
  });
}

function renderSummary(rows) {
  const sites = uniqueSorted(rows.map((row) => row.wwtp_name).filter(Boolean));
  const specimens = uniqueSorted(rows.map((row) => row.specimen_id).filter(Boolean));
  const locations = uniqueSorted(rows.map((row) => row.sample_location_specify).filter(Boolean));
  const dates = rows.map((row) => row.__date).sort((a, b) => a - b);
  const freyjaLineages = new Set();
  rows.forEach((row) => row.lineages.forEach((lineage) => freyjaLineages.add(lineage)));

  const dateLabel = dates.length
    ? `${formatISODate(dates[0])} → ${formatISODate(dates[dates.length - 1])}`
    : "No data";

  const cards = [
    { value: rows.length.toLocaleString(), label: "Filtered rows" },
    { value: sites.length.toLocaleString(), label: "WWTPs" },
    { value: specimens.length.toLocaleString(), label: "Specimens" },
    { value: locations.length.toLocaleString(), label: "Sample locations" },
    { value: freyjaLineages.size.toLocaleString(), label: "Freyja lineages" },
    { value: dateLabel, label: "Filtered date range" }
  ];

  els.summaryCards.innerHTML = cards
    .map((card) => `
      <div class="summary-card">
        <strong>${escapeHTML(card.value)}</strong>
        <span>${escapeHTML(card.label)}</span>
      </div>`)
    .join("");
}

function renderVariantLegend() {
  if (!state.variants.length) {
    els.variantLegend.innerHTML = "<p>No variants found in the uploaded file.</p>";
    return;
  }

  els.variantLegend.innerHTML = "";
  const anySelected = hasVariantSelection();

  state.variants.forEach((variant) => {
    const label = document.createElement("label");
    label.className = "check-option variant-option";
    if (isVariantSelected(variant)) label.classList.add("is-active");
    if (anySelected && !isVariantSelected(variant) && els.dimToggle.checked) {
      label.classList.add("is-dimmed");
    }

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "variant-selection";
    input.value = variant;
    input.checked = isVariantSelected(variant);

    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = getVariantColor(variant);

    const text = document.createElement("span");
    text.textContent = variant;

    input.addEventListener("change", () => {
      toggleVariantSelection(variant);
      renderDashboard();
    });

    label.appendChild(input);
    label.appendChild(swatch);
    label.appendChild(text);
    els.variantLegend.appendChild(label);
  });
}

function buildSiteCard(group, groupIndex) {
  const card = document.createElement("article");
  card.className = "site-card";

  const dates = group.rows.map((row) => row.__date).sort((a, b) => a - b);
  const dateLabel = dates.length
    ? `${formatISODate(dates[0])} → ${formatISODate(dates[dates.length - 1])}`
    : "No matching dates";
  const specimens = uniqueSorted(group.rows.map((row) => row.specimen_id).filter(Boolean));
  const tabLabel = getChartTabLabel(state.activeChartTab);

  card.innerHTML = `
    <div class="site-card-header">
      <div>
        <h3>${escapeHTML(group.label)}</h3>
        <p>${dateLabel}</p>
      </div>
      <div class="site-mini-stats">
        ${escapeHTML(tabLabel)} · ${group.rows.length.toLocaleString()} rows · ${specimens.length.toLocaleString()} specimens
      </div>
    </div>
    <div class="chart-single">
      <div id="chart-${groupIndex}-${state.activeChartTab}" class="chart-box chart-box-large"></div>
    </div>
  `;
  return card;
}

function renderGroupPlots(group, groupIndex, globalScales, isComparison) {
  const suffix = isComparison ? ` — ${group.label}` : "";
  const tab = state.activeChartTab;
  let fig;

  if (tab === "pango") {
    fig = makeStackedWeeklyFigure({
      rows: group.rows,
      column: "pango_lineage",
      title: `Pango Lineages (Weekly, Proportional)${suffix}`,
      legendTitle: "Pango lineage",
      globalWeeks: globalScales.weeks
    });
  } else if (tab === "pcr") {
    fig = makePCRFigure({
      rows: group.rows,
      title: `PCR Target Avg Conc (log)${suffix}`,
      yRange: globalScales.pcrYRange,
      dateRange: globalScales.dateRange
    });
  } else if (tab === "freyja") {
    fig = makeFreyjaFigure({
      rows: group.rows,
      title: `Freyja Results per Specimen${suffix}`
    });
  } else {
    fig = makeStackedWeeklyFigure({
      rows: group.rows,
      column: "nextclade_lineage",
      title: `Nextclade Lineages (Weekly, Proportional)${suffix}`,
      legendTitle: "Nextclade lineage",
      globalWeeks: globalScales.weeks
    });
  }

  drawPlot(`chart-${groupIndex}-${tab}`, fig);
}

function getChartTabLabel(tab) {
  const labels = {
    nextclade: "Nextclade",
    pango: "Pango",
    pcr: "PCR log concentration",
    freyja: "Freyja abundance"
  };
  return labels[tab] || "Chart";
}

function drawPlot(elementId, fig) {
  const element = document.getElementById(elementId);
  if (!element) return;
  Plotly.react(element, fig.data, fig.layout, plotConfig).then(() => {
    element.removeAllListeners && element.removeAllListeners("plotly_legendclick");
    element.on("plotly_legendclick", (eventData) => {
      const trace = eventData.fullData || eventData.data?.[eventData.curveNumber];
      const traceName = trace && trace.name;
      if (traceName && state.variants.includes(traceName)) {
        toggleVariantSelection(traceName);
        renderDashboard();
        return false;
      }
      return true;
    });
  });
}

function computeGlobalScales(rows) {
  const dates = rows.map((row) => row.__date).sort((a, b) => a - b);
  const dateRange = dates.length ? [formatISODate(dates[0]), formatISODate(dates[dates.length - 1])] : null;
  const weeks = buildContinuousWeeks(rows.map((row) => row.__week));
  const pcrValues = rows
    .map((row) => row.pcr_target_avg_conc_log)
    .filter((value) => Number.isFinite(value));
  const pcrYRange = makePaddedRange(pcrValues);

  return { dateRange, weeks, pcrYRange };
}

function buildContinuousWeeks(weekDates) {
  const valid = weekDates.filter(Boolean).sort((a, b) => a - b);
  if (!valid.length) return [];
  const weeks = [];
  const current = new Date(valid[0].getTime());
  const last = valid[valid.length - 1];
  while (current <= last) {
    weeks.push(formatISODate(current));
    current.setUTCDate(current.getUTCDate() + 7);
  }
  return weeks;
}

function makePaddedRange(values) {
  if (!values.length) return null;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 0.5;
    max += 0.5;
  }
  const pad = (max - min) * 0.12;
  return [min - pad, max + pad];
}

function makeStackedWeeklyFigure({ rows, column, title, legendTitle, globalWeeks }) {
  const nonEmptyRows = rows.filter((row) => row[column]);
  if (!nonEmptyRows.length) return makeEmptyFigure(title, "No lineage records match these filters.");

  const weeks = globalWeeks && globalWeeks.length ? globalWeeks : buildContinuousWeeks(nonEmptyRows.map((row) => row.__week));
  const totalsByWeek = new Map();
  const counts = new Map();
  const variants = new Set();

  nonEmptyRows.forEach((row) => {
    const week = row.__weekISO;
    const variant = row[column];
    variants.add(variant);
    totalsByWeek.set(week, (totalsByWeek.get(week) || 0) + 1);
    const key = `${week}|||${variant}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const sortedVariants = [...variants].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const data = sortedVariants.map((variant) => {
    const y = weeks.map((week) => {
      const total = totalsByWeek.get(week) || 0;
      const count = counts.get(`${week}|||${variant}`) || 0;
      return total ? count / total : 0;
    });
    const countValues = weeks.map((week) => counts.get(`${week}|||${variant}`) || 0);
    return {
      type: "bar",
      x: weeks,
      y,
      name: variant,
      legendgroup: variant,
      marker: {
        color: getVariantColor(variant),
        line: {
          color: isVariantSelected(variant) ? "#111827" : "rgba(0,0,0,0)",
          width: isVariantSelected(variant) ? 1.5 : 0
        }
      },
      opacity: getVariantOpacity(variant),
      customdata: countValues,
      hovertemplate: `${legendTitle}: ${escapeForHover(variant)}<br>Week: %{x}<br>Proportion: %{y:.1%}<br>Count: %{customdata}<extra></extra>`
    };
  });

  return {
    data,
    layout: baseLayout(title, {
      barmode: "stack",
      legend: compactLegend(),
      xaxis: {
        title: "Week starting",
        type: "date",
        tickformat: "%Y-%m-%d"
      },
      yaxis: {
        title: "Proportion",
        range: [0, 1],
        tickformat: ".0%"
      }
    })
  };
}

function makePCRFigure({ rows, title, yRange, dateRange }) {
  const pcrRows = rows
    .filter((row) => Number.isFinite(row.pcr_target_avg_conc_log))
    .sort((a, b) => a.__date - b.__date || a.wwtp_name.localeCompare(b.wwtp_name));

  if (!pcrRows.length) return makeEmptyFigure(title, "No valid PCR log concentration values match these filters.");

  const sites = uniqueSorted(pcrRows.map((row) => row.wwtp_name).filter(Boolean));
  const makeTrace = (siteRows, traceName) => ({
    type: "scatter",
    mode: "lines+markers",
    x: siteRows.map((row) => row.__dateISO),
    y: siteRows.map((row) => row.pcr_target_avg_conc_log),
    text: siteRows.map((row) => row.specimen_id),
    name: traceName,
    hovertemplate: "Specimen: %{text}<br>Date: %{x}<br>PCR log conc: %{y}<extra></extra>"
  });

  const data = sites.length > 1
    ? sites.map((site) => makeTrace(pcrRows.filter((row) => row.wwtp_name === site), site))
    : [makeTrace(pcrRows, "PCR log conc")];

  const values = pcrRows.map((row) => row.pcr_target_avg_conc_log).sort((a, b) => a - b);
  const q1 = quantile(values, 0.25);
  const median = quantile(values, 0.5);
  const q3 = quantile(values, 0.75);

  const shapes = [];
  const annotations = [];
  [
    { value: q1, label: "Q1" },
    { value: median, label: "Median" },
    { value: q3, label: "Q3" }
  ].forEach((item, index) => {
    if (!Number.isFinite(item.value)) return;
    shapes.push({
      type: "line",
      xref: "paper",
      x0: 0,
      x1: 1,
      y0: item.value,
      y1: item.value,
      line: { dash: "dash", width: 1.2, color: "rgba(20,32,51,0.55)" }
    });
    annotations.push({
      xref: "paper",
      x: 0.01,
      y: item.value,
      text: item.label,
      showarrow: false,
      xanchor: "left",
      yanchor: index === 1 ? "bottom" : "top",
      bgcolor: "rgba(255,255,255,0.72)",
      font: { size: 11, color: "#344054" }
    });
  });

  return {
    data,
    layout: baseLayout(title, {
      legend: sites.length > 1 ? compactLegend() : { orientation: "h", y: -0.22 },
      shapes,
      annotations,
      xaxis: {
        title: "Sample collect date",
        type: "date",
        tickformat: "%Y-%m-%d",
        range: dateRange || undefined
      },
      yaxis: {
        title: "log conc",
        range: yRange || undefined
      }
    })
  };
}

function makeFreyjaFigure({ rows, title }) {
  const exploded = explodeLineagesAbundances(rows);
  if (!exploded.length) return makeEmptyFigure(title, "No valid Freyja lineage/abundance pairs match these filters.");

  const specimenDates = new Map();
  rows.forEach((row) => specimenDates.set(row.specimen_id, row.__dateISO));

  const specimens = uniqueSorted(exploded.map((row) => row.specimen_id)).sort((a, b) => {
    const ad = specimenDates.get(a) || "";
    const bd = specimenDates.get(b) || "";
    return ad.localeCompare(bd) || a.localeCompare(b, undefined, { numeric: true });
  });

  const lineages = uniqueSorted(exploded.map((row) => row.lineage));
  const abundanceMap = new Map();
  exploded.forEach((row) => {
    const key = `${row.specimen_id}|||${row.lineage}`;
    abundanceMap.set(key, (abundanceMap.get(key) || 0) + row.abundance);
  });

  const data = lineages.map((lineage) => ({
    type: "bar",
    x: specimens,
    y: specimens.map((specimen) => abundanceMap.get(`${specimen}|||${lineage}`) || 0),
    name: lineage,
    legendgroup: lineage,
    marker: {
      color: getVariantColor(lineage),
      line: {
        color: isVariantSelected(lineage) ? "#111827" : "rgba(0,0,0,0)",
        width: isVariantSelected(lineage) ? 1.5 : 0
      }
    },
    opacity: getVariantOpacity(lineage),
    hovertemplate: `Specimen: %{x}<br>Lineage: ${escapeForHover(lineage)}<br>Abundance: %{y:.1%}<extra></extra>`
  }));

  const coverageBySpecimen = new Map();
  const totalBySpecimen = new Map();
  rows.forEach((row) => {
    coverageBySpecimen.set(row.specimen_id, row.freyja_coverage);
  });
  exploded.forEach((row) => {
    totalBySpecimen.set(row.specimen_id, (totalBySpecimen.get(row.specimen_id) || 0) + row.abundance);
  });

  data.push({
    type: "scatter",
    mode: "text",
    x: specimens,
    y: specimens.map((specimen) => Math.min((totalBySpecimen.get(specimen) || 1) + 0.04, 1.1)),
    text: specimens.map((specimen) => {
      const cov = coverageBySpecimen.get(specimen);
      return Number.isFinite(cov) ? cov.toFixed(2) : "";
    }),
    name: "Freyja coverage",
    showlegend: false,
    hoverinfo: "skip",
    textfont: { size: 11, color: "#344054" }
  });

  return {
    data,
    layout: baseLayout(title, {
      barmode: "stack",
      legend: compactLegend(),
      xaxis: {
        title: "Specimen ID",
        type: "category",
        tickangle: specimens.length > 7 ? -35 : 0,
        automargin: true
      },
      yaxis: {
        title: "abundance (proportion)",
        range: [0, 1.15],
        tickformat: ".0%"
      }
    })
  };
}

function explodeLineagesAbundances(rows) {
  const exploded = [];
  rows.forEach((row) => {
    const length = Math.min(row.lineages.length, row.abundances.length);
    for (let i = 0; i < length; i += 1) {
      const lineage = safeString(row.lineages[i]);
      const abundance = row.abundances[i];
      if (!lineage || !Number.isFinite(abundance)) continue;
      exploded.push({
        specimen_id: row.specimen_id,
        lineage,
        abundance
      });
    }
  });
  return exploded;
}

function quantile(sortedValues, q) {
  if (!sortedValues.length) return NaN;
  const pos = (sortedValues.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedValues[base + 1] !== undefined) {
    return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
  }
  return sortedValues[base];
}

function baseLayout(title, overrides = {}) {
  return {
    title: { text: title, x: 0.02, xanchor: "left", font: { size: 15 } },
    height: 560,
    margin: { l: 68, r: 26, t: 68, b: 96 },
    paper_bgcolor: "#ffffff",
    plot_bgcolor: "#ffffff",
    hovermode: "closest",
    font: { family: "Inter, system-ui, -apple-system, Segoe UI, sans-serif", color: "#142033" },
    ...overrides
  };
}

function compactLegend() {
  return {
    title: { text: "Click to highlight" },
    orientation: "h",
    y: -0.24,
    x: 0,
    itemclick: "toggle",
    itemdoubleclick: "toggleothers",
    font: { size: 10 }
  };
}

function makeEmptyFigure(title, message) {
  return {
    data: [],
    layout: baseLayout(title, {
      xaxis: { visible: false },
      yaxis: { visible: false },
      annotations: [{
        text: message,
        x: 0.5,
        y: 0.5,
        xref: "paper",
        yref: "paper",
        showarrow: false,
        font: { size: 13, color: "#61708a" }
      }]
    })
  };
}

function getVariantColor(variant) {
  return state.colorMap[variant] || PALETTE[stableHash(variant) % PALETTE.length];
}

function getVariantOpacity(variant) {
  if (!hasVariantSelection() || !els.dimToggle.checked) return 1;
  return isVariantSelected(variant) ? 1 : 0.18;
}

function showMessage(message, type = "info") {
  els.messageBox.textContent = message;
  els.messageBox.className = `message-box is-${type}`;
}

function clearMessage() {
  els.messageBox.textContent = "";
  els.messageBox.className = "message-box";
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeForHover(value) {
  return String(value).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
