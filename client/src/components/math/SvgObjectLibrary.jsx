import React from 'react';

/**
 * Reusable Illustrated SVG Object Library for Early Childhood Mathematics (FLN).
 * Renders real/illustrated vector objects across standardized dimensions:
 * - small: ~52px
 * - medium: ~88px
 * - large: ~136px
 * - xlarge: ~175px
 */

export const SIZE_DIMENSIONS = {
  small: { sizePx: 52, label: 'નાનું (Small)', scale: 0.6 },
  medium: { sizePx: 88, label: 'મધ્યમ (Medium)', scale: 0.85 },
  large: { sizePx: 136, label: 'મોટું (Large)', scale: 1.15 },
  xlarge: { sizePx: 175, label: 'સૌથી મોટું (Largest)', scale: 1.4 },
};

export const OBJECT_CATALOG = [
  { id: 'ball', nameGujarati: 'દડો (Ball)', color: '#3B82F6' },
  { id: 'apple', nameGujarati: 'સફરજન (Apple)', color: '#EF4444' },
  { id: 'pencil', nameGujarati: 'પેન્સિલ (Pencil)', color: '#F59E0B' },
  { id: 'bottle', nameGujarati: 'બોટલ (Bottle)', color: '#06B6D4' },
  { id: 'cup', nameGujarati: 'કપ (Cup)', color: '#8B5CF6' },
  { id: 'block', nameGujarati: 'બ્લૉક (Block)', color: '#10B981' },
  { id: 'tree', nameGujarati: 'ઝાડ (Tree)', color: '#15803D' },
  { id: 'elephant', nameGujarati: 'હાથી (Elephant)', color: '#64748B' },
  { id: 'mouse', nameGujarati: 'ઉંદર (Mouse)', color: '#94A3B8' },
  { id: 'car', nameGujarati: 'ગાડી (Car)', color: '#E11D48' },
  { id: 'watermelon', nameGujarati: 'તરબૂચ (Watermelon)', color: '#059669' },
  { id: 'flower', nameGujarati: 'ફૂલ (Flower)', color: '#EC4899' },
  { id: 'fish', nameGujarati: 'માછલી (Fish)', color: '#F97316' },
];

