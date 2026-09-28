import React from "react";
import { Hotspot, Clue, Suspect } from "../types/game";
import { 
  Search, CheckCircle2, Sparkles, MapPin, 
  X, MessageSquareQuote, FileSearch, AlertCircle 
} from "lucide-react";

interface HotspotModalProps {
  hotspot: Hotspot;
  clue?: Clue;
  isNewClue: boolean;
  activeSuspectInRoom?: Suspect;
  onClose: () => void;
  onInterrogateWithClue?: (suspect: Suspect, clue: Clue) => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({
  hotspot,
  clue,
  isNewClue,
  activeSuspectInRoom,
  onClose,
  onInterrogateWithClue,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden font-editorial">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${clue ? "bg-amber-500/20 text-amber-400" : "bg-neutral-800 text-neutral-400"}`}>
              {clue ? <Sparkles className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                {clue ? "Physical Evidence Discovered" : "Forensic Inspection"}
              </span>
              <h3 className="font-cinzel font-bold text-sm sm:text-base text-neutral-100">
                {hotspot.label}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {isNewClue && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/60 flex items-center gap-2 text-emerald-300 text-xs font-mono animate-bounce">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>LOGGED INTO EVIDENCE DOSSIER</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <p className="text-sm sm:text-base text-neutral-200 font-serif leading-relaxed">
              {clue ? clue.detailedDesc : hotspot.description}
            </p>
          </div>

          {clue?.contradictionNote && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-200 font-serif">
              <strong className="font-mono text-red-300 block mb-0.5 uppercase tracking-wide">
                Key Contradiction:
              </strong>
              {clue.contradictionNote}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-500">
            {clue ? `Priority: ${clue.importance.toUpperCase()}` : "Environmental detail"}
          </span>

          <div className="flex items-center gap-2">
            {clue && activeSuspectInRoom && onInterrogateWithClue && (
              <button
                onClick={() => {
                  onClose();
                  onInterrogateWithClue(activeSuspectInRoom, clue);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Confront {activeSuspectInRoom.name.split(" ")[0]}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-sans transition-colors"
            >
              Continue Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
