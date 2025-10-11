# 🪶 Corven Lore Lookup
A searchable, auto-updating lore bible for **Corven Mael (Echo)**, powered by Google Sheets and GitHub Pages.

---

## ✍️ Adding or Editing Entries

1. **Open the Google Sheet**
   - [Edit the sheet here](https://docs.google.com/spreadsheets/d/PLACE-YOUR-EDITABLE-LINK-HERE)
   - The site reads from its published CSV automatically.

2. **Fill in columns**

| Column | Required? | Example | Notes |
|---------|------------|---------|-------|
| slug | ✅ | `apostate-crow` | Unique lowercase ID (no spaces). Used in links. |
| type | ✅ | `Faction` | One of `Person, Place, Event, Item, Faction, Concept, Note`. |
| title | ✅ | `The Apostate Crow` | Display title. |
| summary | ✅ | `Cult that wants the lock off the world-ending thing.` | Short blurb. |
| date | Optional | `2025-08-15` | Used for timeline sorting. |
| tags | Optional | `cult,eldritch,whispers` | Comma-separated keywords. |
| body | Optional | Markdown text (supports **bold**, *italics*, lists, and [[slug]] cross-links). |

3. **Save the sheet**
   - Google auto-saves; the CSV updates within ~30 s.

4. **Deploy the update**
   - **Runtime mode**: Just refresh the site.
   - **GitHub Action mode**:  
     - Wait for the scheduled sync (every 12–24 hours)  
     - or trigger it manually:  
       → _Actions → “Sync Lore from Google Sheets” → Run workflow._

---

## 🔗 Linking Between Entries
Use double brackets to cross-link:  

[[apostate-crow]]

When rendered, it links directly to that card on the site.

---

## 🖨️ Exporting / Printing (optional)
Future feature: you’ll be able to select entries and export them as printable cards or a lore packet PDF.

---

## 🧰 Technical Notes
- Built with static HTML + JS (no build tools).  
- `data/data.js` is auto-generated from the Sheet via a GitHub Action.  
- Manual trigger:

gh workflow run “Sync Lore from Google Sheets”

- Cron schedule: once per 24 h (edit in `.github/workflows/sheet-sync.yml`).

---

**License:** Personal use / TTRPG storytelling  
**Author:** Adam Martin (Corven Mael / Echo)  
