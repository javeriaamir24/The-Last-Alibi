import { Router } from "express";
import { GAME_STORY, SUSPECTS, CLUES, LOCATIONS } from "../data/mystery";
import { interrogateSuspect, evaluateAccusation } from "../services/ai_service";

export const apiRouter = Router();

// GET /api/game - Game metadata and case facts
apiRouter.get("/game", (_req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  
  res.json({
    story: GAME_STORY,
    suspects: Object.values(SUSPECTS).map(s => ({
      id: s.id,
      name: s.name,
      role: s.role,
      age: s.age,
      locationId: s.locationId,
      personality: s.personality,
      traits: s.traits,
      publicAlibi: s.publicAlibi,
      stressBase: s.stressBase
    })),
    locations: Object.values(LOCATIONS),
    clues: Object.values(CLUES),
    hasGeminiKey
  });
});

// GET /api/characters - List of all suspects
apiRouter.get("/characters", (_req, res) => {
  const list = Object.values(SUSPECTS).map(s => ({
    id: s.id,
    name: s.name,
    role: s.role,
    age: s.age,
    locationId: s.locationId,
    personality: s.personality,
    traits: s.traits,
    publicAlibi: s.publicAlibi,
    stressBase: s.stressBase
  }));
  res.json(list);
});

// GET /api/characters/:id - Single suspect info
apiRouter.get("/characters/:id", (req, res) => {
  const suspect = SUSPECTS[req.params.id];
  if (!suspect) {
    return res.status(404).json({ error: "Character not found" });
  }
  res.json({
    id: suspect.id,
    name: suspect.name,
    role: suspect.role,
    age: suspect.age,
    locationId: suspect.locationId,
    personality: suspect.personality,
    traits: suspect.traits,
    publicAlibi: suspect.publicAlibi,
    stressBase: suspect.stressBase
  });
});

// GET /api/locations - All game locations
apiRouter.get("/locations", (_req, res) => {
  res.json(Object.values(LOCATIONS));
});

// GET /api/clues - All evidence items
apiRouter.get("/clues", (_req, res) => {
  res.json(Object.values(CLUES));
});

// POST /api/interrogate - Interrogate a suspect
apiRouter.post("/interrogate", async (req, res) => {
  try {
    const { character_id, question, stress, conversation_history, presented_clue_id } = req.body;

    if (!character_id || !question) {
      return res.status(400).json({ error: "character_id and question are required" });
    }

    const currentStress = typeof stress === 'number' ? stress : (SUSPECTS[character_id]?.stressBase ?? 20);

    const result = await interrogateSuspect({
      characterId: character_id,
      question,
      currentStress,
      history: Array.isArray(conversation_history) ? conversation_history : [],
      presentedClueId: presented_clue_id
    });

    res.json({
      character_id: result.characterId,
      response: result.response,
      stress_change: result.stressChange,
      new_stress: result.newStress,
      psychological_state: result.psychologicalState,
      contradiction_exposed: result.contradictionExposed
    });
  } catch (error: any) {
    console.error("Interrogation error:", error);
    res.status(500).json({ error: error.message || "Failed to process interrogation" });
  }
});

// POST /api/accuse - Make final accusation
apiRouter.post("/accuse", (req, res) => {
  try {
    const { suspect_id, motive, evidence_id } = req.body;
    if (!suspect_id) {
      return res.status(400).json({ error: "suspect_id is required" });
    }

    const outcome = evaluateAccusation(suspect_id, motive, evidence_id);
    res.json(outcome);
  } catch (error: any) {
    console.error("Accusation error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate accusation" });
  }
});
