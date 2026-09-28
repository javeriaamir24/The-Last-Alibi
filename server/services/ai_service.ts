import { GoogleGenAI } from "@google/genai";
import { SUSPECTS, CLUES, Suspect, Clue } from "../data/mystery";

interface InterrogateParams {
  characterId: string;
  question: string;
  currentStress: number;
  history?: Array<{ sender: 'detective' | 'suspect'; text: string }>;
  presentedClueId?: string;
}

interface InterrogateResponse {
  characterId: string;
  response: string;
  stressChange: number;
  newStress: number;
  psychologicalState: 'composed' | 'guarded' | 'defensive' | 'cracking';
  discoveredSecret?: string;
  contradictionExposed?: boolean;
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export function calculateStressState(stress: number): 'composed' | 'guarded' | 'defensive' | 'cracking' {
  if (stress < 30) return 'composed';
  if (stress < 60) return 'guarded';
  if (stress < 85) return 'defensive';
  return 'cracking';
}

function evaluateQuestionTension(question: string, presentedClue?: Clue, suspect?: Suspect): { delta: number; contradiction: boolean } {
  const q = question.toLowerCase();
  let delta = 5; // default casual question
  let contradiction = false;

  // Check evidence presentation
  if (presentedClue) {
    delta += 15;
    if (presentedClue.contradictsSuspectId === suspect?.id) {
      delta += 10;
      contradiction = true;
    }
  }

  // Keywords that spike stress
  const highStressKeywords = [
    "blood", "murder", "kill", "handkerchief", "footprint", "clay", "safe", 
    "audit", "embezzle", "embezzlement", "fraud", "10:22", "watch", "lie", 
    "liar", "confess", "arrest", "stole", "weapon", "cut", "wound"
  ];
  const mediumStressKeywords = [
    "where were you", "alibi", "terrace", "garden", "argument", "will", "money", 
    "debt", "foyer", "witness", "alone", "time", "clock", "police", "knife", "statue"
  ];
  const calmingKeywords = [
    "sorry", "condolences", "calm down", "breathe", "water", "tea", "help me understand", 
    "take your time", "no rush"
  ];

  if (highStressKeywords.some(kw => q.includes(kw))) {
    delta += 12;
  } else if (mediumStressKeywords.some(kw => q.includes(kw))) {
    delta += 7;
  } else if (calmingKeywords.some(kw => q.includes(kw))) {
    delta -= 8;
  }

  return { delta, contradiction };
}

// Fallback script engine if AI is unavailable or fails
function getFallbackResponse(suspect: Suspect, question: string, stress: number, presentedClue?: Clue): string {
  const q = question.toLowerCase();

  if (presentedClue) {
    if (suspect.id === 'daniel') {
      if (presentedClue.id === 'bloodstained_handkerchief') {
        if (stress > 70) {
          return "That... that handkerchief?! Where did you find that?! Anyone could have stolen a monogrammed napkin from my coat pocket! You're trying to frame me, Detective!";
        }
        return "A white handkerchief with 'D.S.'? Hundreds of gentlemen in high society carry similar monograms. How it ended up among thorny rosebushes in Arthur's rain-soaked garden is frankly a mystery to me.";
      }
      if (presentedClue.id === 'muddy_footprint') {
        if (stress > 65) {
          return "Bespoke Italian brogues aren't unique to me! Half the board members at the Exchange buy from the same shoemaker on Savile Row! It proves nothing!";
        }
        return "Red clay? I assure you, Detective, my shoes have not touched garden soil tonight. Inspect my trousers if you must—I've remained indoors by the fire.";
      }
      if (presentedClue.id === 'audit_dossier') {
        return "An internal audit? Arthur and I had routine corporate reconciliations underway. Those numbers were a dispute between accountants, not a blood vendetta. Business is tough, Detective, but murder is absurd.";
      }
      if (presentedClue.id === 'pocket_watch') {
        return "Frozen at 10:22 PM? Fascinating. And as I've stated before, at 10:22 PM I was seated in the drawing room nursing twenty-year-old scotch. You have no witness to place me in that room.";
      }
    }

    if (suspect.id === 'sarah') {
      if (presentedClue.id === 'torn_will') {
        return "Fine! Yes, Father threatened to disinherit me! We had a screaming row at nine o'clock and I shredded his draft! But I went straight upstairs to my room afterward. I hated his arrogance, but he was still my father... I didn't lay a finger on him!";
      }
      return "I don't know what that object has to do with me. Check Father's business cronies if you want someone with blood on their hands.";
    }

    if (suspect.id === 'michael') {
      if (presentedClue.id === 'caretaker_log') {
        return "I... I wrote that log, yes sir. The terrace light died around 10:18. When I stepped outside to reset the breaker, I swear on my mother's grave I saw someone in a dark bespoke suit rush through the rose garden! It wasn't me, Detective, please!";
      }
      return "I'm just the caretaker here, sir. I mind the stoves and the boilers. I don't touch Mr. Vance's fine things.";
    }

    if (suspect.id === 'victoria') {
      if (presentedClue.id === 'audit_dossier') {
        return "You found it in the safe. Good. I prepared that audit for Mr. Vance. Daniel Sterling had siphoned $1.4 million into offshore accounts. Mr. Vance was going to have Daniel arrested tomorrow morning. Daniel knew it.";
      }
      return "A significant piece of evidence, Detective. If you analyze the timeline, you will see who had the motive and the panic to strike tonight.";
    }
  }

  // Topic matching
  if (suspect.id === 'daniel') {
    if (q.includes("where") || q.includes("alibi") || q.includes("10") || q.includes("time")) {
      if (stress > 70) {
        return "I've told you three times already! I was in the living room! Why are you badgering me when Arthur's deadbeat daughter was threatening him over the will all afternoon?!";
      }
      return "As I told the officer upon arrival: Arthur and I finished our business review before 9:50 PM. I left the study, poured a bourbon, and read the evening papers by the hearth.";
    }
    if (q.includes("relationship") || q.includes("arthur") || q.includes("partner")) {
      return "Arthur and I built Sterling-Vance into an empire over twelve years. We had disagreements on portfolio management, naturally, but we were brothers in commerce.";
    }
    if (q.includes("kill") || q.includes("murder") || q.includes("struck") || q.includes("weapon")) {
      if (stress > 80) {
        return "Watch your tone, Detective! I have the finest defense attorneys in the state on retainer. You dare insinuate I had anything to do with Arthur's tragic demise?!";
      }
      return "A grotesque act of violence. Arthur was a stubborn man who made enemies in city zoning and banking. You should look outside these walls, not at his grieving partner.";
    }
    if (q.includes("michael") || q.includes("caretaker")) {
      return "The old groundskeeper? Hayes has a criminal record, you know. Arthur hired him out of charity. If you ask me, a former burglar in the house is your most obvious culprit.";
    }
    if (q.includes("sarah") || q.includes("daughter")) {
      return "Sarah has had astronomical debts from gambling in Monaco. Arthur told me tonight he was cutting her out of his estate. She was furious when she arrived.";
    }
    if (stress > 75) {
      return "This line of questioning is becoming tedious. Present your accusations formally or let me call my solicitors.";
    }
    return "I am cooperating fully with the constabulary, Detective. Ask your questions, but pray don't waste time on wild corporate conspiracies.";
  }

  if (suspect.id === 'sarah') {
    if (q.includes("argument") || q.includes("will") || q.includes("money") || q.includes("father")) {
      return "Father never understood my life! He used his money like a leash. Yes, we shouted at 9:00 PM, but I slammed the door and stayed in my room. You can check my telephone records—I called a friend until half past ten.";
    }
    if (q.includes("daniel")) {
      return "Daniel Sterling is a venomous snake in a silk tie. Father was suspicious of him all week. If anyone had everything to lose tonight, it was Daniel.";
    }
    if (q.includes("where") || q.includes("alibi") || q.includes("10")) {
      return "Upstairs in the guest wing bedroom, crying my eyes out into a pillow. You think I wanted him dead? He was cold, but he was my only family left.";
    }
    return "I feel numb, Detective. Vance Manor has always felt like a tomb, and now Father has made it official.";
  }

  if (suspect.id === 'michael') {
    if (q.includes("see") || q.includes("saw") || q.includes("terrace") || q.includes("garden") || q.includes("silhouette")) {
      return "I... I shouldn't say, but I saw a man in a dark tailored suit crossing from the study terrace into the rain toward the front drive around 10:20 PM! He had something white wrapped around his knuckles!";
    }
    if (q.includes("where") || q.includes("alibi")) {
      return "Down by the boiler, sir! Then up to check the garden breaker when the terrace floodlight popped. I never went inside the study until I brought up the silver tea tray.";
    }
    return "Please don't lock me up, Detective. I turned my life around twenty years ago. Mr. Vance gave me honest bread and a roof. I wouldn't harm him!";
  }

  if (suspect.id === 'victoria') {
    if (q.includes("safe") || q.includes("audit") || q.includes("document") || q.includes("embezzle")) {
      return "The audit report in the wall safe holds the key to this entire tragedy. Daniel Sterling was laundering company capital. Mr. Vance was going to ruin him in the morning press.";
    }
    if (q.includes("daniel")) {
      return "Watch Mr. Sterling's hands when you press him about the terrace garden. His composure is an act. He arrived in bespoke Italian shoes—notice the red clay stains on the manor rugs.";
    }
    return "I keep Mr. Vance's appointments and his ledgers, Detective. If you want the truth, examine the numbers and the timeline. Facts do not lie.";
  }

  return "I've told you what I know, Detective. Look closely at the evidence left in the manor.";
}

export async function interrogateSuspect(params: InterrogateParams): Promise<InterrogateResponse> {
  const suspect = SUSPECTS[params.characterId];
  if (!suspect) {
    throw new Error(`Suspect with id ${params.characterId} not found`);
  }

  const presentedClue = params.presentedClueId ? CLUES[params.presentedClueId] : undefined;
  const { delta, contradiction } = evaluateQuestionTension(params.question, presentedClue, suspect);
  
  // Calculate new stress clamped between 0 and 100
  const rawStress = params.currentStress + delta;
  const newStress = Math.max(0, Math.min(100, rawStress));
  const psychologicalState = calculateStressState(newStress);

  // Try Gemini AI response if API key is present
  const ai = getAiClient();
  let aiText: string | null = null;

  if (ai) {
    try {
      const systemInstruction = `You are roleplaying as ${suspect.name}, a character in a classic noir murder mystery game called "The Last Alibi".
Age: ${suspect.age}. Role: ${suspect.role}.
Personality: ${suspect.personality}
Traits: ${suspect.traits.join(", ")}.

SCENARIO:
- Arthur Vance (62, financial tycoon) was murdered in his private manor study tonight between 10:15 PM and 10:30 PM (pocket watch shattered at 10:22 PM).
- You are currently in the ${suspect.locationId} being interrogated by the Detective.
- Your public alibi: "${suspect.publicAlibi}"
- Your hidden secret: "${suspect.secret}"
- Your true knowledge of tonight: "${suspect.trueKnowledge}"
- Are you the killer? ${suspect.isKiller ? "YES, YOU ARE THE KILLER." : "NO, YOU ARE INNOCENT."}

YOUR CURRENT STRESS LEVEL: ${newStress} / 100 (${psychologicalState.toUpperCase()}).
${presentedClue ? `THE DETECTIVE JUST PRESENTED THIS EVIDENCE TO YOU: "${presentedClue.name}" - ${presentedClue.detailedDesc}` : ""}

BEHAVIORAL RULES:
1. Stay strictly in character as ${suspect.name}.
2. If you are Daniel (THE KILLER):
   - You killed Arthur at 10:22 PM because he had the audit report showing your $1.4M embezzlement and was going to have you arrested tomorrow.
   - You MUST NOT confess easily! Deny, deflect, use high-society arrogance, claim you were drinking bourbon in the living room.
   - Only if stress is EXTREME (>85) AND presented with conclusive evidence (handkerchief/footprint/audit), you begin to crack, stammer, and slip into desperate defensiveness.
3. If you are innocent (Sarah, Michael, Victoria):
   - You did not kill Arthur.
   - Sarah is emotional and grief-stricken, hates being blamed for her debts, but loved her father.
   - Michael is terrified of being framed due to his past record, speaks timidly, but saw someone in a dark suit (Daniel) running outside.
   - Victoria is sharp, analytical, knows Daniel embezzled money, and wants justice.
4. Keep your answer concise: 2 to 4 sentences maximum. Speak with atmospheric noir detective dialogue. Never break character. Never mention that you are an AI or language model.`;

      let prompt = `Detective asks: "${params.question}"`;
      if (presentedClue) {
        prompt += ` [Detective presents evidence: ${presentedClue.name}]`;
      }

      // Format conversation history
      const contentsPayload: any[] = [];
      if (params.history && params.history.length > 0) {
        const recentHistory = params.history.slice(-6);
        for (const item of recentHistory) {
          contentsPayload.push({
            role: item.sender === 'detective' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        }
      }
      contentsPayload.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contentsPayload,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        aiText = response.text.trim();
      }
    } catch (err) {
      console.warn("Gemini interrogation API call failed, using fallback script:", err);
      aiText = null;
    }
  }

  // If Gemini failed or not configured, use rich fallback
  const finalDialogue = aiText || getFallbackResponse(suspect, params.question, newStress, presentedClue);

  return {
    characterId: suspect.id,
    response: finalDialogue,
    stressChange: delta,
    newStress,
    psychologicalState,
    contradictionExposed: contradiction
  };
}

export function evaluateAccusation(suspectId: string, motiveId?: string, evidenceId?: string) {
  const suspect = SUSPECTS[suspectId];
  if (!suspect) {
    return {
      correct: false,
      ending: "Invalid Suspect",
      details: "No such person exists in Vance Manor."
    };
  }

  if (suspect.isKiller) {
    return {
      correct: true,
      suspect: suspect.name,
      title: "CASE SOLVED — THE LAST ALIBI SHATTERED",
      headline: "TYCOON'S PARTNER ARRESTED IN MIDNIGHT STUDY MURDER",
      summary: `You cornered Daniel Sterling with undeniable physical and documentary evidence. Faced with the red-clay brogue impression matching his bespoke Italian shoes, his bloodstained monogrammed handkerchief discarded in the rosebushes, and the $1.4 million forensic audit in Arthur's safe, Sterling's aristocratic smirk dissolved.`,
      confession: `"Arthur was going to ruin me! Over a petty accounting dispute! Thirty years of reputation in the dust by nine o'clock tomorrow morning! I went to his study to reason with him... but he reached for the phone. I picked up the bronze statue... it was self-preservation!"`,
      verdict: `Daniel Sterling was escorted from Vance Manor in handcuffs as the morning sun broke through the storm clouds. Sarah Vance was cleared of all suspicion, while caretaker Michael Hayes and assistant Victoria Cross provided sworn testimony ensuring a swift conviction. Justice was served at Vance Manor.`,
      rating: "Master Detective (Rank S)"
    };
  } else {
    let wrongExplanation = "";
    if (suspect.id === 'sarah') {
      wrongExplanation = `You had Sarah Vance handcuffed based on her heated argument and the torn draft will. However, telephone exchange logs proved Sarah was sobbing on an unbroken trunk call with her confidante from 10:05 PM to 10:35 PM. Meanwhile, Daniel Sterling slipped out of the manor before dawn, boarding a steamer for South America with $1.4 million in embezzled wealth. An innocent grieving daughter was framed, while the true killer escaped into the night.`;
    } else if (suspect.id === 'michael') {
      wrongExplanation = `You arrested Michael Hayes, the frightened groundskeeper, pointing to his prior criminal history and proximity to the terrace. But forensic analysis of Michael's heavy rubber mud-boots completely mismatched the size 11 diamond-tread dress brogues imprinted in red clay behind Arthur's desk. Daniel Sterling vanished into the morning fog, leaving a ruined estate and an innocent working man wrongfully imprisoned.`;
    } else if (suspect.id === 'victoria') {
      wrongExplanation = `You accused Victoria Cross, Arthur's analytical assistant. But Victoria was the whistleblower who risked her career to compile the forensic audit against Daniel Sterling. She had zero financial motive and no marks of struggle. With your investigation diverted onto the innocent secretary, Daniel Sterling destroyed the paper trail and escaped justice.`;
    }

    return {
      correct: false,
      suspect: suspect.name,
      title: "WRONG ACCUSATION — THE KILLER WALKS FREE",
      headline: "WRONGFUL ARREST AT VANCE MANOR AS REAL KILLER SLIPS AWAY",
      summary: wrongExplanation,
      verdict: `The evidence against ${suspect.name} crumbled under legal scrutiny. The real murderer had an airtight motive, matching shoe prints, and bloody silk left on the estate grounds—all overlooked by your deduction.`,
      rating: "Case Unsolved"
    };
  }
}
