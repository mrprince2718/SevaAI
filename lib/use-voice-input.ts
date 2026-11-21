'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {LanguageCode} from './types';

export type MicPhase = 'idle' | 'starting' | 'listening' | 'error';

export interface MicNotice {
  type: 'info' | 'error';
  text: string;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onaudiostart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export interface StartVoiceOptions {
  targetId: string;
  langLocale: string;
  fieldHint?: string;
  onBeforeStart?: () => void;
  onInterim?: (liveText: string) => void;
  onFinal: (finalText: string) => void;
}

function getNoticeCopy(
  lang: LanguageCode,
  code: 'unsupported' | 'denied' | 'no-speech' | 'empty' | 'error'
): string {
  if (lang === 'gu') {
    if (code === 'unsupported') {
      return 'આ બ્રાઉઝરમાં ઇનબિલ્ટ વૉઇસ ટાઇપિંગ ઉપલબ્ધ નથી — નીચેનું ગુજરાતી/અંગ્રેજી કીબોર્ડ વાપરો.';
    }
    if (code === 'denied') {
      return 'માઈકની પરવાનગી બંધ છે — બ્રાઉઝરમાં Microphone Allow કરો અથવા કીબોર્ડથી લખો.';
    }
    if (code === 'no-speech') {
      return 'અવાજ સંભળાયો નહીં — માઈક બટન ફરી દબાવીને સ્પષ્ટ બોલો.';
    }
    if (code === 'empty') {
      return 'શબ્દો પકડાયા નહીં — ફરી બોલો અથવા કીબોર્ડથી લખો.';
    }
    return 'માઈકમાં સમસ્યા આવી — ફરી પ્રયાસ કરો અથવા કીબોર્ડથી લખો.';
  }

  if (lang === 'hi') {
    if (code === 'unsupported') {
      return 'इस ब्राउज़र में इनबिल्ट वॉइस टाइपिंग उपलब्ध नहीं है — ऑन-स्क्रीन कीबोर्ड का उपयोग करें।';
    }
    if (code === 'denied') {
      return 'माइक की अनुमति बंद है — ब्राउज़र में Microphone Allow करें या कीबोर्ड से लिखें।';
    }
    if (code === 'no-speech') {
      return 'आवाज़ सुनाई नहीं दी — माइक फिर से दबाकर स्पष्ट बोलें।';
    }
    if (code === 'empty') {
      return 'शब्द साफ़ नहीं मिले — कृपया फिर बोलें या कीबोर्ड का उपयोग करें।';
    }
    return 'माइक त्रुटि — कृपया पुनः प्रयास करें या कीबोर्ड से लिखें।';
  }

  if (code === 'unsupported') {
    return 'Built-in browser voice input is unavailable here — please use the on-screen keyboard.';
  }
  if (code === 'denied') {
    return 'Microphone permission is blocked — allow Microphone in your browser or type on keyboard.';
  }
  if (code === 'no-speech') {
    return 'No speech detected — tap the mic button and speak clearly.';
  }
  if (code === 'empty') {
    return 'No words captured — please speak again or type below.';
  }
  return 'Microphone error — please try again or use the on-screen keyboard.';
}

export function useVoiceInput(uiLanguage: LanguageCode) {
  const [micPhase, setMicPhase] = useState<MicPhase>('idle');
  const [micTarget, setMicTarget] = useState<string | null>(null);
  const [interimText, setInterimText] = useState('');
  const [micNotice, setMicNotice] = useState<MicNotice | null>(null);

  const uiLanguageRef = useRef(uiLanguage);
  useEffect(() => {
    uiLanguageRef.current = uiLanguage;
  }, [uiLanguage]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const sessionIdRef = useRef(0);
  const activeTargetRef = useRef<string | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const latestTranscriptRef = useRef('');
  const hasFinalCommitRef = useRef(false);
  const onInterimRef = useRef<((text: string) => void) | undefined>(undefined);
  const onFinalRef = useRef<((text: string) => void) | undefined>(undefined);
  const phaseRef = useRef<MicPhase>('idle');

  const updatePhase = useCallback((next: MicPhase) => {
    phaseRef.current = next;
    setMicPhase(next);
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const abortHard = useCallback(() => {
    sessionIdRef.current += 1;
    clearSilenceTimer();

    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      rec.onaudiostart = null;
      rec.onspeechstart = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.abort();
      } catch {
        // ignore
      }
    }
  }, [clearSilenceTimer]);

  useEffect(() => {
    return () => {
      abortHard();
    };
  }, [abortHard]);

  const commitTextAndFinish = useCallback(
    (text: string) => {
      if (hasFinalCommitRef.current) return;
      hasFinalCommitRef.current = true;
      clearSilenceTimer();

      const cleaned = text.trim();
      setInterimText('');
      setMicTarget(null);
      activeTargetRef.current = null;
      updatePhase('idle');

      if (cleaned) {
        setMicNotice(null);
        onFinalRef.current?.(cleaned);
      } else {
        setMicNotice({
          type: 'info',
          text: getNoticeCopy(uiLanguageRef.current, 'empty'),
        });
      }
    },
    [clearSilenceTimer, updatePhase]
  );

  // Instant, zero-lag graceful stop: preserves any captured words immediately
  const stopVoiceInput = useCallback(() => {
    clearSilenceTimer();
    const partial = latestTranscriptRef.current.trim();

    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      rec.onaudiostart = null;
      rec.onspeechstart = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.stop();
      } catch {
        // ignore
      }
    }

    if (partial) {
      commitTextAndFinish(partial);
    } else {
      setInterimText('');
      setMicTarget(null);
      activeTargetRef.current = null;
      updatePhase('idle');
    }
  }, [clearSilenceTimer, commitTextAndFinish, updatePhase]);

