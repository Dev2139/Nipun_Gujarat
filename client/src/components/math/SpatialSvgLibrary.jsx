import React from 'react';

/**
 * 100% EMOJI-FREE Vector Illustration Library for Spatial Concepts (M-02)
 * Includes clean cartoon characters, furniture, objects, environments, arrows, and paths.
 */

// Cartoon Child Character (Boy / Girl with customizable height, posture, and state)
export function ChildCharacter({
  gender = 'boy',
  pose = 'standing', // 'standing' | 'reaching_up' | 'happy'
  size = 110,
  className = '',
  highlight = false,
  onClick,
}) {
  const isBoy = gender === 'boy';
  const shirtColor = isBoy ? '#3B82F6' : '#EC4899';
  const pantsColor = isBoy ? '#1E3A8A' : '#7C3AED';
  const hairColor = '#331D0E';
  const skinColor = '#FBD38D';

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${highlight ? 'ring-4 ring-amber-400 bg-amber-50/60 rounded-3xl p-2 shadow-lg animate-pulse' : ''} ${className}`}
      style={{ width: size, height: size * 1.35 }}
    >
      <svg viewBox="0 0 100 135" width="100%" height="100%" className="drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="50" cy="130" rx="22" ry="4.5" fill="#94A3B8" opacity="0.4" />

        {/* Legs / Shoes */}
        <rect x="36" y="94" width="10" height="28" rx="4" fill={pantsColor} />
        <rect x="54" y="94" width="10" height="28" rx="4" fill={pantsColor} />
        {/* Shoes */}
        <rect x="33" y="120" width="15" height="8" rx="3" fill="#1E293B" />
        <rect x="52" y="120" width="15" height="8" rx="3" fill="#1E293B" />

        {/* Body / Shirt */}
        <path
          d="M 32 58 L 68 58 L 65 96 L 35 96 Z"
          fill={shirtColor}
          stroke="#1E293B"
          strokeWidth="1.5"
        />
        {/* Collar */}
        <polygon points="44,58 50,66 56,58" fill="#FFFFFF" />

        {/* Arms */}
        {pose === 'reaching_up' ? (
          <>
            {/* Left arm reaching high */}
            <path d="M 32 62 C 22 45 20 28 26 22" fill="none" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="26" cy="22" r="5" fill={skinColor} />
            {/* Right arm reaching high */}
            <path d="M 68 62 C 78 45 80 28 74 22" fill="none" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="74" cy="22" r="5" fill={skinColor} />
          </>
        ) : (
          <>
            {/* Arms resting beside body */}
            <path d="M 33 60 C 26 72 26 84 28 92" fill="none" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="28" cy="92" r="4.5" fill={skinColor} />
            <path d="M 67 60 C 74 72 74 84 72 92" fill="none" stroke={shirtColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="72" cy="92" r="4.5" fill={skinColor} />
          </>
        )}

        {/* Neck */}
        <rect x="46" y="48" width="8" height="12" fill={skinColor} />

        {/* Head */}
        <circle cx="50" cy="34" r="18" fill={skinColor} stroke="#D97706" strokeWidth="1" />

        {/* Hair */}
        {isBoy ? (
          <path
            d="M 32 30 C 32 16 68 16 68 30 C 66 22 58 18 50 18 C 42 18 34 22 32 30 Z"
            fill={hairColor}
          />
        ) : (
          <>
            <path d="M 30 32 C 30 14 70 14 70 32 C 68 20 50 18 30 32 Z" fill={hairColor} />
            {/* Ponytails */}
            <circle cx="28" cy="30" r="7" fill={hairColor} />
            <circle cx="72" cy="30" r="7" fill={hairColor} />
            <circle cx="30" cy="30" r="3" fill="#EC4899" />
            <circle cx="70" cy="30" r="3" fill="#EC4899" />
          </>
        )}

        {/* Eyes */}
        <circle cx="44" cy="34" r="2.5" fill="#0F172A" />
        <circle cx="56" cy="34" r="2.5" fill="#0F172A" />
        <circle cx="43.5" cy="33" r="0.8" fill="#FFFFFF" />
        <circle cx="55.5" cy="33" r="0.8" fill="#FFFFFF" />

        {/* Smile */}
        <path d="M 45 42 Q 50 47 55 42" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
        {/* Rosy Cheeks */}
        <circle cx="40" cy="38" r="2.5" fill="#F43F5E" opacity="0.3" />
        <circle cx="60" cy="38" r="2.5" fill="#F43F5E" opacity="0.3" />
      </svg>
    </div>
  );
}

// Classroom Study Table
export function ClassroomTable({ width = 160, height = 90, className = '', highlight = false, label = '' }) {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 90" width={width} height={height} className="drop-shadow-md">
        {/* Table Shadow */}
        <ellipse cx="80" cy="85" rx="65" ry="5" fill="#CBD5E1" />
        {/* Back Legs */}
        <rect x="36" y="24" width="8" height="56" rx="2" fill="#78350F" />
        <rect x="116" y="24" width="8" height="56" rx="2" fill="#78350F" />
        {/* Front Legs */}
        <rect x="24" y="24" width="10" height="62" rx="3" fill="#92400E" stroke="#451A03" strokeWidth="1" />
        <rect x="126" y="24" width="10" height="62" rx="3" fill="#92400E" stroke="#451A03" strokeWidth="1" />
        {/* Lower Crossbar */}
        <rect x="26" y="60" width="108" height="6" rx="2" fill="#78350F" />
        {/* Table Top Surface (3D Perspective) */}
        <polygon points="12,24 148,24 136,8 24,8" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
        {/* Front Rim */}
        <rect x="12" y="22" width="136" height="8" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
      </svg>
      {label && (
        <span className="text-[11px] font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs font-gujarati -mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

// Classroom Bookshelf
export function Bookshelf({ width = 140, height = 150, className = '', label = '' }) {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 140 150" width={width} height={height} className="drop-shadow-md">
        {/* Main Cabinet Outer */}
        <rect x="15" y="10" width="110" height="130" rx="6" fill="#B45309" stroke="#78350F" strokeWidth="3" />
        <rect x="22" y="16" width="96" height="118" rx="4" fill="#FDE68A" />

        {/* Shelf 1 (Top) */}
        <rect x="22" y="52" width="96" height="8" fill="#D97706" />
        {/* Shelf 2 (Bottom) */}
        <rect x="22" y="92" width="96" height="8" fill="#D97706" />

        {/* Books on Top Shelf */}
        <rect x="30" y="26" width="10" height="26" rx="2" fill="#EF4444" />
        <rect x="42" y="22" width="12" height="30" rx="2" fill="#3B82F6" />
        <rect x="56" y="28" width="10" height="24" rx="2" fill="#10B981" />
        <rect x="68" y="32" width="18" height="20" rx="2" fill="#8B5CF6" transform="rotate(-15 68 32)" />

        {/* Objects on Middle Shelf */}
        <rect x="32" y="66" width="18" height="26" rx="2" fill="#F59E0B" />
        <rect x="54" y="62" width="14" height="30" rx="2" fill="#06B6D4" />
        <circle cx="90" cy="78" r="10" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" />

        {/* Objects on Bottom Shelf */}
        <rect x="30" y="106" width="30" height="18" rx="3" fill="#64748B" />
        <rect x="70" y="104" width="22" height="20" rx="3" fill="#10B981" />
      </svg>
      {label && (
        <span className="text-[11px] font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs font-gujarati -mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

// Classroom Wooden Chair
export function ClassroomChair({ width = 90, height = 110, className = '', label = '' }) {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 90 110" width={width} height={height} className="drop-shadow-md">
        {/* Backrest */}
        <rect x="22" y="10" width="8" height="55" rx="3" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
        <rect x="20" y="14" width="50" height="22" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
        <line x1="30" y1="20" x2="60" y2="20" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        {/* Seat */}
        <polygon points="18,60 72,60 66,50 24,50" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
        <rect x="18" y="58" width="54" height="6" rx="2" fill="#2563EB" />
        {/* Legs */}
        <rect x="22" y="64" width="6" height="42" rx="2" fill="#475569" />
        <rect x="62" y="64" width="6" height="42" rx="2" fill="#475569" />
        <rect x="30" y="60" width="5" height="38" rx="2" fill="#64748B" />
        <rect x="54" y="60" width="5" height="38" rx="2" fill="#64748B" />
      </svg>
      {label && (
        <span className="text-[10px] font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs font-gujarati">
          {label}
        </span>
      )}
    </div>
  );
}

// Geometric Objects (Colored Block, Sphere, Cube, Cylinder)
export function GeometricObject({
  type = 'cube', // 'cube' | 'sphere' | 'cylinder' | 'pyramid'
  color = '#EF4444',
  size = 56,
  label = '',
  className = '',
  onClick,
  highlight = false,
}) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${highlight ? 'ring-4 ring-amber-400 bg-amber-50 rounded-2xl p-1.5 shadow-md animate-pulse' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 60 60" width="100%" height="100%" className="drop-shadow-md">
        {type === 'cube' && (
          <g>
            <polygon points="30,8 52,18 30,28 8,18" fill="#F87171" stroke="#991B1B" strokeWidth="1.5" />
            <polygon points="8,18 30,28 30,52 8,42" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            <polygon points="30,28 52,18 52,42 30,52" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          </g>
        )}
        {type === 'sphere' && (
          <g>
            <defs>
              <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="60%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
              </radialGradient>
            </defs>
            <circle cx="30" cy="30" r="24" fill="url(#sphereGrad)" stroke="#1E3A8A" strokeWidth="1.5" />
            <ellipse cx="22" cy="20" rx="6" ry="3" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 22 20)" />
          </g>
        )}
        {type === 'cylinder' && (
          <g>
            <rect x="14" y="16" width="32" height="32" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
            <ellipse cx="30" cy="16" rx="16" ry="6" fill="#34D399" stroke="#065F46" strokeWidth="1.5" />
            <ellipse cx="30" cy="48" rx="16" ry="6" fill="#059669" stroke="#065F46" strokeWidth="1.5" />
          </g>
        )}
      </svg>
      {label && (
        <span className="text-[10px] font-black text-slate-700 bg-white/90 px-1.5 py-0.5 rounded-md border border-slate-200 shadow-xs font-gujarati -mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

// Classroom Essentials (Book, Bag, Clock, Box)
export function SchoolItem({ name = 'book', size = 50, label = '', className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center transition-all ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 60 60" width="100%" height="100%" className="drop-shadow-md">
        {name === 'book' && (
          <g>
            <rect x="10" y="12" width="40" height="36" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <path d="M 12 14 L 48 14 L 48 46 L 12 46 Z" fill="#F8FAFC" />
            <line x1="28" y1="14" x2="28" y2="46" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="16" y1="22" x2="24" y2="22" stroke="#64748B" strokeWidth="1.5" />
            <line x1="16" y1="28" x2="24" y2="28" stroke="#64748B" strokeWidth="1.5" />
            <line x1="32" y1="22" x2="44" y2="22" stroke="#64748B" strokeWidth="1.5" />
            <line x1="32" y1="28" x2="44" y2="28" stroke="#64748B" strokeWidth="1.5" />
          </g>
        )}
        {name === 'bag' && (
          <g>
            {/* Bag Body */}
            <rect x="12" y="18" width="36" height="34" rx="8" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            <rect x="18" y="26" width="24" height="20" rx="4" fill="#F472B6" stroke="#BE185D" strokeWidth="1.5" />
            {/* Handle */}
            <path d="M 22 18 C 22 8 38 8 38 18" fill="none" stroke="#BE185D" strokeWidth="3" strokeLinecap="round" />
            <circle cx="30" cy="36" r="2.5" fill="#FDF2F8" />
          </g>
        )}
        {name === 'clock' && (
          <g>
            <circle cx="30" cy="30" r="22" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
            <circle cx="30" cy="30" r="2" fill="#B45309" />
            <line x1="30" y1="30" x2="30" y2="16" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="30" y1="30" x2="40" y2="30" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
        {name === 'box' && (
          <g>
            <polygon points="30,10 50,18 30,26 10,18" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            <polygon points="10,18 30,26 30,48 10,40" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <polygon points="30,26 50,18 50,40 30,48" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
          </g>
        )}
        {name === 'kite' && (
          <g>
            <polygon points="30,8 50,28 30,48 10,28" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="2" />
            <line x1="30" y1="8" x2="30" y2="48" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="10" y1="28" x2="50" y2="28" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M 30 48 Q 24 54 28 60" fill="none" stroke="#F59E0B" strokeWidth="2" />
          </g>
        )}
      </svg>
      {label && (
        <span className="text-[10px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded-md border border-slate-200 shadow-xs font-gujarati -mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

// Directional Arrow & Distance Indicator
export function DirectionArrow({
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'near' | 'far'
  size = 40,
  color = '#10B981',
  label = '',
  animate = true,
}) {
  const getRotation = () => {
    switch (direction) {
      case 'up': return 0;
      case 'right': return 90;
      case 'down': return 180;
      case 'left': return 270;
      default: return 0;
    }
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${animate ? 'animate-bounce' : ''}`}>
      {direction === 'near' ? (
        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full shadow-xs">
          <span className="text-xs text-emerald-700 font-bold">➔ ➔</span>
          <span className="text-[10px] font-black text-emerald-900 font-gujarati">નજીક</span>
        </div>
      ) : direction === 'far' ? (
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-300 px-3 py-0.5 rounded-full shadow-xs">
          <span className="text-xs text-purple-700 font-bold">➔ - - - ➔</span>
          <span className="text-[10px] font-black text-purple-900 font-gujarati">દૂર</span>
        </div>
      ) : (
        <svg
          viewBox="0 0 40 40"
          width={size}
          height={size}
          transform={`rotate(${getRotation()})`}
          className="drop-shadow-sm"
        >
          <path
            d="M 20 6 L 32 20 L 25 20 L 25 34 L 15 34 L 15 20 L 8 20 Z"
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>
      )}
      {label && (
        <span className="text-[10px] font-black text-slate-800 bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs font-gujarati mt-0.5">
          {label}
        </span>
      )}
    </div>
  );
}

// Drop Target Zone Marker (Above / Below / Near / Far)
export function DropZoneMarker({
  position = 'above', // 'above' | 'below' | 'near' | 'far'
  active = false,
  label = '',
  onClick,
  children,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative min-w-[120px] min-h-[90px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-3 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${
        active
          ? 'border-emerald-500 bg-emerald-50/90 shadow-lg ring-4 ring-emerald-200 scale-105'
          : 'border-slate-300 bg-slate-50/70 hover:border-emerald-400 hover:bg-emerald-50/40'
      }`}
    >
      {children || (
        <>
          <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-1 text-slate-400">
            {position === 'above' && <DirectionArrow direction="up" size={18} animate={false} />}
            {position === 'below' && <DirectionArrow direction="down" size={18} animate={false} />}
            {position === 'near' && <DirectionArrow direction="near" size={18} animate={false} />}
            {position === 'far' && <DirectionArrow direction="far" size={18} animate={false} />}
          </div>
          <span className="text-xs font-black text-slate-700 font-gujarati text-center">
            {label || (position === 'above' ? 'ઉપર મૂકો' : position === 'below' ? 'નીચે મૂકો' : 'અહીં મૂકો')}
          </span>
        </>
      )}
    </div>
  );
}