export default function SvgObject({
  name = 'ball',
  size = 'medium',
  className = '',
  highlight = false,
  onClick,
  showLabel = false,
  labelOverride = '',
  disabled = false,
  selected = false,
}) {
  const sizeConfig = typeof size === 'number'
    ? { sizePx: size, label: '' }
    : (SIZE_DIMENSIONS[size] || SIZE_DIMENSIONS.medium);

  const dimension = sizeConfig.sizePx;
  const objectType = (name || 'ball').toLowerCase();

  const renderSvgShape = () => {
    switch (objectType) {
      case 'ball':
      case 'દડો':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id={`ballGrad-${dimension}`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill={`url(#ballGrad-${dimension})`} stroke="#1E40AF" strokeWidth="3" />
            {/* Ball curved athletic stripes */}
            <path d="M 12 35 Q 50 20 88 35" fill="none" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
            <path d="M 12 65 Q 50 80 88 65" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
            <path d="M 35 12 Q 20 50 35 88" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <path d="M 65 12 Q 80 50 65 88" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            {/* Glossy light reflection */}
            <ellipse cx="36" cy="30" rx="12" ry="6" transform="rotate(-30 36 30)" fill="#FFFFFF" opacity="0.5" />
          </svg>
        );

      case 'apple':
      case 'સફરજન':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id={`appleGrad-${dimension}`} cx="35%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="60%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </radialGradient>
            </defs>
            {/* Apple Stem */}
            <path d="M 50 24 C 52 14 62 10 65 8" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            {/* Apple Leaf */}
            <path d="M 53 18 C 65 14 74 18 72 26 C 62 27 55 24 53 18 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            {/* Apple Body */}
            <path
              d="M 50 28 C 36 20 12 28 14 56 C 16 78 36 92 50 90 C 64 92 84 78 86 56 C 88 28 64 20 50 28 Z"
              fill={`url(#appleGrad-${dimension})`}
              stroke="#7F1D1D"
              strokeWidth="2.5"
            />
            {/* Apple Shine */}
            <ellipse cx="32" cy="42" rx="7" ry="14" transform="rotate(-25 32 42)" fill="#FFFFFF" opacity="0.4" />
          </svg>
        );

      case 'pencil':
      case 'પેન્સિલ':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            <g transform="rotate(-40 50 50)">
              {/* Eraser */}
              <rect x="40" y="8" width="20" height="14" rx="4" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
              {/* Metal collar */}
              <rect x="39" y="20" width="22" height="8" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
              <line x1="40" y1="24" x2="60" y2="24" stroke="#94A3B8" strokeWidth="1" />
              {/* Pencil Body */}
              <rect x="40" y="28" width="20" height="46" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              <line x1="47" y1="28" x2="47" y2="74" stroke="#D97706" strokeWidth="2" />
              <line x1="53" y1="28" x2="53" y2="74" stroke="#D97706" strokeWidth="2" />
              {/* Wood cone */}
              <polygon points="40,74 60,74 50,92" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
              {/* Graphite Tip */}
              <polygon points="46,84 54,84 50,92" fill="#1E293B" />
            </g>
          </svg>
        );

      case 'bottle':
      case 'બોટલ':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <linearGradient id={`bottleGrad-${dimension}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>
            </defs>
            {/* Cap */}
            <rect x="41" y="8" width="18" height="12" rx="3" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            {/* Neck */}
            <rect x="44" y="20" width="12" height="10" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
            {/* Body */}
            <path
              d="M 44 30 C 32 34 30 46 30 52 L 30 84 C 30 89 36 92 50 92 C 64 92 70 89 70 84 L 70 52 C 70 46 68 34 56 30 Z"
              fill={`url(#bottleGrad-${dimension})`}
              stroke="#075985"
              strokeWidth="2.5"
            />
            {/* Grip Rings */}
            <line x1="33" y1="58" x2="67" y2="58" stroke="#E0F2FE" strokeWidth="2" opacity="0.6" />
            <line x1="33" y1="66" x2="67" y2="66" stroke="#E0F2FE" strokeWidth="2" opacity="0.6" />
            <line x1="33" y1="74" x2="67" y2="74" stroke="#E0F2FE" strokeWidth="2" opacity="0.6" />
            {/* Glass reflection */}
            <path d="M 36 44 L 36 82" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          </svg>
        );

      case 'cup':
      case 'કપ':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <linearGradient id={`cupGrad-${dimension}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="60%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>
            </defs>
            {/* Handle */}
            <path d="M 68 38 C 88 38 88 66 68 66" fill="none" stroke="#6D28D9" strokeWidth="8" strokeLinecap="round" />
            <path d="M 68 38 C 84 38 84 66 68 66" fill="none" stroke="#DDD6FE" strokeWidth="3" strokeLinecap="round" />
            {/* Cup Body */}
            <path
              d="M 22 28 L 28 80 C 29 86 36 90 50 90 C 64 90 71 86 72 80 L 78 28 Z"
              fill={`url(#cupGrad-${dimension})`}
              stroke="#4C1D95"
              strokeWidth="2.5"
            />
            {/* Decorative Stars */}
            <circle cx="44" cy="54" r="5" fill="#FDE047" />
            <circle cx="56" cy="54" r="5" fill="#FDE047" />
            {/* Steam */}
            <path d="M 38 18 Q 42 12 38 6" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <path d="M 50 18 Q 54 10 50 4" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <path d="M 62 18 Q 66 12 62 6" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          </svg>
        );

      case 'block':
      case 'બ્લૉક':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            {/* 3D Toy Cube */}
            {/* Top Face */}
            <polygon points="50,14 84,30 50,46 16,30" fill="#34D399" stroke="#065F46" strokeWidth="2" />
            {/* Left Face */}
            <polygon points="16,30 50,46 50,86 16,70" fill="#10B981" stroke="#065F46" strokeWidth="2" />
            {/* Right Face */}
            <polygon points="50,46 84,30 84,70 50,86" fill="#059669" stroke="#065F46" strokeWidth="2" />
            {/* Alphabet 'A' on front */}
            <text x="33" y="66" fill="#FFFFFF" fontSize="24" fontWeight="bold" fontFamily="Arial" transform="skewY(18)">A</text>
          </svg>
        );

      case 'tree':
      case 'ઝાડ':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <radialGradient id={`treeGrad-${dimension}`} cx="40%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="60%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#14532D" />
              </radialGradient>
            </defs>
            {/* Trunk */}
            <rect x="43" y="60" width="14" height="32" rx="4" fill="#92400E" stroke="#78350F" strokeWidth="2" />
            <line x1="47" y1="66" x2="47" y2="86" stroke="#78350F" strokeWidth="1.5" />
            {/* Foliage Clouds */}
            <circle cx="50" cy="34" r="26" fill={`url(#treeGrad-${dimension})`} stroke="#14532D" strokeWidth="2" />
            <circle cx="30" cy="46" r="20" fill={`url(#treeGrad-${dimension})`} stroke="#14532D" strokeWidth="2" />
            <circle cx="70" cy="46" r="20" fill={`url(#treeGrad-${dimension})`} stroke="#14532D" strokeWidth="2" />
            <circle cx="40" cy="54" r="18" fill={`url(#treeGrad-${dimension})`} stroke="#14532D" strokeWidth="2" />
            <circle cx="60" cy="54" r="18" fill={`url(#treeGrad-${dimension})`} stroke="#14532D" strokeWidth="2" />
            {/* Little fruits / apples */}
            <circle cx="36" cy="38" r="3.5" fill="#EF4444" />
            <circle cx="62" cy="36" r="3.5" fill="#EF4444" />
            <circle cx="48" cy="48" r="3.5" fill="#EF4444" />
          </svg>
        );

      case 'elephant':
      case 'હાથી':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            {/* Elephant Body */}
            <ellipse cx="56" cy="58" rx="28" ry="24" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
            {/* Legs */}
            <rect x="36" y="68" width="10" height="24" rx="4" fill="#64748B" stroke="#334155" strokeWidth="2" />
            <rect x="52" y="68" width="10" height="24" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <rect x="68" y="68" width="10" height="24" rx="4" fill="#64748B" stroke="#334155" strokeWidth="2" />
            {/* Tail */}
            <path d="M 82 56 Q 90 64 88 74" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            {/* Head */}
            <circle cx="34" cy="46" r="18" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
            {/* Trunk */}
            <path d="M 22 48 C 14 56 12 70 20 74 C 24 76 26 70 22 66" fill="none" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            {/* Ear */}
            <ellipse cx="44" cy="46" rx="12" ry="16" fill="#FBCFE8" stroke="#475569" strokeWidth="2" />
            {/* Eye */}
            <circle cx="28" cy="42" r="3" fill="#0F172A" />
            <circle cx="27" cy="41" r="1" fill="#FFFFFF" />
            {/* Tusk */}
            <path d="M 24 54 Q 18 58 14 54" fill="none" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 'mouse':
      case 'ઉંદર':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            {/* Mouse Tail */}
            <path d="M 80 62 Q 94 48 88 32" fill="none" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
            {/* Mouse Body */}
            <ellipse cx="50" cy="62" rx="26" ry="18" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
            {/* Snout Head */}
            <polygon points="20,62 44,48 44,72" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            {/* Ears */}
            <circle cx="44" cy="42" r="12" fill="#FBCFE8" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="44" cy="42" r="7" fill="#F472B6" />
            {/* Eye */}
            <circle cx="32" cy="56" r="2.5" fill="#0F172A" />
            {/* Pink Nose */}
            <circle cx="18" cy="62" r="3" fill="#EC4899" />
            {/* Whiskers */}
            <line x1="22" y1="60" x2="8" y2="54" stroke="#64748B" strokeWidth="1.5" />
            <line x1="22" y1="64" x2="8" y2="70" stroke="#64748B" strokeWidth="1.5" />
          </svg>
        );

      case 'watermelon':
      case 'તરબૂચ':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            {/* Outer Rind */}
            <path d="M 12 40 A 42 42 0 0 0 88 40 Z" fill="#15803D" stroke="#14532D" strokeWidth="2.5" />
            {/* White inner rind */}
            <path d="M 16 40 A 38 38 0 0 0 84 40 Z" fill="#DCFCE7" />
            {/* Red Flesh */}
            <path d="M 20 40 A 34 34 0 0 0 80 40 Z" fill="#EF4444" />
            {/* Seeds */}
            <ellipse cx="36" cy="50" rx="2" ry="3.5" fill="#1E293B" transform="rotate(-20 36 50)" />
            <ellipse cx="50" cy="58" rx="2" ry="3.5" fill="#1E293B" />
            <ellipse cx="64" cy="50" rx="2" ry="3.5" fill="#1E293B" transform="rotate(20 64 50)" />
            <ellipse cx="44" cy="46" rx="1.5" ry="3" fill="#1E293B" />
            <ellipse cx="56" cy="46" rx="1.5" ry="3" fill="#1E293B" />
          </svg>
        );

      case 'car':
      case 'ગાડી':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            {/* Car Cabin */}
            <path d="M 26 50 L 36 30 L 64 30 L 74 50 Z" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />
            {/* Windows */}
            <polygon points="38,34 48,34 48,48 30,48" fill="#E0F2FE" />
            <polygon points="52,34 62,34 70,48 52,48" fill="#E0F2FE" />
            {/* Car Body */}
            <rect x="14" y="48" width="72" height="24" rx="8" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
            {/* Headlights */}
            <circle cx="18" cy="56" r="3.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <circle cx="82" cy="56" r="3.5" fill="#DC2626" />
            {/* Wheels */}
            <circle cx="32" cy="72" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="32" cy="72" r="4" fill="#94A3B8" />
            <circle cx="68" cy="72" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="68" cy="72" r="4" fill="#94A3B8" />
          </svg>
        );

      case 'flower':
      case 'ફૂલ':
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            {/* Stem */}
            <path d="M 50 60 Q 48 76 50 92" fill="none" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M 50 74 C 62 70 66 78 50 82 Z" fill="#22C55E" />
            {/* Petals */}
            <circle cx="50" cy="30" r="14" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
            <circle cx="70" cy="50" r="14" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
            <circle cx="50" cy="70" r="14" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
            <circle cx="30" cy="50" r="14" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
            {/* Center */}
            <circle cx="50" cy="50" r="13" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          </svg>
        );

      case 'fish':
      case 'માછલી':
      default:
        return (
          <svg viewBox="0 0 100 100" width={dimension} height={dimension} className="drop-shadow-md">
            <defs>
              <linearGradient id={`fishGrad-${dimension}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
            {/* Tail Fin */}
            <polygon points="76,50 94,32 90,50 94,68" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            {/* Body */}
            <ellipse cx="48" cy="50" rx="32" ry="20" fill={`url(#fishGrad-${dimension})`} stroke="#C2410C" strokeWidth="2" />
            {/* White clownfish stripes */}
            <path d="M 38 32 Q 42 50 38 68" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
            <path d="M 58 34 Q 62 50 58 66" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
            {/* Eye */}
            <circle cx="26" cy="46" r="3.5" fill="#0F172A" />
            <circle cx="25" cy="45" r="1" fill="#FFFFFF" />
            {/* Fin */}
            <polygon points="46,50 56,58 46,62" fill="#FDBA74" stroke="#EA580C" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  const isClickable = Boolean(onClick) && !disabled;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`relative inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        isClickable
          ? 'cursor-pointer active:scale-95 hover:scale-105 group'
          : disabled
          ? 'opacity-60 cursor-not-allowed'
          : ''
      } ${
        selected
          ? 'ring-4 ring-emerald-400 bg-emerald-50/80 rounded-3xl p-2.5 shadow-lg shadow-emerald-100 scale-105'
          : highlight
          ? 'ring-4 ring-amber-400 bg-amber-50/80 rounded-3xl p-2.5 shadow-lg shadow-amber-100 animate-pulse'
          : 'p-1.5'
      } ${className}`}
      style={{ minWidth: dimension + 16, minHeight: dimension + 16 }}
    >
      <div className="flex items-center justify-center transition-transform duration-300">
        {renderSvgShape()}
      </div>

      {(showLabel || labelOverride) && (
        <span className="mt-1 text-[11px] font-black text-slate-700 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs font-gujarati">
          {labelOverride || sizeConfig.label}
        </span>
      )}
    </div>
  );
}
