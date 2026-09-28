import React, { useState, useEffect } from "react";
import { 
  Suspect, Clue, LocationData, Hotspot, 
  DialogueMessage, PsychologicalState, AccusationResult 
} from "./types/game";
import { 
  INITIAL_LOCATIONS, INITIAL_SUSPECTS, INITIAL_CLUES 
} from "./data/gameData";
import { noirAudio } from "./utils/audio";
import { Header } from "./components/Header";
import { LocationNav } from "./components/LocationNav";
import { LocationScene } from "./components/LocationScene";
import { DialogueBox } from "./components/DialogueBox";
import { EvidenceModal } from "./components/EvidenceModal";
import { SuspectsModal } from "./components/SuspectsModal";
import { AccusationModal } from "./components/AccusationModal";
import { EndingScreen } from "./components/EndingScreen";
import { IntroScreen } from "./components/IntroScreen";
import { HotspotModal } from "./components/HotspotModal";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export default function App() {
  const [screen, setScreen] = useState<"intro" | "investigation" | "ending">("intro");
  const [locations, setLocations] = useState<LocationData[]>(INITIAL_LOCATIONS);
  const [currentLocationId, setCurrentLocationId] = useState<string>("entrance");
  const [suspects, setSuspects] = useState<Suspect[]>(INITIAL_SUSPECTS);
  const [allClues, setAllClues] = useState<Clue[]>(INITIAL_CLUES);
  const [discoveredClueIds, setDiscoveredClueIds] = useState<string[]>([]);
  const [inspectedHotspotIds, setInspectedHotspotIds] = useState<string[]>([]);
  
  // Stress & psychology per suspect
  const [characterStressMap, setCharacterStressMap] = useState<Record<string, number>>({
    sarah: 25,
    daniel: 35,
    michael: 45,
    victoria: 15,
  });
  const [characterStatesMap, setCharacterStatesMap] = useState<Record<string, PsychologicalState>>({
    sarah: "composed",
    daniel: "composed",
    michael: "guarded",
    victoria: "composed",
  });

  // Conversation history
  const [dialogueHistories, setDialogueHistories] = useState<Record<string, DialogueMessage[]>>({
    sarah: [],
    daniel: [],
    michael: [],
    victoria: [],
  });

  // Active UI Modals
  const [activeInterrogationSuspect, setActiveInterrogationSuspect] = useState<Suspect | null>(null);
  const [activeModal, setActiveModal] = useState<"none" | "dossier" | "suspects" | "accuse" | "hotspot">("none");
  const [selectedHotspotData, setSelectedHotspotData] = useState<{
    hotspot: Hotspot;
    clue?: Clue;
    isNewClue: boolean;
  } | null>(null);
  const [accusationResult, setAccusationResult] = useState<AccusationResult | null>(null);

  // System states
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Sync with backend on mount
  useEffect(() => {
    async function loadGameMetadata() {
      try {
        const res = await fetch("/api/game");
        if (res.ok) {
          const data = await res.json();
          if (data.locations) setLocations(data.locations);
          if (data.suspects) setSuspects(data.suspects);
          if (data.clues) setAllClues(data.clues);
          if (typeof data.hasGeminiKey === "boolean") setHasGeminiKey(data.hasGeminiKey);
        }
      } catch (err) {
        console.warn("Could not reach backend /api/game, using client local state:", err);
      }
    }
    loadGameMetadata();
  }, []);

  const showNotification = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => {
      setBannerNotice(null);
    }, 4500);
  };

  const currentLocation = locations.find((l) => l.id === currentLocationId) || locations[0];
  const suspectsInCurrentLocation = suspects.filter((s) => s.locationId === currentLocationId);
  const discoveredClues = allClues.filter((c) => discoveredClueIds.includes(c.id));

  // Audio Toggle
  const handleToggleAudio = () => {
    const newState = noirAudio.toggle();
    setIsAudioPlaying(newState);
  };

  // Inspect an interactive object / clue hotspot
  const handleInspectHotspot = (hotspot: Hotspot) => {
    let clueObj: Clue | undefined = undefined;
    let isNew = false;

    if (hotspot.clueId) {
      clueObj = allClues.find((c) => c.id === hotspot.clueId);
      if (clueObj && !discoveredClueIds.includes(clueObj.id)) {
        setDiscoveredClueIds((prev) => [...prev, clueObj!.id]);
        isNew = true;
        showNotification(`New Clue Secured: "${clueObj.name}" added to Case Dossier`);
      }
    }

    if (!inspectedHotspotIds.includes(hotspot.id)) {
      setInspectedHotspotIds((prev) => [...prev, hotspot.id]);
    }

    setSelectedHotspotData({
      hotspot,
      clue: clueObj,
      isNewClue: isNew,
    });
    setActiveModal("hotspot");
  };

  // Interrogate Suspect
  const handleStartInterrogation = (suspect: Suspect) => {
    setActiveInterrogationSuspect(suspect);
  };

  const handleSendMessage = async (question: string, presentedClueId?: string) => {
    if (!activeInterrogationSuspect) return;
    setIsLoading(true);

    const suspectId = activeInterrogationSuspect.id;
    const currentStress = characterStressMap[suspectId] ?? activeInterrogationSuspect.stressBase;
    const presentedClue = presentedClueId ? allClues.find((c) => c.id === presentedClueId) : undefined;

    const detectiveMsg: DialogueMessage = {
      id: `det_${Date.now()}`,
      sender: "detective",
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cluePresentedName: presentedClue?.name,
    };

    // Update dialogue history optimistically
    setDialogueHistories((prev) => ({
      ...prev,
      [suspectId]: [...(prev[suspectId] || []), detectiveMsg],
    }));

    try {
      const response = await fetch("/api/interrogate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character_id: suspectId,
          question,
          stress: currentStress,
          conversation_history: (dialogueHistories[suspectId] || []).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          presented_clue_id: presentedClueId,
        }),
      });

      if (!response.ok) {
        throw new Error("Interrogation request failed");
      }

      const data = await response.json();

      const suspectMsg: DialogueMessage = {
        id: `susp_${Date.now()}`,
        sender: "suspect",
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        stressDelta: data.stress_change,
        contradictionExposed: data.contradiction_exposed,
      };

      setDialogueHistories((prev) => ({
        ...prev,
        [suspectId]: [...(prev[suspectId] || []), suspectMsg],
      }));

      setCharacterStressMap((prev) => ({
        ...prev,
        [suspectId]: data.new_stress,
      }));

      setCharacterStatesMap((prev) => ({
        ...prev,
        [suspectId]: data.psychological_state,
      }));

      if (data.contradiction_exposed) {
        showNotification(`Contradiction Exposed! ${activeInterrogationSuspect.name}'s stress jumped.`);
      }
    } catch (err) {
      console.error("Interrogation error:", err);
      // Fallback response
      const fallbackMsg: DialogueMessage = {
        id: `susp_err_${Date.now()}`,
        sender: "suspect",
        text: "I... I have nothing more to say about that. You're wasting your time pursuing this line of questioning.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setDialogueHistories((prev) => ({
        ...prev,
        [suspectId]: [...(prev[suspectId] || []), fallbackMsg],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Formal Accusation
  const handleSubmitAccusation = async (suspectId: string, motive: string, evidenceId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/accuse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suspect_id: suspectId,
          motive,
          evidence_id: evidenceId,
        }),
      });

      if (!response.ok) {
        throw new Error("Accusation submission failed");
      }

      const outcome = await response.json();
      setAccusationResult(outcome);
      setActiveModal("none");
      setScreen("ending");
    } catch (err) {
      console.error("Accusation failed:", err);
      showNotification("Failed to deliver indictment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartGame = () => {
    setDiscoveredClueIds([]);
    setInspectedHotspotIds([]);
    setCurrentLocationId("entrance");
    setActiveInterrogationSuspect(null);
    setActiveModal("none");
    setAccusationResult(null);
    setCharacterStressMap({
      sarah: 25,
      daniel: 35,
      michael: 45,
      victoria: 15,
    });
    setDialogueHistories({
      sarah: [],
      daniel: [],
      michael: [],
      victoria: [],
    });
    setScreen("intro");
  };

  if (screen === "intro") {
    return (
      <IntroScreen
        onStartInvestigation={() => setScreen("investigation")}
        hasGeminiKey={hasGeminiKey}
      />
    );
  }

  if (screen === "ending" && accusationResult) {
    return (
      <EndingScreen
        result={accusationResult}
        discoveredClues={discoveredClues}
        allCluesCount={allClues.length}
        suspects={suspects}
        characterStressMap={characterStressMap}
        onRestartGame={handleRestartGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        discoveredCluesCount={discoveredClues.length}
        totalCluesCount={allClues.length}
        onOpenDossier={() => setActiveModal("dossier")}
        onOpenSuspects={() => setActiveModal("suspects")}
        onOpenAccusation={() => setActiveModal("accuse")}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Location Navigation Floorplan */}
      <LocationNav
        locations={locations}
        currentLocationId={currentLocationId}
        onSelectLocation={(locId) => {
          setCurrentLocationId(locId);
          setActiveInterrogationSuspect(null);
        }}
        suspects={suspects}
        allClues={allClues}
        discoveredClueIds={discoveredClueIds}
      />

      {/* Banner Toast Notification */}
      {bannerNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-mono text-xs font-bold shadow-2xl flex items-center gap-2 border border-amber-300 animate-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 fill-current" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Main Investigation Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* 2D Room Graphic Scene */}
        <LocationScene
          location={currentLocation}
          suspectsInLocation={suspectsInCurrentLocation}
          discoveredClueIds={discoveredClueIds}
          inspectedHotspotIds={inspectedHotspotIds}
          onInspectHotspot={handleInspectHotspot}
          onInterrogateSuspect={handleStartInterrogation}
          characterStressMap={characterStressMap}
        />

        {/* Active Interrogation Panel if suspect clicked */}
        {activeInterrogationSuspect && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <DialogueBox
              suspect={activeInterrogationSuspect}
              stress={characterStressMap[activeInterrogationSuspect.id] ?? activeInterrogationSuspect.stressBase}
              psychologicalState={characterStatesMap[activeInterrogationSuspect.id] ?? "composed"}
              dialogueHistory={dialogueHistories[activeInterrogationSuspect.id] || []}
              discoveredClues={discoveredClues}
              onSendMessage={handleSendMessage}
              onClose={() => setActiveInterrogationSuspect(null)}
              isLoading={isLoading}
              hasGeminiKey={hasGeminiKey}
            />
          </div>
        )}

        {/* Ambient Case Objectives Footer Bar */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Investigation Active: Inspect rooms for forensic clues, then confront the 4 suspects.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Evidence: <strong className="text-amber-400">{discoveredClues.length} / {allClues.length}</strong>
            </span>
            <span>·</span>
            <span>
              Contradictions Found: <strong className="text-amber-400">
                {discoveredClues.filter(c => c.contradictsSuspectId).length}
              </strong>
            </span>
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === "dossier" && (
        <EvidenceModal
          discoveredClues={discoveredClues}
          allClues={allClues}
          suspects={suspects}
          onClose={() => setActiveModal("none")}
        />
      )}

      {activeModal === "suspects" && (
        <SuspectsModal
          suspects={suspects}
          characterStressMap={characterStressMap}
          onClose={() => setActiveModal("none")}
          onInterrogate={(s) => {
            setActiveModal("none");
            handleStartInterrogation(s);
          }}
        />
      )}

      {activeModal === "accuse" && (
        <AccusationModal
          suspects={suspects}
          discoveredClues={discoveredClues}
          onClose={() => setActiveModal("none")}
          onSubmitAccusation={handleSubmitAccusation}
          isLoading={isLoading}
        />
      )}

      {activeModal === "hotspot" && selectedHotspotData && (
        <HotspotModal
          hotspot={selectedHotspotData.hotspot}
          clue={selectedHotspotData.clue}
          isNewClue={selectedHotspotData.isNewClue}
          activeSuspectInRoom={suspectsInCurrentLocation[0]}
          onClose={() => setActiveModal("none")}
          onInterrogateWithClue={(suspect, clue) => {
            setActiveModal("none");
            handleStartInterrogation(suspect);
            handleSendMessage(`Explain this item: "${clue.name}"`, clue.id);
          }}
        />
      )}
    </div>
  );
}
