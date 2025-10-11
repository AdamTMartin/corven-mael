// scripts/fetch-sheet.mjs
import fs from "node:fs/promises";

const SHEET_CSV_URL = process.env.SHEET_CSV_URL; // set in workflow
if (!SHEET_CSV_URL) {
  console.error("Missing SHEET_CSV_URL env var"); process.exit(1);
}

// Minimal CSV parser that preserves quoted newlines.
function parseCSV(text) {
  const rows = [];
  let i = 0, field = "", row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i], n = text[i+1];
    if (inQuotes) {
      if (c === '"' && n === '"') { field += '"'; i += 2; continue; }
      if (c === '"' ) { inQuotes = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { row.push(field); field = ""; i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  row.push(field); rows.push(row);
  return rows;
}

function toRecords(rows) {
  const [header, ...data] = rows;
  const idx = (k) => header.indexOf(k);
  const get = (r, k) => r[idx(k)] ?? "";
  return data
    .filter(r => r.length && get(r, "slug"))
    .map(r => {
      const tags = (get(r,"tags") || "")
        .split(",").map(s=>s.trim()).filter(Boolean);
      const rec = {
        slug: get(r,"slug").trim(),
        type: get(r,"type").trim() || "Note",
        title: get(r,"title").trim() || "(untitled)",
        summary: get(r,"summary").trim() || "",
        date: get(r,"date").trim() || undefined,
        tags,
        body: get(r,"body")
      };
      // Remove empty props
      if (!rec.summary) delete rec.summary;
      if (!rec.date) delete rec.date;
      if (!rec.tags.length) delete rec.tags;
      if (!rec.body) delete rec.body;
      return rec;
    });
}

const res = await fetch(SHEET_CSV_URL);
if (!res.ok) { console.error("Fetch failed:", res.status, res.statusText); process.exit(1); }
const csv = await res.text();
const rows = parseCSV(csv);
const records = toRecords(rows);

// Pretty output as window.CORVEN_DATA
const out = `// GENERATED from Google Sheets — do not edit by hand.
window.CORVEN_DATA = ${JSON.stringify(records, null, 2)};
`;
await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/data.js", out, "utf8");
console.log(`Wrote data/data.js with ${records.length} entries`);
