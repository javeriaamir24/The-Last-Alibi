import React from "react";
import { LocationData, Suspect, Clue } from "../types/game";
import { 
  Compass, Shield, User, Flame, 
  DoorClosed, Droplets, Utensils, AlertCircle 
} from "lucide-react";

interface LocationNavProps {
  locations: LocationData[];
  currentLocationId: string;
  onSelectLocation: (locationId: string) => void;
  suspects: Suspect[];
  allClues: Clue[];
  discoveredClueIds: string[];
}

export const LocationNav: React.FC<LocationNavProps> = ({
  locations,
  currentLocationId,
  onSelectLocation,
  suspects,
  allClues,
  discoveredClueIds,
}) => {
  const getLocationIcon = (id: string) => {
    switch (id) {
      case "entrance": return <DoorClosed className="w-4 h-4" />;
      case "living_room": return <Flame className="w-4 h-4" />;
      case "study": return <Shield className="w-4 h-4" />;
      case "kitchen": return <Utensils className="w-4 h-4" />;
      case "garden": return <Droplets className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <nav className="w-full bg-neutral-950/70 border-b border-neutral-800/80 px-4 py-2 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest hidden lg:inline mr-2 flex-shrink-0">
          MANOR ESTATE:
        </span>

        {locations.map((loc) => {
          const isSelected = loc.id === currentLocationId;
          const suspectInRoom = suspects.find((s) => s.locationId === loc.id);
          const roomClues = allClues.filter((c) => c.locationId === loc.id);
          const foundRoomClues = roomClues.filter((c) =>
            discoveredClueIds.includes(c.id)
          );

          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold transition-all flex items-center gap-2.5 border ${
                isSelected
                  ? "bg-amber-600 text-neutral-950 border-amber-400 shadow-md scale-102"
                  : "bg-neutral-900/90 hover:bg-neutral-850 text-neutral-300 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <span className={isSelected ? "text-neutral-950" : "text-amber-500"}>
                {getLocationIcon(loc.id)}
              </span>

              <div className="flex flex-col text-left">
                <span className="leading-tight">{loc.name}</span>
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-normal opacity-80 mt-0.5">
                  {suspectInRoom && (
                    <span className="flex items-center gap-0.5 font-semibold text-neutral-100">
                      <User className="w-2.5 h-2.5" />
                      {suspectInRoom.name.split(" ")[0]}
                    </span>
                  )}
                  {roomClues.length > 0 && (
                    <span>
                      ({foundRoomClues.length}/{roomClues.length} Clues)
                    </span>
                  )}
                </div>
              </div>

              {loc.id === "study" && !isSelected && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" title="Crime Scene" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
