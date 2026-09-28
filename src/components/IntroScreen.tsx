import React, { useState } from "react";
import { 
  Play, FileText, Clock, MapPin, 
  ShieldAlert, ChevronRight, UserCheck 
} from "lucide-react";
import { CharacterPortrait } from "./CharacterPortrait";

interface IntroScreenProps {
  onStartInvestigation: () => void;
  hasGeminiKey: boolean;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartInvestigation,
  hasGeminiKey,
}) => {
  const [step, setStep] = useState<"title" | "briefing">("title");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-amber-900/50">
      {step === "title" ? (
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in duration-500">
          {/* Noir Seal Badge */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-amber-500/50 flex items-center justify-center shadow-2xl ring-8 ring-amber-500/10">
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">
              A 1938 AI Noir Detective Mystery
            </span>
            <h1 className="font-cinzel text-4xl sm:text-6xl font-black tracking-wider text-neutral-100 drop-shadow-lg">
              THE LAST ALIBI
            </h1>
            <p className="text-base sm:text-lg text-neutral-400 font-editorial italic max-w-lg mx-auto">
              "A storm is brewing over Vance Manor. Inside the study, a tycoon lies dead. One of four suspects is lying."
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto py-2">
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-xs font-cinzel font-bold text-amber-400">
                1 Fixed Mystery
              </div>
              <p className="text-[11px] text-neutral-400 font-mono mt-1">
                Authentic, tightly plotted 1938 murder case with real forensic clues.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-xs font-cinzel font-bold text-amber-400">
                AI Interrogations
              </div>
              <p className="text-[11px] text-neutral-400 font-mono mt-1">
                Dynamic suspect psychology & stress system powered by Gemini.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-xs font-cinzel font-bold text-amber-400">
                True Physical Proof
              </div>
              <p className="text-[11px] text-neutral-400 font-mono mt-1">
                Confront suspects with contradictions to shatter their alibi.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              onClick={() => setStep("briefing")}
              className="px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-cinzel font-black text-sm sm:text-base tracking-widest uppercase transition-all shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START INVESTIGATION</span>
            </button>
            <span className="text-[11px] font-mono text-neutral-500">
              Estimated duration: 15–20 minutes · Fully playable in browser
            </span>
          </div>
        </div>
      ) : (
        /* Briefing Screen */
        <div className="max-w-3xl w-full bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden font-editorial animate-in fade-in duration-300">
          <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <h2 className="font-cinzel font-bold text-base sm:text-lg text-neutral-100 tracking-wider">
                CONFIDENTIAL POLICE DISPATCH: CASE #38-1014
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              STRICT DISCRETION
            </span>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* The Crime Summary */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>The Crime Scene: Vance Manor Ground-Floor Study</span>
              </div>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-serif">
                At 10:48 PM, groundskeeper Michael Hayes raised the alarm after finding 62-year-old financial magnate Arthur Vance dead beside his overturned mahogany desk. The heavy bronze paperweight on the floor bears faint wiped stains; his shattered pocket watch is frozen at <strong>10:22 PM</strong>.
              </p>
            </div>

            {/* Suspects Briefing */}
            <div>
              <h3 className="font-cinzel font-bold text-sm text-neutral-300 uppercase tracking-wider mb-3">
                Persons Detained Inside Vance Manor
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                  <CharacterPortrait suspectId="sarah" size="sm" />
                  <div className="text-xs font-serif">
                    <strong className="text-neutral-100 block font-cinzel">Sarah Vance</strong>
                    <span className="text-neutral-400 text-[11px]">Estranged Daughter · Inheritor</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                  <CharacterPortrait suspectId="daniel" size="sm" />
                  <div className="text-xs font-serif">
                    <strong className="text-neutral-100 block font-cinzel">Daniel Sterling</strong>
                    <span className="text-neutral-400 text-[11px]">Business Partner · Co-Director</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                  <CharacterPortrait suspectId="michael" size="sm" />
                  <div className="text-xs font-serif">
                    <strong className="text-neutral-100 block font-cinzel">Michael Hayes</strong>
                    <span className="text-neutral-400 text-[11px]">Head Caretaker · Groundskeeper</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                  <CharacterPortrait suspectId="victoria" size="sm" />
                  <div className="text-xs font-serif">
                    <strong className="text-neutral-100 block font-cinzel">Victoria Cross</strong>
                    <span className="text-neutral-400 text-[11px]">Executive Secretary · Auditor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detective Directives */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs sm:text-sm text-amber-200/90 space-y-1 font-serif">
              <strong className="font-cinzel text-amber-300 block mb-1">
                Your Directives, Detective:
              </strong>
              <ul className="list-disc pl-5 space-y-1">
                <li>Search the 5 manor locations to secure physical forensics.</li>
                <li>Interrogate each suspect; observe their stress gauge as you press them.</li>
                <li>Present contradicting evidence to break their fabricated alibis.</li>
                <li>Accuse the killer and name their motive before sunrise.</li>
              </ul>
            </div>
          </div>

          <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => setStep("title")}
              className="text-xs font-mono text-neutral-400 hover:text-neutral-200"
            >
              Back
            </button>

            <button
              onClick={onStartInvestigation}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-cinzel font-bold text-xs sm:text-sm tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-105"
            >
              <span>ENTER VANCE MANOR</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
