export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  locationId: string;
  personality: string;
  traits: string[];
  publicAlibi: string;
  secret?: string;
  stressBase: number;
}

export interface Clue {
  id: string;
  name: string;
  shortDesc: string;
  detailedDesc: string;
  locationId: string;
  relatedSuspectId?: string;
  contradictsSuspectId?: string;
  contradictionNote?: string;
  importance: 'critical' | 'high' | 'medium';
  iconType: string;
}

export interface Hotspot {
  id: string;
  label: string;
  type: 'clue' | 'flavor';
  clueId?: string;
  x: number;
  y: number;
  description: string;
  icon: string;
}

export interface LocationData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  ambientTone: string;
  hotspots: Hotspot[];
}

export interface DialogueMessage {
  id: string;
  sender: 'detective' | 'suspect';
  text: string;
  timestamp: string;
  cluePresentedName?: string;
  stressDelta?: number;
  contradictionExposed?: boolean;
}

export type PsychologicalState = 'composed' | 'guarded' | 'defensive' | 'cracking';

export interface AccusationResult {
  correct: boolean;
  suspect?: string;
  title: string;
  headline: string;
  summary: string;
  confession?: string;
  verdict: string;
  rating: string;
}
