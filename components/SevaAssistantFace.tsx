'use client';

import React, {useEffect, useState} from 'react';
import {motion} from 'motion/react';
import {Volume2, VolumeX, RotateCcw} from 'lucide-react';

interface SevaAssistantFaceProps {
  isSpeaking: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onReplaySpeech: () => void;
  primarySubtitle: string;
  secondarySubtitle: string;
  badgeTitle: string;
  voiceOnLabel: string;
  voiceMutedLabel: string;
  replayLabel: string;
  showNamasteBadge?: boolean;
}

export default function SevaAssistantFace({
  isSpeaking,
  isMuted,
  onToggleMute,
  onReplaySpeech,
  primarySubtitle,
  secondarySubtitle,
  badgeTitle,
  voiceOnLabel,
  voiceMutedLabel,
  replayLabel,
  showNamasteBadge = false,
}: SevaAssistantFaceProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthFrame, setMouthFrame] = useState(0);

  // Natural eye blink interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3400);
    return () => clearInterval(blinkInterval);
  }, []);

  // Talking mouth animation frames synced cleanly to speechSynthesis active state
  useEffect(() => {
    if (!isSpeaking) return;
    const talkInterval = setInterval(() => {
      setMouthFrame((prev) => (prev + 1) % 4);
    }, 135);
    return () => clearInterval(talkInterval);
  }, [isSpeaking]);

  const activeMouthFrame = isSpeaking ? mouthFrame : 0;

  const mouthHeight = !isSpeaking
    ? 4
    : activeMouthFrame === 0
      ? 7
      : activeMouthFrame === 1
        ? 15
        : activeMouthFrame === 2
          ? 10
          : 17;

  return (
    <div className="uidai-card rounded-3xl p-5 sm:p-6 overflow-hidden relative">
      {/* Subtle Top Royal-to-Cyan Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#020B50] via-[#0C4DA2] to-[#00A8E8]" />

      <div className="flex flex-col md:flex-row items-center gap-6 pt-1">
        {/* Cute Rounded 2D Mascot AI Assistant Face with Floating & Soundwave Aura */}
        <div className="relative flex items-center justify-center w-44 h-44 shrink-0">
          {/* Concentric Soundwave Rings when speaking */}
          {isSpeaking && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#00A8E8]/45"
                initial={{scale: 0.88, opacity: 0.8}}
                animate={{scale: 1.2, opacity: 0}}
                transition={{duration: 1.25, repeat: Infinity, ease: 'easeOut'}}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-[#F37021]/35"
                initial={{scale: 0.9, opacity: 0.75}}
                animate={{scale: 1.14, opacity: 0}}
                transition={{
                  duration: 1.25,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.42,
                }}
              />
            </>
          )}

          {/* Soft Pastel Sky Circle Backdrop */}
          <div className="absolute inset-2.5 rounded-full bg-gradient-to-b from-[#EEF5FF] to-[#D8E8FC] border-2 border-[#C8DAF2] shadow-inner" />

          {/* Floating + Gentle Sway Cute Rounded Bot SVG */}
          <motion.div
            animate={
              isSpeaking
                ? {y: [0, -7, 0], rotate: [-1.8, 1.8, -1.8]}
                : {y: [0, -5, 0], rotate: [-1, 1, -1]}
            }
            transition={{
              duration: isSpeaking ? 2.1 : 3.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 w-38 h-38 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 180 180"
              className="w-full h-full drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="SevaMitra Cute Rounded Voice AI Assistant"
            >
              <defs>
                <radialGradient id="cuteOrbHead" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="75%" stopColor="#F0F6FF" />
                  <stop offset="100%" stopColor="#DCE8F8" />
                </radialGradient>
                <linearGradient id="cuteVisor" x1="40" y1="54" x2="140" y2="128" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#041259" />
                  <stop offset="100%" stopColor="#0C4DA2" />
                </linearGradient>
                <radialGradient id="eyeIris" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0066B3" />
                </radialGradient>
              </defs>

              {/* Cute Bouncy Top Antenna */}
              <path
                d="M90 18C90 22 90 28 90 34"
                stroke="#020B50"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle
                cx="90"
                cy="15"
                r="7.5"
                fill={isSpeaking ? '#F37021' : '#00A8E8'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />

              {/* Rounded Puffy Side Headphone Ear Cups */}
              <rect
                x="14"
                y="72"
                width="18"
                height="42"
                rx="9"
                fill="#0C4DA2"
                stroke="#020B50"
                strokeWidth="2.5"
              />
              <rect
                x="148"
                y="72"
                width="18"
                height="42"
                rx="9"
                fill="#0C4DA2"
                stroke="#020B50"
                strokeWidth="2.5"
              />
              <circle cx="23" cy="93" r="4" fill={isSpeaking ? '#38BDF8' : '#E2E8F0'} />
              <circle cx="157" cy="93" r="4" fill={isSpeaking ? '#38BDF8' : '#E2E8F0'} />

              {/* Super Rounded Cute Mascot Head Shell */}
              <rect
                x="26"
                y="34"
                width="128"
                height="112"
                rx="56"
                fill="url(#cuteOrbHead)"
                stroke="#020B50"
                strokeWidth="3.5"
              />

              {/* Cute Warm Forehead Bindi / Digital India Crest */}
              <circle cx="90" cy="44" r="4.5" fill="#F37021" />
              <circle cx="90" cy="44" r="1.8" fill="#FFFFFF" />

              {/* Soft Rounded Visor Face Screen */}
              <rect
                x="40"
                y="54"
                width="100"
                height="74"
                rx="37"
                fill="url(#cuteVisor)"
              />

              {/* Cute Warm Rosy Blushing Cheeks */}
              <ellipse cx="56" cy="99" rx="8.5" ry="4.5" fill="#FF7E67" fillOpacity="0.52" />
              <ellipse cx="124" cy="99" rx="8.5" ry="4.5" fill="#FF7E67" fillOpacity="0.52" />

              {/* Big Cute Expressive Left Eye */}
              {isBlinking ? (
                <path
                  d="M55 84Q66 77 77 84"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              ) : (
                <g>
                  <circle cx="66" cy="82" r="11.5" fill="#FFFFFF" />
                  <circle cx="67.5" cy="82.5" r="7" fill="url(#eyeIris)" />
                  <circle cx="67.5" cy="82.5" r="3.4" fill="#020B50" />
                  <circle cx="70.5" cy="78.5" r="2.6" fill="#FFFFFF" />
                  <circle cx="64.5" cy="85.5" r="1.2" fill="#FFFFFF" />
                </g>
              )}

              {/* Big Cute Expressive Right Eye */}
              {isBlinking ? (
                <path
                  d="M103 84Q114 77 125 84"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              ) : (
                <g>
                  <circle cx="114" cy="82" r="11.5" fill="#FFFFFF" />
                  <circle cx="112.5" cy="82.5" r="7" fill="url(#eyeIris)" />
                  <circle cx="112.5" cy="82.5" r="3.4" fill="#020B50" />
                  <circle cx="115.5" cy="78.5" r="2.6" fill="#FFFFFF" />
                  <circle cx="109.5" cy="85.5" r="1.2" fill="#FFFFFF" />
                </g>
              )}

              {/* Expressive Cute Animated Mouth */}
              {isSpeaking ? (
                <g>
                  <rect
                    x="77"
                    y={104 - mouthHeight / 2}
                    width="26"
                    height={mouthHeight}
                    rx={mouthHeight / 2}
                    fill="#38BDF8"
                  />
                  <ellipse
                    cx="90"
                    cy={104 + mouthHeight / 4}
                    rx="7"
                    ry="2.5"
                    fill="#FF8FA3"
                    fillOpacity="0.85"
                  />
                </g>
              ) : (
                <path
                  d="M77 101Q90 112 103 101"
                  stroke="#38BDF8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}

              {/* Rounded Cute Collar & Namaste Hands on Greeting */}
              <rect x="74" y="146" width="32" height="10" rx="5" fill="#008FD5" />
              <path
                d="M54 162C54 156 66 154 90 154C114 154 126 156 126 162"
                stroke="#020B50"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {showNamasteBadge && (
                <g>
                  <ellipse cx="90" cy="158" rx="13" ry="10" fill="#FDE68A" stroke="#020B50" strokeWidth="2" />
                  <line x1="90" y1="149" x2="90" y2="167" stroke="#020B50" strokeWidth="1.8" />
                </g>
              )}
            </svg>
          </motion.div>
        </div>

        {/* Subtitles & Clear Voice Controls */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0C4DA2]">
              <span>SevaMitra Voice AI</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600 font-medium">{badgeTitle}</span>
              {isSpeaking && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#138808] font-bold">Speaking Clearly</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReplaySpeech}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#020B50] bg-[#EEF4FB] border border-[#D4E1F2] rounded-xl hover:bg-[#E1ECFA] transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{replayLabel}</span>
              </button>
              <button
                type="button"
                onClick={onToggleMute}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                  isMuted
                    ? 'bg-slate-100 text-slate-700 border-[#DCE5F2]'
                    : 'bg-[#0C4DA2] text-white border-[#0C4DA2]'
                }`}
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
                <span>{isMuted ? voiceMutedLabel : voiceOnLabel}</span>
              </button>
            </div>
          </div>

          {/* Large Crystal-Clear Bilingual Subtitles Display */}
          <div
            aria-live="polite"
            className="bg-gradient-to-br from-[#F4F8FD] to-[#EEF4FB] border border-[#D4E1F2] rounded-2xl p-4 sm:p-5"
          >
            <p className="text-base sm:text-xl font-extrabold text-[#020B50] leading-relaxed">
              “{primarySubtitle}”
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {secondarySubtitle}
            </p>

            {/* Voice Equalizer Bars when speaking */}
            <div className="mt-3 flex items-center gap-1 h-4" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((bar) => (
                <motion.span
                  key={bar}
                  className={`w-1 rounded-full ${
                    isSpeaking ? 'bg-[#008FD5]' : 'bg-[#CBD8EB]'
                  }`}
                  animate={
                    isSpeaking
                      ? {height: [4, 14, 6, 16, 4]}
                      : {height: 4}
                  }
                  transition={
                    isSpeaking
                      ? {
                          duration: 0.65,
                          repeat: Infinity,
                          delay: bar * 0.06,
                          ease: 'easeInOut',
                        }
                      : {duration: 0.2}
                  }
                  style={{height: 4}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
