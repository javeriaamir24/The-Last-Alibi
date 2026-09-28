import { Suspect, Clue, LocationData } from "../types/game";

export const INITIAL_SUSPECTS: Suspect[] = [
  {
    id: "sarah",
    name: "Sarah Vance",
    role: "Victim's Estranged Daughter",
    age: 27,
    locationId: "living_room",
    personality: "Emotional, haughty, defensive, intelligent, grieving under a cynical facade.",
    traits: ["Defensive", "Emotional", "Sharp-tongued"],
    publicAlibi: "I retired to my second-floor bedroom before 9:30 PM and didn't step foot downstairs until the caretaker screamed.",
    stressBase: 25
  },
  {
    id: "daniel",
    name: "Daniel Sterling",
    role: "Business Partner & Co-Director",
    age: 42,
    locationId: "entrance",
    personality: "Calm, manipulative, confident, slick, calculates every syllable, hides panic behind polite charm.",
    traits: ["Calculating", "Manipulative", "Unflappable"],
    publicAlibi: "Arthur and I finished our business review before 9:50 PM. I stayed in the living room sipping bourbon by the fire until 10:45 PM. I never went back into that study.",
    stressBase: 35
  },
  {
    id: "michael",
    name: "Michael Hayes",
    role: "Head Caretaker & Groundskeeper",
    age: 58,
    locationId: "kitchen",
    personality: "Nervous, soft-spoken, observant, fidgets with an oily tea towel, terrified of police.",
    traits: ["Nervous", "Observant", "Timid"],
    publicAlibi: "I was down in the basement boiler room and kitchen peeling potatoes all evening until I brought Mr. Vance his tea.",
    stressBase: 45
  },
  {
    id: "victoria",
    name: "Victoria Cross",
    role: "Executive Personal Assistant",
    age: 31,
    locationId: "garden",
    personality: "Crisp, hyper-competent, analytical, stoic, observes everything with clinical detachment.",
    traits: ["Analytical", "Observant", "Composed"],
    publicAlibi: "I was organizing corporate archives in the east library wing until 10:00 PM, then retired to the guest annex to read.",
    stressBase: 15
  }
];

