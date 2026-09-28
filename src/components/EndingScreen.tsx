import React from "react";
import { AccusationResult, Clue, Suspect } from "../types/game";
import { CharacterPortrait } from "./CharacterPortrait";
import { 
  Trophy, AlertOctagon, RotateCcw, Newspaper, 
  CheckCircle2, XCircle, FileText, ArrowRight 
} from "lucide-react";

interface EndingScreenProps {
  result: AccusationResult;
  discoveredClues: Clue[];
  allCluesCount: number;
  suspects: Suspect[];
  characterStressMap: Record<string, number>;
  onRestartGame: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  result,
  discoveredClues,
  allCluesCount,
  suspects,
  characterStressMap,
  onRestartGame,
}) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-amber-900/50">
      <div className="w-full max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
        {/* Newspaper Masthead */}
        <div className="bg-[#f7f3e8] text-neutral-950 p-6 sm:p-10 rounded-2xl shadow-2xl border-4 border-[#3c362d] font-editorial relative overflow-hidden">
          {/* Weathering watermark */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f3eed9]/40 to-[#eae3c9]/80 pointer-events-none" />

          {/* Paper Header */}
          <div className="text-center border-b-2 border-neutral-900 pb-4 mb-6 relative">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-700 uppercase border-b border-neutral-400 pb-1 mb-2">
              <span>SPECIAL EXTRA EDITION</span>
              <span>OCTOBER 15, 1938</span>
              <span>PRICE THREE CENTS</span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-tight text-neutral-950">
              THE MORNING CHRONICLE
            </h1>
            <p className="text-xs italic text-neutral-700 mt-1">
              "The Independent Voice of Truth & Justice"
            </p>
          </div>

          {/* Banner Tag */}
          <div className="flex items-center justify-center mb-4">
            <span
              className={`px-4 py-1 rounded text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                result.correct
                  ? "bg-emerald-900 text-emerald-100"
                  : "bg-red-900 text-red-100"
              }`}
            >
              {result.correct ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CASE OFFICIALLY SOLVED
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  MISCARRIAGE OF JUSTICE
                </>
              )}
            </span>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-6">
            <h2 className="font-cinzel font-black text-2xl sm:text-4xl text-neutral-900 leading-tight">
              {result.headline}
            </h2>
            <p className="text-sm sm:text-base font-serif italic text-neutral-700 mt-2 max-w-2xl mx-auto">
              {result.title}
            </p>
          </div>

          {/* Newspaper Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-900">
            {/* Column 1: Portrait & Verdict */}
            <div className="md:col-span-1 space-y-4 border-b md:border-b-0 md:border-r border-neutral-300 pr-0 md:pr-6">
              <div className="p-3 bg-[#e8e2cd] rounded-xl border border-neutral-400 flex flex-col items-center text-center">
                <CharacterPortrait
                  suspectId={result.correct ? "daniel" : "victim"}
                  size="xl"
                  className="shadow-lg border-2 border-neutral-800"
                />
                <span className="font-cinzel font-bold text-xs mt-2 text-neutral-900">
                  {result.correct ? "DANIEL STERLING (ARRESTED)" : "COLD CASE DOSSIER"}
                </span>
                <span className="text-[10px] font-mono text-neutral-600">
                  Official Police Blotter
                </span>
              </div>

              {/* Detective Rank Box */}
              <div className="p-4 rounded-xl bg-neutral-900 text-neutral-100 shadow-md">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <Trophy className="w-4 h-4" />
                  <span>PERFORMANCE EVALUATION</span>
                </div>
                <div className="font-cinzel font-bold text-lg text-neutral-100">
                  {result.rating}
                </div>
                <div className="text-[11px] font-mono text-neutral-400 mt-1">
                  Evidence Recovered: {discoveredClues.length} / {allCluesCount}
                </div>
              </div>
            </div>

            {/* Column 2 & 3: Story Resolution & Confession */}
            <div className="md:col-span-2 space-y-4 text-neutral-900 text-sm sm:text-base leading-relaxed font-serif">
              <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:font-bold first-letter:float-left first-letter:mr-2">
                {result.summary}
              </p>

              {result.confession && (
                <div className="p-4 rounded-xl bg-[#e3dbc4] border-l-4 border-neutral-900 my-4 italic">
                  <span className="text-[10px] font-mono uppercase tracking-wider block text-neutral-700 not-italic font-bold mb-1">
                    Suspect's Signed Deposition:
                  </span>
                  {result.confession}
                </div>
              )}

              <p className="text-neutral-800">
                {result.verdict}
              </p>
            </div>
          </div>
        </div>

        {/* Case Post-Mortem & Suspect Stress Wrapup */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
          <h3 className="font-cinzel font-bold text-sm text-neutral-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Investigation Post-Mortem: Suspect Stress Gauges</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {suspects.map((s) => {
              const stress = characterStressMap[s.id] ?? s.stressBase;
              return (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3"
                >
                  <CharacterPortrait suspectId={s.id} size="sm" stressLevel={stress} />
                  <div className="min-w-0">
                    <div className="font-cinzel font-bold text-xs truncate text-neutral-200">
                      {s.name}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Final Stress: {stress}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-neutral-400">
              The Last Alibi — Version 1 Complete Prototype
            </span>

            <button
              onClick={onRestartGame}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-cinzel font-bold text-sm tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reopen Investigation (New Case)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
