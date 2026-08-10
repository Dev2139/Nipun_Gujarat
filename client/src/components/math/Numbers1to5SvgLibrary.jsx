import React from 'react';

/**
 * 100% EMOJI-FREE Vector Illustration Library for Numbers 1 to 5 Module (M-03)
 * Includes illustrated apples, 3D math blocks, counting spheres, pencils,
 * number cards (૧-૫), interactive number lines, and operation baskets.
 */

// 1. Illustrated Red Apple
export function VectorApple({ size = 48, className = '', highlight = false, countBadge = null, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${highlight ? 'ring-4 ring-amber-400 bg-amber-50/80 rounded-2xl p-1 shadow-md animate-bounce' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 60 60" width="100%" height="100%" className="drop-shadow-sm">
        {/* Apple Stem */}
        <path d="M 30 16 C 30 8 36 6 38 4" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        {/* Apple Leaf */}
        <path d="M 32 10 C 38 8 44 11 42 16 C 36 17 33 14 32 10 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
        {/* Apple Body Gradient */}
        <defs>
          <radialGradient id="appleGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="55%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </radialGradient>
        </defs>
        <path
          d="M 30 16 C 22 14 10 20 10 34 C 10 46 22 54 30 52 C 38 54 50 46 50 34 C 50 20 38 14 30 16 Z"
          fill="url(#appleGrad)"
          stroke="#991B1B"
          strokeWidth="1.5"
        />
        {/* Highlight sheen */}
        <ellipse cx="22" cy="26" rx="4" ry="7" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 22 26)" />
      </svg>

      {countBadge !== null && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shadow-md font-mono border-2 border-white animate-scale-in">
          {countBadge}
        </span>
      )}
    </div>
  );
}

// 2. Illustrated 3D Math Cube Block
export function VectorBlock({ size = 48, color = '#3B82F6', className = '', highlight = false, countBadge = null, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${highlight ? 'ring-4 ring-amber-400 bg-amber-50 rounded-2xl p-1 shadow-md animate-bounce' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 60 60" width="100%" height="100%" className="drop-shadow-sm">
        {/* Top Face */}
        <polygon points="30,8 52,18 30,28 8,18" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.5" />
        {/* Left Face */}
        <polygon points="8,18 30,28 30,52 8,42" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
        {/* Right Face */}
        <polygon points="30,28 52,18 52,42 30,52" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
      </svg>
      {countBadge !== null && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shadow-md font-mono border-2 border-white animate-scale-in">
          {countBadge}
        </span>
      )}
    </div>
  );
}

// 3. Illustrated Counting Ball / Sphere
export function VectorBall({ size = 48, className = '', highlight = false, countBadge = null, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${highlight ? 'ring-4 ring-amber-400 bg-amber-50 rounded-2xl p-1 shadow-md animate-bounce' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 60 60" width="100%" height="100%" className="drop-shadow-sm">
        <defs>
          <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </radialGradient>
        </defs>
        <circle cx="30" cy="30" r="22" fill="url(#ballGrad)" stroke="#A16207" strokeWidth="1.5" />
        <ellipse cx="23" cy="22" rx="5" ry="3" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 23 22)" />
      </svg>
      {countBadge !== null && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center shadow-md font-mono border-2 border-white animate-scale-in">
          {countBadge}
        </span>
      )}
    </div>
  );
}

// 4. Illustrated Stationery Pencil
export function VectorPencil({ size = 50, className = '', countBadge = null, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 60 60" width="100%" height="100%" className="drop-shadow-sm">
        {/* Pencil Body */}
        <rect x="22" y="16" width="16" height="34" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        <line x1="27" y1="16" x2="27" y2="50" stroke="#D97706" strokeWidth="1.5" />
        <line x1="33" y1="16" x2="33" y2="50" stroke="#D97706" strokeWidth="1.5" />
        {/* Eraser */}
        <rect x="22" y="10" width="16" height="6" rx="2" fill="#EC4899" stroke="#BE185D" strokeWidth="1" />
        <rect x="22" y="14" width="16" height="2" fill="#94A3B8" />
        {/* Tip */}
        <polygon points="22,50 38,50 30,58" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
        <polygon points="27,55 33,55 30,58" fill="#1E293B" />
      </svg>
      {countBadge !== null && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center shadow-md font-mono border-2 border-white animate-scale-in">
          {countBadge}
        </span>
      )}
    </div>
  );
}

// 5. Generic Object Renderer by Type (apple | block | ball | pencil)
export function VectorObjectItem({ type = 'apple', size = 48, highlight = false, countBadge = null, onClick, className = '' }) {
  if (type === 'apple') return <VectorApple size={size} highlight={highlight} countBadge={countBadge} onClick={onClick} className={className} />;
  if (type === 'block') return <VectorBlock size={size} highlight={highlight} countBadge={countBadge} onClick={onClick} className={className} />;
  if (type === 'ball') return <VectorBall size={size} highlight={highlight} countBadge={countBadge} onClick={onClick} className={className} />;
  if (type === 'pencil') return <VectorPencil size={size} countBadge={countBadge} onClick={onClick} className={className} />;
  return <VectorApple size={size} highlight={highlight} countBadge={countBadge} onClick={onClick} className={className} />;
}

