import React from "react";

interface CharacterPortraitProps {
  suspectId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  stressLevel?: number;
}

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  suspectId,
  className = "",
  size = 'md',
  stressLevel = 0,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32 md:w-36 md:h-36",
    xl: "w-44 h-44 md:w-56 md:h-56",
  };

  const isNervous = stressLevel > 60;
  const isCracking = stressLevel > 85;

  const renderSvg = () => {
    switch (suspectId) {
      case "sarah":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="sarah_bg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#2c3a2f" />
                <stop offset="100%" stopColor="#0f1611" />
              </radialGradient>
              <linearGradient id="sarah_gown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e4620" />
                <stop offset="100%" stopColor="#0b240e" />
              </linearGradient>
            </defs>
            <rect width="160" height="160" rx="16" fill="url(#sarah_bg)" />
            {/* Hair back */}
            <path d="M 40 70 C 35 120, 125 120, 120 70 C 120 30, 40 30, 40 70 Z" fill="#4a1e1b" />
            {/* Shoulders / Evening gown */}
            <path d="M 30 160 C 40 120, 120 120, 130 160 Z" fill="url(#sarah_gown)" />
            <path d="M 65 130 Q 80 145 95 130" stroke="#c4a747" strokeWidth="2" fill="none" />
            {/* Neck */}
            <rect x="72" y="98" width="16" height="24" rx="4" fill="#eed5b7" />
            {/* Face */}
            <ellipse cx="80" cy="80" rx="28" ry="32" fill="#f7e2cc" />
            {/* Eyes */}
            <path d="M 64 78 Q 72 74 78 79" stroke="#22110c" strokeWidth="2.5" fill="none" />
            <path d="M 82 79 Q 88 74 96 78" stroke="#22110c" strokeWidth="2.5" fill="none" />
            <circle cx="71" cy="80" r="3.5" fill="#2b4736" />
            <circle cx="89" cy="80" r="3.5" fill="#2b4736" />
            <circle cx="72" cy="79" r="1" fill="#ffffff" />
            <circle cx="90" cy="79" r="1" fill="#ffffff" />
            {/* Tear streak if stressed */}
            {isNervous && (
              <path d="M 72 84 Q 71 95 72 102" stroke="#8ecae6" strokeWidth="1.5" strokeDasharray="2,2" fill="none" opacity="0.8" />
            )}
            {/* Eyebrows */}
            <path d="M 62 72 Q 70 69 77 74" stroke="#3d1815" strokeWidth="2" fill="none" />
            <path d="M 83 74 Q 90 69 98 72" stroke="#3d1815" strokeWidth="2" fill="none" />
            {/* Nose */}
            <path d="M 80 80 L 78 92 L 83 92" stroke="#d4ab82" strokeWidth="2" fill="none" />
            {/* Lips (Crimson lipstick) */}
            <path d="M 72 102 Q 80 106 88 102 Q 80 100 72 102 Z" fill="#881337" />
            {/* Waved hair front */}
            <path d="M 45 60 C 50 35, 110 35, 115 60 C 112 45, 95 42, 80 44 C 65 42, 48 48, 45 60 Z" fill="#5c2622" />
            <path d="M 45 60 C 40 85, 48 105, 52 110 C 48 95, 44 75, 48 60 Z" fill="#5c2622" />
            <path d="M 115 60 C 120 85, 112 105, 108 110 C 112 95, 116 75, 112 60 Z" fill="#5c2622" />
          </svg>
        );

      case "daniel":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="daniel_bg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#252733" />
                <stop offset="100%" stopColor="#0d0e12" />
              </radialGradient>
              <linearGradient id="daniel_suit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e222d" />
                <stop offset="100%" stopColor="#0a0c10" />
              </linearGradient>
            </defs>
            <rect width="160" height="160" rx="16" fill="url(#daniel_bg)" />
            {/* Shoulders / Charcoal three-piece suit */}
            <path d="M 24 160 L 40 120 L 120 120 L 136 160 Z" fill="url(#daniel_suit)" />
            {/* Shirt collar & tie */}
            <polygon points="80,120 68,102 92,102" fill="#ffffff" />
            <polygon points="76,108 84,108 82,145 78,145" fill="#71717a" />
            {/* Lapels */}
            <polygon points="40,120 68,145 76,120" fill="#2d3342" />
            <polygon points="120,120 92,145 84,120" fill="#2d3342" />
            {/* Neck */}
            <rect x="71" y="94" width="18" height="24" rx="3" fill="#f0d5bc" />
            {/* Face */}
            <path d="M 54 65 C 54 48, 106 48, 106 65 C 106 98, 92 110, 80 110 C 68 110, 54 98, 54 65 Z" fill="#f5dec6" />
            {/* Hair (Slicked back) */}
            <path d="M 52 60 C 50 36, 110 36, 108 60 C 104 42, 94 40, 80 40 C 66 40, 56 42, 52 60 Z" fill="#18181b" />
            {/* Eyes */}
            <ellipse cx="68" cy="74" rx="4" ry="2.5" fill="#27272a" />
            <ellipse cx="92" cy="74" rx="4" ry="2.5" fill="#27272a" />
            <path d="M 62 70 Q 70 68 76 72" stroke="#18181b" strokeWidth="2.5" fill="none" />
            <path d="M 84 72 Q 90 68 98 70" stroke="#18181b" strokeWidth="2.5" fill="none" />
            {/* Nose */}
            <path d="M 80 72 L 78 88 L 84 88" stroke="#d4ab82" strokeWidth="2" fill="none" />
            {/* Thin mustache */}
            <path d="M 72 94 Q 80 91 88 94 Q 80 93 72 94 Z" fill="#18181b" />
            {/* Smug mouth or nervous grimace */}
            {isCracking ? (
              <path d="M 70 102 Q 80 97 90 101" stroke="#991b1b" strokeWidth="2.5" fill="none" />
            ) : (
              <path d="M 72 100 Q 82 104 90 98" stroke="#52525b" strokeWidth="2" fill="none" />
            )}
            {/* Sweat beads if stressed */}
            {isNervous && (
              <circle cx="102" cy="68" r="2" fill="#38bdf8" opacity="0.9" />
            )}
          </svg>
        );

      case "michael":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="michael_bg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#3d2d1d" />
                <stop offset="100%" stopColor="#140e08" />
              </radialGradient>
            </defs>
            <rect width="160" height="160" rx="16" fill="url(#michael_bg)" />
            {/* Work waistcoat and shirt */}
            <path d="M 28 160 L 44 125 L 116 125 L 132 160 Z" fill="#543825" />
            <polygon points="80,125 70,105 90,105" fill="#e5e5e5" />
            {/* Neck */}
            <rect x="70" y="96" width="20" height="24" rx="4" fill="#deb887" />
            {/* Face */}
            <ellipse cx="80" cy="82" rx="30" ry="34" fill="#ebd2b0" />
            {/* Graying disheveled hair */}
            <path d="M 46 72 C 40 40, 120 40, 114 72 C 108 48, 96 46, 80 46 C 64 46, 52 48, 46 72 Z" fill="#8c8d8f" />
            <path d="M 44 75 Q 48 85 45 95" stroke="#8c8d8f" strokeWidth="3" fill="none" />
            <path d="M 116 75 Q 112 85 115 95" stroke="#8c8d8f" strokeWidth="3" fill="none" />
            {/* Worried furrowed brow */}
            <path d="M 64 71 Q 72 76 77 73" stroke="#523a28" strokeWidth="2.5" fill="none" />
            <path d="M 83 73 Q 88 76 96 71" stroke="#523a28" strokeWidth="2.5" fill="none" />
            <path d="M 76 66 L 76 72" stroke="#b08d6d" strokeWidth="1.5" />
            <path d="M 84 66 L 84 72" stroke="#b08d6d" strokeWidth="1.5" />
            {/* Tired eyes */}
            <ellipse cx="71" cy="80" rx="4" ry="3" fill="#3f2e20" />
            <ellipse cx="89" cy="80" rx="4" ry="3" fill="#3f2e20" />
            <path d="M 65 87 Q 71 89 77 87" stroke="#b08d6d" strokeWidth="1.5" fill="none" />
            <path d="M 83 87 Q 89 89 95 87" stroke="#b08d6d" strokeWidth="1.5" fill="none" />
            {/* Nose */}
            <path d="M 80 77 L 76 93 L 84 93" stroke="#b08d6d" strokeWidth="2.5" fill="none" />
            {/* Mouth */}
            <path d="M 71 106 Q 80 102 89 106" stroke="#523a28" strokeWidth="2" fill="none" />
            {/* Stubble / 5 o'clock shadow */}
            <ellipse cx="80" cy="104" rx="20" ry="12" fill="#b08d6d" opacity="0.3" />
          </svg>
        );

      case "victoria":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id="victoria_bg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0a0f1d" />
              </radialGradient>
              <linearGradient id="victoria_blazer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#090514" />
              </linearGradient>
            </defs>
            <rect width="160" height="160" rx="16" fill="url(#victoria_bg)" />
            {/* Navy tailored blazer & silk collar */}
            <path d="M 28 160 L 42 122 L 118 122 L 132 160 Z" fill="url(#victoria_blazer)" />
            <polygon points="80,122 68,102 92,102" fill="#f8fafc" />
            <polygon points="42,122 68,145 76,122" fill="#312e81" />
            <polygon points="118,122 92,145 84,122" fill="#312e81" />
            {/* Neck */}
            <rect x="72" y="96" width="16" height="22" rx="3" fill="#f1ddd0" />
            {/* Face */}
            <ellipse cx="80" cy="80" rx="26" ry="30" fill="#fceee4" />
            {/* Sleek dark bob haircut */}
            <path d="M 48 55 C 50 32, 110 32, 112 55 L 114 96 C 112 90, 106 75, 106 65 C 106 48, 54 48, 54 65 C 54 75, 48 90, 46 96 Z" fill="#0f172a" />
            {/* Glasses */}
            <rect x="61" y="73" width="16" height="12" rx="3" stroke="#b45309" strokeWidth="2" fill="rgba(255,255,255,0.15)" />
            <rect x="83" y="73" width="16" height="12" rx="3" stroke="#b45309" strokeWidth="2" fill="rgba(255,255,255,0.15)" />
            <line x1="77" y1="78" x2="83" y2="78" stroke="#b45309" strokeWidth="2" />
            {/* Analytical eyes behind glass */}
            <circle cx="69" cy="79" r="2.5" fill="#1e293b" />
            <circle cx="91" cy="79" r="2.5" fill="#1e293b" />
            {/* Eyebrows */}
            <path d="M 61 70 L 76 69" stroke="#0f172a" strokeWidth="2" />
            <path d="M 84 69 L 99 70" stroke="#0f172a" strokeWidth="2" />
            {/* Nose */}
            <path d="M 80 77 L 78 90 L 83 90" stroke="#d5b49d" strokeWidth="1.8" fill="none" />
            {/* Composed lips */}
            <path d="M 73 100 Q 80 102 87 100" stroke="#991b1b" strokeWidth="2.2" fill="none" />
          </svg>
        );

      case "victim":
      case "arthur":
      default:
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
            <rect width="160" height="160" rx="16" fill="#18181b" />
            {/* Chalk outline silhouette */}
            <path
              d="M 80 40 C 92 40, 102 50, 102 65 C 102 78, 94 88, 80 88 C 66 88, 58 78, 58 65 C 58 50, 68 40, 80 40 Z"
              stroke="#e4e4e7"
              strokeWidth="2.5"
              strokeDasharray="6,4"
              fill="rgba(255,255,255,0.04)"
            />
            <path
              d="M 50 140 L 60 100 L 100 100 L 110 140"
              stroke="#e4e4e7"
              strokeWidth="2.5"
              strokeDasharray="6,4"
              fill="rgba(255,255,255,0.04)"
            />
            <line x1="72" y1="88" x2="72" y2="100" stroke="#e4e4e7" strokeWidth="2" strokeDasharray="4,3" />
            <line x1="88" y1="88" x2="88" y2="100" stroke="#e4e4e7" strokeWidth="2" strokeDasharray="4,3" />
            <text x="80" y="152" fill="#a1a1aa" fontSize="11" textAnchor="middle" fontFamily="monospace">
              ARTHUR VANCE (DEC.)
            </text>
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-neutral-700/80 bg-neutral-900 shadow-xl flex-shrink-0 transition-transform ${sizeClasses[size]} ${className} ${
        isCracking ? "ring-2 ring-red-600/70 animate-pulse" : isNervous ? "ring-1 ring-amber-500/60" : ""
      }`}
    >
      {renderSvg()}
      {stressLevel > 0 && (
        <div className="absolute bottom-0 inset-x-0 bg-neutral-950/80 backdrop-blur-xs py-0.5 px-1.5 flex items-center justify-between text-[10px] font-mono border-t border-neutral-800">
          <span className="text-neutral-400">STRESS</span>
          <span
            className={
              isCracking ? "text-red-400 font-bold" : isNervous ? "text-amber-400" : "text-emerald-400"
            }
          >
            {stressLevel}%
          </span>
        </div>
      )}
    </div>
  );
};
