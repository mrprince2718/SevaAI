'use client';

import React from 'react';
import {
  CheckCircle2,
  ScanLine,
  Camera,
  FileText,
  ShieldCheck,
  Mic,
  Loader2,
  Play,
} from 'lucide-react';
import {LanguageCode, OcrCrossCheckDoc} from '@/lib/types';

interface BottomScanPlateProps {
  documents: OcrCrossCheckDoc[];
  language: LanguageCode;
  scanningIndex: number | null;
  completedIds: string[];
  inspectedDocId: string;
  onInspectDoc: (id: string) => void;
  onStartManualScan: () => void;
  isDemoRunning: boolean;
  title: string;
  subtitle: string;
  scanBtnLabel: string;
  scanningLabel: string;
}

export default function BottomScanPlate({
  documents,
  language,
  scanningIndex,
  completedIds,
  inspectedDocId,
  onInspectDoc,
  onStartManualScan,
  isDemoRunning,
  title,
  subtitle,
  scanBtnLabel,
  scanningLabel,
}: BottomScanPlateProps) {
  const activeDoc =
    scanningIndex !== null
      ? documents[scanningIndex]
      : documents.find((d) => d.id === inspectedDocId) || documents[0];

  const isCurrentlyScanning = scanningIndex !== null;
  const allScanned = completedIds.length === documents.length;

  const getDocTitle = (doc: OcrCrossCheckDoc) => {
    if (language === 'gu') return doc.titleGu;
    if (language === 'hi') return doc.titleHi;
    return doc.titleEn;
  };

  return (
    <div className="uidai-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3EAF5]">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-[#020B50]">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {allScanned ? (
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#138808]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>6/6 Verified · 100% Spelling Match</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartManualScan}
              disabled={isCurrentlyScanning || isDemoRunning}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#020B50] to-[#0C4DA2] hover:from-[#0C4DA2] hover:to-[#008FD5] disabled:opacity-60 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {isCurrentlyScanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>{scanBtnLabel}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Virtual Overhead Scan Plate Bed */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative flex-1 min-h-[350px] rounded-2xl bg-gradient-to-b from-[#07143A] to-[#0B1E54] border border-[#1E3A8A] p-4 flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Overhead Platen Frame Header */}
            <div className="flex items-center justify-between text-[11px] text-sky-200/90 font-mono z-10">
              <span>PLATEN-CAM 16MP · 5000K LED</span>
              <span
                className={
                  isCurrentlyScanning
                    ? 'text-[#38BDF8] font-bold'
                    : allScanned
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-300'
                }
              >
                {isCurrentlyScanning
                  ? `SCANNING DOC #${(scanningIndex ?? 0) + 1}/6`
                  : allScanned
                    ? 'ALL 6 VERIFIED'
                    : 'READY ON TRAY'}
              </span>
            </div>

            {/* Simulated Document Sheet on Scan Glass */}
            <div className="relative my-3 flex-1 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between overflow-hidden shadow-md">
              {/* Laser Sweep Bar during active scan */}
              {isCurrentlyScanning && (
                <div
                  className="animate-laser-sweep absolute left-0 right-0 top-0 z-20 pointer-events-none"
                  style={{height: '85%'}}
                >
                  <div className="h-1 w-full bg-[#008FD5] shadow-[0_0_20px_5px_rgba(0,143,213,0.75)]" />
                  <div className="h-14 w-full bg-gradient-to-b from-[#008FD5]/25 to-transparent" />
                </div>
              )}

              {/* Document Header Inside Platen */}
              <div>
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#E3EAF5]">
                  <div>
                    <div className="text-[11px] font-mono text-slate-500">
                      DOC #{activeDoc.order} · {activeDoc.docNumber}
                    </div>
                    <div className="text-sm font-bold text-[#020B50] mt-0.5">
                      {activeDoc.titleEn}
                    </div>
                    <div className="text-xs text-[#0C4DA2] font-medium">
                      {activeDoc.titleGu}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#EEF4FB] border border-[#D4E1F2] flex items-center justify-center text-[#0C4DA2] shrink-0">
                    {activeDoc.docType === 'webcam' ? (
                      <Camera className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>
                </div>

                {/* Live OCR Extracted Fields */}
                <div className="mt-3 space-y-2 text-xs">
                  {activeDoc.docType === 'webcam' ? (
                    <div className="grid grid-cols-3 gap-3 items-center bg-[#F4F8FD] border border-[#D4E1F2] rounded-xl p-3">
                      <div className="col-span-1 aspect-square rounded-xl bg-gradient-to-b from-[#020B50] to-[#0C4DA2] flex flex-col items-center justify-center text-white p-2">
                        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
                          <circle cx="32" cy="24" r="11" fill="#E2E8F0" />
                          <path
                            d="M14 54C14 43 22 38 32 38C42 38 50 43 50 54"
                            fill="#E2E8F0"
                          />
                          <rect
                            x="6"
                            y="6"
                            width="52"
                            height="52"
                            rx="6"
                            stroke="#38BDF8"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                          />
                        </svg>
                        <span className="text-[10px] font-mono text-sky-300 mt-1">
                          WDR LIVE
                        </span>
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-[#020B50]">
                          <Mic className="h-3.5 w-3.5 text-[#008FD5]" />
                          <span>
                            {language === 'gu'
                              ? 'અવાજ સ્વ-ઘોષણા વેરિફાઈડ'
                              : language === 'hi'
                                ? 'वॉइस स्व-घोषणा वेरिफाइड'
                                : 'Voice Self-Declaration Verified'}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-snug">
                          {language === 'gu'
                            ? `“હું ${documents[0]?.extractedNameGu || activeDoc.extractedNameGu} જાહેર કરું છું કે રજૂ કરેલા તમામ ૬ દસ્તાવેજો સાચા છે.”`
                            : language === 'hi'
                              ? `“मैं ${documents[0]?.extractedNameGu || activeDoc.extractedNameGu} घोषित करता/करती हूँ कि प्रस्तुत सभी 6 दस्तावेज़ सही हैं।”`
                              : `“I, ${documents[0]?.extractedName || activeDoc.extractedName}, declare all 6 documents are genuine.”`}
                        </p>
                        <div className="font-mono text-[11px] text-[#138808] font-bold">
                          Liveness Score: 99.4% · Match OK
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-2.5 rounded-lg bg-[#F4F8FD] border border-[#E3EAF5]">
                        <div className="text-[11px] text-slate-500">OCR Name Match</div>
                        <div className="font-bold text-[#020B50] mt-0.5">
                          {activeDoc.extractedName}
                        </div>
                        <div className="text-slate-600">{activeDoc.extractedNameGu}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F4F8FD] border border-[#E3EAF5]">
                        <div className="text-[11px] text-slate-500">Father / Guardian</div>
                        <div className="font-bold text-[#020B50] mt-0.5">
                          {activeDoc.extractedFatherName}
                        </div>
                        <div className="text-slate-600">
                          {activeDoc.extractedFatherNameGu}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F4F8FD] border border-[#E3EAF5]">
                        <div className="text-[11px] text-slate-500">Verified Attribute</div>
                        <div className="font-mono text-[11px] font-semibold text-slate-800 mt-0.5">
                          {activeDoc.extractedCasteOrDetail}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* OCR Match Result Footer inside platen */}
              <div className="mt-3 pt-2.5 border-t border-[#E3EAF5] flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#138808] flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{activeDoc.verificationBadge}</span>
                </span>
                <span className="font-mono font-bold text-[#020B50] tabular-nums">
                  100% Match
                </span>
              </div>
            </div>

            {/* Tray Alignment Guide Footer */}
            <div className="flex items-center justify-between text-[11px] text-sky-200/75 font-mono z-10">
              <span>TRAY ALIGNMENT: A4 / LAMINATED OK</span>
              <span>{isCurrentlyScanning ? scanningLabel : '0 SPELLING ERRORS'}</span>
            </div>
          </div>
        </div>

        {/* Right: 6-Document Verification Checklist */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-2.5">
          {documents.map((doc, idx) => {
            const isScanningThis = scanningIndex === idx;
            const isDone = completedIds.includes(doc.id);
            const isInspected = activeDoc.id === doc.id;

            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => onInspectDoc(doc.id)}
                className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                  isScanningThis
                    ? 'bg-[#EEF4FB] border-[#008FD5] shadow-xs'
                    : isInspected
                      ? 'bg-[#F4F8FD] border-[#0C4DA2] shadow-xs'
                      : 'bg-white border-[#DCE5F2] hover:bg-[#F4F8FD]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isDone
                          ? 'bg-[#138808]/12 text-[#138808]'
                          : isScanningThis
                            ? 'bg-[#008FD5] text-white'
                            : 'bg-[#EEF4FB] text-[#0C4DA2]'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isScanningThis ? (
                        <ScanLine className="h-4 w-4 animate-pulse" />
                      ) : (
                        `0${doc.order}`
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#020B50] truncate">
                        {doc.order}) {getDocTitle(doc)}
                      </div>
                      <div className="text-xs text-slate-600 truncate mt-0.5">
                        {isDone
                          ? doc.verificationBadge
                          : isScanningThis
                            ? 'Running laser OCR & phonetic cross-check...'
                            : `${doc.titleEn} · Ready to scan`}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#138808] tabular-nums">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>100% Spelling Match</span>
                      </span>
                    ) : isScanningThis ? (
                      <span className="text-xs font-bold text-[#008FD5]">
                        Laser Scanning...
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        Queued
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
