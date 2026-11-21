'use client';

import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ScanLine,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {LanguageCode, OcrCrossCheckDoc} from '@/lib/types';
import DemoPrototypeNote from './DemoPrototypeNote';

interface DocScanAnimationPlayerProps {
  documents: OcrCrossCheckDoc[]; // First 5 physical documents
  language: LanguageCode;
  autoPlay?: boolean;
  onAllComplete: () => void;
}

type AnimationSubPhase = 'placing' | 'scanning' | 'extracted';

export default function DocScanAnimationPlayer({
  documents,
  language,
  autoPlay = true,
  onAllComplete,
}: DocScanAnimationPlayerProps) {
  const physicalDocs = documents.slice(0, 5);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [subPhase, setSubPhase] = useState<AnimationSubPhase>('placing');
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const allDone = completedIds.length >= physicalDocs.length;
  const activeDoc = physicalDocs[currentIdx] || physicalDocs[0];

  useEffect(() => {
    if (!isPlaying || allDone) return;

    const placingTimer = window.setTimeout(() => {
      setSubPhase('scanning');
    }, 650);

    const scanTimer = window.setTimeout(() => {
      setSubPhase('extracted');
      setCompletedIds((prev) =>
        prev.includes(activeDoc.id) ? prev : [...prev, activeDoc.id]
      );
    }, 1750);

    const nextTimer = window.setTimeout(() => {
      if (currentIdx < physicalDocs.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setSubPhase('placing');
      } else {
        setIsPlaying(false);
      }
    }, 2550);

    return () => {
      window.clearTimeout(placingTimer);
      window.clearTimeout(scanTimer);
      window.clearTimeout(nextTimer);
    };
  }, [isPlaying, currentIdx, activeDoc.id, physicalDocs.length, allDone]);

  const handleReplayAll = () => {
    setCompletedIds([]);
    setCurrentIdx(0);
    setSubPhase('placing');
    setIsPlaying(true);
  };

  const handleSelectDoc = (idx: number) => {
    setCurrentIdx(idx);
    setSubPhase('placing');
    setIsPlaying(true);
  };

  const getDocTitle = (doc: OcrCrossCheckDoc) => {
    if (language === 'gu') return doc.titleGu;
    if (language === 'hi') return doc.titleHi;
    return doc.titleEn;
  };

  const progressPercent = Math.round(
    ((completedIds.length + (subPhase === 'scanning' ? 0.5 : 0)) /
      physicalDocs.length) *
      100
  );

  return (
    <div className="uidai-card rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Theater Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3EAF5]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#123B63]">
            <span>PROTOTYPE HARDWARE SCAN VIDEO SIMULATION</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#046A38]">No Physical Upload Required</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#123B63] mt-1">
            {language === 'gu'
              ? 'ડોક્યુમેન્ટ સ્કેન એનિમેશન — નીચેની સ્કેન પ્લેટ'
              : language === 'hi'
                ? 'दस्तावेज़ स्कैन एनीमेशन — बॉटम स्कैन प्लेट'
                : 'Animated Document Scan Simulation — Bottom Hardware Platen'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {language === 'gu'
              ? 'અસલી હાર્ડવેર આવશે ત્યારે આ જ રીતે દસ્તાવેજો ઓટોમેટિક લેસર સ્કેન થશે.'
              : language === 'hi'
                ? 'असली हार्डवेयर आने पर इसी तरह दस्तावेज़ स्वतः लेज़र स्कैन होंगे।'
                : 'Demonstrating how the physical kiosk slides, laser-captures, and OCR-verifies each paper document.'}
          </p>
        </div>

        {/* Video Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            disabled={allDone}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#E1ECFA] disabled:opacity-50 rounded-xl cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Resume</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReplayAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#E1ECFA] rounded-xl cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Replay Video</span>
          </button>
        </div>
      </div>

      <DemoPrototypeNote language={language} context="scan" />

      {/* Main Split: Left Video Animation Stage + Right 5-Doc Reel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Video Animation Screen */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#061233] to-[#0B1E54] border border-[#1E3A8A] p-5 text-white relative overflow-hidden min-h-[380px]">
          {/* Video Top Overlay */}
          <div className="flex items-center justify-between text-[11px] font-mono text-sky-200 z-10">
            <span>
              Kiosk Cam Feed · Doc {currentIdx + 1} / {physicalDocs.length}
            </span>
            <span className="text-sky-300 font-bold">
              {subPhase === 'placing'
                ? 'STEP 1: PLACING ON LED TRAY'
                : subPhase === 'scanning'
                  ? 'STEP 2: 16MP LASER CAPTURE'
                  : 'STEP 3: OCR MATCHED 100%'}
            </span>
          </div>

          {/* Animated Hardware Platen Surface */}
          <div className="relative my-4 flex-1 rounded-xl border-2 border-dashed border-sky-400/40 bg-[#0A163D] flex items-center justify-center p-4 overflow-hidden">
            {/* Optical Corner Guides */}
            <div className="absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-[#00A8E8]" />
            <div className="absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-[#00A8E8]" />
            <div className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-[#00A8E8]" />
            <div className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-[#00A8E8]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeDoc.id}-${currentIdx}`}
                initial={{y: 90, opacity: 0, scale: 0.92}}
                animate={{y: 0, opacity: 1, scale: 1}}
                exit={{y: -40, opacity: 0, scale: 0.96}}
                transition={{duration: 0.45, ease: 'easeOut'}}
                className="relative w-full max-w-md bg-white text-[#0F172A] rounded-xl p-4 sm:p-5 shadow-2xl overflow-hidden"
              >
                {/* Laser Sweep Animation during 'scanning' */}
                {subPhase === 'scanning' && (
                  <div
                    className="animate-laser-sweep absolute left-0 right-0 top-0 z-20 pointer-events-none"
                    style={{height: '85%'}}
                  >
                    <div className="h-1.5 w-full bg-[#00A8E8] shadow-[0_0_24px_6px_rgba(0,168,232,0.85)]" />
                    <div className="h-14 w-full bg-gradient-to-b from-[#00A8E8]/30 to-transparent" />
                  </div>
                )}

                {/* Document Content Preview */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {activeDoc.docNumber}
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#123B63] mt-0.5">
                      {getDocTitle(activeDoc)}
                    </div>
                    <div className="text-xs text-[#123B63] font-medium">
                      {activeDoc.titleEn}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#F6F8FA] text-[#123B63] flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>

                {/* Animated OCR Highlights */}
                <div className="mt-3 space-y-2 text-xs">
                  <div
                    className={`p-2.5 rounded-lg border transition-colors ${
                      subPhase === 'extracted'
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-[#F6F8FA] border-[#D9DEE5]'
                    }`}
                  >
                    <div className="text-[11px] text-slate-500">Name Extracted</div>
                    <div className="font-bold text-[#123B63] mt-0.5">
                      {activeDoc.extractedName} ({activeDoc.extractedNameGu})
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border transition-colors ${
                      subPhase === 'extracted'
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-[#F6F8FA] border-[#D9DEE5]'
                    }`}
                  >
                    <div className="text-[11px] text-slate-500">
                      Father &amp; Verification Details
                    </div>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {activeDoc.extractedFatherName} · {activeDoc.extractedCasteOrDetail}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span
                    className={`font-bold flex items-center gap-1.5 ${
                      subPhase === 'extracted'
                        ? 'text-[#046A38]'
                        : 'text-[#D32828]'
                    }`}
                  >
                    {subPhase === 'extracted' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{activeDoc.verificationBadge}</span>
                      </>
                    ) : (
                      <>
                        <ScanLine className="h-4 w-4 shrink-0" />
                        <span>
                          {subPhase === 'placing'
                            ? 'Aligning paper on LED plate...'
                            : 'Laser scanning & OCR matching...'}
                        </span>
                      </>
                    )}
                  </span>
                  <span className="font-mono font-bold text-[#123B63] tabular-nums">
                    {subPhase === 'extracted' ? '100% Match' : 'Scanning'}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Video Timeline Bar */}
          <div className="space-y-2 z-10">
            <div className="flex items-center justify-between text-[11px] font-mono text-sky-200">
              <span>Simulation Progress</span>
              <span className="tabular-nums">{Math.min(progressPercent, 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00A8E8] to-[#34D399] transition-all duration-300"
                style={{width: `${Math.min(progressPercent, 100)}%`}}
              />
            </div>
          </div>
        </div>

        {/* Right: 5-Document Scan Reel + Continue Action */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            {physicalDocs.map((doc, idx) => {
              const isDone = completedIds.includes(doc.id);
              const isActive = currentIdx === idx && !allDone;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelectDoc(idx)}
                  className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F6F8FA] border-[#D32828] shadow-xs'
                      : isDone
                        ? 'bg-white border-[#046A38]/35'
                        : 'bg-[#F8FAFD] border-[#D9DEE5]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`h-8 w-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                          isDone
                            ? 'bg-[#046A38] text-white'
                            : isActive
                              ? 'bg-[#D32828] text-white'
                              : 'bg-white border border-[#CBD8EB] text-slate-500'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          `0${idx + 1}`
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#123B63] truncate">
                          {getDocTitle(doc)}
                        </div>
                        <div className="text-xs text-slate-600 truncate">
                          {isDone
                            ? doc.verificationBadge
                            : isActive
                              ? 'Playing scan animation...'
                              : doc.titleEn}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold shrink-0 ${
                        isDone
                          ? 'text-[#046A38]'
                          : isActive
                            ? 'text-[#D32828]'
                            : 'text-slate-400'
                      }`}
                    >
                      {isDone ? '100% Match' : isActive ? 'Scanning' : 'Queued'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onAllComplete}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#123B63] to-[#123B63] hover:from-[#123B63] hover:to-[#D32828] rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {allDone ? (
                <>
                  <Sparkles className="h-4 w-4 text-sky-300" />
                  <span>
                    {language === 'gu'
                      ? 'આગળ વધો: ઓટોમેટિક પાસપોર્ટ ફોટો'
                      : language === 'hi'
                        ? 'आगे बढ़ें: ऑटो पासपोर्ट फोटो'
                        : 'Next: Automatic AI Passport Photo'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>
                    {language === 'gu'
                      ? 'સ્કીપ કરી ફોટો સ્ટેપ પર જાઓ'
                      : language === 'hi'
                        ? 'आगे पासपोर्ट फोटो पर जाएँ'
                        : 'Continue to Auto Passport Photo'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
