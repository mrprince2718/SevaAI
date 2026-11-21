'use client';

import {transliterateToEnglish} from './transliterate';
import {LanguageCode} from './types';

export type SpeechEngineStatus =
  | 'idle'
  | 'native'
  | 'english_fallback'
  | 'muted'
  | 'unsupported';

export interface SpeechSnapshot {
  isSpeaking: boolean;
  engineStatus: SpeechEngineStatus;
  activeVoiceName: string | null;
  availableVoiceCount: number;
  hasNativeIndicVoice: boolean;
}

export interface SpeakOptions {
  text: string;
  subText?: string;
  language: LanguageCode;
  speechLocale: string;
  isMuted?: boolean;
  fallbackMs?: number;
  preferEnglishFallback?: boolean;
  onStart?: () => void;
  onDone?: () => void;
}

const failedVoiceURIs = new Set<string>();
const listeners = new Set<(snap: SpeechSnapshot) => void>();

let currentSeq = 0;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let safetyTimer: number | null = null;
let gapTimer: number | null = null;
let startWatchdogTimer: number | null = null;
let keepAliveInterval: number | null = null;
let activeDoneCallbacks: Array<() => void> = [];
let activeTag: string | null = null;

let snapshot: SpeechSnapshot = {
  isSpeaking: false,
  engineStatus: 'idle',
  activeVoiceName: null,
  availableVoiceCount: 0,
  hasNativeIndicVoice: false,
};

function emitSnapshot(partial: Partial<SpeechSnapshot>) {
  snapshot = {...snapshot, ...partial};
  listeners.forEach((fn) => fn(snapshot));
}

export function subscribeSpeechSnapshot(
  listener: (snap: SpeechSnapshot) => void
): () => void {
  listeners.add(listener);
  listener(snapshot);
  return () => {
    listeners.delete(listener);
  };
}

export function getSpeechSnapshot(): SpeechSnapshot {
  return snapshot;
}

function getSafeVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
    return [];
  }
  try {
    return window.speechSynthesis.getVoices() || [];
  } catch {
    return [];
  }
}

export function refreshAvailableVoices(language: LanguageCode = 'gu') {
  const voices = getSafeVoices();
  const prefix = language === 'gu' ? 'gu' : language === 'hi' ? 'hi' : 'en';
  const hasNative = voices.some(
    (v) => v.lang.toLowerCase().startsWith(prefix) && !failedVoiceURIs.has(v.voiceURI)
  );
  emitSnapshot({
    availableVoiceCount: voices.length,
    hasNativeIndicVoice: hasNative,
  });
}

function scoreVoice(v: SpeechSynthesisVoice): number {
  let score = 0;
  const name = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();
  if (lang.endsWith('-in')) score += 45;
  if (v.localService) score += 35; // Local OS voices never fail offline/sandboxed
  if (/natural|google|swara|madhur|dhwani|niranjan|heera|ravi|neerja|prabhat/.test(name)) {
    score += 25;
  }
  if (v.default) score += 10;
  return score;
}

export function pickVoiceForPrefix(
  prefix: 'gu' | 'hi' | 'en',
  excludeFailed = true
): SpeechSynthesisVoice | null {
  const voices = getSafeVoices();
  if (!voices.length) return null;

  const candidates = voices.filter((v) => {
    const matchesLang = v.lang.toLowerCase().startsWith(prefix);
    if (!matchesLang) return false;
    if (excludeFailed && failedVoiceURIs.has(v.voiceURI)) return false;
    return true;
  });

  if (!candidates.length) return null;
  return [...candidates].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
}

function pickAnyWorkingVoice(): SpeechSynthesisVoice | null {
  const en = pickVoiceForPrefix('en', true);
  if (en) return en;
  const voices = getSafeVoices().filter((v) => !failedVoiceURIs.has(v.voiceURI));
  if (!voices.length) return null;
  return [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
}

function clearAllSpeechTimers() {
  if (safetyTimer !== null) {
    window.clearTimeout(safetyTimer);
    safetyTimer = null;
  }
  if (gapTimer !== null) {
    window.clearTimeout(gapTimer);
    gapTimer = null;
  }
  if (startWatchdogTimer !== null) {
    window.clearTimeout(startWatchdogTimer);
    startWatchdogTimer = null;
  }
  if (keepAliveInterval !== null) {
    window.clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

export function primeBuiltInSpeech(language: LanguageCode = 'gu') {
  if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
    return;
  }
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    refreshAvailableVoices(language);
  } catch {
    // ignore
  }
}

export function cancelBuiltInSpeech() {
  currentSeq += 1;
  activeTag = null;
  activeDoneCallbacks = [];
  clearAllSpeechTimers();

  if (activeUtterance) {
    activeUtterance.onstart = null;
    activeUtterance.onend = null;
    activeUtterance.onerror = null;
    activeUtterance = null;
  }

  if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // ignore
    }
  }

  emitSnapshot({isSpeaking: false});
}