export const INITIAL_CLUES: Clue[] = [
  {
    id: "pocket_watch",
    name: "Shattered Gold Pocket Watch",
    shortDesc: "Victim's pocket watch stopped precisely at 10:22 PM with a cracked crystal.",
    detailedDesc: "Found gripped in Arthur Vance's cold fingers. The glass face is shattered and the balance wheel jammed, freezing the hands at exactly 10:22 PM. This establishes the exact time of the murder struggle.",
    locationId: "study",
    relatedSuspectId: "daniel",
    contradictsSuspectId: "daniel",
    contradictionNote: "Daniel claims he was calmly drinking bourbon in the living room between 9:50 and 10:45 PM, but Arthur died at 10:22 PM.",
    importance: "critical",
    iconType: "watch"
  },
  {
    id: "torn_will",
    name: "Torn Will Draft",
    shortDesc: "A crumpled draft document from the living room wastebasket disinheriting Sarah.",
    detailedDesc: "A legal codicil drafted this afternoon. It states: 'Due to ongoing reckless fiscal behavior, Sarah Vance is hereby stripped of all residue estate entitlements.' Sarah's teardrop stains mark the paper.",
    locationId: "living_room",
    relatedSuspectId: "sarah",
    contradictsSuspectId: "sarah",
    contradictionNote: "Contradicts Sarah's claim that she had a peaceful evening without any confrontation.",
    importance: "medium",
    iconType: "document"
  },
  {
    id: "muddy_footprint",
    name: "Muddy Red-Clay Shoe Print",
    shortDesc: "Size 11 footprint with distinctive diamond-groove leather brogue tread behind the desk.",
    detailedDesc: "A wet footprint made of damp red clay soil found behind the victim's mahogany desk. Red clay only exists in Vance Manor along the garden fountain path. The shoe matches size 11 bespoke Italian dress brogues — the exact brand Daniel Sterling wears.",
    locationId: "study",
    relatedSuspectId: "daniel",
    contradictsSuspectId: "daniel",
    contradictionNote: "Daniel swore on his honor he never entered the study after 9:50 PM and never went out into the rain.",
    importance: "critical",
    iconType: "footprint"
  },
  {
    id: "bloodstained_handkerchief",
    name: "Monogrammed Silk Handkerchief",
    shortDesc: "Pure white silk handkerchief caught in the terrace rose thorns, stained with fresh blood and initials 'D.S.'.",
    detailedDesc: "Found snagged on sharp rose thorns right outside the study terrace door along the escape path. Embroidered in silver thread with the monogram 'D.S.' (Daniel Sterling). Faint blood stains along the hem match a fresh cut on Daniel's right knuckle.",
    locationId: "garden",
    relatedSuspectId: "daniel",
    contradictsSuspectId: "daniel",
    contradictionNote: "Irrefutable physical link connecting Daniel Sterling to the study terrace escape route during the rain.",
    importance: "critical",
    iconType: "handkerchief"
  },
  {
    id: "audit_dossier",
    name: "Forensic Audit Dossier",
    shortDesc: "Confidential report from Arthur's locked safe showing Daniel's $1.4M embezzlement.",
    detailedDesc: "Recovered from the concealed wall safe behind the maritime portrait. Contains signed promissory notes, wire transfers to Cayman accounts, and an official notice drafted by Arthur declaring Daniel will be handed to federal prosecutors tomorrow at 9:00 AM.",
    locationId: "study",
    relatedSuspectId: "daniel",
    contradictsSuspectId: "daniel",
    contradictionNote: "Destroys Daniel's story of an 'amicable partnership' and provides an airtight murder motive.",
    importance: "critical",
    iconType: "folder"
  },
  {
    id: "caretaker_log",
    name: "Maintenance Log & Fuse Ticket",
    shortDesc: "Logbook showing garden circuit trip at 10:18 PM and service bell buzz at 10:21 PM.",
    detailedDesc: "A grease-stained notebook on the kitchen table. Notes that the garden terrace floodlight blew a fuse at 10:18 PM. Michael went out to fix it and noted seeing a dark silhouette in a tailored suit fleeing toward the rose path.",
    locationId: "kitchen",
    relatedSuspectId: "michael",
    importance: "high",
    iconType: "notebook"
  },
  {
    id: "guest_register",
    name: "Foyer Arrival Register",
    shortDesc: "Foyer book recording arrival times of all manor guests tonight.",
    detailedDesc: "Leather-bound logbook in the entrance foyer. Records: Victoria Cross (8:00 PM), Sarah Vance (8:45 PM), Daniel Sterling (9:25 PM). Daniel arrived wearing an expensive charcoal suit and bespoke Italian brogues.",
    locationId: "entrance",
    relatedSuspectId: "daniel",
    importance: "medium",
    iconType: "book"
  }
];

