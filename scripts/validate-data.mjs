// scripts/validate-data.mjs
// Quick integrity checks for lore and journal data.
import fs from "node:fs/promises";
import path from "node:path";

const DATA_FILE = path.join("data", "data.js");
const JOURNAL_FILE = path.join("data", "journal.js");

function extractJson(raw, marker) {
  const m = raw.match(/=\s*(\[\s*[\s\S]*\s*\]);?\s*$/m);
  if (!m) throw new Error(`Could not find array assignment in ${marker}`);
  return JSON.parse(m[1]);
}

async function readDataFile(file, marker) {
  const raw = await fs.readFile(file, "utf8");
  return extractJson(raw, marker);
}

function isValidSlug(slug) {
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function isValidDate(date) {
  if (!date) return true;
  return !Number.isNaN(Date.parse(date));
}

function checkLore(entries) {
  const errors = [];
  const seen = new Set();
  const TYPES = new Set(["Person","Place","Event","Item","Faction","Concept","Note","Player"]);

  entries.forEach((e, idx) => {
    const where = `lore[${idx}] (${e.slug || "no-slug"})`;
    if (!e.slug) errors.push(`${where}: missing slug`);
    if (e.slug && !isValidSlug(e.slug)) errors.push(`${where}: invalid slug "${e.slug}" (use kebab-case)`);
    if (e.slug) {
      if (seen.has(e.slug)) errors.push(`${where}: duplicate slug "${e.slug}"`);
      seen.add(e.slug);
    }
    if (!e.title) errors.push(`${where}: missing title`);
    if (!e.type) errors.push(`${where}: missing type`);
    if (e.type && !TYPES.has(e.type)) errors.push(`${where}: unexpected type "${e.type}"`);
    if (!isValidDate(e.date)) errors.push(`${where}: invalid date "${e.date}"`);
  });
  return errors;
}

function checkJournal(entries) {
  const errors = [];
  const seen = new Set();
  entries.forEach((e, idx) => {
    const where = `journal[${idx}] (${e.slug || "no-slug"})`;
    if (!e.slug) errors.push(`${where}: missing slug`);
    if (e.slug && !isValidSlug(e.slug)) errors.push(`${where}: invalid slug "${e.slug}" (use kebab-case)`);
    if (e.slug) {
      if (seen.has(e.slug)) errors.push(`${where}: duplicate slug "${e.slug}"`);
      seen.add(e.slug);
    }
    if (!e.title) errors.push(`${where}: missing title`);
    if (!isValidDate(e.date)) errors.push(`${where}: invalid date "${e.date}"`);
  });
  return errors;
}

async function main() {
  const lore = await readDataFile(DATA_FILE, "data.js");
  const journal = await readDataFile(JOURNAL_FILE, "journal.js");

  const loreErrors = checkLore(lore);
  const journalErrors = checkJournal(journal);
  const errors = [...loreErrors, ...journalErrors];

  if (errors.length) {
    console.error(`Found ${errors.length} data issue${errors.length === 1 ? "" : "s"}:`);
    errors.forEach(e => console.error(" -", e));
    process.exit(1);
  }

  console.log(`OK: ${lore.length} lore entries, ${journal.length} journal entries`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
