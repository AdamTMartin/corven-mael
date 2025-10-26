// scripts/fetch-journal.mjs
import fs from "node:fs/promises";
import path from "node:path";

const JOURNAL_CSV_URL =
  process.env.JOURNAL_SHEET_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=XXXX&single=true&output=csv";

const JOURNAL_FILE = path.join("data", "journal.js");

function parseCSV(text) {
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

function rowsToRecords(rows) {
  const [header, ...data] = rows;
  if (!header) return [];
  const idx = Object.fromEntries(header.map((h,i)=>[h.trim(), i]));
  const get = (r, k) => (r[idx[k]] ?? "").toString().trim();

  return data.map(r => {
    const slug = get(r,"slug");
    if (!slug) return null;
    const rec = {
      slug,
      date: get(r,"date") || "",
      title: get(r,"title") || "(untitled)",
      tags: get(r,"tags").split(",").map(s=>s.trim()).filter(Boolean),
      body: get(r,"body") || ""
    };
    return rec;
  }).filter(Boolean);
}

(async function main(){
  console.log("Fetching Journal CSV...");
  const res = await fetch(JOURNAL_CSV_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const csv = await res.text();
  const rows = parseCSV(csv);
  const records = rowsToRecords(rows);
  const out = `// GENERATED from Journal CSV\n// Source: ${JOURNAL_CSV_URL}\nwindow.JOURNAL_DATA = ${JSON.stringify(records, null, 2)};\n`;
  await fs.mkdir(path.dirname(JOURNAL_FILE), { recursive: true });
  await fs.writeFile(JOURNAL_FILE, out, "utf8");
  console.log(`Wrote ${records.length} journal entries to ${JOURNAL_FILE}`);
})().catch(err => { console.error(err); process.exit(1); });
