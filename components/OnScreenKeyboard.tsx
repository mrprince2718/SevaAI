'use client';

import React, {useState} from 'react';
import {Delete, Keyboard, CornerDownLeft, Space} from 'lucide-react';

export type KeyboardLayout = 'en' | 'gu' | 'hi';

interface OnScreenKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onDone?: () => void;
  targetLabel: string;
  preferredLayout?: KeyboardLayout;
}

const EN_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '/', '₹', ','],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '-'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.'],
];

const GU_QUICK_WORDS = [
  'રમેશભાઈ',
  'કનુભાઈ',
  'પટેલ',
  'કુંડળ',
  'સાણંદ',
  'અમદાવાદ',
  'મહેશભાઈ',
  'મીનાબેન',
  'શ્રી',
  'બેન',
];

const GU_CHARS = [
  'અ', 'આ', 'ઇ', 'ઈ', 'ઉ', 'ઊ', 'એ', 'ઐ', 'ઓ', 'ઔ',
  'ક', 'ખ', 'ગ', 'ઘ', 'ચ', 'છ', 'જ', 'ઝ', 'ટ', 'ઠ', 'ડ', 'ઢ', 'ણ',
  'ત', 'થ', 'દ', 'ધ', 'ન', 'પ', 'ફ', 'બ', 'ભ', 'મ',
  'ય', 'ર', 'લ', 'વ', 'શ', 'ષ', 'સ', 'હ', 'ળ', 'ક્ષ', 'જ્ઞ',
  'ા', 'િ', 'ી', 'ુ', 'ૂ', 'ે', 'ૈ', 'ો', 'ૌ', 'ં', '્',
  '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯', '૦', '/',
];

const HI_QUICK_WORDS = [
  'रमेशभाई',
  'कनुभाई',
  'पटेल',
  'कुंडल',
  'साणंद',
  'अहमदाबाद',
  'महेशभाई',
  'मीनाबेन',
  'श्री',
  'कुमार',
];

const HI_CHARS = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ',
  'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'ण',
  'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म',
  'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ',
  'ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ं', '्',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '/',
];

export default function OnScreenKeyboard({
  onKeyPress,
  onBackspace,
  onClear,
  onDone,
  targetLabel,
  preferredLayout = 'en',
}: OnScreenKeyboardProps) {
  const [manualOverride, setManualOverride] = useState<{
    base: KeyboardLayout;
    chosen: KeyboardLayout;
  } | null>(null);
  const [isShift, setIsShift] = useState(true);

  const layout =
    manualOverride && manualOverride.base === preferredLayout
      ? manualOverride.chosen
      : preferredLayout;

  const selectLayout = (next: KeyboardLayout) => {
    setManualOverride({base: preferredLayout, chosen: next});
  };

  return (
    <div className="rounded-2xl bg-[#F6F8FA] border-2 border-[#D9DEE5] p-3 sm:p-4 space-y-2.5 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#D9DEE5]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#123B63]">
          <Keyboard className="h-4 w-4 text-[#123B63] shrink-0" />
          <span>કીબોર્ડ · {targetLabel}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => selectLayout('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
              layout === 'en'
                ? 'bg-[#123B63] text-white'
                : 'bg-white text-[#123B63] border border-[#D9DEE5]'
            }`}
          >
            English (ABC)
          </button>
          <button
            type="button"
            onClick={() => selectLayout('gu')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
              layout === 'gu'
                ? 'bg-[#123B63] text-white'
                : 'bg-white text-[#123B63] border border-[#D9DEE5]'
            }`}
          >
            ગુજરાતી (કખગ)
          </button>
          <button
            type="button"
            onClick={() => selectLayout('hi')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
              layout === 'hi'
                ? 'bg-[#123B63] text-white'
                : 'bg-white text-[#123B63] border border-[#D9DEE5]'
            }`}
          >
            हिन्दी (कखग)
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-2.5 py-1 text-xs font-bold text-[#B3261E] bg-white border border-red-200 hover:bg-red-50 rounded-lg cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {layout === 'en' ? (
        <div className="space-y-1.5">
          {EN_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 flex-wrap">
              {row.map((key) => {
                const char =
                  /^[A-Z]$/.test(key) && !isShift ? key.toLowerCase() : key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onKeyPress(char)}
                    className="min-w-[32px] sm:min-w-[40px] h-10 px-2 rounded-lg bg-white border border-[#D9DEE5] text-sm font-bold text-[#123B63] hover:bg-[#123B63] hover:text-white active:scale-95 shadow-2xs transition-all cursor-pointer"
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {(layout === 'gu' ? GU_QUICK_WORDS : HI_QUICK_WORDS).map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => onKeyPress(`${word} `)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#123B63]/35 text-xs font-bold text-[#123B63] hover:bg-[#123B63] hover:text-white cursor-pointer"
              >
                {word}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {(layout === 'gu' ? GU_CHARS : HI_CHARS).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => onKeyPress(ch)}
                className="min-w-[32px] h-9 px-2 rounded-lg bg-white border border-[#D9DEE5] text-sm font-bold text-[#123B63] hover:bg-[#123B63] hover:text-white cursor-pointer"
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 pt-1">
        {layout === 'en' && (
          <button
            type="button"
            onClick={() => setIsShift((s) => !s)}
            className={`px-3.5 h-10 rounded-lg text-xs font-bold border cursor-pointer ${
              isShift
                ? 'bg-[#123B63] text-white border-[#123B63]'
                : 'bg-white text-[#123B63] border-[#D9DEE5]'
            }`}
          >
            {isShift ? 'CAPS ON' : 'caps'}
          </button>
        )}
        <button
          type="button"
          onClick={() => onKeyPress(' ')}
          className="flex-1 max-w-[220px] h-10 rounded-lg bg-white border border-[#D9DEE5] text-xs font-bold text-[#123B63] hover:bg-[#E1ECFA] inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Space className="h-4 w-4" />
          <span>SPACE</span>
        </button>
        <button
          type="button"
          onClick={onBackspace}
          className="px-4 h-10 rounded-lg bg-white border border-[#D9DEE5] text-xs font-bold text-[#123B63] hover:bg-red-50 hover:text-[#B3261E] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Delete className="h-4 w-4" />
          <span>Backspace</span>
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="px-4 h-10 rounded-lg bg-[#046A38] text-white text-xs font-bold hover:bg-[#0f6e06] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <CornerDownLeft className="h-4 w-4" />
            <span>Done</span>
          </button>
        )}
      </div>
    </div>
  );
}