  const startVoiceInput = useCallback(
    (opts: StartVoiceOptions) => {
      if (
        (phaseRef.current === 'starting' || phaseRef.current === 'listening') &&
        activeTargetRef.current === opts.targetId
      ) {
        return;
      }

      opts.onBeforeStart?.();
      abortHard();

      const mySessionId = sessionIdRef.current;
      hasFinalCommitRef.current = false;
      latestTranscriptRef.current = '';
      onInterimRef.current = opts.onInterim;
      onFinalRef.current = opts.onFinal;
      activeTargetRef.current = opts.targetId;
      setMicTarget(opts.targetId);
      setInterimText('');
      setMicNotice(null);

      if (typeof window === 'undefined') return;

      const win = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (!SpeechRec) {
        setMicTarget(null);
        activeTargetRef.current = null;
        updatePhase('error');
        setMicNotice({
          type: 'info',
          text: getNoticeCopy(uiLanguageRef.current, 'unsupported'),
        });
        return;
      }

      updatePhase('starting');

      const recognition = new SpeechRec();
      recognition.lang = opts.langLocale;
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognition.onaudiostart = () => {
        if (sessionIdRef.current !== mySessionId) return;
        updatePhase('listening');
      };

      recognition.onspeechstart = () => {
        if (sessionIdRef.current !== mySessionId) return;
        updatePhase('listening');
      };

      recognition.onresult = (event) => {
        if (sessionIdRef.current !== mySessionId) return;

        let combined = '';
        let hasNewFinal = false;

        for (let i = 0; i < event.results.length; i++) {
          const seg = event.results[i]?.[0]?.transcript || '';
          combined += seg;
          if (event.results[i].isFinal) {
            hasNewFinal = true;
          }
        }

        const live = combined.trim();
        latestTranscriptRef.current = live;
        setInterimText(live);
        if (live) {
          onInterimRef.current?.(live);
        }

        clearSilenceTimer();
        if (live) {
          silenceTimerRef.current = window.setTimeout(
            () => {
              if (sessionIdRef.current !== mySessionId) return;
              stopVoiceInput();
            },
            hasNewFinal ? 1100 : 1750
          );
        }
      };

      recognition.onerror = (ev) => {
        if (sessionIdRef.current !== mySessionId) return;
        const err = ev?.error || '';
        if (err === 'aborted') return;

        clearSilenceTimer();
        recognitionRef.current = null;
        setInterimText('');
        setMicTarget(null);
        activeTargetRef.current = null;
        updatePhase('error');

        if (err === 'not-allowed' || err === 'audio-capture') {
          setMicNotice({
            type: 'error',
            text: getNoticeCopy(uiLanguageRef.current, 'denied'),
          });
        } else if (err === 'no-speech') {
          setMicNotice({
            type: 'info',
            text: getNoticeCopy(uiLanguageRef.current, 'no-speech'),
          });
        } else {
          setMicNotice({
            type: 'info',
            text: getNoticeCopy(uiLanguageRef.current, 'unsupported'),
          });
        }
      };

      recognition.onend = () => {
        if (sessionIdRef.current !== mySessionId) return;
        recognitionRef.current = null;
        clearSilenceTimer();

        if (!hasFinalCommitRef.current) {
          const captured = latestTranscriptRef.current.trim();
          if (captured) {
            commitTextAndFinish(captured);
          } else if (phaseRef.current !== 'error') {
            setMicTarget(null);
            activeTargetRef.current = null;
            updatePhase('idle');
          }
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        recognitionRef.current = null;
        setMicTarget(null);
        activeTargetRef.current = null;
        updatePhase('error');
        setMicNotice({
          type: 'info',
          text: getNoticeCopy(uiLanguageRef.current, 'error'),
        });
      }
    },
    [abortHard, clearSilenceTimer, commitTextAndFinish, stopVoiceInput, updatePhase]
  );

  const toggleVoiceInput = useCallback(
    (opts: StartVoiceOptions) => {
      if (
        (phaseRef.current === 'starting' || phaseRef.current === 'listening') &&
        activeTargetRef.current === opts.targetId
      ) {
        stopVoiceInput();
        return;
      }
      startVoiceInput(opts);
    },
    [startVoiceInput, stopVoiceInput]
  );

  const cancelVoiceInput = useCallback(() => {
    abortHard();
    setInterimText('');
    setMicTarget(null);
    activeTargetRef.current = null;
    updatePhase('idle');
  }, [abortHard, updatePhase]);

  const dismissMicNotice = useCallback(() => {
    setMicNotice(null);
  }, []);

  const isListening = micPhase === 'starting' || micPhase === 'listening';

  return {
    micPhase,
    micTarget,
    interimText,
    micNotice,
    isListening,
    startVoiceInput,
    toggleVoiceInput,
    stopVoiceInput,
    cancelVoiceInput,
    dismissMicNotice,
  };
}
