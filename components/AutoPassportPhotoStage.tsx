'use client';

import React, {useEffect, useState} from 'react';
import {motion} from 'motion/react';
import {
  Camera,
  CheckCircle2,
  Mic,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {LanguageCode} from '@/lib/types';
import DemoPrototypeNote from './DemoPrototypeNote';

interface AutoPassportPhotoStageProps {
  language: LanguageCode;
  applicantName: string;
  applicantNameGu: string;
  onComplete: () => void;
}

export default function AutoPassportPhotoStage({
  language,
  applicantName,
  applicantNameGu,
  onComplete,
}: AutoPassportPhotoStageProps) {
  const [countdown, setCountdown] = useState<number>(3);
  const [captured, setCaptured] = useState<boolean>(false);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  useEffect(() => {
    if (captured) return;

    if (countdown > 0) {
      const t = window.setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 750);
      return () => window.clearTimeout(t);
    }

    // Trigger automatic AI shutter flash and capture
    const flashOn = window.setTimeout(() => {
      setFlashActive(true);
    }, 50);

    const flashOff = window.setTimeout(() => {
      setFlashActive(false);
      setCaptured(true);
    }, 320);

    return () => {
      window.clearTimeout(flashOn);
      window.clearTimeout(flashOff);
    };
  }, [countdown, captured]);

  const handleRetake = () => {
    setCaptured(false);
    setCountdown(3);
  };

  return (
    <div className="uidai-card rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3EAF5]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#123B63]">
            <span>TOP 5MP WDR FACE-CAM · AUTOMATIC AI CAPTURE</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#123B63] mt-1">
            {language === 'gu'
              ? 'ઓટોમેટિક પાસપોર્ટ સાઈઝ ફોટો અને વોઈસ સંમતિ'
              : language === 'hi'
                ? 'ऑटोमैटिक पासपोर्ट साइज फोटो और वॉयस सहमति'
                : 'Automatic AI Passport-Size Photo & Voice Consent'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {language === 'gu'
              ? 'કિઓસ્કનો ઉપરનો કેમેરા આપમેળે તમારો ફોટો પાડીને પાસપોર્ટ સાઈઝ (35×45mm) માં સેટ કરે છે.'
              : language === 'hi'
                ? 'कियोस्क का टॉप कैमरा स्वतः पासपोर्ट फोटो खींचकर बैकग्राउंड साफ़ करता है।'
                : 'Top kiosk camera automatically centers your face, captures the portrait, and formats a clean 35×45mm passport photo.'}
          </p>
        </div>

        {captured && (
          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#E1ECFA] rounded-xl cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Auto Photo</span>
          </button>
        )}
      </div>

      <DemoPrototypeNote language={language} context="photo" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Live Top Face-Cam Viewfinder */}
        <div className="lg:col-span-6">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#061233] to-[#0B1E54] border border-[#1E3A8A] p-5 flex flex-col items-center justify-center min-h-[320px] overflow-hidden">
            {/* Shutter Flash Overlay */}
            {flashActive && (
              <div className="absolute inset-0 bg-white z-30 pointer-events-none" />
            )}

            <div className="w-full flex items-center justify-between text-[11px] font-mono text-sky-200 mb-3">
              <span>WDR FACE-CAM · LIVENESS ACTIVE</span>
              <span className={captured ? 'text-emerald-300 font-bold' : 'text-sky-300'}>
                {captured ? 'CAPTURED (99.4%)' : `AUTO-CAPTURE IN ${countdown}s`}
              </span>
            </div>

            {/* Simulated Viewfinder Frame with Oval Alignment */}
            <div className="relative w-56 h-64 rounded-2xl bg-[#F6F8FA] border-2 border-[#00A8E8] flex flex-col items-center justify-end overflow-hidden shadow-inner">
              {/* Oval Face Alignment Guide */}
              {!captured && (
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#123B63]/60 pointer-events-none" />
              )}

              {/* Crisp Portrait Illustration */}
              <svg
                viewBox="0 0 180 210"
                className="w-48 h-56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Clean Passport Background */}
                <rect width="180" height="210" fill={captured ? '#FFFFFF' : '#E8F1FC'} />
                {/* Shoulders / Kurta */}
                <path
                  d="M24 210C24 162 54 146 90 146C126 146 156 162 156 210"
                  fill="#123B63"
                />
                <path d="M74 146L90 174L106 146" fill="#FFFFFF" />
                {/* Neck */}
                <rect x="77" y="124" width="26" height="26" rx="8" fill="#D99B72" />
                {/* Face */}
                <ellipse cx="90" cy="92" rx="34" ry="42" fill="#E3AA82" />
                {/* Hair */}
                <path
                  d="M56 84C56 54 72 44 90 44C108 44 124 54 124 84C116 68 104 62 90 62C76 62 64 68 56 84Z"
                  fill="#1E293B"
                />
                {/* Eyes & Smile */}
                <circle cx="77" cy="88" r="3.2" fill="#0F172A" />
                <circle cx="103" cy="88" r="3.2" fill="#0F172A" />
                <path
                  d="M78 108Q90 117 102 108"
                  stroke="#7C2D12"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>

              {/* Countdown Overlay */}
              {!captured && (
                <motion.div
                  key={countdown}
                  initial={{scale: 1.4, opacity: 0.4}}
                  animate={{scale: 1, opacity: 1}}
                  className="absolute top-3 right-3 h-10 w-10 rounded-full bg-[#123B63] text-white font-mono text-lg font-extrabold flex items-center justify-center shadow-md"
                >
                  {countdown > 0 ? countdown : <Camera className="h-5 w-5" />}
                </motion.div>
              )}
            </div>

            <div className="mt-3 text-xs text-sky-200 font-mono">
              {captured
                ? 'Background Auto-Cleaned · 35×45mm Official Spec'
                : 'Look straight into the top camera...'}
            </div>
          </div>
        </div>

        {/* Right: AI Passport Photo Result & Voice Self-Declaration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#123B63]">
                AUTO-GENERATED PASSPORT PHOTO
              </span>
              {captured ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#046A38]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Ready for Certificate</span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-[#F0A900]">
                  Capturing...
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 bg-white border border-[#D9DEE5] rounded-xl p-4">
              <div className="h-24 w-20 rounded-lg border-2 border-[#123B63] bg-white overflow-hidden shrink-0 flex items-end justify-center">
                {captured ? (
                  <svg viewBox="0 0 180 210" className="w-full h-full" fill="none">
                    <rect width="180" height="210" fill="#FFFFFF" />
                    <path
                      d="M24 210C24 162 54 146 90 146C126 146 156 162 156 210"
                      fill="#123B63"
                    />
                    <path d="M74 146L90 174L106 146" fill="#FFFFFF" />
                    <rect x="77" y="124" width="26" height="26" rx="8" fill="#D99B72" />
                    <ellipse cx="90" cy="92" rx="34" ry="42" fill="#E3AA82" />
                    <path
                      d="M56 84C56 54 72 44 90 44C108 44 124 54 124 84C116 68 104 62 90 62C76 62 64 68 56 84Z"
                      fill="#1E293B"
                    />
                    <circle cx="77" cy="88" r="3.2" fill="#0F172A" />
                    <circle cx="103" cy="88" r="3.2" fill="#0F172A" />
                    <path
                      d="M78 108Q90 117 102 108"
                      stroke="#7C2D12"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300">
                    <Camera className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-sm text-[#123B63]">
                  {applicantName}
                </div>
                <div className="text-slate-600">{applicantNameGu}</div>
                <div className="font-mono text-[11px] text-[#046A38] font-bold pt-1">
                  35×45mm · 300 DPI · Aadhaar Face Match 99.4%
                </div>
              </div>
            </div>

            {/* Voice Self-Declaration Box */}
            <div className="bg-white border border-[#D9DEE5] rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#123B63]">
                <Mic className="h-4 w-4 text-[#D32828]" />
                <span>
                  {language === 'gu'
                    ? 'અવાજ દ્વારા સ્વ-ઘોષણા રેકોર્ડ થઈ'
                    : language === 'hi'
                      ? 'वॉयस स्व-घोषणा रिकॉर्ड हुई'
                      : 'Voice Self-Declaration Recorded'}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {language === 'gu'
                  ? `“હું ${applicantNameGu} જાહેર કરું છું કે મેં આપેલી તમામ માહિતી અને દસ્તાવેજો સાચા છે.”`
                  : language === 'hi'
                    ? `“मैं ${applicantNameGu} घोषित करता/करती हूँ कि मेरे द्वारा दी गई सभी जानकारी और दस्तावेज़ सत्य हैं।”`
                    : `“I, ${applicantName}, hereby declare that all details and documents submitted are true and authentic.”`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onComplete}
            disabled={!captured}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#123B63] to-[#123B63] hover:from-[#123B63] hover:to-[#D32828] disabled:opacity-50 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-sky-300" />
            <span>
              {language === 'gu'
                ? 'આગળ વધો: છેલ્લે વિગતો ચકાસો'
                : language === 'hi'
                  ? 'आगे बढ़ें: अंतिम विवरण जाँचें'
                  : 'Next: Final Verification & Review'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