export const INITIAL_LOCATIONS: LocationData[] = [
  {
    id: "entrance",
    name: "Grand Foyer & Hall",
    subtitle: "The gateway to Vance Manor",
    description: "Towering mahogany pillars, a marble floor slick with rain puddles, and a grandfather clock ticking solemnly.",
    ambientTone: "Echoing raindrops and ticking pendulum",
    hotspots: [
      {
        id: "hs_register",
        label: "Guest Arrival Register",
        type: "clue",
        clueId: "guest_register",
        x: 28,
        y: 62,
        description: "A leather-bound registry resting on an ornate carved pedestal.",
        icon: "book"
      },
      {
        id: "hs_coat",
        label: "Damp Trench Coat",
        type: "flavor",
        x: 74,
        y: 48,
        description: "A charcoal cashmere coat hanging on the brass rack. The hem is wet with rain and smells faintly of crushed roses.",
        icon: "shirt"
      },
      {
        id: "hs_clock",
        label: "Grandfather Clock",
        type: "flavor",
        x: 50,
        y: 35,
        description: "A majestic German clock from 1890. Its brass pendulum swings with rhythmic finality.",
        icon: "clock"
      }
    ]
  },
  {
    id: "living_room",
    name: "The Drawing Room",
    subtitle: "Where Sarah Vance waits by the dying hearth",
    description: "Deep Persian carpets, high leather armchairs, and smoldering oak logs casting long shadows across book-lined walls.",
    ambientTone: "Crackling embers and distant thunder",
    hotspots: [
      {
        id: "hs_wastebasket",
        label: "Brass Wastebasket",
        type: "clue",
        clueId: "torn_will",
        x: 65,
        y: 72,
        description: "A crumpled parchment sits inside the wastebasket beside the leather armchair.",
        icon: "trash"
      },
      {
        id: "hs_decanter",
        label: "Whiskey Decanter",
        type: "flavor",
        x: 35,
        y: 52,
        description: "A crystal carafe of 25-year scotch. A single crystal tumbler sits half-empty with melted ice cubes.",
        icon: "glass"
      },
      {
        id: "hs_hearth",
        label: "Stone Fireplace",
        type: "flavor",
        x: 50,
        y: 40,
        description: "Embers glow cherry-red in the ornate fireplace. The scent of pine and charred paper lingers.",
        icon: "flame"
      }
    ]
  },
  {
    id: "study",
    name: "Arthur Vance's Study",
    subtitle: "The Crime Scene",
    description: "The air smells of old leather, spilled black ink, and cold rainwater blowing through the terrace latch. Arthur Vance lies beside his overturned desk.",
    ambientTone: "Wind howling through cracked terrace glass",
    hotspots: [
      {
        id: "hs_watch",
        label: "Shattered Pocket Watch",
        type: "clue",
        clueId: "pocket_watch",
        x: 44,
        y: 68,
        description: "Gripped in the victim's outstretched hand on the floor rug.",
        icon: "watch"
      },
      {
        id: "hs_footprint",
        label: "Red Clay Footprint",
        type: "clue",
        clueId: "muddy_footprint",
        x: 62,
        y: 74,
        description: "A distinct red-clay shoe print stamped onto the cream Persian carpet behind the desk.",
        icon: "footprint"
      },
      {
        id: "hs_safe",
        label: "Concealed Wall Safe",
        type: "clue",
        clueId: "audit_dossier",
        x: 78,
        y: 36,
        description: "Swung ajar behind a tilted oil painting of a clipper ship in storm.",
        icon: "safe"
      },
      {
        id: "hs_terrace_door",
        label: "Terrace French Door",
        type: "flavor",
        x: 18,
        y: 45,
        description: "Glass door leading outside to the garden colonnade. The bolt is pulled back and raindrops puddle inside.",
        icon: "door"
      }
    ]
  },
  {
    id: "kitchen",
    name: "The Manor Kitchen",
    subtitle: "Sanctuary of Michael Hayes",
    description: "Cast-iron cookstoves, hanging copper pans, and shelves of preserves. Warm steam rises from an iron kettle on the range.",
    ambientTone: "Hissing kettle steam and clinking crockery",
    hotspots: [
      {
        id: "hs_log",
        label: "Caretaker's Notebook",
        type: "clue",
        clueId: "caretaker_log",
        x: 32,
        y: 60,
        description: "An open, dog-eared notebook on the oak prep table next to an oil lamp.",
        icon: "notebook"
      },
      {
        id: "hs_bell_board",
        label: "Servants' Bell Board",
        type: "flavor",
        x: 68,
        y: 35,
        description: "Vintage annunciator box on the wall. The indicator for 'Private Study' remains mechanically tilted down.",
        icon: "bell"
      },
      {
        id: "hs_boots",
        label: "Mudroom Rubber Boots",
        type: "flavor",
        x: 80,
        y: 78,
        description: "Heavy green rubber Wellington boots caked with ordinary garden loam, size 9 with wide tread.",
        icon: "footwear"
      }
    ]
  },
  {
    id: "garden",
    name: "Conservatory & Fountain Terrace",
    subtitle: "Rain-swept grounds outside the study",
    description: "Stone balustrades drenched in cold downpour, dripping stone gargoyles, and an ornate fountain surrounded by deep red clay flowerbeds.",
    ambientTone: "Torrential rain lashing against stone",
    hotspots: [
      {
        id: "hs_handkerchief",
        label: "Caught Silk Cloth",
        type: "clue",
        clueId: "bloodstained_handkerchief",
        x: 48,
        y: 65,
        description: "A white fabric snagged in the dripping thorny rosebushes beside the fountain path.",
        icon: "handkerchief"
      },
      {
        id: "hs_fountain",
        label: "Red Clay Basin",
        type: "flavor",
        x: 75,
        y: 50,
        description: "The stone fountain's flowerbeds are filled with distinctive imported Georgia red clay, churned up by rapid footfalls.",
        icon: "droplet"
      },
      {
        id: "hs_colonnade",
        label: "Covered Colonnade",
        type: "flavor",
        x: 20,
        y: 40,
        description: "Arched stone walkway offering shelter from the deluge, overlooking the dark manor grounds.",
        icon: "columns"
      }
    ]
  }
];
