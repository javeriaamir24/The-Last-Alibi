import React from "react";
import { 
  FolderArchive, Users, Gavel, Volume2, VolumeX, 
  Clock, ShieldAlert, Sparkles 
} from "lucide-react";

interface HeaderProps {
  discoveredCluesCount: number;
  totalCluesCount: number;
  onOpenDossier: () => void;
  onOpenSuspects: () => void;
  onOpenAccusation: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  discoveredCluesCount,
  totalCluesCount,
  onOpenDossier,
  onOpenSuspects,
  onOpenAccusation,
  isAudioPlaying,
  onToggleAudio,
  hasGeminiKey,
}) => {
  return (
    <header className="w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Title & Atmosphere */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel font-extrabold text-base sm:text-lg tracking-wider text-neutral-100">
                THE LAST ALIBI
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hidden sm:inline">
                OCT 14, 1938 · 10:48 PM
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              Vance Manor Homicide · Ground-Floor Study
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambient Rain Audio Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-mono ${
              isAudioPlaying
                ? "bg-amber-950/60 border-amber-700/80 text-amber-300"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
            title={isAudioPlaying ? "Mute ambient rain & thunder" : "Play noir rain atmosphere"}
          >
            {isAudioPlaying ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden md:inline">
              {isAudioPlaying ? "Rain Audio On" : "Audio Off"}
            </span>
          </button>

          {/* Suspects Button */}
          <button
            onClick={onOpenSuspects}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 hover:border-neutral-700 text-xs font-cinzel font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Suspects (4)</span>
          </button>

          {/* Evidence Dossier Button */}
          <button
            onClick={onOpenDossier}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 hover:border-neutral-700 text-xs font-cinzel font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <FolderArchive className="w-4 h-4 text-amber-400" />
            <span>
              Evidence ({discoveredCluesCount}/{totalCluesCount})
            </span>
          </button>

          {/* Accuse / Indict Button */}
          <button
            onClick={onOpenAccusation}
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white border border-red-500/60 text-xs font-cinzel font-bold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-red-900/30"
          >
            <Gavel className="w-4 h-4" />
            <span className="tracking-wide">ACCUSE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
