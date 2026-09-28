import React, { useState } from "react";
import { Suspect, Clue } from "../types/game";
import { CharacterPortrait } from "./CharacterPortrait";
import { 
  Gavel, AlertTriangle, ShieldCheck, X, 
  HelpCircle, CheckCircle2, ChevronRight 
} from "lucide-react";

interface AccusationModalProps {
  suspects: Suspect[];
  discoveredClues: Clue[];
  onClose: () => void;
  onSubmitAccusation: (suspectId: string, motive: string, evidenceId: string) => Promise<void>;
  isLoading: boolean;
}

const MOTIVES = [
  {
    id: "embezzlement",
    label: "Corporate Embezzlement & Imminent Arrest",
    desc: "To prevent $1.4M fraudulent offshore transactions from being turned over to federal prosecutors tomorrow morning."
  },
  {
    id: "inheritance",
    label: "Estate Disinheritance & Will Dispute",
    desc: "In rage over being stripped of all hereditary inheritance in Arthur's revised will draft."
  },
  {
    id: "burglary",
    label: "Panic Over Prior Criminal Record",
    desc: "A terrified confrontation when caught loitering near the study safe."
  },
  {
    id: "silencing",
    label: "Silencing a Whistleblower",
    desc: "A preemptive strike to bury audit documents prepared for the board."
  }
];

export const AccusationModal: React.FC<AccusationModalProps> = ({
  suspects,
  discoveredClues,
  onClose,
  onSubmitAccusation,
  isLoading,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>("");
  const [selectedMotive, setSelectedMotive] = useState<string>("");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

  const isFormValid = selectedSuspectId && selectedMotive && selectedEvidenceId;

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;
    await onSubmitAccusation(selectedSuspectId, selectedMotive, selectedEvidenceId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-red-950/50 border-b border-red-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg text-neutral-100 tracking-wider">
                FORMAL INDICTMENT: ACCUSE THE KILLER
              </h2>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                The morning train arrives at dawn. You have one chance to close this case.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {discoveredClues.length < 3 && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center gap-3 text-amber-300 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>
                You have only discovered {discoveredClues.length} pieces of evidence. It is recommended to thoroughly inspect all rooms before delivering an indictment.
              </span>
            </div>
          )}

          {/* Section 1: Choose the Murderer */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 font-bold">
              1. Who Murdered Arthur Vance?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {suspects.map((s) => {
                const isSelected = selectedSuspectId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSuspectId(s.id)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? "bg-red-950/80 border-red-500 ring-2 ring-red-500/50 shadow-lg"
                        : "bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                    }`}
                  >
                    <CharacterPortrait suspectId={s.id} size="sm" />
                    <div>
                      <div className="font-cinzel font-bold text-xs text-neutral-100">
                        {s.name}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 truncate max-w-[120px]">
                        {s.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Choose the Motive */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 font-bold">
              2. What Was the True Motive?
            </label>
            <div className="space-y-2">
              {MOTIVES.map((m) => {
                const isSelected = selectedMotive === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMotive(m.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-red-950/70 border-red-500 text-neutral-100"
                        : "bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-red-400 bg-red-600" : "border-neutral-600"
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-100 font-cinzel">
                        {m.label}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 font-serif">
                        {m.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Select Smoking Gun Evidence */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 font-bold">
              3. The Indisputable Physical Proof (Smoking Gun)
            </label>
            {discoveredClues.length === 0 ? (
              <p className="text-xs text-neutral-500 italic p-3 bg-neutral-950 rounded-xl">
                No physical evidence discovered yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {discoveredClues.map((c) => {
                  const isSelected = selectedEvidenceId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedEvidenceId(c.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-red-950/70 border-red-500 text-neutral-100"
                          : "bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${
                          isSelected ? "text-red-400" : "text-neutral-700"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate text-neutral-100">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          {c.shortDesc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-sans transition-colors"
          >
            Review Evidence More
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-cinzel font-bold text-xs sm:text-sm tracking-wider flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <span>Rendering Verdict...</span>
            ) : (
              <>
                <Gavel className="w-4 h-4" />
                <span>Deliver Formal Accusation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
