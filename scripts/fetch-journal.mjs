// scripts/fetch-journal.mjs
import fs from "node:fs/promises";
import path from "node:path";

const JOURNAL_CSV_URL =
  process.env.JOURNAL_SHEET_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=XXXX&single=true&output=csv";

const JOURNAL_FILE = path.join("data", "journal.js");

// --- tiny CSV parser (handles quotes, newlines) ---
function parseCSV(text) {
  // strip BOM if present
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

  const rows = [];
  let i = 0, field = "", row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i], n = text[i+1];
    if (inQuotes) {
      if (c === '"' && n === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { row.push(field); field = ""; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  row.push(field); rows.push(row);
  return rows;
}

// normalize header names: trim, lower, strip BOM
const normHeader = s => s.replace(/^\uFEFF/, "").trim().toLowerCase();
// normalize slugs: strip wrapping [[...]], spaces -> -, lower, keep a-z0-9- only
function normSlug(s) {
  if (!s) return "";
  s = s.trim();
  const m = s.match(/^\[\[([\s\S]+?)\]\]$/); // [[slug]] → slug
  if (m) s = m[1];
  s = s.replace(/\s+/g, "-").toLowerCase();
  s = s.replace(/[^a-z0-9\-]/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
  return s;
}

function rowsToRecords(rows) {
  const [rawHeader, ...data] = rows;
  if (!rawHeader) return [];

  const header = rawHeader.map(normHeader);
  const idx = Object.fromEntries(header.map((h,i)=>[h, i]));
  const get = (r, k) => ((idx[k] != null ? r[idx[k]] : "") ?? "").toString();

  const out = [];
  for (const r of data) {
    // skip fully empty rows
    if (!r || r.every(cell => !String(cell || "").trim())) continue;

    const slugRaw = get(r, "slug");
    const slug = normSlug(slugRaw);
    if (!slug) continue;

    const tagsRaw = get(r, "tags");
    const tags = tagsRaw
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    out.push({
      slug,
      date: get(r, "date").trim(),
      title: (get(r, "title") || "(untitled)").trim(),
      tags,
      body: get(r, "body") || ""
    });
  }
  return out;
}

(async function main(){
  console.log("Fetching Journal CSV...");
  const res = await fetch(JOURNAL_CSV_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const csv = await res.text();

  const rows = parseCSV(csv);
  console.log(`CSV rows (incl. header): ${rows.length}`);
  if (rows.length) console.log("Header:", rows[0].map(s => s.replace(/^\uFEFF/,"")));

  const records = rowsToRecords(rows);
  const out = `// GENERATED from Journal CSV\n// Source: ${JOURNAL_CSV_URL}\nwindow.JOURNAL_DATA = ${JSON.stringify(records, null, 2)};\n`;

  await fs.mkdir(path.dirname(JOURNAL_FILE), { recursive: true });
  await fs.writeFile(JOURNAL_FILE, out, "utf8");
  console.log(`Wrote ${records.length} journal entries to ${JOURNAL_FILE}`);
})().catch(err => { console.error(err); process.exit(1); });
