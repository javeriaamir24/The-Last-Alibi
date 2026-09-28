import React, { useState } from "react";
import { LocationData, Hotspot, Suspect } from "../types/game";
import { CharacterPortrait } from "./CharacterPortrait";
import { 
  Eye, CheckCircle2, Search, MessageSquareQuote, 
  Flame, Clock, BookOpen, Trash2, Footprints, 
  ShieldAlert, Bell, DoorClosed, Droplets, Columns,
  HelpCircle, Sparkles
} from "lucide-react";

interface LocationSceneProps {
  location: LocationData;
  suspectsInLocation: Suspect[];
  discoveredClueIds: string[];
  inspectedHotspotIds: string[];
  onInspectHotspot: (hotspot: Hotspot) => void;
  onInterrogateSuspect: (suspect: Suspect) => void;
  characterStressMap: Record<string, number>;
}

export const LocationScene: React.FC<LocationSceneProps> = ({
  location,
  suspectsInLocation,
  discoveredClueIds,
  inspectedHotspotIds,
  onInspectHotspot,
  onInterrogateSuspect,
  characterStressMap,
}) => {
  const [activeHoverHotspot, setActiveHoverHotspot] = useState<Hotspot | null>(null);

  const getHotspotIcon = (icon: string) => {
    switch (icon) {
      case "watch": return <Clock className="w-4 h-4" />;
      case "book": return <BookOpen className="w-4 h-4" />;
      case "trash": return <Trash2 className="w-4 h-4" />;
      case "footprint": return <Footprints className="w-4 h-4" />;
      case "safe": return <ShieldAlert className="w-4 h-4" />;
      case "notebook": return <BookOpen className="w-4 h-4" />;
      case "flame": return <Flame className="w-4 h-4" />;
      case "bell": return <Bell className="w-4 h-4" />;
      case "door": return <DoorClosed className="w-4 h-4" />;
      case "droplet": return <Droplets className="w-4 h-4" />;
      case "columns": return <Columns className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  // 2D SVG Backdrop for each location
  const renderBackdropSvg = () => {
    switch (location.id) {
      case "entrance":
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none">
            <defs>
              <linearGradient id="ent_wall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#141110" />
                <stop offset="100%" stopColor="#241a15" />
              </linearGradient>
              <linearGradient id="ent_floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1b1d22" />
                <stop offset="100%" stopColor="#0b0c0e" />
              </linearGradient>
            </defs>
            {/* Dark wood walls */}
            <rect width="800" height="300" fill="url(#ent_wall)" />
            {/* Marble checkered floor */}
            <polygon points="0,300 800,300 800,450 0,450" fill="url(#ent_floor)" />
            {/* Floor perspective tiles */}
            <line x1="0" y1="300" x2="0" y2="450" stroke="#2a2e38" strokeWidth="1.5" />
            <line x1="200" y1="300" x2="100" y2="450" stroke="#2a2e38" strokeWidth="1.5" />
            <line x1="400" y1="300" x2="400" y2="450" stroke="#2a2e38" strokeWidth="1.5" />
            <line x1="600" y1="300" x2="700" y2="450" stroke="#2a2e38" strokeWidth="1.5" />
            <line x1="800" y1="300" x2="800" y2="450" stroke="#2a2e38" strokeWidth="1.5" />
            <line x1="0" y1="340" x2="800" y2="340" stroke="#2a2e38" strokeWidth="1" />
            <line x1="0" y1="390" x2="800" y2="390" stroke="#2a2e38" strokeWidth="1" />
            {/* Grand mahogany archway */}
            <path d="M 280 300 L 280 100 Q 400 40 520 100 L 520 300 Z" fill="#0c0908" stroke="#3d2b22" strokeWidth="4" />
            {/* Stained glass rain window */}
            <rect x="340" y="80" width="120" height="140" rx="8" fill="#131c26" stroke="#263545" strokeWidth="3" />
            <line x1="400" y1="80" x2="400" y2="220" stroke="#263545" strokeWidth="2" />
            <line x1="340" y1="150" x2="460" y2="150" stroke="#263545" strokeWidth="2" />
            {/* Rain streaks on glass */}
            <line x1="355" y1="90" x2="352" y2="130" stroke="#476282" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
            <line x1="380" y1="110" x2="378" y2="160" stroke="#476282" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
            <line x1="420" y1="95" x2="418" y2="140" stroke="#476282" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
            <line x1="445" y1="120" x2="442" y2="180" stroke="#476282" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
            {/* Grandfather clock */}
            <rect x="385" y="110" width="30" height="180" rx="4" fill="#3b2315" stroke="#1d1109" strokeWidth="2" />
            <circle cx="400" cy="135" r="10" fill="#fef3c7" stroke="#92400e" strokeWidth="1" />
            <rect x="393" y="170" width="14" height="60" fill="#1d1109" />
            <circle cx="400" cy="205" r="5" fill="#f59e0b" />
            {/* Ornate Coat Rack */}
            <line x1="590" y1="120" x2="590" y2="300" stroke="#78350f" strokeWidth="4" />
            <line x1="575" y1="130" x2="605" y2="130" stroke="#78350f" strokeWidth="3" />
            <path d="M 578 140 Q 570 190 580 230 Q 600 230 602 140 Z" fill="#27272a" />
            {/* Registry pedestal */}
            <polygon points="210,310 240,310 235,220 215,220" fill="#451a03" />
            <rect x="200" y="210" width="50" height="15" rx="2" fill="#78350f" transform="rotate(-15 225 215)" />
            <rect x="205" y="208" width="40" height="10" fill="#fef3c7" transform="rotate(-15 225 215)" />
          </svg>
        );

      case "living_room":
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none">
            <defs>
              <linearGradient id="liv_wall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1412" />
                <stop offset="100%" stopColor="#2c1f19" />
              </linearGradient>
              <radialGradient id="hearth_glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="280" fill="url(#liv_wall)" />
            {/* Wooden floor */}
            <rect y="280" width="800" height="170" fill="#24140e" />
            {/* Crimson Persian Rug */}
            <ellipse cx="400" cy="370" rx="280" ry="65" fill="#450a0a" stroke="#991b1b" strokeWidth="3" strokeDasharray="6,4" />
            <ellipse cx="400" cy="370" rx="220" ry="45" fill="#581c87" opacity="0.3" />
            {/* Bookshelves */}
            <rect x="40" y="60" width="160" height="220" fill="#1c110b" stroke="#3b2315" strokeWidth="3" />
            <line x1="40" y1="120" x2="200" y2="120" stroke="#3b2315" strokeWidth="3" />
            <line x1="40" y1="180" x2="200" y2="180" stroke="#3b2315" strokeWidth="3" />
            {/* Books */}
            <rect x="55" y="75" width="14" height="42" fill="#7f1d1d" />
            <rect x="72" y="80" width="18" height="37" fill="#14532d" />
            <rect x="93" y="70" width="12" height="47" fill="#1e3a5f" />
            <rect x="110" y="77" width="22" height="40" fill="#713f12" />
            {/* Stone Fireplace */}
            <rect x="320" y="100" width="160" height="180" fill="#3f3f46" stroke="#27272a" strokeWidth="4" />
            <path d="M 340 180 Q 400 150 460 180 L 460 280 L 340 280 Z" fill="#09090b" />
            {/* Hearth fire & embers */}
            <circle cx="400" cy="240" r="140" fill="url(#hearth_glow)" pointerEvents="none" />
            <path d="M 380 265 Q 400 220 405 250 Q 420 225 425 265 Z" fill="#f97316" />
            <path d="M 390 265 Q 400 240 405 255 Q 412 245 415 265 Z" fill="#fde047" />
            {/* Leather Armchair */}
            <path d="M 540 230 C 530 200, 670 200, 660 230 L 670 320 L 530 320 Z" fill="#3f1d12" stroke="#1c0c07" strokeWidth="3" />
            <rect x="525" y="240" width="25" height="70" rx="10" fill="#4d2417" />
            <rect x="650" y="240" width="25" height="70" rx="10" fill="#4d2417" />
            {/* Small side table with decanter */}
            <polygon points="260,330 300,330 295,270 265,270" fill="#2d150b" />
            <rect x="250" y="260" width="60" height="12" rx="3" fill="#451a03" />
            {/* Decanter */}
            <rect x="272" y="235" width="16" height="25" rx="3" fill="#cbd5e1" opacity="0.6" />
            <rect x="274" y="244" width="12" height="14" fill="#b45309" opacity="0.8" />
            {/* Wastebasket */}
            <polygon points="505,360 525,360 520,330 510,330" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
            <rect x="509" y="326" width="12" height="6" fill="#fef08a" transform="rotate(12 515 329)" />
          </svg>
        );

      case "study":
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none">
            <defs>
              <linearGradient id="std_wall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f1118" />
                <stop offset="100%" stopColor="#1e222f" />
              </linearGradient>
            </defs>
            <rect width="800" height="290" fill="url(#std_wall)" />
            {/* Dark parquetry floor */}
            <rect y="290" width="800" height="160" fill="#1b1411" />
            {/* French Terrace Glass Door (Ajar, rain blowing in) */}
            <rect x="80" y="60" width="110" height="230" fill="#090d16" stroke="#334155" strokeWidth="4" />
            <line x1="80" y1="140" x2="190" y2="140" stroke="#334155" strokeWidth="2" />
            <line x1="80" y1="210" x2="190" y2="210" stroke="#334155" strokeWidth="2" />
            {/* Raindrops on glass and puddles */}
            <ellipse cx="140" cy="305" rx="45" ry="12" fill="#1e293b" opacity="0.8" />
            <line x1="100" y1="80" x2="96" y2="130" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
            <line x1="130" y1="95" x2="126" y2="155" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
            <line x1="160" y1="75" x2="157" y2="125" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
            {/* Tilted Maritime Painting & Wall Safe */}
            <rect x="610" y="90" width="100" height="80" fill="#020617" stroke="#475569" strokeWidth="3" />
            <circle cx="660" cy="130" r="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <rect x="657" y="125" width="6" height="10" fill="#cbd5e1" />
            {/* Tilted frame */}
            <rect x="585" y="80" width="110" height="90" rx="3" fill="#2d1b0d" stroke="#ca8a04" strokeWidth="2.5" transform="rotate(-18 640 125)" />
            {/* Large Heavy Mahogany Desk */}
            <polygon points="260,250 560,250 580,340 240,340" fill="#2e140a" stroke="#1c0b05" strokeWidth="3" />
            <polygon points="240,340 580,340 575,370 245,370" fill="#1e0c05" />
            {/* Desk legs */}
            <rect x="250" y="340" width="25" height="50" fill="#150803" />
            <rect x="545" y="340" width="25" height="50" fill="#150803" />
            {/* Overturned leather chair */}
            <path d="M 430 350 L 490 320 L 510 370 L 450 390 Z" fill="#450a0a" stroke="#1c0b05" strokeWidth="2" transform="rotate(35 470 355)" />
            {/* Victim chalk outline on rug */}
            <ellipse cx="360" cy="385" rx="80" ry="35" fill="#3f1d12" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,4" />
            <circle cx="310" cy="380" r="18" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4,4" />
            {/* Broken gold pocket watch */}
            <circle cx="350" cy="388" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <line x1="347" y1="388" x2="353" y2="388" stroke="#ffffff" strokeWidth="1" />
            {/* Red Clay Footprint behind desk */}
            <ellipse cx="500" cy="335" rx="8" ry="16" fill="#991b1b" opacity="0.85" transform="rotate(-15 500 335)" />
            <ellipse cx="496" cy="348" rx="6" ry="8" fill="#991b1b" opacity="0.85" transform="rotate(-15 496 348)" />
          </svg>
        );

      case "kitchen":
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none">
            <defs>
              <linearGradient id="kitch_wall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1c1b" />
                <stop offset="100%" stopColor="#2e2722" />
              </linearGradient>
            </defs>
            <rect width="800" height="280" fill="url(#kitch_wall)" />
            {/* Quarry tile kitchen floor */}
            <rect y="280" width="800" height="170" fill="#431407" />
            <line x1="0" y1="330" x2="800" y2="330" stroke="#270c04" strokeWidth="1.5" />
            <line x1="0" y1="385" x2="800" y2="385" stroke="#270c04" strokeWidth="1.5" />
            {/* Hanging copper pots rack */}
            <line x1="180" y1="60" x2="620" y2="60" stroke="#52525b" strokeWidth="4" />
            <circle cx="240" cy="90" r="18" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <circle cx="340" cy="95" r="24" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <circle cx="460" cy="90" r="16" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <circle cx="560" cy="100" r="22" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            {/* Servants' Annunciator Bell Board */}
            <rect x="520" y="110" width="130" height="70" fill="#29180f" stroke="#78350f" strokeWidth="2" />
            <rect x="530" y="120" width="20" height="20" fill="#fef08a" />
            <rect x="560" y="120" width="20" height="20" fill="#29180f" stroke="#78350f" />
            <rect x="590" y="120" width="20" height="20" fill="#29180f" stroke="#78350f" />
            <text x="540" y="155" fill="#fef08a" fontSize="9" fontFamily="monospace">STUDY</text>
            {/* Cast Iron Cookstove */}
            <rect x="80" y="160" width="160" height="120" fill="#18181b" stroke="#09090b" strokeWidth="4" />
            <circle cx="130" cy="180" r="16" fill="#27272a" />
            <circle cx="190" cy="180" r="16" fill="#27272a" />
            {/* Hissing Tea Kettle */}
            <rect x="122" y="155" width="20" height="15" rx="3" fill="#94a3b8" />
            <path d="M 142 160 Q 155 155 152 145" stroke="#94a3b8" strokeWidth="3" fill="none" />
            <path d="M 152 145 Q 165 140 160 130" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" fill="none" />
            {/* Oak Prep Table */}
            <polygon points="260,260 520,260 540,350 240,350" fill="#3b2014" stroke="#1f0f08" strokeWidth="3" />
            <rect x="250" y="350" width="20" height="60" fill="#1f0f08" />
            <rect x="510" y="350" width="20" height="60" fill="#1f0f08" />
            {/* Caretaker's Notebook on table */}
            <rect x="280" y="270" width="35" height="45" fill="#d97706" stroke="#451a03" strokeWidth="1" transform="rotate(10 300 290)" />
            <line x1="285" y1="280" x2="310" y2="285" stroke="#ffffff" strokeWidth="1" />
            <line x1="287" y1="290" x2="308" y2="295" stroke="#ffffff" strokeWidth="1" />
            {/* Mudroom Rubber Boots */}
            <path d="M 640 370 L 640 330 L 655 330 L 655 355 L 670 355 L 670 370 Z" fill="#15803d" stroke="#052e16" strokeWidth="2" />
            <path d="M 660 370 L 660 330 L 675 330 L 675 355 L 690 355 L 690 370 Z" fill="#15803d" stroke="#052e16" strokeWidth="2" />
          </svg>
        );

      case "garden":
      default:
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none">
            <defs>
              <linearGradient id="gard_sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#050811" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
            {/* Stormy night sky */}
            <rect width="800" height="240" fill="url(#gard_sky)" />
            {/* Heavy Rain streaks */}
            <line x1="120" y1="20" x2="100" y2="180" stroke="#38bdf8" strokeWidth="1" strokeDasharray="12,14" opacity="0.4" />
            <line x1="240" y1="10" x2="220" y2="210" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="10,12" opacity="0.45" />
            <line x1="380" y1="30" x2="360" y2="230" stroke="#38bdf8" strokeWidth="1" strokeDasharray="14,16" opacity="0.4" />
            <line x1="520" y1="15" x2="500" y2="200" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="10,12" opacity="0.45" />
            <line x1="680" y1="25" x2="660" y2="220" stroke="#38bdf8" strokeWidth="1.3" strokeDasharray="12,14" opacity="0.4" />
            {/* Stone Colonnade (Covered walkway) */}
            <rect x="40" y="80" width="180" height="240" fill="#0f172a" stroke="#1e293b" strokeWidth="3" />
            <path d="M 60 120 Q 100 80 140 120 L 140 320 L 60 320 Z" fill="#090d16" />
            {/* Stone balustrade & terrace floor */}
            <rect y="240" width="800" height="210" fill="#1e293b" />
            <line x1="0" y1="240" x2="800" y2="240" stroke="#334155" strokeWidth="4" />
            {/* Baluster posts */}
            <line x1="60" y1="240" x2="60" y2="290" stroke="#334155" strokeWidth="5" />
            <line x1="160" y1="240" x2="160" y2="290" stroke="#334155" strokeWidth="5" />
            <line x1="260" y1="240" x2="260" y2="290" stroke="#334155" strokeWidth="5" />
            <line x1="660" y1="240" x2="660" y2="290" stroke="#334155" strokeWidth="5" />
            <line x1="740" y1="240" x2="740" y2="290" stroke="#334155" strokeWidth="5" />
            {/* Wet Red Clay Flowerbeds */}
            <ellipse cx="600" cy="350" rx="140" ry="55" fill="#7f1d1d" stroke="#991b1b" strokeWidth="2" />
            <ellipse cx="600" cy="345" rx="120" ry="40" fill="#991b1b" opacity="0.9" />
            {/* Stone Fountain Basin */}
            <ellipse cx="600" cy="320" rx="60" ry="22" fill="#334155" stroke="#1e293b" strokeWidth="3" />
            <rect x="590" y="270" width="20" height="50" fill="#1e293b" />
            <ellipse cx="600" cy="270" rx="35" ry="12" fill="#475569" />
            {/* Thorny Rosebush with snagged white handkerchief */}
            <path d="M 360 330 Q 380 270 410 310 Q 430 260 450 340" stroke="#14532d" strokeWidth="4" fill="none" />
            <circle cx="395" cy="285" r="7" fill="#b91c1c" />
            <circle cx="435" cy="275" r="6" fill="#b91c1c" />
            {/* Caught white handkerchief */}
            <polygon points="380,295 400,310 395,325 375,315" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="390" cy="312" r="3" fill="#dc2626" />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
      {/* 2D Room Graphic */}
      <div className="absolute inset-0">
        {renderBackdropSvg()}
      </div>

      {/* Atmospheric Vignette & Rain Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-neutral-700/30" />

      {/* Room Title Tag */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700/60 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs font-cinzel font-bold text-neutral-100 tracking-wide">
          {location.name.toUpperCase()}
        </span>
        <span className="text-neutral-500 text-xs">·</span>
        <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
          {location.subtitle}
        </span>
      </div>

      {/* Suspect Figure Present in Room */}
      {suspectsInLocation.map((suspect) => {
        const stress = characterStressMap[suspect.id] || suspect.stressBase;
        return (
          <div
            key={suspect.id}
            className="absolute bottom-5 right-5 sm:right-10 z-20 flex flex-col items-center group cursor-pointer"
            onClick={() => onInterrogateSuspect(suspect)}
          >
            <div className="relative transform transition-transform group-hover:scale-105 duration-200">
              <CharacterPortrait
                suspectId={suspect.id}
                size="lg"
                stressLevel={stress}
                className="ring-2 ring-amber-500/70 shadow-2xl"
              />
              <div className="absolute -top-3 -right-2 bg-amber-500 text-neutral-950 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md shadow flex items-center gap-1 animate-bounce">
                <MessageSquareQuote className="w-3 h-3" />
                TALK
              </div>
            </div>
            <button
              className="mt-2 px-3 py-1 rounded-md bg-neutral-900/90 hover:bg-amber-600 text-neutral-100 hover:text-neutral-950 border border-neutral-700 hover:border-amber-400 text-xs font-cinzel font-bold tracking-wider transition-colors shadow-lg flex items-center gap-1.5"
            >
              <span>{suspect.name}</span>
            </button>
            <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
              {suspect.role}
            </span>
          </div>
        );
      })}

      {/* Interactive Hotspots */}
      {location.hotspots.map((hotspot) => {
        const isDiscovered = hotspot.clueId && discoveredClueIds.includes(hotspot.clueId);
        const isInspected = inspectedHotspotIds.includes(hotspot.id);

        return (
          <div
            key={hotspot.id}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            onMouseEnter={() => setActiveHoverHotspot(hotspot)}
            onMouseLeave={() => setActiveHoverHotspot(null)}
          >
            <button
              onClick={() => onInspectHotspot(hotspot)}
              className={`relative flex items-center justify-center rounded-full p-2 transition-all transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-xl ${
                isDiscovered
                  ? "bg-emerald-950/90 text-emerald-400 border border-emerald-500/80"
                  : hotspot.type === "clue"
                  ? "bg-amber-500 text-neutral-950 border-2 border-amber-300 ring-4 ring-amber-500/30 animate-pulse"
                  : "bg-neutral-800/90 text-neutral-300 border border-neutral-600 hover:border-neutral-400"
              }`}
              title={hotspot.label}
              aria-label={hotspot.label}
            >
              {isDiscovered ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : hotspot.type === "clue" ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                getHotspotIcon(hotspot.icon)
              )}
            </button>

            {/* Hover Tooltip Card */}
            {activeHoverHotspot?.id === hotspot.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-neutral-950/95 border border-neutral-700 text-left pointer-events-none shadow-2xl backdrop-blur-md z-30">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold text-neutral-100 font-cinzel">
                    {hotspot.label}
                  </span>
                  {hotspot.type === "clue" && (
                    <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50">
                      {isDiscovered ? "EVIDENCE" : "CLUE"}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-300 leading-tight">
                  {hotspot.description}
                </p>
                <div className="mt-1 text-[9px] text-amber-400 font-mono flex items-center gap-1">
                  <Search className="w-2.5 h-2.5" />
                  <span>Click to examine</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Ambient footer banner */}
      <div className="absolute bottom-2 left-4 z-10 text-[11px] text-neutral-500 font-mono hidden sm:flex items-center gap-2 pointer-events-none">
        <Eye className="w-3.5 h-3.5 text-neutral-400" />
        <span>Click glowing markers to search for physical evidence</span>
      </div>
    </div>
  );
};