// 6. Rich Gujarati Number Card (૧, ૨, ૩, ૪, ૫)
export function NumberCard({
  numeral = '૧',
  gujaratiWord = 'એક',
  selected = false,
  correct = null, // true | false | null
  size = 'md', // 'sm' | 'md' | 'lg'
  onClick,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-12 h-16 text-xl',
    md: 'w-20 h-24 text-3xl',
    lg: 'w-28 h-36 text-5xl',
  };

  const getBorderColor = () => {
    if (correct === true) return 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200 text-emerald-950 scale-105';
    if (correct === false) return 'border-rose-400 bg-rose-50 text-rose-950 animate-shake';
    if (selected) return 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-200 text-indigo-950 scale-105';
    return 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-900 shadow-sm';
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border-2 flex flex-col items-center justify-center select-none transition-all duration-300 ${
        onClick ? 'cursor-pointer active:scale-95 hover:shadow-md' : ''
      } ${sizeClasses[size]} ${getBorderColor()} ${className}`}
    >
      <span className="font-black font-gujarati drop-shadow-xs leading-none">
        {numeral}
      </span>
      {gujaratiWord && (
        <span className="text-[10px] md:text-xs font-bold text-slate-600 font-gujarati mt-1 tracking-tight">
          {gujaratiWord}
        </span>
      )}
    </div>
  );
}

// 7. Interactive Number Line (૧ - ૨ - ૩ - ૪ - ૫) with Animated Jumping Character
export function InteractiveNumberLine({
  activePosition = 1, // 1 to 5
  startPosition = null,
  endPosition = null,
  highlightRange = [], // e.g. [2, 3, 4]
  direction = 'forward', // 'forward' | 'backward'
  onSelectPosition,
}) {
  const numbers = [
    { num: '૧', val: 1, word: 'એક' },
    { num: '૨', val: 2, word: 'બે' },
    { num: '૩', val: 3, word: 'ત્રણ' },
    { num: '૪', val: 4, word: 'ચાર' },
    { num: '૫', val: 5, word: 'પાંચ' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-sm space-y-6 select-none">
      <div className="flex items-center justify-between text-xs font-bold text-indigo-800 font-gujarati px-2">
        <span>સંખ્યા રેખા (Number Line)</span>
        <span>૧ થી ૫</span>
      </div>

      {/* Main Track with Hop Indicators */}
      <div className="relative pt-8 pb-4 px-4">
        {/* Horizontal Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 h-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400 rounded-full -translate-y-1/2" />

        {/* 5 Position Nodes */}
        <div className="relative flex items-center justify-between z-10">
          {numbers.map((item) => {
            const isCurrent = activePosition === item.val;
            const isStart = startPosition === item.val;
            const isEnd = endPosition === item.val;
            const inRange = highlightRange.includes(item.val);

            return (
              <div
                key={item.val}
                onClick={() => onSelectPosition && onSelectPosition(item.val)}
                className={`flex flex-col items-center cursor-pointer group transition-all duration-300 ${
                  isCurrent ? 'scale-110' : ''
                }`}
              >
                {/* Jumping Character Marker */}
                {isCurrent && (
                  <div className="absolute -top-7 animate-bounce flex flex-col items-center">
                    <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-300 shadow-xs font-gujarati">
                      અહીં છે
                    </span>
                    <div className="w-2 h-2 bg-indigo-600 rotate-45 -mt-1" />
                  </div>
                )}

                {/* Number Circle Node */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl font-gujarati transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 scale-110 shadow-indigo-300'
                      : inRange
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-200 scale-105'
                      : 'bg-white text-slate-800 border-2 border-slate-300 group-hover:border-indigo-400 group-hover:bg-indigo-50'
                  }`}
                >
                  {item.num}
                </div>

                {/* Word Label */}
                <span className={`text-xs font-bold mt-2 font-gujarati ${
                  isCurrent ? 'text-indigo-900 font-black' : 'text-slate-500'
                }`}>
                  {item.word}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 8. Operation Basket (For Combining / Taking Away Objects)
export function OperationBasket({
  title = 'સમૂહ',
  count = 0,
  objectType = 'apple',
  highlight = false,
  onClick,
  children,
  className = '',
}) {
  return (
    <div
      onClick={onClick}
      className={`relative min-w-[140px] min-h-[120px] rounded-3xl border-2 border-dashed p-4 flex flex-col items-center justify-between transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${
        highlight
          ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-4 ring-emerald-200'
          : 'border-slate-300 bg-slate-50/70 hover:border-indigo-300'
      } ${className}`}
    >
      <span className="text-xs font-black text-slate-700 font-gujarati text-center">
        {title} ({count})
      </span>

      <div className="flex items-center justify-center gap-1.5 flex-wrap my-auto p-2">
        {children || (
          Array.from({ length: count }).map((_, i) => (
            <VectorObjectItem key={i} type={objectType} size={36} countBadge={i + 1} />
          ))
        )}
      </div>
    </div>
  );
}
