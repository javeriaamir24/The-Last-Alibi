import React, { useState, useEffect, useRef } from "react";
import { Suspect, Clue, DialogueMessage, PsychologicalState } from "../types/game";
import { CharacterPortrait } from "./CharacterPortrait";
import { 
  Send, AlertTriangle, Shield, MessageSquare, 
  HelpCircle, Sparkles, ChevronRight, X, History,
  FileSearch, CheckCircle2
} from "lucide-react";

interface DialogueBoxProps {
  suspect: Suspect;
  stress: number;
  psychologicalState: PsychologicalState;
  dialogueHistory: DialogueMessage[];
  discoveredClues: Clue[];
  onSendMessage: (question: string, presentedClueId?: string) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  hasGeminiKey: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  suspect,
  stress,
  psychologicalState,
  dialogueHistory,
  discoveredClues,
  onSendMessage,
  onClose,
  isLoading,
  hasGeminiKey,
}) => {
  const [questionInput, setQuestionInput] = useState("");
  const [selectedClueToPresent, setSelectedClueToPresent] = useState<string>("");
  const [showEvidenceSelector, setShowEvidenceSelector] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for the latest suspect response
  const latestMessage = dialogueHistory[dialogueHistory.length - 1];
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (latestMessage && latestMessage.sender === "suspect") {
      setIsTyping(true);
      setDisplayedText("");
      let currentIndex = 0;
      const fullText = latestMessage.text;

      const timer = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setDisplayedText(latestMessage?.text || "");
      setIsTyping(false);
    }
  }, [latestMessage?.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedText, isTyping, dialogueHistory]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || questionInput.trim();
    if (!text && !selectedClueToPresent) return;

    const clueId = selectedClueToPresent || undefined;
    setQuestionInput("");
    setSelectedClueToPresent("");
    setShowEvidenceSelector(false);

    await onSendMessage(text || "Explain this evidence.", clueId);
  };

  const getSuggestedQuestions = () => {
    const base = [
      "Where were you between 10:15 PM and 10:30 PM?",
      "What was the nature of your relationship with Arthur Vance?",
      "Did you hear any shouting or disturbance tonight?",
      "Can anyone independently verify your alibi?",
    ];

    if (suspect.id === "daniel") {
      base.push(
        "Why was the living room empty when the caretaker passed by at 10:20 PM?",
        "Did you have any disagreements over the company accounts?"
      );
    } else if (suspect.id === "sarah") {
      base.push(
        "Did you and your father argue earlier this evening?",
        "Who were you speaking to on the telephone upstairs?"
      );
    } else if (suspect.id === "michael") {
      base.push(
        "What did you see when you went outside to check the garden fuse?",
        "Did anyone run past the kitchen toward the terrace?"
      );
    } else if (suspect.id === "victoria") {
      base.push(
        "What documents were you compiling for Mr. Vance tonight?",
        "Who else knew the combination to the study wall safe?"
      );
    }
    return base;
  };

  const getStressColor = () => {
    if (stress < 30) return "bg-emerald-500 text-emerald-400 border-emerald-500";
    if (stress < 60) return "bg-amber-500 text-amber-400 border-amber-500";
    if (stress < 85) return "bg-orange-500 text-orange-400 border-orange-500";
    return "bg-red-500 text-red-400 border-red-500 animate-pulse";
  };

  const getPsychologicalLabel = () => {
    switch (psychologicalState) {
      case "composed":
        return { label: "Composed & Guarded", desc: "Speaks with calculated steadiness." };
      case "guarded":
        return { label: "Agitated & Defensive", desc: "Deflecting questions; posture stiffening." };
      case "defensive":
        return { label: "Visibly Strained", desc: "Voice tightens; perspiration evident." };
      case "cracking":
        return { label: "Near Breaking Point", desc: "Frantic defensiveness, contradictions showing." };
    }
  };

  const psycho = getPsychologicalLabel();

  return (
    <div className="flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <CharacterPortrait
            suspectId={suspect.id}
            size="sm"
            stressLevel={stress}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel font-bold text-sm text-neutral-100">
                {suspect.name}
              </h3>
              <span className="text-[11px] font-mono text-neutral-400">
                ({suspect.role})
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-neutral-500">
                Public Alibi:
              </span>
              <span className="text-[10px] text-neutral-300 italic truncate max-w-xs sm:max-w-md">
                "{suspect.publicAlibi}"
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stress Meter */}
          <div className="hidden sm:flex flex-col items-end min-w-[130px]">
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-neutral-400">STRESS</span>
              <span className={`font-bold ${getStressColor().split(" ")[1]}`}>
                {stress}%
              </span>
            </div>
            <div className="w-28 h-2 bg-neutral-800 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-500 rounded-full ${getStressColor().split(" ")[0]}`}
                style={{ width: `${Math.min(100, Math.max(5, stress))}%` }}
              />
            </div>
            <span className="text-[9px] text-neutral-400 font-mono mt-0.5">
              {psycho.label}
            </span>
          </div>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100 text-xs transition-colors flex items-center gap-1"
            title="View dialogue record"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors"
            title="Leave interrogation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interrogation Screen */}
      <div className="p-4 flex flex-col md:flex-row gap-4 bg-neutral-950/60 min-h-[220px]">
        {/* Suspect Figure & Psychological status */}
        <div className="flex md:flex-col items-center md:items-start gap-3 md:w-52 flex-shrink-0 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="relative">
            <CharacterPortrait
              suspectId={suspect.id}
              size="lg"
              stressLevel={stress}
            />
            {psychologicalState === "cracking" && (
              <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded font-mono animate-pulse">
                CRACKING
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-neutral-200">
              {psycho.label}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {psycho.desc}
            </p>
            <div className="mt-2 text-[10px] text-neutral-500 font-mono flex items-center gap-1">
              <Shield className="w-3 h-3 text-neutral-400" />
              <span>Base stress: {suspect.stressBase}%</span>
            </div>
          </div>
        </div>

        {/* Dialogue Stream & Suspect Response */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="h-[180px] overflow-y-auto pr-2 space-y-3 font-editorial">
            {dialogueHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-neutral-400">
                <MessageSquare className="w-8 h-8 text-neutral-600 mb-2" />
                <p className="text-sm font-cinzel text-neutral-300">
                  Interrogation Commenced
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                  Choose a suggested line of inquiry, present collected evidence, or type your own direct question below.
                </p>
              </div>
            ) : (
              dialogueHistory.map((item, idx) => {
                const isLatestSuspect = item.sender === "suspect" && idx === dialogueHistory.length - 1;
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col ${
                      item.sender === "detective" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mb-1">
                      <span>{item.sender === "detective" ? "DETECTIVE" : suspect.name.toUpperCase()}</span>
                      <span>·</span>
                      <span>{item.timestamp}</span>
                      {item.cluePresentedName && (
                        <span className="text-amber-400 font-semibold">
                          [Presented: {item.cluePresentedName}]
                        </span>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        item.sender === "detective"
                          ? "bg-amber-950/40 text-amber-100 border border-amber-800/60 font-sans"
                          : "bg-neutral-900 text-neutral-100 border border-neutral-800 font-serif shadow-md"
                      }`}
                    >
                      {isLatestSuspect && isTyping ? displayedText : item.text}
                      {isLatestSuspect && isTyping && (
                        <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 p-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Suspect is hesitating... assessing your words</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Evidence Presentation Banner if selected */}
          {selectedClueToPresent && (
            <div className="mt-2 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-600/60 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-amber-400" />
                <span>
                  Presenting Evidence: <strong>{discoveredClues.find(c => c.id === selectedClueToPresent)?.name}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedClueToPresent("")}
                className="text-amber-400 hover:text-amber-100 text-xs font-mono"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Questions Quick Carousel */}
      <div className="px-4 py-2 bg-neutral-950/90 border-t border-neutral-800/80 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] font-mono text-neutral-500 uppercase flex-shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          Inquiries:
        </span>
        {getSuggestedQuestions().map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            disabled={isLoading}
            className="flex-shrink-0 px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-neutral-800 hover:border-neutral-700 text-[11px] font-sans transition-colors disabled:opacity-50"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-2">
        {/* Present Clue Trigger */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowEvidenceSelector(!showEvidenceSelector)}
            className={`w-full sm:w-auto px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              selectedClueToPresent
                ? "bg-amber-500 text-neutral-950 border-amber-400"
                : "bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-neutral-600"
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>{selectedClueToPresent ? "Evidence Selected" : "Present Evidence"}</span>
          </button>

          {/* Evidence Selector Popover */}
          {showEvidenceSelector && (
            <div className="absolute bottom-full left-0 mb-2 w-72 max-h-64 overflow-y-auto p-2 rounded-xl bg-neutral-950 border border-neutral-700 shadow-2xl z-50">
              <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase px-2 py-1 border-b border-neutral-800 mb-1">
                Confront with Evidence ({discoveredClues.length})
              </div>
              {discoveredClues.length === 0 ? (
                <div className="p-3 text-xs text-neutral-500 text-center">
                  No clues collected yet. Search the rooms first!
                </div>
              ) : (
                discoveredClues.map((clue) => (
                  <button
                    key={clue.id}
                    onClick={() => {
                      setSelectedClueToPresent(clue.id);
                      setShowEvidenceSelector(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start gap-2 ${
                      selectedClueToPresent === clue.id
                        ? "bg-amber-950 text-amber-200 border border-amber-700"
                        : "hover:bg-neutral-900 text-neutral-300"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-100">{clue.name}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">{clue.shortDesc}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Freeform Question Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="w-full flex items-center gap-2"
        >
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={`Ask ${suspect.name} anything or confront their story...`}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || (!questionInput.trim() && !selectedClueToPresent)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* History Drawer Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[80vh] flex flex-col bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-cinzel font-bold text-neutral-100 uppercase">
                  Interrogation Transcript: {suspect.name}
                </h4>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-neutral-400 hover:text-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 font-editorial text-sm">
              {dialogueHistory.length === 0 ? (
                <div className="text-center text-neutral-500 py-8">
                  No exchanges recorded yet.
                </div>
              ) : (
                dialogueHistory.map((m) => (
                  <div key={m.id} className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                      <span className="font-bold text-amber-400">
                        {m.sender === "detective" ? "DETECTIVE" : suspect.name.toUpperCase()}
                      </span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="text-neutral-200 leading-relaxed">{m.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
