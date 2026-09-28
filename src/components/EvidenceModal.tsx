import React, { useState } from "react";
import { Clue, Suspect } from "../types/game";
import { 
  FolderArchive, X, Clock, FileText, Footprints, 
  Sparkles, ShieldAlert, BookOpen, AlertTriangle, 
  MapPin, CheckCircle2, Search
} from "lucide-react";

interface EvidenceModalProps {
  discoveredClues: Clue[];
  allClues: Clue[];
  suspects: Suspect[];
  onClose: () => void;
  onSelectClueToInterrogate?: (clue: Clue) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  discoveredClues,
  allClues,
  suspects,
  onClose,
  onSelectClueToInterrogate,
}) => {
  const [selectedClue, setSelectedClue] = useState<Clue | null>(
    discoveredClues[0] || null
  );

  const getClueIcon = (type: string) => {
    switch (type) {
      case "watch": return <Clock className="w-5 h-5 text-amber-400" />;
      case "document": return <FileText className="w-5 h-5 text-amber-400" />;
      case "footprint": return <Footprints className="w-5 h-5 text-amber-400" />;
      case "handkerchief": return <Sparkles className="w-5 h-5 text-amber-400" />;
      case "folder": return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case "notebook": return <BookOpen className="w-5 h-5 text-amber-400" />;
      default: return <Search className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Dossier Header */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg text-neutral-100 tracking-wider">
                CASE DOSSIER: EVIDENCE & FORENSICS
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mt-0.5">
                <span>Arthur Vance Homicide</span>
                <span>·</span>
                <span className="text-amber-400">
                  {discoveredClues.length} of {allClues.length} Clues Uncovered
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area: Sidebar + Detail view */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left list of clues */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950/50 p-3 overflow-y-auto space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-2 py-1">
              Collected Artifacts
            </div>

            {allClues.map((clue) => {
              const isFound = discoveredClues.some((c) => c.id === clue.id);
              const isSelected = selectedClue?.id === clue.id;

              return (
                <button
                  key={clue.id}
                  onClick={() => isFound && setSelectedClue(clue)}
                  disabled={!isFound}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                    isSelected
                      ? "bg-amber-950/60 border-amber-600 text-amber-100 shadow-md"
                      : isFound
                      ? "bg-neutral-900/80 hover:bg-neutral-850 border-neutral-800 text-neutral-200"
                      : "bg-neutral-950/40 border-neutral-900/80 text-neutral-600 cursor-not-allowed"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex-shrink-0">
                    {isFound ? (
                      getClueIcon(clue.iconType)
                    ) : (
                      <Search className="w-5 h-5 text-neutral-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs truncate">
                        {isFound ? clue.name : "Uncollected Clue"}
                      </span>
                      {isFound && clue.importance === "critical" && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/60 uppercase">
                          Smoking Gun
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {isFound
                        ? clue.shortDesc
                        : `Hidden in Vance Manor (${clue.locationId.replace("_", " ")})`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          <div className="flex-1 p-6 overflow-y-auto bg-neutral-900/90 font-editorial">
            {selectedClue ? (
              <div className="max-w-xl mx-auto space-y-6">
                {/* Forensic Card Header */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                        {getClueIcon(selectedClue.iconType)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                          Forensic Artifact #{selectedClue.id.toUpperCase()}
                        </span>
                        <h3 className="font-cinzel font-bold text-xl text-neutral-100">
                          {selectedClue.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                      {selectedClue.importance.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Discovered in:</span>
                    <strong className="text-neutral-200 capitalize">
                      {selectedClue.locationId.replace("_", " ")}
                    </strong>
                  </div>
                </div>

                {/* Detailed Narrative Examination */}
                <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Detective's Examination Notes
                  </h4>
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-serif">
                    {selectedClue.detailedDesc}
                  </p>
                </div>

                {/* Contradiction / Suspect Linkage */}
                {selectedClue.contradictionNote && (
                  <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-red-300 font-bold">
                        Contradiction Identified
                      </h4>
                      <p className="text-xs sm:text-sm text-red-200 mt-1 font-serif">
                        {selectedClue.contradictionNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500">
                <FolderArchive className="w-12 h-12 text-neutral-700 mb-3" />
                <p className="text-sm font-cinzel text-neutral-400">
                  Select a piece of collected evidence to inspect
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>Tip: You can present any of these clues directly to suspects during interrogation.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors font-sans text-xs"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
