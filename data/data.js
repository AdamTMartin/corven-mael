// data/data.js
// Corven’s Lore Bible — add entries here.
window.CORVEN_DATA = [
  {
    slug: "corven-profile",
    type: "Person",
    title: "Corven Mael (aka Echo)",
    summary: "Hellbound avenger, Mojon escapee, knives in the dark; keeps his promises even when it hurts.",
    date: "2025-08-15",
    tags: ["protagonist","backstory","motive","oath"],
    body: `
**Species/Class**: (fill me)  
**Concept**: Damned wanderer seeking to cut out the rot and the rot in himself.  

**Core vows**
- *Never let Mojon chains close on anyone else again.*
- *Debts are paid in full—coin, blood, or time.*

**Threads**
- The **Mojon Mining Consortium** used prisoners as blood-keys in timework. Corven escaped. [[mojon-mining-consortium]]
- Keeps a black token from the **Apostate Crow** as a reminder. [[apostate-crow]]
    `
  },
  {
    slug: "mojon-mining-consortium",
    type: "Faction",
    title: "Mojon Mining Consortium",
    summary: "Extraction at any cost; rumor says their ledgers can roll time backwards—for a price.",
    tags: ["antagonist","industry","timework"],
    body: `
**Modus**: Capture bloodlines tied to old pacts; harvest vitae for "retroactive favors."  
**Notes**: Ties into The Guild and the Apostate Crow; off-books convoys run through sympathetic ports.  

**Known Contacts**
- Quartermaster **Sib Orveck** (coward with immaculate boots).
- Fixer **Vessel** (voice like broken glass).
    `
  },
  {
    slug: "apostate-crow",
    type: "Faction",
    title: "The Apostate Crow",
    summary: "Cult that wants the lock off the world-ending thing. They offer answers Corven can’t afford.",
    tags: ["cult","eldritch","whispers"],
    body: `
**Doctrine**: Unshackle the **Quiet God** beneath the horizon.  
**Iconography**: Black feathers stitched into lips.  
**Corven’s Tie**: A token traded for a name; the name led him out of a cell. Cost pending.  
    `
  },
  {
    slug: "first-knife",
    type: "Item",
    title: "The First Knife",
    summary: "A jagged heirloom that rings near time-magic.",
    tags: ["relic","weapon","timework"],
    body: `
**Origin**: Found in the necromancer’s lab.  
**Properties**: Cuts oaths clean; hums when a lie is spoken within arm’s reach.  
**Linked**: See [[mojon-mining-consortium]] experiments log.
    `
  },
  {
    slug: "docks-ambush",
    type: "Event",
    title: "The Docks Ambush",
    date: "2022-10-04",
    tags: ["escape","flashback","violence"],
    summary: "Where Corven chose the hard exit and became Echo.",
    body: `
A memory that smells like ozone and tar. Three men down, one promise up. He left the name Corven on the water and took **Echo** instead.
    `
  },
  {
    slug: "notes-inbox",
    type: "Note",
    title: "Scratchpad",
    tags: ["todo","ideas"],
    summary: "Loose bits to sort later.",
    body: `
- NPC idea: **Guilder Archivist** who buys confessions like futures.  
- Location seed: **Wharf of Tides-That-Return**, clocks run wrong.  
- Theme line: *"If you carry the past, let it cut who needs cutting."*
    `
  }
];
