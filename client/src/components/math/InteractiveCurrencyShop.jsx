import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { speakGujarati } from '../../utils/gujaratiAudio';
import { ShoppingBag, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function InteractiveCurrencyShop({
  items = [
    { name: 'પેન્સિલ (Pencil)', emoji: '✏️', price: 5 },
    { name: 'ચોકલેટ (Chocolate)', emoji: '🍫', price: 2 },
    { name: 'દડો (Football)', emoji: '⚽', price: 10 },
    { name: 'રમકડું કાર (Car)', emoji: '🚗', price: 20 },
  ]
}) {
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [paidCoins, setPaidCoins] = useState([]);
  const [success, setSuccess] = useState(false);

  const totalPaid = paidCoins.reduce((sum, c) => sum + c.val, 0);

  const handleAddMoney = (val, type, label) => {
    if (success) return;
    const newPaid = [...paidCoins, { val, type, label }];
    setPaidCoins(newPaid);
    const newTotal = totalPaid + val;
    speakGujarati(`${val} રૂપિયા ઉમેર્યા. કુલ ${newTotal} રૂપિયા થયા.`);

    if (newTotal === selectedItem.price) {
      setSuccess(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      setTimeout(() => {
        speakGujarati(`અભિનંદન! તમે ${selectedItem.price} રૂપિયા ચૂકવીને ${selectedItem.name.split(' ')[0]} ખરીદી લીધું!`);
      }, 700);
    }
  };

  const handleSelectItem = (it) => {
    setSelectedItem(it);
    setPaidCoins([]);
    setSuccess(false);
    speakGujarati(`${it.name.split(' ')[0]} ની કિંમત ${it.price} રૂપિયા છે. સિક્કા કે નોટ ચૂકવો.`);
  };

  const handleReset = () => {
    setPaidCoins([]);
    setSuccess(false);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-amber-50/60 p-6 rounded-3xl border-2 border-emerald-300 shadow-md space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-emerald-600 text-white font-bold text-lg shadow-sm">
            🏪
          </span>
          <div>
            <h3 className="font-extrabold text-base md:text-lg text-emerald-950 font-gujarati">
              રમકડાની દુકાન અને ચલણી નાણું (Currency Shop)
            </h3>
            <p className="text-xs text-emerald-800 font-gujarati">
              વસ્તુ પસંદ કરો અને સિક્કા ચૂકવીને ખરીદી કરો!
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 bg-white hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold font-gujarati flex items-center gap-1 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ફરીથી</span>
        </button>
      </div>

      {/* Item Store Shelf */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-gujarati">
        {items.map((it, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectItem(it)}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1.5 shadow-xs ${
              selectedItem.name === it.name
                ? 'border-emerald-600 bg-white ring-4 ring-emerald-200 scale-105'
                : 'border-slate-200 bg-white/70 hover:border-emerald-300 hover:bg-white'
            }`}
          >
            <span className="text-3xl sm:text-4xl">{it.emoji}</span>
            <div className="font-bold text-xs text-slate-800 truncate w-full">{it.name.split(' ')[0]}</div>
            <div className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-mono font-black text-xs">
              ₹{it.price}
            </div>
          </button>
        ))}
      </div>

      {/* Target & Cash Register */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 font-gujarati">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{selectedItem.emoji}</span>
          <div>
            <div className="text-xs font-bold text-slate-500">ખરીદવા માટે પસંદ કરેલ વસ્તુ:</div>
            <div className="font-black text-base text-slate-900">{selectedItem.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">કિંમત (Target)</div>
            <div className="text-xl font-black text-slate-800">₹{selectedItem.price}</div>
          </div>
          <div className="text-xl text-slate-400 font-bold">=</div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-emerald-700">ચૂકવેલા (Paid)</div>
            <div className={`text-2xl font-black ${totalPaid > selectedItem.price ? 'text-rose-600' : 'text-emerald-700'}`}>
              ₹{totalPaid}
            </div>
          </div>
        </div>
      </div>

      {/* Money Wallet / Coins & Notes */}
      <div className="space-y-2 font-gujarati text-xs">
        <span className="font-bold text-slate-700">સિક્કા અને નોટો પર ક્લિક કરી ચૂકવો:</span>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleAddMoney(1, 'coin', '₹૧')}
            className="p-3 bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 rounded-2xl font-black font-mono text-sm text-amber-900 shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <span>🪙</span>
            <span>₹૧</span>
          </button>

          <button
            onClick={() => handleAddMoney(2, 'coin', '₹૨')}
            className="p-3 bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 rounded-2xl font-black font-mono text-sm text-amber-900 shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <span>🪙</span>
            <span>₹૨</span>
          </button>

          <button
            onClick={() => handleAddMoney(5, 'coin', '₹૫')}
            className="p-3 bg-amber-200 hover:bg-amber-300 border-2 border-amber-500 rounded-2xl font-black font-mono text-sm text-amber-950 shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <span>🪙</span>
            <span>₹૫</span>
          </button>

          <button
            onClick={() => handleAddMoney(10, 'coin', '₹૧૦')}
            className="p-3 bg-yellow-300 hover:bg-yellow-400 border-2 border-yellow-600 rounded-2xl font-black font-mono text-sm text-amber-950 shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <span>🪙</span>
            <span>₹૧૦</span>
          </button>

          <button
            onClick={() => handleAddMoney(20, 'note', '₹૨૦')}
            className="p-3 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-400 rounded-2xl font-black font-mono text-sm text-emerald-900 shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <span>💵</span>
            <span>₹૨૦</span>
          </button>
        </div>
      </div>

      {/* Paid Coins Tray */}
      <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2 min-h-[48px]">
        <span className="text-xs font-bold text-slate-500 font-gujarati mr-1">ચૂકવેલા સિક્કા:</span>
        {paidCoins.length === 0 ? (
          <span className="text-xs text-slate-400 font-gujarati">હજુ સુધી કોઈ સિક્કો ચૂકવ્યો નથી</span>
        ) : (
          paidCoins.map((c, i) => (
            <span key={i} className="px-2.5 py-1 bg-white border border-amber-300 rounded-xl text-xs font-black font-mono text-amber-950 shadow-xs">
              {c.label}
            </span>
          ))
        )}
      </div>

      {/* Success Celebration */}
      {success && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-sm flex items-center gap-2 font-gujarati animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>ખૂબ સરસ! ખરીદી સફળ થઈ! તમે સાચું ચલણ ચૂકવ્યું ⭐</span>
        </div>
      )}

      {totalPaid > selectedItem.price && (
        <div className="p-3 bg-rose-100 border border-rose-300 rounded-2xl text-rose-900 font-bold text-xs flex items-center justify-between font-gujarati">
          <span>વધુ પૈસા ચૂકવાઈ ગયા છે! ₹{totalPaid - selectedItem.price} પરત કરવાના રહેશે.</span>
          <button onClick={handleReset} className="underline text-rose-800 font-bold">ફરીથી કરો</button>
        </div>
      )}
    </div>
  );
}
