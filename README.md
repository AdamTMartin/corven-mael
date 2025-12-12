# Corven Lore Lookup
A searchable, auto-updating lore bible for **Corven Mael (Echo)**, powered by Google Sheets and GitHub Pages.

---

## Adding or Editing Entries

1. **Open the Google Sheet**
   - [Edit the sheet here](https://docs.google.com/spreadsheets/d/18eSLL5bM2LhMXdZ2ZOaf-cHqxblSbTkTmqGaoG9PYAI/edit?gid=175844498#gid=175844498)
   - The site reads from its published CSV automatically.

2. **Fill in columns**

| Column | Required? | Example | Notes |
|---------|-----------|---------|-------|
| slug | Yes | `apostate-crow` | Unique lowercase ID (no spaces). Used in links. |
| type | Yes | `Faction` | One of `Person, Place, Event, Item, Faction, Concept, Note`. |
| title | Yes | `The Apostate Crow` | Display title. |
| summary | Yes | `Cult that wants the lock off the world-ending thing.` | Short blurb. |
| date | Optional | `2025-08-15` | Used for timeline sorting. |
| tags | Optional | `cult,eldritch,whispers` | Comma-separated keywords. |
| body | Optional | Markdown text (supports **bold**, *italics*, lists, and [[slug]] cross-links). |

3. **Save the sheet**
   - Google auto-saves; the CSV updates within ~30 s.

4. **Deploy the update**
   - **Runtime mode**: Just refresh the site.
   - **GitHub Action mode**:  
     - Wait for the scheduled sync (every 12-24 hours), or  
     - Trigger it manually: _Actions -> "Sync Lore from Google Sheets" -> Run workflow._

---

## Linking Between Entries
Use double brackets to cross-link:  

[[apostate-crow]]

When rendered, it links directly to that card on the site.

---

## Exporting / Printing (planned)
Future feature: select entries and export them as printable cards or a lore packet PDF.

---

## References (maps, images)
Place shared reference files in `assets/` (e.g., `assets/map.jpg`). They appear under the **References** section in the slide-out menu.

---

## Technical Notes
- Built with static HTML + JS (no build tools).  
- `data/data.js` is auto-generated from the Sheet via a GitHub Action.  
- Manual trigger: `gh workflow run "Sync Lore from Google Sheets"`  
- Cron schedule: twice per 24 h (edit in `.github/workflows/sheet-sync.yml`).

---

**License:** Personal use / TTRPG storytelling  
**Author:** Adam Martin (Corven Mael / Echo)  
