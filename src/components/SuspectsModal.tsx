import React from "react";
import { Suspect } from "../types/game";
import { CharacterPortrait } from "./CharacterPortrait";
import { Users, X, MessageSquareQuote, ShieldAlert, CheckCircle2 } from "lucide-react";

interface SuspectsModalProps {
  suspects: Suspect[];
  characterStressMap: Record<string, number>;
  onClose: () => void;
  onInterrogate: (suspect: Suspect) => void;
}

export const SuspectsModal: React.FC<SuspectsModalProps> = ({
  suspects,
  characterStressMap,
  onClose,
  onInterrogate,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg text-neutral-100 tracking-wider">
                PERSONS OF INTEREST
              </h2>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">
                4 individuals inside Vance Manor at the time of Arthur Vance's death
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

        {/* Suspects Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {suspects.map((suspect) => {
            const stress = characterStressMap[suspect.id] ?? suspect.stressBase;
            const isCracking = stress > 80;

            return (
              <div
                key={suspect.id}
                className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <CharacterPortrait
                      suspectId={suspect.id}
                      size="lg"
                      stressLevel={stress}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-cinzel font-bold text-base text-neutral-100 truncate">
                          {suspect.name}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Age {suspect.age}
                        </span>
                      </div>
                      <div className="text-xs text-amber-400 font-mono mt-0.5">
                        {suspect.role}
                      </div>

                      {/* Stress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                          <span className="text-neutral-400">Stress Gauge</span>
                          <span
                            className={
                              isCracking
                                ? "text-red-400 font-bold"
                                : stress > 55
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          >
                            {stress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCracking
                                ? "bg-red-500"
                                : stress > 55
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${stress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Public Alibi Box */}
                  <div className="mt-4 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Sworn Alibi (10:00 – 10:45 PM):
                    </div>
                    <p className="text-xs text-neutral-300 italic font-serif leading-relaxed">
                      "{suspect.publicAlibi}"
                    </p>
                  </div>

                  {/* Personality Traits */}
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {suspect.traits.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500 capitalize">
                    Location: {suspect.locationId.replace("_", " ")}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onInterrogate(suspect);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>Question</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