export function getActiveSpeechTag(): string | null {
  return activeTag;
}

export function attachToActiveSpeechDone(tag: string, onDone: () => void): boolean {
  if (activeTag === tag && snapshot.isSpeaking) {
    activeDoneCallbacks.push(onDone);
    return true;
  }
  return false;
}

function splitSpeechChunks(text: string): string[] {
  const rawSegments = text
    .split(/(?<=[।.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const seg of rawSegments) {
    if (seg.length <= 135) {
      chunks.push(seg);
    } else {
      const subParts = seg
        .split(/(?<=[,;—])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      chunks.push(...(subParts.length > 0 ? subParts : [seg]));
    }
  }
  return chunks.length > 0 ? chunks : [text];
}

/**
 * Synchronous-gesture-safe Built-in Browser Voice Engine.
 * - Speaks synchronously when queue is empty so Chromium/Edge never blocks audio playback
 * - Retries immediately with English/local OS voice if online Indic TTS fails or hangs
 */
export function speakBuiltIn(opts: SpeakOptions, tag?: string) {
  const wasBusy =
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined' &&
    (window.speechSynthesis.speaking || window.speechSynthesis.pending);

  cancelBuiltInSpeech();

  const mySeq = currentSeq;
  activeTag = tag || null;
  if (opts.onDone) {
    activeDoneCallbacks.push(opts.onDone);
  }

  let finished = false;
  const finish = () => {
    if (finished || currentSeq !== mySeq) return;
    finished = true;
    activeTag = null;
    clearAllSpeechTimers();
    activeUtterance = null;
    emitSnapshot({isSpeaking: false});
    const cbs = [...activeDoneCallbacks];
    activeDoneCallbacks = [];
    cbs.forEach((cb) => cb());
  };

  const readingDurationMs = Math.max(opts.fallbackMs ?? 2800, opts.text.length * 68 + 800);

  if (opts.isMuted) {
    emitSnapshot({isSpeaking: true, engineStatus: 'muted', activeVoiceName: null});
    opts.onStart?.();
    safetyTimer = window.setTimeout(
      finish,
      Math.min(3200, Math.max(1600, opts.text.length * 38))
    );
    return;
  }

  if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
    emitSnapshot({isSpeaking: true, engineStatus: 'unsupported', activeVoiceName: null});
    opts.onStart?.();
    safetyTimer = globalThis.setTimeout(finish, readingDurationMs) as unknown as number;
    return;
  }

  const voices = getSafeVoices();
  const nativePrefix: 'gu' | 'hi' | 'en' =
    opts.language === 'gu' ? 'gu' : opts.language === 'hi' ? 'hi' : 'en';

  const nativeVoice = opts.preferEnglishFallback
    ? null
    : pickVoiceForPrefix(nativePrefix, true);
  const englishVoice = pickAnyWorkingVoice();

  // Phonetic fallback text if Gujarati/Hindi voice pack is absent or fails
  const englishSpokenText =
    opts.subText && opts.subText.trim()
      ? opts.subText.trim()
      : transliterateToEnglish(opts.text);

  // Determine Tier 1 vs Tier 2
  const useNativePrimary =
    nativeVoice !== null || (voices.length === 0 && !opts.preferEnglishFallback);

  let currentText = useNativePrimary ? opts.text : englishSpokenText;
  let currentLocale = useNativePrimary
    ? nativeVoice?.lang || opts.speechLocale
    : englishVoice?.lang || 'en-IN';
  let currentVoice: SpeechSynthesisVoice | null = useNativePrimary
    ? nativeVoice
    : englishVoice;
  let didFallbackToEnglish = !useNativePrimary;

  let chunks = splitSpeechChunks(currentText);

  emitSnapshot({
    isSpeaking: true,
    availableVoiceCount: voices.length,
    hasNativeIndicVoice: nativeVoice !== null,
    engineStatus: didFallbackToEnglish ? 'english_fallback' : 'native',
    activeVoiceName: currentVoice?.name || (didFallbackToEnglish ? 'System English' : 'Browser Default'),
  });
  opts.onStart?.();

  keepAliveInterval = window.setInterval(() => {
    if (currentSeq !== mySeq || finished) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // ignore
    }
  }, 3500);

  safetyTimer = window.setTimeout(
    finish,
    Math.max(12000, readingDurationMs + 5000)
  );

  const switchToEnglishFallback = (failedVoice: SpeechSynthesisVoice | null) => {
    if (failedVoice?.voiceURI) {
      failedVoiceURIs.add(failedVoice.voiceURI);
    }
    if (didFallbackToEnglish || currentSeq !== mySeq || finished) {
      return false;
    }

    didFallbackToEnglish = true;
    const workingEn = pickAnyWorkingVoice();
    currentText = englishSpokenText;
    currentLocale = workingEn?.lang || 'en-IN';
    currentVoice = workingEn;
    chunks = splitSpeechChunks(currentText);

    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }

    emitSnapshot({
      engineStatus: 'english_fallback',
      activeVoiceName: workingEn?.name || 'System Default Voice',
      hasNativeIndicVoice: pickVoiceForPrefix(nativePrefix, true) !== null,
    });

    speakChunk(0, Date.now());
    return true;
  };

  const speakChunk = (chunkIdx: number, startedAtOverall: number) => {
    if (currentSeq !== mySeq || finished) return;
    if (chunkIdx >= chunks.length) {
      finish();
      return;
    }

    if (startWatchdogTimer !== null) {
      window.clearTimeout(startWatchdogTimer);
      startWatchdogTimer = null;
    }

    const phrase = chunks[chunkIdx];
    const chunkStartedAt = Date.now();
    let chunkHasStarted = false;

    try {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = currentLocale;
      utterance.rate = didFallbackToEnglish ? 0.96 : 0.94;
      utterance.pitch = 1.04;
      utterance.volume = 1;
      if (currentVoice) {
        utterance.voice = currentVoice;
      }

      activeUtterance = utterance;

      // Watchdog: if online neural voice hangs without firing onstart within 1500ms, switch to reliable local voice!
      startWatchdogTimer = window.setTimeout(() => {
        if (currentSeq !== mySeq || finished || chunkHasStarted) return;
        if (!window.speechSynthesis.speaking) {
          const retried = switchToEnglishFallback(currentVoice);
          if (!retried) {
            const elapsedAll = Date.now() - startedAtOverall;
            gapTimer = window.setTimeout(
              finish,
              Math.max(1500, readingDurationMs - elapsedAll)
            );
          }
        }
      }, 1500);

      utterance.onstart = () => {
        if (currentSeq !== mySeq || finished) return;
        chunkHasStarted = true;
        if (startWatchdogTimer !== null) {
          window.clearTimeout(startWatchdogTimer);
          startWatchdogTimer = null;
        }
        emitSnapshot({isSpeaking: true});
      };

      utterance.onend = () => {
        if (currentSeq !== mySeq || finished) return;
        if (startWatchdogTimer !== null) {
          window.clearTimeout(startWatchdogTimer);
          startWatchdogTimer = null;
        }
        const elapsed = Date.now() - chunkStartedAt;

        // If browser silently skipped chunk in < 160ms without audio
        if (!chunkHasStarted && elapsed < 160 && phrase.length > 10 && chunkIdx === 0) {
          const retried = switchToEnglishFallback(currentVoice);
          if (retried) return;

          const elapsedAll = Date.now() - startedAtOverall;
          gapTimer = window.setTimeout(
            finish,
            Math.max(1800, readingDurationMs - elapsedAll)
          );
          return;
        }

        speakChunk(chunkIdx + 1, startedAtOverall);
      };

      utterance.onerror = () => {
        if (currentSeq !== mySeq || finished) return;
        if (startWatchdogTimer !== null) {
          window.clearTimeout(startWatchdogTimer);
          startWatchdogTimer = null;
        }

        const retried = switchToEnglishFallback(currentVoice);
        if (retried) return;

        const elapsedAll = Date.now() - startedAtOverall;
        gapTimer = window.setTimeout(
          finish,
          Math.max(1500, readingDurationMs - elapsedAll)
        );
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      const retried = switchToEnglishFallback(currentVoice);
      if (!retried) {
        gapTimer = window.setTimeout(finish, Math.max(1500, readingDurationMs));
      }
    }
  };

  // CRITICAL: Call .speak() SYNCHRONOUSLY when queue wasn't busy so browser user-activation isn't lost!
  if (wasBusy) {
    gapTimer = window.setTimeout(() => {
      if (currentSeq !== mySeq || finished) return;
      speakChunk(0, Date.now());
    }, 25);
  } else {
    speakChunk(0, Date.now());
  }
}
