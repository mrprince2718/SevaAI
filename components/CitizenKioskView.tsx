'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit3,
  FileCheck2,
  FileText,
  HelpCircle,
  Home,
  Keyboard,
  Mic,
  Play,
  Printer,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Square,
  Volume2,
  Wand2,
  XCircle,
} from 'lucide-react';
import {useSeva} from '@/lib/seva-store';
import {
  DEMO_CITIZEN,
  getServiceKey,
  SERVICE_DOCUMENTS,
  UI_COPY,
} from '@/lib/i18n';
import {
  COMMON_DOUBTS,
  detectServiceFromText,
  getServiceLabel,
  getStageCopy,
  KioskStage,
  resolveCitizenDoubt,
} from '@/lib/conversational-kiosk';
import {ApplicationRecord, LanguageCode} from '@/lib/types';
import {MicNotice, MicPhase, useVoiceInput} from '@/lib/use-voice-input';
import {
  attachToActiveSpeechDone,
  cancelBuiltInSpeech,
  getActiveSpeechTag,
  getSpeechSnapshot,
  primeBuiltInSpeech,
  refreshAvailableVoices,
  speakBuiltIn,
  SpeechSnapshot,
  subscribeSpeechSnapshot,
} from '@/lib/built-in-speech';
import {
  containsIndicScript,
  normalizeIndicDigits,
  normalizeSpokenDateInput,
  normalizeSpokenIncomeInput,
  transliterateFromEnglish,
  transliterateToEnglish,
} from '@/lib/transliterate';
import SevaRobot3D from './SevaRobot3D';
import DocScanAnimationPlayer from './DocScanAnimationPlayer';
import AutoPassportPhotoStage from './AutoPassportPhotoStage';
import OfficialCertificateModal from './OfficialCertificateModal';
import OnScreenKeyboard, {KeyboardLayout} from './OnScreenKeyboard';
import DemoPrototypeNote from './DemoPrototypeNote';

type ExtendedStage = KioskStage | 'place_docs';

type KeyboardField =
  | 'applicantName'
  | 'applicantNameGu'
  | 'fatherName'
  | 'fatherNameGu'
  | 'villageTaluka'
  | 'dob'
  | 'casteCategory'
  | 'annualIncome'
  | 'occupation'
  | 'residenceYears';

const STEP_ORDER: ExtendedStage[] = [
  'greeting',
  'confirm_service',
  'prepare_docs',
  'collect_name',
  'collect_father',
  'collect_village_dob',
  'collect_caste_income',
  'place_docs',
  'doc_scan_animation',
  'auto_photo',
  'final_review',
  'submitted',
];

const DEMO_SEQUENCE: ExtendedStage[] = [
  'greeting',
  'confirm_service',
  'prepare_docs',
  'collect_name',
  'collect_father',
  'collect_village_dob',
  'collect_caste_income',
  'place_docs',
  'doc_scan_animation',
];

const PREVIOUS_STAGE_MAP: Partial<Record<ExtendedStage, ExtendedStage>> = {
  confirm_service: 'greeting',
  prepare_docs: 'confirm_service',
  collect_name: 'prepare_docs',
  collect_father: 'collect_name',
  collect_village_dob: 'collect_father',
  collect_caste_income: 'collect_village_dob',
  place_docs: 'collect_caste_income',
  doc_scan_animation: 'place_docs',
  auto_photo: 'doc_scan_animation',
  final_review: 'auto_photo',
};

interface StepNavFooterProps {
  language: LanguageCode;
  canGoBack: boolean;
  onGoBack: () => void;
  confirmCancelOpen: boolean;
  onToggleConfirmCancel: () => void;
  onConfirmReset: () => void;
  onNext?: () => void;
  nextLabel?: string;
}

function StepNavFooter({
  language,
  canGoBack,
  onGoBack,
  confirmCancelOpen,
  onToggleConfirmCancel,
  onConfirmReset,
  onNext,
  nextLabel,
}: StepNavFooterProps) {
  return (
    <div className="pt-4 mt-4 border-t border-[#D9DEE5] space-y-3">
      {confirmCancelOpen && (
        <div className="rounded-2xl bg-[#FDF2F2] border border-[#B3261E]/30 p-3.5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs sm:text-sm font-bold text-[#B3261E]">
            {language === 'gu'
              ? 'શું તમારે આ અરજી રદ કરીને શરૂઆતમાં જવું છે?'
              : language === 'hi'
                ? 'क्या आप यह आवेदन रद्द करके शुरूआत पर जाना चाहते हैं?'
                : 'Cancel this application and restart?'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onConfirmReset}
              className="px-4 py-2 text-xs font-bold text-white bg-[#B3261E] hover:bg-[#931E17] rounded-xl cursor-pointer"
            >
              {language === 'gu' ? 'હા, રદ કરો' : 'Yes, Cancel'}
            </button>
            <button
              type="button"
              onClick={onToggleConfirmCancel}
              className="px-4 py-2 text-xs font-bold text-[#123B63] bg-white border border-[#D9DEE5] rounded-xl cursor-pointer"
            >
              {language === 'gu' ? 'ચાલુ રાખો' : 'Keep Going'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {canGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>
                {language === 'gu'
                  ? 'પાછળ'
                  : language === 'hi'
                    ? 'पीछे'
                    : 'Back'}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={onToggleConfirmCancel}
            className="inline-flex items-center gap-1.5 px-3.5 py-3 text-xs sm:text-sm font-bold text-[#B3261E] bg-[#FDF2F2] border border-[#B3261E]/25 hover:bg-[#FBE6E6] rounded-xl transition-colors cursor-pointer"
          >
            <XCircle className="h-4 w-4" />
            <span>
              {language === 'gu'
                ? 'રદ કરો'
                : language === 'hi'
                  ? 'रद्द करें'
                  : 'Cancel'}
            </span>
          </button>
        </div>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-extrabold text-white bg-[#D32828] hover:bg-[#B3261E] rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <span>{nextLabel}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

interface MicStatusPillProps {
  micPhase: MicPhase;
  interimText: string;
  micNotice: MicNotice | null;
  language: LanguageCode;
  onStop: () => void;
  onDismissNotice: () => void;
}

function MicStatusPill({
  micPhase,
  interimText,
  micNotice,
  language,
  onStop,
  onDismissNotice,
}: MicStatusPillProps) {
  if (micPhase === 'idle' && !micNotice) return null;

  return (
    <div className="space-y-2">
      {(micPhase === 'starting' || micPhase === 'listening') && (
        <div className="rounded-2xl bg-[#ECF7F0] border border-[#046A38]/40 p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Mic className="h-5 w-5 text-[#046A38] shrink-0" />
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-extrabold text-[#046A38]">
                {language === 'gu'
                  ? 'માઈક ચાલુ છે — સ્પષ્ટ અવાજમાં બોલો...'
                  : language === 'hi'
                    ? 'माइक चालू है — स्पष्ट आवाज़ में बोलें...'
                    : 'Microphone listening — speak clearly...'}
              </div>
              {interimText && (
                <div className="text-sm font-bold text-[#123B63] truncate mt-0.5">
                  “{interimText}”
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onStop}
            className="px-3.5 py-2 text-xs font-extrabold text-white bg-[#046A38] hover:bg-[#03542C] rounded-xl cursor-pointer shrink-0"
          >
            {language === 'gu' ? 'થઈ ગયું (Done)' : 'Done'}
          </button>
        </div>
      )}

      {micNotice && (
        <div
          className={`rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs font-semibold ${
            micNotice.type === 'error'
              ? 'bg-[#FDF2F2] border-[#B3261E]/30 text-[#B3261E]'
              : 'bg-[#FAF6EE] border-[#F0A900]/40 text-[#202124]'
          }`}
        >
          <span>{micNotice.text}</span>
          <button
            type="button"
            onClick={onDismissNotice}
            className="text-xs underline font-bold cursor-pointer shrink-0"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

interface FieldVerifyBoxProps {
  language: LanguageCode;
  questionGu: string;
  questionHi?: string;
  questionEn: string;
  displayPrimary: string;
  displaySecondary?: string;
  onEditClick: () => void;
}

function FieldVerifyBox({
  language,
  questionGu,
  questionHi,
  questionEn,
  displayPrimary,
  displaySecondary,
  onEditClick,
}: FieldVerifyBoxProps) {
  if (!displayPrimary.trim()) return null;

  const qText =
    language === 'gu' ? questionGu : language === 'hi' && questionHi ? questionHi : questionEn;

  return (
    <div className="rounded-2xl bg-[#ECF7F0] border border-[#046A38]/40 p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-extrabold text-[#046A38] flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{qText}</span>
        </span>
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#123B63] underline underline-offset-2 cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>{language === 'gu' ? 'સુધારો' : language === 'hi' ? 'सुधारें' : 'Edit'}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onEditClick}
        className="w-full text-left rounded-xl bg-white border border-[#046A38]/25 hover:border-[#123B63] px-4 py-3 transition-colors cursor-pointer"
      >
        <div className="text-base sm:text-lg font-extrabold text-[#202124]">
          {displayPrimary}
        </div>
        {displaySecondary && (
          <div className="text-xs sm:text-sm font-semibold text-[#5F6368] mt-0.5">
            {displaySecondary}
          </div>
        )}
        <div className="text-[11px] font-semibold text-[#D32828] mt-1">
          {language === 'gu'
            ? 'જો નામ કે વિગત બદલવી હોય તો અહીં ક્લિક કરો'
            : language === 'hi'
              ? 'यदि नाम या विवरण बदलना हो तो यहाँ टैप करें'
              : 'Tap directly on this box to edit'}
        </div>
      </button>
    </div>
  );
}

export default function CitizenKioskView() {
  const {
    language,
    applications,
    activeKioskAppId,
    setActiveKioskAppId,
    submitApplication,
    setActiveView,
    kioskLaunchMode,
    kioskLaunchSeq,
    kioskPreselectedService,
  } = useSeva();

  const copy = UI_COPY[language];

  const [stage, setStage] = useState<ExtendedStage>('greeting');
  const [selectedService, setSelectedService] = useState(
    'Caste Certificate (Jati Pramanpatra)'
  );

  // Form fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantNameGu, setApplicantNameGu] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherNameGu, setFatherNameGu] = useState('');
  const [villageTaluka, setVillageTaluka] = useState('');
  const [dob, setDob] = useState('');
  const [casteCategory, setCasteCategory] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [occupation, setOccupation] = useState('');
  const [residenceYears, setResidenceYears] = useState('');

  // UI helper states
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<KeyboardField>('applicantName');
  const [validationNotice, setValidationNotice] = useState<string | null>(null);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [placingAnimating, setPlacingAnimating] = useState(false);

  // Built-in Browser SpeechSynthesis state (synced across kiosk & home launch clicks)
  const [isMuted, setIsMuted] = useState(false);
  const [speechSnap, setSpeechSnap] = useState<SpeechSnapshot>(() => getSpeechSnapshot());

  // Guided Step-by-Step Demo State (Waits for full speech & user "Continue"!)
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [demoAutoAdvance, setDemoAutoAdvance] = useState(false);
  const [isDemoBusySpeaking, setIsDemoBusySpeaking] = useState(false);
  const [waitingDemoContinue, setWaitingDemoContinue] = useState(false);

  const [subtitlePrimary, setSubtitlePrimary] = useState(
    STAGE_CONTENT_WELCOME(language).primary
  );
  const [subtitleSecondary, setSubtitleSecondary] = useState(
    STAGE_CONTENT_WELCOME(language).secondary
  );
  const [showCertModal, setShowCertModal] = useState(false);

  const timersRef = useRef<number[]>([]);
  const cancelledRef = useRef(false);
  const primaryInputRef = useRef<HTMLInputElement | null>(null);

  const isDemoRunningRef = useRef(isDemoRunning);
  const demoAutoAdvanceRef = useRef(demoAutoAdvance);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isDemoRunningRef.current = isDemoRunning;
  }, [isDemoRunning]);
  useEffect(() => {
    demoAutoAdvanceRef.current = demoAutoAdvance;
  }, [demoAutoAdvance]);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    return subscribeSpeechSnapshot(setSpeechSnap);
  }, []);

  const isSpeaking = speechSnap.isSpeaking;

  const voiceStatusHint =
    speechSnap.engineStatus === 'unsupported'
      ? language === 'gu'
        ? 'આ બ્રાઉઝરમાં અવાજ સપોર્ટ ઉપલબ્ધ નથી — કૃપા કરીને Chrome / Edge વાપરો.'
        : language === 'hi'
          ? 'इस ब्राउज़र में वॉइस उपलब्ध नहीं है — कृपया Chrome / Edge उपयोग करें।'
          : 'Built-in browser voice unavailable in this viewer — please open in Chrome/Edge.'
      : speechSnap.engineStatus === 'english_fallback'
        ? language === 'gu'
          ? `સિસ્ટમ ઇંગ્લિશ વૉઇસ સક્રિય (${speechSnap.activeVoiceName || 'OS Voice'}) · ગુજરાતી વાક્ય સ્ક્રીન પર છે`
          : language === 'hi'
            ? `सिस्टम अंग्रेज़ी वॉइस सक्रिय (${speechSnap.activeVoiceName || 'OS Voice'})`
            : `Active OS Voice: ${speechSnap.activeVoiceName || 'English Fallback'}`
        : speechSnap.engineStatus === 'native' && speechSnap.activeVoiceName
          ? language === 'gu'
            ? `બોટ અવાજ સક્રિય (${speechSnap.activeVoiceName})`
            : language === 'hi'
              ? `बॉट आवाज़ सक्रिय (${speechSnap.activeVoiceName})`
              : `Voice Active (${speechSnap.activeVoiceName})`
          : undefined;

  const {
    micPhase,
    micTarget,
    interimText,
    micNotice,
    toggleVoiceInput,
    stopVoiceInput,
    cancelVoiceInput,
    dismissMicNotice,
  } = useVoiceInput(language);

  const effectiveStage: ExtendedStage = activeKioskAppId ? 'submitted' : stage;

  const activeApplication = applications.find(
    (app) => app.id === activeKioskAppId
  );
  const isCertificateIssued = activeApplication?.status === 'Certificate Issued';

  // Keep browser speech voices preloaded and updated on voiceschanged
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
      return;
    }
    const handleVoices = () => refreshAvailableVoices(language);
    handleVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handleVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
    };
  }, [language]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const cancelSpeechImmediate = useCallback(() => {
    cancelBuiltInSpeech();
  }, []);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      clearAllTimers();
      cancelBuiltInSpeech();
    };
  }, [clearAllTimers]);

  // Synchronous-gesture-safe Built-in Browser Voice playback
  const speakText = useCallback(
    (
      text: string,
      subText?: string,
      fallbackMs = 2800,
      onDone?: () => void
    ) => {
      cancelVoiceInput();
      primeBuiltInSpeech(language);

      setSubtitlePrimary(text);
      if (subText) setSubtitleSecondary(subText);

      speakBuiltIn({
        text,
        subText,
        language,
        speechLocale: copy.speechLocale,
        isMuted: isMutedRef.current,
        fallbackMs,
        onDone,
      });
    },
    [cancelVoiceInput, copy.speechLocale, language]
  );

  const getExtendedPrompt = useCallback(
    (st: ExtendedStage, svc: string) => {
      if (st === 'place_docs') {
        return language === 'gu'
          ? {
              primary:
                'હવે તમારા ૫ દસ્તાવેજો નીચેની LED સ્કેન પ્લેટ પર એક પછી એક મૂકો, પછી સ્કેન શરૂ કરવાનું બટન દબાવો.',
              secondary:
                'Place your 5 paper documents flat on the bottom LED scan plate below.',
            }
          : language === 'hi'
            ? {
                primary:
                  'अब अपने 5 दस्तावेज़ नीचे की LED स्कैन प्लेट पर रखें और स्कैन शुरू करें बटन दबाएँ।',
                secondary:
                  'Place your 5 documents on the bottom LED scan plate.',
              }
            : {
                primary:
                  'Now lay your 5 documents flat on the bottom LED scan plate and tap Place on Plate.',
                secondary:
                  'કૃપા કરીને ૫ દસ્તાવેજો નીચેની સ્કેન પ્લેટ પર મૂકો.',
              };
      }
      const c = getStageCopy(language, st, svc);
      return {primary: c.aiPrompt, secondary: c.aiPromptSub};
    },
    [language]
  );

  const goToStage = useCallback(
    (
      nextStage: ExtendedStage,
      serviceOverride?: string,
      customSpoken?: {primary: string; secondary?: string}
    ) => {
      cancelVoiceInput();
      dismissMicNotice();
      setValidationNotice(null);
      setConfirmCancelOpen(false);
      setShowKeyboard(false);

      const effectiveSvc = serviceOverride ?? selectedService;
      if (nextStage === 'collect_name') setActiveField('applicantName');
      if (nextStage === 'collect_father') setActiveField('fatherName');
      if (nextStage === 'collect_village_dob') setActiveField('villageTaluka');
      if (nextStage === 'collect_caste_income') {
        const key = getServiceKey(effectiveSvc);
        setActiveField(
          key === 'income'
            ? 'occupation'
            : key === 'domicile'
              ? 'residenceYears'
              : 'casteCategory'
        );
      }

      setStage(nextStage);
      const prompt = customSpoken || getExtendedPrompt(nextStage, effectiveSvc);
      speakText(prompt.primary, prompt.secondary, 2600);
    },
    [
      cancelVoiceInput,
      dismissMicNotice,
      getExtendedPrompt,
      selectedService,
      speakText,
    ]
  );

  const resetAllFields = useCallback(() => {
    setApplicantName('');
    setApplicantNameGu('');
    setFatherName('');
    setFatherNameGu('');
    setVillageTaluka('');
    setDob('');
    setCasteCategory('');
    setAnnualIncome('');
    setOccupation('');
    setResidenceYears('');
    setShowKeyboard(false);
    setValidationNotice(null);
    setConfirmCancelOpen(false);
    setPlacingAnimating(false);
  }, []);

  const handleHardReset = useCallback(() => {
    cancelledRef.current = true;
    clearAllTimers();
    cancelSpeechImmediate();
    cancelVoiceInput();
    dismissMicNotice();
    setIsDemoRunning(false);
    setWaitingDemoContinue(false);
    setIsDemoBusySpeaking(false);
    setDemoStepIndex(0);
    setActiveKioskAppId(null);
    resetAllFields();
    setStage('greeting');
    const welcome = getExtendedPrompt('greeting', selectedService);
    speakText(welcome.primary, welcome.secondary, 2500);
  }, [
    cancelSpeechImmediate,
    cancelVoiceInput,
    clearAllTimers,
    dismissMicNotice,
    getExtendedPrompt,
    resetAllFields,
    selectedService,
    setActiveKioskAppId,
    speakText,
  ]);

  // AutoWrite Helper — clearly labeled as Demo Prototype data
  const handleAutoWriteStep = useCallback(
    (st: ExtendedStage) => {
      setValidationNotice(null);
      if (st === 'collect_name') {
        setApplicantName(DEMO_CITIZEN.applicantName);
        setApplicantNameGu(DEMO_CITIZEN.applicantNameGu);
      } else if (st === 'collect_father') {
        setFatherName(DEMO_CITIZEN.fatherName);
        setFatherNameGu(DEMO_CITIZEN.fatherNameGu);
      } else if (st === 'collect_village_dob') {
        setVillageTaluka(`${DEMO_CITIZEN.village}, Tal. ${DEMO_CITIZEN.taluka}`);
        setDob(DEMO_CITIZEN.dob);
      } else if (st === 'collect_caste_income') {
        const key = getServiceKey(selectedService);
        if (key === 'income') {
          setOccupation(DEMO_CITIZEN.occupation);
          setAnnualIncome(DEMO_CITIZEN.annualIncome);
        } else if (key === 'domicile') {
          setResidenceYears(DEMO_CITIZEN.residenceYears);
          setOccupation(DEMO_CITIZEN.occupation);
        } else {
          setCasteCategory(DEMO_CITIZEN.subCaste);
          setAnnualIncome(DEMO_CITIZEN.annualIncome);
        }
      }
    },
    [selectedService]
  );

  const regionalScript: 'gu' | 'hi' = language === 'hi' ? 'hi' : 'gu';

  // Ensure bilingual fields always stay properly separated (English in English box, Gujarati/Hindi in regional box)
  const applyApplicantNameSync = useCallback(
    (val: string, source: 'en' | 'regional' | 'voice') => {
      setValidationNotice(null);
      if (source === 'voice') {
        if (containsIndicScript(val)) {
          setApplicantNameGu(val);
          setApplicantName(transliterateToEnglish(val));
        } else {
          setApplicantName(val);
          setApplicantNameGu(val.trim() ? transliterateFromEnglish(val, regionalScript) : '');
        }
        return;
      }

      if (source === 'en') {
        if (containsIndicScript(val)) {
          setApplicantNameGu(val);
          setApplicantName(transliterateToEnglish(val));
        } else {
          setApplicantName(val);
          setApplicantNameGu(val.trim() ? transliterateFromEnglish(val, regionalScript) : '');
        }
        return;
      }

      // source === 'regional'
      setApplicantNameGu(val);
      setApplicantName(val.trim() ? transliterateToEnglish(val) : '');
    },
    [regionalScript]
  );

  const applyFatherNameSync = useCallback(
    (val: string, source: 'en' | 'regional' | 'voice') => {
      setValidationNotice(null);
      if (source === 'voice') {
        if (containsIndicScript(val)) {
          setFatherNameGu(val);
          setFatherName(transliterateToEnglish(val));
        } else {
          setFatherName(val);
          setFatherNameGu(val.trim() ? transliterateFromEnglish(val, regionalScript) : '');
        }
        return;
      }

      if (source === 'en') {
        if (containsIndicScript(val)) {
          setFatherNameGu(val);
          setFatherName(transliterateToEnglish(val));
        } else {
          setFatherName(val);
          setFatherNameGu(val.trim() ? transliterateFromEnglish(val, regionalScript) : '');
        }
        return;
      }

      setFatherNameGu(val);
      setFatherName(val.trim() ? transliterateToEnglish(val) : '');
    },
    [regionalScript]
  );

  // Active service docs mapped to live applicant inputs — NEVER duplicates Gujarati in English fields!
  const activeServiceKey = getServiceKey(selectedService);
  const rawEnApplicant = applicantName.trim() || applicantNameGu.trim();
  const resolvedApplicantName = rawEnApplicant
    ? containsIndicScript(rawEnApplicant)
      ? transliterateToEnglish(rawEnApplicant)
      : rawEnApplicant
    : DEMO_CITIZEN.applicantName;

  const rawGuApplicant = applicantNameGu.trim() || applicantName.trim();
  const resolvedApplicantNameGu = rawGuApplicant
    ? containsIndicScript(rawGuApplicant)
      ? rawGuApplicant
      : transliterateFromEnglish(rawGuApplicant, regionalScript)
    : DEMO_CITIZEN.applicantNameGu;

  const rawEnFather = fatherName.trim() || fatherNameGu.trim();
  const resolvedFatherName = rawEnFather
    ? containsIndicScript(rawEnFather)
      ? transliterateToEnglish(rawEnFather)
      : rawEnFather
    : DEMO_CITIZEN.fatherName;

  const rawGuFather = fatherNameGu.trim() || fatherName.trim();
  const resolvedFatherNameGu = rawGuFather
    ? containsIndicScript(rawGuFather)
      ? rawGuFather
      : transliterateFromEnglish(rawGuFather, regionalScript)
    : DEMO_CITIZEN.fatherNameGu;

  const normalizedLocationEn = villageTaluka.trim()
    ? transliterateToEnglish(villageTaluka.trim())
    : `${DEMO_CITIZEN.village}, Tal. ${DEMO_CITIZEN.taluka}`;
  const normalizedDob = dob.trim() ? normalizeIndicDigits(dob.trim()) : DEMO_CITIZEN.dob;
  const normalizedIncome = annualIncome.trim()
    ? normalizeSpokenIncomeInput(annualIncome.trim())
    : DEMO_CITIZEN.annualIncome;
  const normalizedCaste = casteCategory.trim()
    ? transliterateToEnglish(casteCategory.trim())
    : DEMO_CITIZEN.subCaste;
  const normalizedOccupation = occupation.trim()
    ? transliterateToEnglish(occupation.trim())
    : DEMO_CITIZEN.occupation;
  const normalizedResidence = residenceYears.trim()
    ? transliterateToEnglish(residenceYears.trim())
    : DEMO_CITIZEN.residenceYears;

  const activeServiceDocs = SERVICE_DOCUMENTS[activeServiceKey].map((doc) => {
    let dynamicDetail = doc.extractedCasteOrDetail;
    if (doc.docType === 'aadhaar') {
      dynamicDetail = `Address: ${normalizedLocationEn}, ${DEMO_CITIZEN.district}`;
    } else if (doc.docType === 'school') {
      dynamicDetail =
        activeServiceKey === 'domicile'
          ? `10+ Years Continuous Study in Gujarat · DOB: ${normalizedDob}`
          : `Caste: ${normalizedCaste} · DOB: ${normalizedDob}`;
    } else if (doc.docType === 'ration') {
      dynamicDetail = `Head of Family: ${resolvedFatherName} · Member Verified`;
    } else if (doc.docType === 'income') {
      dynamicDetail =
        activeServiceKey === 'income'
          ? `Source: ${normalizedOccupation} · Verified Annual Income: ${normalizedIncome}`
          : `Annual Income: ${normalizedIncome} (Verified Threshold)`;
    } else if (doc.id === 'dom-doc-5') {
      dynamicDetail = `Gujarat Domicile Confirmed: ${normalizedResidence}`;
    }

    return {
      ...doc,
      extractedName:
        doc.docType === 'father_caste' || doc.extractedName.includes('(Father)')
          ? `${resolvedFatherName} (Father)`
          : resolvedApplicantName,
      extractedNameGu:
        doc.docType === 'father_caste' || doc.extractedNameGu.includes('(પિતા)')
          ? `${resolvedFatherNameGu} (પિતા)`
          : resolvedApplicantNameGu,
      extractedFatherName:
        doc.docType === 'father_caste' || doc.extractedName.includes('(Father)')
          ? doc.extractedFatherName
          : resolvedFatherName,
      extractedFatherNameGu:
        doc.docType === 'father_caste' || doc.extractedNameGu.includes('(પિતા)')
          ? doc.extractedFatherNameGu
          : resolvedFatherNameGu,
      extractedCasteOrDetail: dynamicDetail,
    };
  });

  const handleSubmitPacket = useCallback(
    (customSpoken?: {primary: string; secondary?: string}) => {
      const appId = `GJ-TLK-2026-${Math.floor(84200 + Math.random() * 5700)}`;
      const now = new Date();
      const submittedAt = `${now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}, ${now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;

      const svcKey = getServiceKey(selectedService);
      const isIncome = svcKey === 'income';
      const isDomicile = svcKey === 'domicile';

      const locEn = villageTaluka.trim()
        ? transliterateToEnglish(villageTaluka.trim())
        : '';
      const locParts = locEn
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedVillage = locParts[0] || DEMO_CITIZEN.village;
      const parsedTaluka =
        locParts[1]?.replace(/^Tal\.?\s*/i, '') || DEMO_CITIZEN.taluka;
      const parsedDistrict =
        locParts[2]?.replace(/^Dist\.?\s*/i, '') || DEMO_CITIZEN.district;

      const record: ApplicationRecord = {
        id: appId,
        certificateType: selectedService,
        certificateTypeGu: isIncome
          ? 'તાલુકા આવકનો દાખલો'
          : isDomicile
            ? 'રહેઠાણનો દાખલો'
            : 'જાતિ પ્રમાણપત્ર (SEBC)',
        certificateTypeHi: isIncome
          ? 'तालुका आय प्रमाण पत्र'
          : isDomicile
            ? 'निवास प्रमाण पत्र'
            : 'जाति प्रमाण पत्र (SEBC)',
        applicantName: resolvedApplicantName,
        applicantNameGu: resolvedApplicantNameGu,
        fatherName: resolvedFatherName,
        fatherNameGu: resolvedFatherNameGu,
        village: parsedVillage,
        taluka: parsedTaluka,
        district: parsedDistrict,
        casteCategory: DEMO_CITIZEN.casteCategory,
        subCaste: isIncome
          ? normalizedOccupation
          : isDomicile
            ? normalizedResidence
            : normalizedCaste,
        dob: normalizedDob,
        annualIncome: normalizedIncome,
        aadhaarMasked: DEMO_CITIZEN.aadhaarMasked,
        submittedAt,
        status: 'Pending Mamlatdar DSC',
        aiScore: 100,
        spellingMismatches: 0,
        documents: activeServiceDocs,
      };

      submitApplication(record);
      goToStage('submitted', undefined, customSpoken);
    },
    [
      activeServiceDocs,
      goToStage,
      normalizedCaste,
      normalizedDob,
      normalizedIncome,
      normalizedOccupation,
      normalizedResidence,
      resolvedApplicantName,
      resolvedApplicantNameGu,
      resolvedFatherName,
      resolvedFatherNameGu,
      selectedService,
      submitApplication,
      villageTaluka,
    ]
  );

  // =========================================================================
  // GUIDED STEP-BY-STEP DEMO RUNNER (Waits for FULL speech + User Continue!)
  // =========================================================================
  const speakAndWait = useCallback(
    (primary: string, secondary?: string, reuseActiveTag?: string) =>
      new Promise<void>((resolve) => {
        if (reuseActiveTag && attachToActiveSpeechDone(reuseActiveTag, resolve)) {
          setSubtitlePrimary(primary);
          if (secondary) setSubtitleSecondary(secondary);
          return;
        }
        speakText(primary, secondary, Math.max(2400, primary.length * 70), () => {
          resolve();
        });
      }),
    [speakText]
  );

  const runSingleDemoStepRef = useRef<(stepIdx: number, launchTag?: string) => Promise<void>>(
    async () => {}
  );

  const runSingleDemoStep = useCallback(
    async (stepIdx: number, launchTag?: string) => {
      if (cancelledRef.current) return;
      const targetStage = DEMO_SEQUENCE[stepIdx];
      if (!targetStage) {
        setIsDemoRunning(false);
        setWaitingDemoContinue(false);
        return;
      }

      const demoSvc = 'Caste Certificate (Jati Pramanpatra)';
      setSelectedService(demoSvc);
      setDemoStepIndex(stepIdx);
      setWaitingDemoContinue(false);
      setIsDemoBusySpeaking(true);
      setStage(targetStage);

      const prompt = getExtendedPrompt(targetStage, demoSvc);
      await speakAndWait(prompt.primary, prompt.secondary, launchTag);
      if (cancelledRef.current) return;

      // After AI finishes speaking completely, reveal the illustrative demo entry cleanly
      if (
        targetStage === 'collect_name' ||
        targetStage === 'collect_father' ||
        targetStage === 'collect_village_dob' ||
        targetStage === 'collect_caste_income'
      ) {
        handleAutoWriteStep(targetStage);
      } else if (targetStage === 'place_docs') {
        setPlacingAnimating(true);
        await new Promise<void>((resolve) => {
          const id = window.setTimeout(resolve, 800);
          timersRef.current.push(id);
        });
        if (cancelledRef.current) return;
        setPlacingAnimating(false);
      }

      setIsDemoBusySpeaking(false);

      // Reached the final animated scan stage of Demo intro
      if (stepIdx >= DEMO_SEQUENCE.length - 1) {
        setIsDemoRunning(false);
        setWaitingDemoContinue(false);
        return;
      }

      // Strictly wait for user to tap Continue UNLESS optional Auto-Advance is toggled ON!
      if (demoAutoAdvanceRef.current) {
        const id = window.setTimeout(() => {
          if (!cancelledRef.current && demoAutoAdvanceRef.current) {
            void runSingleDemoStepRef.current(stepIdx + 1);
          }
        }, 2400);
        timersRef.current.push(id);
      } else {
        setWaitingDemoContinue(true);
      }
    },
    [getExtendedPrompt, handleAutoWriteStep, speakAndWait]
  );

  useEffect(() => {
    runSingleDemoStepRef.current = runSingleDemoStep;
  }, [runSingleDemoStep]);

  const startStepByStepDemo = useCallback(
    (launchTag?: string) => {
      cancelledRef.current = false;
      clearAllTimers();
      if (!launchTag || getActiveSpeechTag() !== launchTag) {
        cancelSpeechImmediate();
      }
      cancelVoiceInput();
      setActiveKioskAppId(null);
      resetAllFields();
      setIsDemoRunning(true);
      isDemoRunningRef.current = true;
      void runSingleDemoStep(0, launchTag);
    },
    [
      cancelSpeechImmediate,
      cancelVoiceInput,
      clearAllTimers,
      resetAllFields,
      runSingleDemoStep,
      setActiveKioskAppId,
    ]
  );

  const handleDemoContinueNext = useCallback(() => {
    if (!isDemoRunning || isDemoBusySpeaking) return;
    clearAllTimers();
    void runSingleDemoStep(demoStepIndex + 1);
  }, [clearAllTimers, demoStepIndex, isDemoBusySpeaking, isDemoRunning, runSingleDemoStep]);

  const launchHandlerRef = useRef<(seq: number) => void>(() => {});
  useEffect(() => {
    launchHandlerRef.current = (seq: number) => {
      const launchTag = `launch-${seq}`;

      if (kioskLaunchMode === 'demo') {
        startStepByStepDemo(launchTag);
        return;
      }

      cancelledRef.current = false;
      clearAllTimers();
      cancelVoiceInput();
      dismissMicNotice();
      setIsDemoRunning(false);
      setWaitingDemoContinue(false);
      setIsDemoBusySpeaking(false);
      setDemoStepIndex(0);
      resetAllFields();

      const targetSvc = kioskPreselectedService || 'Caste Certificate (Jati Pramanpatra)';
      const targetStage: ExtendedStage = kioskPreselectedService
        ? 'confirm_service'
        : 'greeting';

      setSelectedService(targetSvc);
      setStage(targetStage);
      setIsMuted(false);
      isMutedRef.current = false;

      const prompt = getExtendedPrompt(targetStage, targetSvc);
      setSubtitlePrimary(prompt.primary);
      if (prompt.secondary) setSubtitleSecondary(prompt.secondary);

      // Keep already-playing synchronous gesture audio alive instead of canceling it!
      if (getActiveSpeechTag() !== launchTag) {
        speakText(prompt.primary, prompt.secondary, 2600);
      }
    };
  }, [
    cancelVoiceInput,
    clearAllTimers,
    dismissMicNotice,
    getExtendedPrompt,
    kioskLaunchMode,
    kioskPreselectedService,
    resetAllFields,
    speakText,
    startStepByStepDemo,
  ]);

  useEffect(() => {
    if (kioskLaunchSeq > 0) {
      const id = window.setTimeout(() => {
        launchHandlerRef.current(kioskLaunchSeq);
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [kioskLaunchSeq]);

  // Refresh subtitle caption cleanly if UI language is switched mid-stage
  useEffect(() => {
    const prompt = getExtendedPrompt(effectiveStage, selectedService);
    const id = window.setTimeout(() => {
      setSubtitlePrimary(prompt.primary);
      if (prompt.secondary) setSubtitleSecondary(prompt.secondary);
    }, 0);
    return () => window.clearTimeout(id);
  }, [language, effectiveStage, selectedService, getExtendedPrompt]);

  const getActiveFieldValue = (field: KeyboardField): string => {
    if (field === 'applicantName') return applicantName;
    if (field === 'applicantNameGu') return applicantNameGu;
    if (field === 'fatherName') return fatherName;
    if (field === 'fatherNameGu') return fatherNameGu;
    if (field === 'villageTaluka') return villageTaluka;
    if (field === 'dob') return dob;
    if (field === 'casteCategory') return casteCategory;
    if (field === 'annualIncome') return annualIncome;
    if (field === 'occupation') return occupation;
    return residenceYears;
  };

  const setSyncedFieldValue = (field: KeyboardField, nextVal: string) => {
    setValidationNotice(null);
    if (field === 'applicantName') return applyApplicantNameSync(nextVal, 'en');
    if (field === 'applicantNameGu') return applyApplicantNameSync(nextVal, 'regional');
    if (field === 'fatherName') return applyFatherNameSync(nextVal, 'en');
    if (field === 'fatherNameGu') return applyFatherNameSync(nextVal, 'regional');
    if (field === 'villageTaluka') return setVillageTaluka(normalizeIndicDigits(nextVal));
    if (field === 'dob') return setDob(normalizeIndicDigits(nextVal));
    if (field === 'casteCategory') return setCasteCategory(nextVal);
    if (field === 'annualIncome') return setAnnualIncome(normalizeIndicDigits(nextVal));
    if (field === 'occupation') return setOccupation(nextVal);
    return setResidenceYears(normalizeIndicDigits(nextVal));
  };

  // On-Screen Keyboard Dispatchers (Now fully synced with bidirectional transliteration!)
  const applyKeyboardChar = (ch: string) => {
    const cur = getActiveFieldValue(activeField);
    setSyncedFieldValue(activeField, cur + ch);
  };

  const applyKeyboardBackspace = () => {
    const cur = getActiveFieldValue(activeField);
    setSyncedFieldValue(activeField, cur.slice(0, -1));
  };

  const applyKeyboardClear = () => {
    setSyncedFieldValue(activeField, '');
  };

  const getFieldDisplayLabel = (field: KeyboardField): string => {
    if (field === 'applicantName') {
      return language === 'gu'
        ? 'અરજદારનું નામ (English)'
        : language === 'hi'
          ? 'आवेदक का नाम (English)'
          : 'Applicant Name (English)';
    }
    if (field === 'applicantNameGu') {
      return language === 'gu'
        ? 'અરજદારનું નામ (ગુજરાતી)'
        : language === 'hi'
          ? 'आवेदक का नाम (हिन्दी)'
          : 'Applicant Name (Gujarati)';
    }
    if (field === 'fatherName') {
      return language === 'gu'
        ? 'પિતાનું નામ (English)'
        : language === 'hi'
          ? 'पिता का नाम (English)'
          : "Father's Name (English)";
    }
    if (field === 'fatherNameGu') {
      return language === 'gu'
        ? 'પિતાનું નામ (ગુજરાતી)'
        : language === 'hi'
          ? 'पिता का नाम (हिन्दी)'
          : "Father's Name (Gujarati)";
    }
    if (field === 'villageTaluka') {
      return language === 'gu' ? 'ગામ અને તાલુકો' : language === 'hi' ? 'गाँव और तालुका' : 'Village & Taluka';
    }
    if (field === 'dob') {
      return language === 'gu' ? 'જન્મ તારીખ' : language === 'hi' ? 'जन्म तिथि' : 'Date of Birth';
    }
    if (field === 'annualIncome') {
      return language === 'gu' ? 'વાર્ષિક આવક (₹)' : language === 'hi' ? 'वार्षिक आय (₹)' : 'Annual Income (₹)';
    }
    if (field === 'occupation') {
      return language === 'gu' ? 'વ્યવસાય' : language === 'hi' ? 'व्यवसाय' : 'Occupation';
    }
    if (field === 'residenceYears') {
      return language === 'gu' ? 'ગુજરાતમાં વસવાટના વર્ષો' : language === 'hi' ? 'गुजरात में निवास के वर्ष' : 'Years in Gujarat';
    }
    return language === 'gu' ? 'જાતિ / પેટા-જાતિ' : language === 'hi' ? 'जाति / उप-जाति' : 'Caste / Sub-Caste';
  };

  const getPreferredKeyboardLayout = (field: KeyboardField): KeyboardLayout => {
    if (field === 'applicantNameGu' || field === 'fatherNameGu') {
      return language === 'hi' ? 'hi' : 'gu';
    }
    return 'en';
  };

  const handleOpenEditField = (field: KeyboardField) => {
    setActiveField(field);
    setShowKeyboard(true);
    window.setTimeout(() => {
      primaryInputRef.current?.focus();
    }, 50);
  };

  const handleVoiceForField = (
    targetId: string,
    hint: string,
    applyValue: (txt: string) => void
  ) => {
    setValidationNotice(null);
    toggleVoiceInput({
      targetId,
      langLocale: copy.speechLocale,
      fieldHint: hint,
      onBeforeStart: cancelSpeechImmediate,
      onInterim: applyValue,
      onFinal: applyValue,
    });
  };

  const handlePlaceDocumentsOnPlate = () => {
    if (placingAnimating) return;
    setPlacingAnimating(true);
    const id = window.setTimeout(() => {
      setPlacingAnimating(false);
      goToStage('doc_scan_animation');
    }, 750);
    timersRef.current.push(id);
  };

  const handleSpeakDoubtAnswer = (doubtIdOrText: string) => {
    const doubtStage: KioskStage =
      effectiveStage === 'place_docs' ? 'doc_scan_animation' : effectiveStage;
    const ans = resolveCitizenDoubt(doubtIdOrText, language, doubtStage);
    speakText(ans.reply, ans.replySub, 3000);
  };

  const currentStepIdx = Math.max(0, STEP_ORDER.indexOf(effectiveStage));
  const totalVisibleSteps = 11;
  const displayStepNum = Math.min(currentStepIdx + 1, totalVisibleSteps);

  const physicalFiveDocs = activeServiceDocs.slice(0, 5);

  const serviceCards = [
    {
      value: 'Caste Certificate (Jati Pramanpatra)',
      titleGu: 'જાતિનો દાખલો',
      titleHi: 'जाति प्रमाण पत्र',
      titleEn: 'Caste Certificate',
      sub: 'SEBC / OBC / SC / ST',
      emojiBg: 'from-[#123B63] to-[#123B63]',
    },
    {
      value: 'Taluka Income Certificate',
      titleGu: 'આવકનો દાખલો',
      titleHi: 'आय प्रमाण पत्र',
      titleEn: 'Income Certificate',
      sub: 'Talati & Mamlatdar Income Proof',
      emojiBg: 'from-[#123B63] to-[#D32828]',
    },
    {
      value: 'Domicile Certificate',
      titleGu: 'રહેઠાણનો દાખલો',
      titleHi: 'निवास प्रमाण पत्र',
      titleEn: 'Domicile Certificate',
      sub: '10+ Years Gujarat Residence',
      emojiBg: 'from-[#123B63] to-[#046A38]',
    },
  ];

  const handleSelectServiceCard = (svcValue: string) => {
    setSelectedService(svcValue);
    goToStage('confirm_service', svcValue);
  };

  const canGoBack = Boolean(PREVIOUS_STAGE_MAP[effectiveStage]) && !isDemoRunning;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Top Focus Control Bar */}
      <div className="bg-white border border-[#D9DEE5] rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              cancelSpeechImmediate();
              cancelVoiceInput();
              setActiveView('home');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-extrabold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-xl transition-colors cursor-pointer"
          >
            <Home className="h-4 w-4 text-[#123B63]" />
            <span>{language === 'gu' ? 'હોમ' : language === 'hi' ? 'होम' : 'Home'}</span>
          </button>

          <span className="font-mono text-xs sm:text-sm font-extrabold text-[#123B63] px-3 py-1.5 rounded-xl bg-[#F6F8FA] border border-[#D9DEE5] tabular-nums">
            {language === 'gu'
              ? `પગલું ${displayStepNum} / ${totalVisibleSteps}`
              : language === 'hi'
                ? `चरण ${displayStepNum} / ${totalVisibleSteps}`
                : `Step ${displayStepNum} / ${totalVisibleSteps}`}
          </span>

          {effectiveStage !== 'greeting' && (
            <span className="hidden sm:inline text-xs font-bold text-[#046A38]">
              · {getServiceLabel(selectedService, language)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const prompt = getExtendedPrompt(effectiveStage, selectedService);
              speakText(prompt.primary, prompt.secondary, 2600);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-xl cursor-pointer whitespace-nowrap"
          >
            <Volume2 className="h-3.5 w-3.5 text-[#D32828]" />
            <span>
              {language === 'gu'
                ? 'અવાજ ફરી સાંભળો'
                : language === 'hi'
                  ? 'आवाज़ फिर सुनें'
                  : 'Replay Voice'}
            </span>
          </button>

          {isDemoRunning ? (
            <button
              type="button"
              onClick={() => {
                cancelledRef.current = true;
                clearAllTimers();
                cancelSpeechImmediate();
                setIsDemoRunning(false);
                setWaitingDemoContinue(false);
                setIsDemoBusySpeaking(false);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-[#B3261E] hover:bg-[#931E17] rounded-xl cursor-pointer whitespace-nowrap"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
              <span>
                {language === 'gu'
                  ? 'ડેમો બંધ કરો'
                  : language === 'hi'
                    ? 'डेमो बंद करें'
                    : 'Stop Demo'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startStepByStepDemo()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-[#202124] bg-[#FAB401] border border-[#F0A900] hover:bg-[#F0A900] rounded-xl cursor-pointer whitespace-nowrap"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>
                {language === 'gu'
                  ? 'સ્ટાર્ટ ડેમો'
                  : language === 'hi'
                    ? 'डेमो शुरू करें'
                    : 'Start Demo'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleHardReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-xl cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Full-Focus 2-Column Stage: Left 3D Robot + Instant Built-in Help | Right Focused Question */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <SevaRobot3D
            isSpeaking={isSpeaking}
            isListening={
              micPhase === 'listening' || micPhase === 'starting'
            }
            isMuted={isMuted}
            onToggleMute={() => {
              const nextMuted = !isMuted;
              isMutedRef.current = nextMuted;
              setIsMuted(nextMuted);
              if (nextMuted) cancelSpeechImmediate();
            }}
            onReplay={() => {
              const prompt = getExtendedPrompt(effectiveStage, selectedService);
              speakText(prompt.primary, prompt.secondary, 2600);
            }}
            voiceStatusHint={voiceStatusHint}
            subtitlePrimary={subtitlePrimary}
            subtitleSecondary={subtitleSecondary}
            language={language}
          />

          {/* Instant Offline Built-in Voice Doubt Helper (Zero API Cost) */}
          <div className="bg-white border border-[#D9DEE5] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#123B63]">
              <HelpCircle className="h-4 w-4 text-[#D32828]" />
              <span>
                {language === 'gu'
                  ? 'મૂંઝવણ હોય તો પૂછો (બોટ અવાજમાં જવાબ આપશે):'
                  : language === 'hi'
                    ? 'कोई सवाल हो तो टैप करें (तुरंत आवाज़ में उत्तर):'
                    : 'Common Citizen Questions (Instant Built-in Voice):'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_DOUBTS.map((d) => {
                const lbl =
                  language === 'gu'
                    ? d.labelGu
                    : language === 'hi'
                      ? d.labelHi
                      : d.labelEn;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSpeakDoubtAnswer(d.id)}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:border-[#123B63] rounded-lg cursor-pointer text-left"
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Guided Demo Bar + Focused Question */}
        <div className="lg:col-span-7 space-y-4">
          {/* Guided Step-by-Step Demo Control Panel (Waits for Full Speech + Continue Click!) */}
          {isDemoRunning && (
            <div className="rounded-2xl bg-[#FAF6EE] border-2 border-[#FAB401] p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-extrabold text-[#123B63]">
                    {language === 'gu'
                      ? `ગાઇડેડ ડેમો ચાલુ છે · પગલું ${demoStepIndex + 1} / ${DEMO_SEQUENCE.length}`
                      : `Guided Step-by-Step Demo · Step ${demoStepIndex + 1} / ${DEMO_SEQUENCE.length}`}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#202124] mt-0.5">
                    {isDemoBusySpeaking
                      ? language === 'gu'
                        ? 'બોટ આખું વાક્ય બોલીને સમજાવી રહ્યો છે... કૃપા કરીને સાંભળો.'
                        : 'AI Guide is speaking the full step explanation cleanly...'
                      : waitingDemoContinue
                        ? language === 'gu'
                          ? 'બોટનું બોલવાનું પૂરું થયું! હવે આગળ વધવા "આગળ વધો" બટન દબાવો.'
                          : 'Finished speaking! Tap Continue Demo Step when you are ready.'
                        : language === 'gu'
                          ? 'આગળનું પગલું તૈયાર થઈ રહ્યું છે...'
                          : 'Preparing next step...'}
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-bold text-[#202124] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={demoAutoAdvance}
                    onChange={(e) => setDemoAutoAdvance(e.target.checked)}
                    className="h-4 w-4 accent-[#123B63]"
                  />
                  <span>
                    {language === 'gu'
                      ? 'ઓટો આગળ વધે'
                      : 'Auto-Advance After Voice'}
                  </span>
                </label>
              </div>

              {waitingDemoContinue && !isDemoBusySpeaking && (
                <button
                  type="button"
                  onClick={handleDemoContinueNext}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-extrabold text-white bg-[#D32828] hover:bg-[#B3261E] rounded-xl cursor-pointer"
                >
                  <span>
                    {language === 'gu'
                      ? 'આગળ વધો — આગળનું ડેમો પગલું (Continue)'
                      : 'Continue Next Demo Step'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={effectiveStage}
              initial={{opacity: 0, y: 6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -4}}
              transition={{duration: 0.13, ease: 'easeOut'}}
            >
              {/* STEP 1: SELECT SERVICE */}
              {effectiveStage === 'greeting' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="space-y-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#123B63]">
                      {language === 'gu'
                        ? 'તમારે કયો દાખલો કઢાવવો છે?'
                        : language === 'hi'
                          ? 'आपको कौन-सा प्रमाण पत्र बनवाना है?'
                          : 'Which certificate do you need today?'}
                    </h1>
                    <p className="text-sm sm:text-base text-[#5F6368]">
                      {language === 'gu'
                        ? 'નીચેના ૩ માંથી એક બોક્સ પર ક્લિક કરો અથવા બોલીને જણાવો.'
                        : language === 'hi'
                          ? 'नीचे 3 में से किसी एक कार्ड पर टैप करें या बोलकर बताएँ।'
                          : 'Tap any certificate card below or speak naturally.'}
                    </p>
                  </div>

                  <DemoPrototypeNote language={language} context="form" />

                  <button
                    type="button"
                    onClick={() => {
                      setValidationNotice(null);
                      toggleVoiceInput({
                        targetId: 'serviceChoice',
                        langLocale: copy.speechLocale,
                        fieldHint: 'Certificate name',
                        onBeforeStart: cancelSpeechImmediate,
                        onFinal: (txt) => {
                          const matched = detectServiceFromText(txt);
                          if (matched) {
                            handleSelectServiceCard(matched.fullEn);
                          } else {
                            setValidationNotice(
                              language === 'gu'
                                ? 'કૃપા કરીને જાતિનો દાખલો, આવકનો દાખલો અથવા રહેઠાણનો દાખલો બોલો અથવા નીચેથી પસંદ કરો.'
                                : 'Please say Caste, Income, or Domicile certificate or tap a card below.'
                            );
                          }
                        },
                      });
                    }}
                    className={`w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm sm:text-base font-extrabold rounded-2xl transition-colors cursor-pointer ${
                      micTarget === 'serviceChoice'
                        ? 'bg-[#046A38] text-white'
                        : 'bg-[#123B63] hover:bg-[#0D2B49] text-white'
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                    <span>
                      {micTarget === 'serviceChoice'
                        ? language === 'gu'
                          ? 'સાંભળી રહ્યું છે — બોલો (દા.ત. આવકનો દાખલો)'
                          : 'Listening — Say Caste, Income, or Domicile'
                        : language === 'gu'
                          ? 'બોલીને દાખલો પસંદ કરો (ઈનબિલ્ટ માઈક)'
                          : 'Tap to Speak Service Name'}
                    </span>
                  </button>

                  <MicStatusPill
                    micPhase={micPhase}
                    interimText={interimText}
                    micNotice={micNotice}
                    language={language}
                    onStop={stopVoiceInput}
                    onDismissNotice={dismissMicNotice}
                  />

                  {validationNotice && (
                    <div className="rounded-xl bg-[#FAF6EE] border border-[#F0A900]/45 px-4 py-3 text-sm font-bold text-[#202124]">
                      {validationNotice}
                    </div>
                  )}

                  {/* 3 Big Visual Service Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {serviceCards.map((card) => (
                      <button
                        key={card.value}
                        type="button"
                        onClick={() => handleSelectServiceCard(card.value)}
                        className="group rounded-2xl border-2 border-[#D9DEE5] bg-white hover:border-[#123B63] p-5 text-left transition-all cursor-pointer flex flex-col justify-between gap-4"
                      >
                        <div
                          className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.emojiBg} text-white flex items-center justify-center`}
                        >
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-display text-lg font-extrabold text-[#123B63]">
                            {language === 'gu'
                              ? card.titleGu
                              : language === 'hi'
                                ? card.titleHi
                                : card.titleEn}
                          </div>
                          <div className="text-xs font-semibold text-[#5F6368] mt-1">
                            {card.sub}
                          </div>
                        </div>
                        <div className="text-xs font-extrabold text-[#123B63] inline-flex items-center gap-1">
                          <span>{language === 'gu' ? 'પસંદ કરો' : 'Select'}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: CONFIRM SERVICE */}
              {effectiveStage === 'confirm_service' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#123B63]">
                      {language === 'gu' ? 'સેવા કન્ફર્મેશન' : 'Confirm Selection'}
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#123B63]">
                      {language === 'gu'
                        ? `શું તમારે "${getServiceLabel(selectedService, language)}" કઢાવવો છે?`
                        : language === 'hi'
                          ? `क्या आपको "${getServiceLabel(selectedService, language)}" बनवाना है?`
                          : `Do you want to apply for "${getServiceLabel(selectedService, language)}"?`}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => goToStage('prepare_docs')}
                      className="rounded-2xl bg-[#046A38] hover:bg-[#03542C] text-white p-6 font-extrabold text-xl transition-all cursor-pointer flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 className="h-7 w-7" />
                      <span>
                        {language === 'gu'
                          ? 'હા, આગળ વધો'
                          : language === 'hi'
                            ? 'हाँ, आगे बढ़ें'
                            : 'Yes, Proceed'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => goToStage('greeting')}
                      className="rounded-2xl bg-[#F6F8FA] hover:bg-[#EEF2F7] text-[#123B63] border-2 border-[#D9DEE5] p-6 font-extrabold text-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span>
                        {language === 'gu'
                          ? 'ના, બીજી સેવા'
                          : language === 'hi'
                            ? 'नहीं, बदलें'
                            : 'No, Change Service'}
                      </span>
                    </button>
                  </div>

                  <StepNavFooter
                    language={language}
                    canGoBack={canGoBack}
                    onGoBack={() => goToStage('greeting')}
                    confirmCancelOpen={confirmCancelOpen}
                    onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                    onConfirmReset={handleHardReset}
                  />
                </div>
              )}

              {/* STEP 3: 5 REQUIRED DOCUMENTS CHECKLIST */}
              {effectiveStage === 'prepare_docs' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div>
                    <div className="text-xs font-bold text-[#123B63]">
                      {getServiceLabel(selectedService, language)}
                    </div>
                    <h2 className="font-display text-2xl font-extrabold text-[#123B63] mt-1">
                      {language === 'gu'
                        ? 'આ ૫ દસ્તાવેજો હાથમાં તૈયાર રાખો'
                        : language === 'hi'
                          ? 'ये 5 दस्तावेज़ अपने पास तैयार रखें'
                          : 'Keep These 5 Documents Ready'}
                    </h2>
                  </div>

                  <DemoPrototypeNote language={language} context="scan" />

                  <div className="space-y-2.5">
                    {physicalFiveDocs.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className="rounded-2xl bg-[#F6F8FA] border border-[#D9DEE5] px-4 py-3 flex items-center gap-3.5"
                      >
                        <span className="h-8 w-8 rounded-xl bg-[#123B63] text-white font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-extrabold text-[#123B63]">
                            {language === 'gu'
                              ? doc.titleGu
                              : language === 'hi'
                                ? doc.titleHi
                                : doc.titleEn}
                          </div>
                          <div className="text-xs text-[#5F6368]">{doc.titleEn}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <StepNavFooter
                    language={language}
                    canGoBack={canGoBack}
                    onGoBack={() => goToStage('confirm_service')}
                    confirmCancelOpen={confirmCancelOpen}
                    onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                    onConfirmReset={handleHardReset}
                    onNext={() => goToStage('collect_name')}
                    nextLabel={
                      language === 'gu'
                        ? 'બધા કાગળ તૈયાર છે — આગળ વધો'
                        : language === 'hi'
                          ? 'सभी दस्तावेज़ तैयार हैं — आगे बढ़ें'
                          : 'Documents Ready — Continue'
                    }
                  />
                </div>
              )}

              {/* STEP 4: COLLECT APPLICANT NAME */}
              {effectiveStage === 'collect_name' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#123B63]">
                        {language === 'gu'
                          ? 'વિગત ૧ / ૪'
                          : language === 'hi'
                            ? 'विवरण 1 / 4'
                            : 'DETAIL 1 OF 4'}
                      </div>
                      <h2 className="font-display text-2xl font-extrabold text-[#123B63] mt-0.5">
                        {language === 'gu'
                          ? 'તમારું પૂરું નામ બોલો અથવા લખો'
                          : language === 'hi'
                            ? 'अपना पूरा नाम बोलें या लिखें'
                            : 'Speak or Enter Your Full Name'}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAutoWriteStep('collect_name')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#202124] bg-[#FAB401] border border-[#F0A900] hover:bg-[#F0A900] rounded-xl cursor-pointer shrink-0"
                    >
                      <Wand2 className="h-4 w-4 text-[#202124]" />
                      <span>
                        {language === 'gu'
                          ? 'ઓટોરાઈટ (Demo)'
                          : language === 'hi'
                            ? 'ऑटो-राइट (Demo)'
                            : 'AutoWrite (Demo)'}
                      </span>
                    </button>
                  </div>

                  <DemoPrototypeNote language={language} context="form" />

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleVoiceForField(
                          'applicantName',
                          'Citizen Full Name (e.g. Rameshbhai Kanubhai Patel)',
                          (txt) => applyApplicantNameSync(txt, 'voice')
                        )
                      }
                      className={`flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-extrabold rounded-2xl cursor-pointer transition-all ${
                        micTarget === 'applicantName'
                          ? 'bg-[#046A38] text-white'
                          : 'bg-[#123B63] hover:bg-[#0D2B49] text-white'
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                      <span>
                        {micTarget === 'applicantName'
                          ? language === 'gu'
                            ? 'સાંભળી રહ્યું છે...'
                            : language === 'hi'
                              ? 'सुन रहा है...'
                              : 'Listening...'
                          : language === 'gu'
                            ? 'માઈકથી નામ બોલો'
                            : language === 'hi'
                              ? 'माइक से नाम बोलें'
                              : 'Speak Full Name'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowKeyboard((k) => !k)}
                      className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-2xl cursor-pointer"
                    >
                      <Keyboard className="h-5 w-5 text-[#123B63]" />
                      <span>
                        {language === 'gu'
                          ? 'કીબોર્ડ'
                          : language === 'hi'
                            ? 'कीबोर्ड'
                            : 'Keyboard'}
                      </span>
                    </button>
                  </div>

                  <MicStatusPill
                    micPhase={micPhase}
                    interimText={interimText}
                    micNotice={micNotice}
                    language={language}
                    onStop={stopVoiceInput}
                    onDismissNotice={dismissMicNotice}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123B63] mb-1.5">
                        {language === 'gu'
                          ? 'પૂરું નામ (Englishમાં — ઓટો ટ્રાન્સલિટરેટ)'
                          : language === 'hi'
                            ? 'पूरा नाम (English में)'
                            : 'Full Name (English)'}
                      </label>
                      <input
                        ref={primaryInputRef}
                        type="text"
                        value={applicantName}
                        onFocus={() => setActiveField('applicantName')}
                        onChange={(e) => applyApplicantNameSync(e.target.value, 'en')}
                        placeholder="e.g. Rameshbhai Kanubhai Patel"
                        className="w-full rounded-xl border-2 border-[#D9DEE5] focus:border-[#123B63] bg-white px-4 py-3 text-base font-bold text-[#202124] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#123B63] mb-1.5">
                        {language === 'gu'
                          ? 'નામ (ગુજરાતીમાં — ઓટો સિંક)'
                          : language === 'hi'
                            ? 'नाम (हिन्दी में — ऑटो सिंक)'
                            : 'Full Name (Gujarati)'}
                      </label>
                      <input
                        type="text"
                        value={applicantNameGu}
                        onFocus={() => setActiveField('applicantNameGu')}
                        onChange={(e) => applyApplicantNameSync(e.target.value, 'regional')}
                        placeholder={
                          language === 'hi'
                            ? 'उदा. रमेशभाई कनुभाई पटेल'
                            : 'દા.ત. રમેશભાઈ કનુભાઈ પટેલ'
                        }
                        className="w-full rounded-xl border-2 border-[#D9DEE5] focus:border-[#123B63] bg-white px-4 py-3 text-base font-bold text-[#202124] outline-none"
                      />
                    </div>
                  </div>

                  <FieldVerifyBox
                    language={language}
                    questionGu="શું તમારું નામ (English અને ગુજરાતી) આ જ છે? ચેક કરી લો:"
                    questionHi="क्या आपका नाम (English और हिन्दी) यही है? जांच लें:"
                    questionEn="Is this your exact full name? Please verify:"
                    displayPrimary={
                      applicantName.trim() || applicantNameGu.trim()
                        ? resolvedApplicantName
                        : ''
                    }
                    displaySecondary={
                      (applicantName.trim() || applicantNameGu.trim()) &&
                      resolvedApplicantNameGu !== resolvedApplicantName
                        ? resolvedApplicantNameGu
                        : undefined
                    }
                    onEditClick={() => handleOpenEditField('applicantName')}
                  />

                  {validationNotice && (
                    <div className="rounded-xl bg-[#FAF6EE] border border-[#F0A900]/45 px-4 py-2.5 text-sm font-bold text-[#202124]">
                      {validationNotice}
                    </div>
                  )}

                  {showKeyboard && (
                    <OnScreenKeyboard
                      targetLabel={getFieldDisplayLabel(activeField)}
                      preferredLayout={getPreferredKeyboardLayout(activeField)}
                      onKeyPress={applyKeyboardChar}
                      onBackspace={applyKeyboardBackspace}
                      onClear={applyKeyboardClear}
                      onDone={() => setShowKeyboard(false)}
                    />
                  )}

                  <StepNavFooter
                    language={language}
                    canGoBack={canGoBack}
                    onGoBack={() => goToStage('prepare_docs')}
                    confirmCancelOpen={confirmCancelOpen}
                    onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                    onConfirmReset={handleHardReset}
                    onNext={() => {
                      if (!applicantName.trim() && !applicantNameGu.trim()) {
                        setValidationNotice(
                          language === 'gu'
                            ? 'કૃપા કરીને તમારું નામ બોલો, લખો અથવા "ઓટોરાઈટ" દબાવો.'
                            : language === 'hi'
                              ? 'कृपया अपना नाम बोलें, लिखें या "ऑटो-राइट" दबाएँ।'
                              : 'Please enter your name or tap AutoWrite.'
                        );
                        return;
                      }
                      goToStage('collect_father');
                    }}
                    nextLabel={
                      language === 'gu'
                        ? 'સાચું છે — આગળ વધો'
                        : language === 'hi'
                          ? 'सही है — आगे बढ़ें'
                          : 'Confirm Name & Next'
                    }
                  />
                </div>
              )}

              {/* STEP 5: COLLECT FATHER NAME */}
              {effectiveStage === 'collect_father' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#123B63]">
                        {language === 'gu'
                          ? 'વિગત ૨ / ૪'
                          : language === 'hi'
                            ? 'विवरण 2 / 4'
                            : 'DETAIL 2 OF 4'}
                      </div>
                      <h2 className="font-display text-2xl font-extrabold text-[#123B63] mt-0.5">
                        {language === 'gu'
                          ? 'તમારા પિતાનું પૂરું નામ જણાવો'
                          : language === 'hi'
                            ? 'अपने पिता का पूरा नाम बताएँ'
                            : "Speak or Enter Father's Full Name"}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAutoWriteStep('collect_father')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#202124] bg-[#FAB401] border border-[#F0A900] hover:bg-[#F0A900] rounded-xl cursor-pointer shrink-0"
                    >
                      <Wand2 className="h-4 w-4 text-[#202124]" />
                      <span>
                        {language === 'gu'
                          ? 'ઓટોરાઈટ (Demo)'
                          : language === 'hi'
                            ? 'ऑटो-राइट (Demo)'
                            : 'AutoWrite (Demo)'}
                      </span>
                    </button>
                  </div>

                  <DemoPrototypeNote language={language} context="form" />

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleVoiceForField(
                          'fatherName',
                          "Father's Full Name (e.g. Kanubhai Nathabhai Patel)",
                          (txt) => applyFatherNameSync(txt, 'voice')
                        )
                      }
                      className={`flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-extrabold rounded-2xl cursor-pointer transition-all ${
                        micTarget === 'fatherName'
                          ? 'bg-[#046A38] text-white'
                          : 'bg-[#123B63] hover:bg-[#0D2B49] text-white'
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                      <span>
                        {micTarget === 'fatherName'
                          ? language === 'gu'
                            ? 'સાંભળી રહ્યું છે...'
                            : language === 'hi'
                              ? 'सुन रहा है...'
                              : 'Listening...'
                          : language === 'gu'
                            ? 'પિતાનું નામ બોલો'
                            : language === 'hi'
                              ? 'पिता का नाम बोलें'
                              : "Speak Father's Name"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowKeyboard((k) => !k)}
                      className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-2xl cursor-pointer"
                    >
                      <Keyboard className="h-5 w-5 text-[#123B63]" />
                      <span>
                        {language === 'gu'
                          ? 'કીબોર્ડ'
                          : language === 'hi'
                            ? 'कीबोर्ड'
                            : 'Keyboard'}
                      </span>
                    </button>
                  </div>

                  <MicStatusPill
                    micPhase={micPhase}
                    interimText={interimText}
                    micNotice={micNotice}
                    language={language}
                    onStop={stopVoiceInput}
                    onDismissNotice={dismissMicNotice}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123B63] mb-1.5">
                        {language === 'gu'
                          ? 'પિતાનું નામ (English)'
                          : language === 'hi'
                            ? 'पिता का नाम (English)'
                            : "Father's Name (English)"}
                      </label>
                      <input
                        ref={primaryInputRef}
                        type="text"
                        value={fatherName}
                        onFocus={() => setActiveField('fatherName')}
                        onChange={(e) => applyFatherNameSync(e.target.value, 'en')}
                        placeholder="e.g. Kanubhai Nathabhai Patel"
                        className="w-full rounded-xl border-2 border-[#D9DEE5] focus:border-[#123B63] bg-white px-4 py-3 text-base font-bold text-[#202124] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#123B63] mb-1.5">
                        {language === 'gu'
                          ? 'પિતાનું નામ (ગુજરાતીમાં)'
                          : language === 'hi'
                            ? 'पिता का नाम (हिन्दी में)'
                            : "Father's Name (Gujarati)"}
                      </label>
                      <input
                        type="text"
                        value={fatherNameGu}
                        onFocus={() => setActiveField('fatherNameGu')}
                        onChange={(e) => applyFatherNameSync(e.target.value, 'regional')}
                        placeholder={
                          language === 'hi'
                            ? 'उदा. कनुभाई नाथाभाई पटेल'
                            : 'દા.ત. કનુભાઈ નાથાભાઈ પટેલ'
                        }
                        className="w-full rounded-xl border-2 border-[#D9DEE5] focus:border-[#123B63] bg-white px-4 py-3 text-base font-bold text-[#202124] outline-none"
                      />
                    </div>
                  </div>

                  <FieldVerifyBox
                    language={language}
                    questionGu="શું તમારા પિતાનું નામ (English અને ગુજરાતી) આ જ છે? ચેક કરી લો:"
                    questionHi="क्या आपके पिता का नाम (English और हिन्दी) यही है? जांच लें:"
                    questionEn="Is your father's name accurate? Verify:"
                    displayPrimary={
                      fatherName.trim() || fatherNameGu.trim() ? resolvedFatherName : ''
                    }
                    displaySecondary={
                      (fatherName.trim() || fatherNameGu.trim()) &&
                      resolvedFatherNameGu !== resolvedFatherName
                        ? resolvedFatherNameGu
                        : undefined
                    }
                    onEditClick={() => handleOpenEditField('fatherName')}
                  />

                  {validationNotice && (
                    <div className="rounded-xl bg-[#FAF6EE] border border-[#F0A900]/45 px-4 py-2.5 text-sm font-bold text-[#202124]">
                      {validationNotice}
                    </div>
                  )}

                  {showKeyboard && (
                    <OnScreenKeyboard
                      targetLabel={getFieldDisplayLabel(activeField)}
                      preferredLayout={getPreferredKeyboardLayout(activeField)}
                      onKeyPress={applyKeyboardChar}
                      onBackspace={applyKeyboardBackspace}
                      onClear={applyKeyboardClear}
                      onDone={() => setShowKeyboard(false)}
                    />
                  )}

                  <StepNavFooter
                    language={language}
                    canGoBack={canGoBack}
                    onGoBack={() => goToStage('collect_name')}
                    confirmCancelOpen={confirmCancelOpen}
                    onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                    onConfirmReset={handleHardReset}
                    onNext={() => {
                      if (!fatherName.trim() && !fatherNameGu.trim()) {
                        setValidationNotice(
                          language === 'gu'
                            ? 'કૃપા કરીને પિતાનું નામ લખો અથવા "ઓટોરાઈટ" દબાવો.'
                            : language === 'hi'
                              ? 'कृपया पिता का नाम लिखें या "ऑटो-राइट" दबाएँ।'
                              : "Please enter father's name or tap AutoWrite."
                        );
                        return;
                      }
                      goToStage('collect_village_dob');
                    }}
                    nextLabel={
                      language === 'gu'
                        ? 'સાચું છે — આગળ વધો'
                        : language === 'hi'
                          ? 'सही है — आगे बढ़ें'
                          : 'Confirm & Next'
                    }
                  />
                </div>
              )}

              {/* STEP 6: VILLAGE, TALUKA & DATE OF BIRTH */}
              {effectiveStage === 'collect_village_dob' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#123B63]">
                        {language === 'gu'
                          ? 'વિગત ૩ / ૪'
                          : language === 'hi'
                            ? 'विवरण 3 / 4'
                            : 'DETAIL 3 OF 4'}
                      </div>
                      <h2 className="font-display text-2xl font-extrabold text-[#123B63] mt-0.5">
                        {language === 'gu'
                          ? 'તમારું ગામ, તાલુકો અને જન્મ તારીખ'
                          : language === 'hi'
                            ? 'आपका गाँव, तालुका और जन्म तिथि'
                            : 'Village, Taluka & Date of Birth'}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAutoWriteStep('collect_village_dob')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#202124] bg-[#FAB401] border border-[#F0A900] hover:bg-[#F0A900] rounded-xl cursor-pointer shrink-0"
                    >
                      <Wand2 className="h-4 w-4 text-[#202124]" />
                      <span>
                        {language === 'gu'
                          ? 'ઓટોરાઈટ (Demo)'
                          : language === 'hi'
                            ? 'ऑटो-राइट (Demo)'
                            : 'AutoWrite (Demo)'}
                      </span>
                    </button>
                  </div>

                  <DemoPrototypeNote language={language} context="form" />

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleVoiceForField(
                          'villageTaluka',
                          'Village and Taluka (e.g. Kundal, Tal. Sanand)',
                          (txt) => setVillageTaluka(transliterateToEnglish(txt))
                        )
                      }
                      className={`flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-extrabold rounded-2xl cursor-pointer transition-all ${
                        micTarget === 'villageTaluka'
                          ? 'bg-[#046A38] text-white'
                          : 'bg-[#123B63] hover:bg-[#0D2B49] text-white'
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                      <span>
                        {micTarget === 'villageTaluka'
                          ? language === 'gu'
                            ? 'સાંભળી રહ્યું છે...'
                            : language === 'hi'
                              ? 'सुन रहा है...'
                              : 'Listening...'
                          : language === 'gu'
                            ? 'ગામ અને તાલુકો બોલો'
                            : language === 'hi'
                              ? 'गाँव व तालुका बोलें'
                              : 'Speak Village'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleVoiceForField(
                          'dob',
                          'Date of Birth (e.g. 14/08/1998)',
                          (txt) => setDob(normalizeSpokenDateInput(txt))
                        )
                      }
                      className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-extrabold rounded-2xl cursor-pointer transition-all ${
                        micTarget === 'dob'
                          ? 'bg-[#046A38] text-white'
                          : 'bg-[#EEF4FB] border border-[#123B63]/30 text-[#123B63] hover:bg-[#E1ECF9]'
                      }`}
                    >
                      <Mic className="h-4 w-4" />
                      <span>
                        {micTarget === 'dob'
                          ? language === 'gu'
                            ? 'તારીખ બોલો...'
                            : 'Listening...'
                          : language === 'gu'
                            ? 'જન્મ તારીખ બોલો'
                            : language === 'hi'
                              ? 'जन्म तिथि बोलें'
                              : 'Speak DOB'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowKeyboard((k) => !k)}
                      className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-2xl cursor-pointer"
                    >
                      <Keyboard className="h-5 w-5 text-[#123B63]" />
                      <span>
                        {language === 'gu'
                          ? 'કીબોર્ડ'
                          : language === 'hi'
                            ? 'कीबोर्ड'
                            : 'Keyboard'}
                      </span>
                    </button>
                  </div>

                  <MicStatusPill
                    micPhase={micPhase}
                    interimText={interimText}
                    micNotice={micNotice}
                    language={language}
                    onStop={stopVoiceInput}
                    onDismissNotice={dismissMicNotice}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123B63] mb-1.5">
                        {language === 'gu'
                          ? 'ગામ અને તાલુકો'
                          : language === 'hi'
                            ? 'गाँव और तालुका'
                            : 'Village & Taluka'}
                      </label>
                      <input
                        ref={primaryInputRef}
                        type="text"
                        value={villageTaluka}
                        onFocus={() => setActiveField('villageTaluka')}
                        onChange={(e) => {
                          setValidationNotice(null);
                          setVillageTaluka(normalizeIndicDigits(e.target.value));
                        }}
                        placeholder="e.g. Kundal, Tal. Sanand"
                        className="w-full rounded-xl border-2 border-[#D9DEE5] focus:border-[#123B63] bg-white px-4 py-3 text-base font-bold text-[#202124] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#123B63] mb-1.5">
                        {language === 'gu'
                          ? 'જન્મ તારીખ (DD/MM/YYYY)'
                          : language === 'hi'
                            ? 'जन्म तिथि (DD/MM/YYYY)'
                            : 'Date of Birth (DD/MM/YYYY)'}
                      </label>
                      <input
                        type="text"
                        value={dob}
                        onFocus={() => setActiveField('dob')}
                        onChange={(e) => {
                          setValidationNotice(null);
                          setDob(normalizeIndicDigits(e.target.value));
                        }}
                        placeholder="14/08/1998"
                        className="w-full rounded-xl border-2 border-[#D9DEE5] focus:border-[#123B63] bg-white px-4 py-3 text-base font-bold text-[#202124] outline-none"
                      />
                    </div>
                  </div>

                  <FieldVerifyBox
                    language={language}
                    questionGu="શું તમારું ગામ અને જન્મ તારીખ સાચા છે?"
                    questionHi="क्या आपका गाँव और जन्म तिथि सही हैं?"
                    questionEn="Please verify your Village & Date of Birth:"
                    displayPrimary={
                      villageTaluka.trim()
                        ? transliterateToEnglish(villageTaluka.trim())
                        : ''
                    }
                    displaySecondary={
                      dob.trim() ? `DOB: ${normalizeIndicDigits(dob.trim())}` : undefined
                    }
                    onEditClick={() => handleOpenEditField('villageTaluka')}
                  />

                  {validationNotice && (
                    <div className="rounded-xl bg-[#FAF6EE] border border-[#F0A900]/45 px-4 py-2.5 text-sm font-bold text-[#202124]">
                      {validationNotice}
                    </div>
                  )}

                  {showKeyboard && (
                    <OnScreenKeyboard
                      targetLabel={getFieldDisplayLabel(activeField)}
                      preferredLayout={getPreferredKeyboardLayout(activeField)}
                      onKeyPress={applyKeyboardChar}
                      onBackspace={applyKeyboardBackspace}
                      onClear={applyKeyboardClear}
                      onDone={() => setShowKeyboard(false)}
                    />
                  )}

                  <StepNavFooter
                    language={language}
                    canGoBack={canGoBack}
                    onGoBack={() => goToStage('collect_father')}
                    confirmCancelOpen={confirmCancelOpen}
                    onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                    onConfirmReset={handleHardReset}
                    onNext={() => {
                      if (!villageTaluka.trim()) {
                        setValidationNotice(
                          language === 'gu'
                            ? 'કૃપા કરીને ગામ અને તાલુકો દાખલ કરો અથવા "ઓટોરાઈટ" દબાવો.'
                            : language === 'hi'
                              ? 'कृपया गाँव और तालुका दर्ज करें या "ऑटो-राइट" दबाएँ।'
                              : 'Please enter village/taluka or tap AutoWrite.'
                        );
                        return;
                      }
                      goToStage('collect_caste_income');
                    }}
                    nextLabel={
                      language === 'gu'
                        ? 'સાચું છે — આગળ વધો'
                        : language === 'hi'
                          ? 'सही है — आगे बढ़ें'
                          : 'Confirm & Next'
                    }
                  />
                </div>
              )}

              {/* STEP 7: SERVICE-SPECIFIC CASTE / INCOME / DOMICILE DETAILS */}
              {effectiveStage === 'collect_caste_income' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#123B63]">
                        {language === 'gu'
                          ? 'વિગત ૪ / ૪'
                          : language === 'hi'
                            ? 'विवरण 4 / 4'
                            : 'DETAIL 4 OF 4'}
                      </div>
                      <h2 className="font-display text-2xl font-extrabold text-[#123B63] mt-0.5">
                        {activeServiceKey === 'income'
                          ? language === 'gu'
                            ? 'વ્યવસાય અને પરિવારની વાર્ષિક આવક'
                            : language === 'hi'
                              ? 'व्यवसाय और परिवार की वार्षिक आय'
                              : 'Occupation & Annual Family Income'
                          : activeServiceKey === 'domicile'
                            ? language === 'gu'
                              ? 'ગુજરાતમાં વસવાટના વર્ષો અને વ્યવસાય'
                              : language === 'hi'
                                ? 'गुजरात में निवास के वर्ष और व्यवसाय'
                                : 'Years in Gujarat & Occupation'
                            : language === 'gu'
                              ? 'જાતિ / પેટા-જાતિ અને વાર્ષિક આવક'
                              : language === 'hi'
                                ? 'जाति / उप-जाति और वार्षिक आय'
                                : 'Caste / Sub-Caste & Annual Income'}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAutoWriteStep('collect_caste_income')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#202124] bg-[#FAB401] border border-[#F0A900] hover:bg-[#F0A900] rounded-xl cursor-pointer shrink-0"
                    >
                      <Wand2 className="h-4 w-4 text-[#202124]" />
                      <span>
                        {language === 'gu'
                          ? 'ઓટોરાઈટ (Demo)'
                          : language === 'hi'
                            ? 'ऑटो-राइट (Demo)'
                            : 'AutoWrite (Demo)'}
                      </span>
                    </button>
                  </div>

                  <DemoPrototypeNote language={language} context="form" />

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const target =
                          activeServiceKey === 'income'
                            ? 'occupation'
                            : activeServiceKey === 'domicile'
                              ? 'residenceYears'
                              : 'casteCategory';
                        handleVoiceForField(target, target, (txt) => {
                          const normalized = transliterateToEnglish(normalizeIndicDigits(txt));
                          if (activeServiceKey === 'income') {
                            setOccupation(normalized);
                          } else if (activeServiceKey === 'domicile') {
                            setResidenceYears(normalized);
                          } else {
                            setCasteCategory(normalized);
                          }
                        });
                      }}
                      className={`flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-extrabold rounded-2xl cursor-pointer transition-all ${
                        micTarget === 'occupation' ||
                        micTarget === 'residenceYears' ||
                        micTarget === 'casteCategory'
                          ? 'bg-[#046A38] text-white'
                          : 'bg-[#123B63] hover:bg-[#0D2B49] text-white'
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                      <span>
                        {micTarget === 'occupation' ||
                        micTarget === 'residenceYears' ||
                        micTarget === 'casteCategory'
                          ? language === 'gu'
                            ? 'સાંભળી રહ્યું છે...'
                            : language === 'hi'
                              ? 'सुन रहा है...'
                              : 'Listening...'
                          : language === 'gu'
                            ? 'અવાજથી વિગત બોલો'
                            : language === 'hi'
                              ? 'विवरण बोलें'
                              : 'Speak Details'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const target2 =
                          activeServiceKey === 'domicile' ? 'occupation' : 'annualIncome';
                        handleVoiceForField(target2, target2, (txt) => {
                          if (activeServiceKey === 'domicile') {
                            setOccupation(transliterateToEnglish(txt));
                          } else {
                            setAnnualIncome(normalizeSpokenIncomeInput(txt));
                          }
                        });
                      }}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-extrabold rounded-2xl cursor-pointer transition-all ${
                        micTarget === 'annualIncome' ||
                        (activeServiceKey === 'domicile' && micTarget === 'occupation')
                          ? 'bg-[#046A38] text-white'
                          : 'bg-[#EEF4FB] border border-[#123B63]/30 text-[#123B63] hover:bg-[#E1ECF9]'
                      }`}
                    >
                      <Mic className="h-4 w-4" />
                      <span>
                        {activeServiceKey === 'domicile'
                          ? language === 'gu'
                            ? 'વ્યવસાય બોલો'
                            : language === 'hi'
                              ? 'व्यवसाय बोलें'
                              : 'Speak Occupation'
                          : language === 'gu'
                            ? 'વાર્ષિક આવક બોલો'
                            : language === 'hi'
                              ? 'वार्षिक आय बोलें'
                              : 'Speak Income'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowKeyboard((k) => !k)}
                      className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-2xl cursor-pointer"
                    >
                      <Keyboard className="h-5 w-5 text-[#123B63]" />
                      <span>
                        {language === 'gu'
                          ? 'કીબોર્ડ'
                          : language === 'hi'
                            ? 'कीबोर्ड'
                            : 'Keyboard'}
                      </span>
                    </button>
                  </div>

                  <MicStatusPill
                    micPhase={micPhase}
                    interimText={interimText}
                    micNotice={micNotice}
                    language={language}
                    onStop={stopVoiceInput}
                    onDismissNotice={dismissMicNotice}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123B63] mb-1.5">
                        {activeServiceKey === 'income'
                          ? language === 'gu'
                            ? 'વ્યવસાય (ખેતી / નોકરી / ધંધો)'
                            : language === 'hi'
                              ? 'व्यवसाय (खेती / नौकरी / व्यापार)'
                              : 'Occupation'
                          : activeServiceKey === 'domicile'
                            ? language === 'gu'
                              ? 'ગુજરાતમાં વસવાટના વર્ષો'
                              : language === 'hi'
                                ? 'गुजरात में निवास के वर्ष'
                                : 'Years Residing in Gujarat'
                            : language === 'gu'
                              ? 'જાતિ / પેટા-જાતિ (Caste)'
                              : language === 'hi'
                                ? 'जाति / उप-जाति'
                                : 'Caste / Sub-Caste'}
                      </label>
                      <input
                        ref={primaryInputRef}
                        type="text"
                        value={
                          activeServiceKey === 'income'
                            ? occupation
                            : activeServiceKey === 'domicile'
                              ? residenceYears
                              : casteCategory
                        }
                        onFocus={() =>
                          setActiveField(
                            activeServiceKey === 'income'
                              ? 'occupation'
                              : activeServiceKey === 'domicile'
                                ? 'residenceYears'
                                : 'casteCategory'
                          )
                        }
                        onChange={(e) => {
                          setValidationNotice(null);
                          const val = normalizeIndicDigits(e.target.value);
                          if (activeServiceKey === 'income') {
                            setOccupation(val);
                          } else if (activeServiceKey === 'domicile') {
                            setResidenceYears(val);
                          } else {
                            setCasteCategory(val);
                          }
                        }}
                        placeholder={
                          activeServiceKey === 'income'
                            ? 'e.g. Agriculture / Farming'
                            : activeServiceKey === 'domicile'
                              ? 'e.g. 28 Years (Since Birth)'
                              : 'e.g. Patel (SEBC)'
                        }
                        className="w-full rounded-xl border-2 border-[#D9DEE5] focus:border-[#123B63] bg-white px-4 py-3 text-base font-bold text-[#202124] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#123B63] mb-1.5">
                        {activeServiceKey === 'domicile'
                          ? language === 'gu'
                            ? 'વ્યવસાય (Occupation)'
                            : language === 'hi'
                              ? 'व्यवसाय'
                              : 'Occupation'
                          : language === 'gu'
                            ? 'વાર્ષિક આવક (₹)'
                            : language === 'hi'
                              ? 'वार्षिक आय (₹)'
                              : 'Annual Income (₹)'}
                      </label>
                      <input
                        type="text"
                        value={
                          activeServiceKey === 'domicile'
                            ? occupation
                            : annualIncome
                        }
                        onFocus={() =>
                          setActiveField(
                            activeServiceKey === 'domicile'
                              ? 'occupation'
                              : 'annualIncome'
                          )
                        }
                        onChange={(e) => {
                          setValidationNotice(null);
                          const val = normalizeIndicDigits(e.target.value);
                          if (activeServiceKey === 'domicile') {
                            setOccupation(val);
                          } else {
                            setAnnualIncome(val);
                          }
                        }}
                        placeholder={
                          activeServiceKey === 'domicile'
                            ? 'e.g. Small Farming'
                            : '₹1,85,000'
                        }
                        className="w-full rounded-xl border-2 border-[#D9DEE5] focus:border-[#123B63] bg-white px-4 py-3 text-base font-bold text-[#202124] outline-none"
                      />
                    </div>
                  </div>

                  <FieldVerifyBox
                    language={language}
                    questionGu="શું આ વિગત બરાબર છે? ચેક કરી લો:"
                    questionHi="क्या यह विवरण सही है? जांच लें:"
                    questionEn="Please verify these details:"
                    displayPrimary={
                      activeServiceKey === 'income'
                        ? occupation.trim() || annualIncome.trim()
                          ? occupation.trim()
                            ? transliterateToEnglish(occupation.trim())
                            : normalizeSpokenIncomeInput(annualIncome.trim())
                          : ''
                        : activeServiceKey === 'domicile'
                          ? residenceYears.trim() || occupation.trim()
                            ? residenceYears.trim()
                              ? transliterateToEnglish(residenceYears.trim())
                              : transliterateToEnglish(occupation.trim())
                            : ''
                          : casteCategory.trim() || annualIncome.trim()
                            ? casteCategory.trim()
                              ? transliterateToEnglish(casteCategory.trim())
                              : normalizeSpokenIncomeInput(annualIncome.trim())
                            : ''
                    }
                    displaySecondary={
                      activeServiceKey === 'domicile'
                        ? occupation.trim()
                          ? transliterateToEnglish(occupation.trim())
                          : undefined
                        : annualIncome.trim()
                          ? `Annual Income: ${normalizeSpokenIncomeInput(annualIncome.trim())}`
                          : undefined
                    }
                    onEditClick={() =>
                      handleOpenEditField(
                        activeServiceKey === 'income'
                          ? 'occupation'
                          : activeServiceKey === 'domicile'
                            ? 'residenceYears'
                            : 'casteCategory'
                      )
                    }
                  />

                  {validationNotice && (
                    <div className="rounded-xl bg-[#FAF6EE] border border-[#F0A900]/45 px-4 py-2.5 text-sm font-bold text-[#202124]">
                      {validationNotice}
                    </div>
                  )}

                  {showKeyboard && (
                    <OnScreenKeyboard
                      targetLabel={getFieldDisplayLabel(activeField)}
                      preferredLayout={getPreferredKeyboardLayout(activeField)}
                      onKeyPress={applyKeyboardChar}
                      onBackspace={applyKeyboardBackspace}
                      onClear={applyKeyboardClear}
                      onDone={() => setShowKeyboard(false)}
                    />
                  )}

                  <StepNavFooter
                    language={language}
                    canGoBack={canGoBack}
                    onGoBack={() => goToStage('collect_village_dob')}
                    confirmCancelOpen={confirmCancelOpen}
                    onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                    onConfirmReset={handleHardReset}
                    onNext={() => {
                      const primaryVal =
                        activeServiceKey === 'income'
                          ? occupation.trim() || annualIncome.trim()
                          : activeServiceKey === 'domicile'
                            ? residenceYears.trim()
                            : casteCategory.trim();
                      if (!primaryVal) {
                        setValidationNotice(
                          language === 'gu'
                            ? 'કૃપા કરીને આ વિગત લખો અથવા "ઓટોરાઈટ" દબાવો.'
                            : language === 'hi'
                              ? 'कृपया यह विवरण लिखें या "ऑटो-राइट" दबाएँ।'
                              : 'Please fill this field or tap AutoWrite.'
                        );
                        return;
                      }
                      goToStage('place_docs');
                    }}
                    nextLabel={
                      language === 'gu'
                        ? 'સાચું છે — ડોક્યુમેન્ટ પ્લેટ પર જાઓ'
                        : language === 'hi'
                          ? 'सही है — दस्तावेज़ प्लेट पर जाएँ'
                          : 'Next: Place Docs on Plate'
                    }
                  />
                </div>
              )}

              {/* STEP 8: PLACE DOCUMENTS ON BOTTOM SCANNER PLATE */}
              {effectiveStage === 'place_docs' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div>
                    <div className="text-xs font-bold text-[#123B63]">
                      {language === 'gu'
                        ? 'હાર્ડવેર સ્કેનર માર્ગદર્શન'
                        : 'BOTTOM SCAN PLATEN'}
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#123B63] mt-1">
                      {language === 'gu'
                        ? 'કિઓસ્કની નીચેની LED પ્લેટ પર દસ્તાવેજ મૂકો'
                        : language === 'hi'
                          ? 'कियोस्क की नीचे की LED प्लेट पर दस्तावेज़ रखें'
                          : 'Place Your 5 Documents on Bottom LED Plate'}
                    </h2>
                    <p className="text-sm text-[#5F6368] mt-1">
                      {language === 'gu'
                        ? 'કાગળ મૂકવા માટે નીચેનું બટન દબાવો — ૧૬MP ઓવરહેડ કેમેરા તરત લેસર સ્કેન શરૂ કરશે.'
                        : 'Tap below to slide your documents onto the illuminated scanner bed.'}
                    </p>
                  </div>

                  <DemoPrototypeNote language={language} context="scan" />

                  <div className="rounded-3xl bg-gradient-to-b from-[#061233] to-[#0D215B] border-2 border-[#123B63] p-6 text-white relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs font-mono text-sky-200 mb-4">
                      <span>BOTTOM 16MP OVERHEAD LED PLATE</span>
                      <span className="text-[#34D399] font-bold">LED READY</span>
                    </div>

                    <div className="rounded-2xl border-2 border-dashed border-sky-400/50 bg-[#0A163D] min-h-[210px] p-4 flex flex-wrap items-center justify-center gap-3 relative">
                      {physicalFiveDocs.map((doc, idx) => (
                        <motion.div
                          key={doc.id}
                          initial={{y: 40, opacity: 0.7}}
                          animate={
                            placingAnimating
                              ? {y: 0, scale: 1.03, opacity: 1}
                              : {y: 8, scale: 0.96, opacity: 0.9}
                          }
                          transition={{
                            delay: idx * 0.08,
                            duration: 0.35,
                            ease: 'easeOut',
                          }}
                          className="w-36 sm:w-40 rounded-xl bg-white text-[#123B63] p-3 border border-[#D9DEE5]"
                        >
                          <div className="text-[10px] font-mono text-[#123B63] font-bold">
                            DOC 0{idx + 1}
                          </div>
                          <div className="text-xs font-extrabold truncate mt-0.5">
                            {language === 'gu' ? doc.titleGu : doc.titleEn}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceDocumentsOnPlate}
                    disabled={placingAnimating}
                    className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 text-base sm:text-lg font-extrabold text-white bg-[#046A38] hover:bg-[#03542C] rounded-2xl transition-all cursor-pointer"
                  >
                    <ScanLine className="h-6 w-6" />
                    <span>
                      {placingAnimating
                        ? language === 'gu'
                          ? 'દસ્તાવેજ પ્લેટ પર ગોઠવાઈ રહ્યા છે...'
                          : 'Placing Documents on Plate...'
                        : language === 'gu'
                          ? 'દસ્તાવેજો પ્લેટ પર મૂકી સ્કેન શરૂ કરો'
                          : 'Place Documents on Plate & Start Scan'}
                    </span>
                  </button>

                  <StepNavFooter
                    language={language}
                    canGoBack={canGoBack}
                    onGoBack={() => goToStage('collect_caste_income')}
                    confirmCancelOpen={confirmCancelOpen}
                    onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                    onConfirmReset={handleHardReset}
                  />
                </div>
              )}

              {/* STEP 9: DOCUMENT SCAN ANIMATION PLAYER */}
              {effectiveStage === 'doc_scan_animation' && (
                <div className="space-y-4">
                  <DocScanAnimationPlayer
                    documents={activeServiceDocs}
                    language={language}
                    autoPlay
                    onAllComplete={() => goToStage('auto_photo')}
                  />
                  <div className="uidai-card rounded-2xl px-5 py-3">
                    <StepNavFooter
                      language={language}
                      canGoBack={canGoBack}
                      onGoBack={() => goToStage('place_docs')}
                      confirmCancelOpen={confirmCancelOpen}
                      onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                      onConfirmReset={handleHardReset}
                    />
                  </div>
                </div>
              )}

              {/* STEP 10: AUTO PASSPORT PHOTO STAGE */}
              {effectiveStage === 'auto_photo' && (
                <div className="space-y-4">
                  <AutoPassportPhotoStage
                    language={language}
                    applicantName={resolvedApplicantName}
                    applicantNameGu={resolvedApplicantNameGu}
                    onComplete={() => goToStage('final_review')}
                  />
                  <div className="uidai-card rounded-2xl px-5 py-3">
                    <StepNavFooter
                      language={language}
                      canGoBack={canGoBack}
                      onGoBack={() => goToStage('doc_scan_animation')}
                      confirmCancelOpen={confirmCancelOpen}
                      onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                      onConfirmReset={handleHardReset}
                    />
                  </div>
                </div>
              )}

              {/* STEP 11: FINAL REVIEW & SUBMIT */}
              {effectiveStage === 'final_review' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div>
                    <div className="text-xs font-bold text-[#046A38] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      <span>100% AI SPELLING MATCHED · 0 ERRORS</span>
                    </div>
                    <h2 className="font-display text-2xl font-extrabold text-[#123B63] mt-1">
                      {language === 'gu'
                        ? 'છેલ્લી વાર તમારી બધી વિગતો ચકાસો'
                        : language === 'hi'
                          ? 'अंतिम बार अपना पूरा विवरण जाँचें'
                          : 'Final Application Review'}
                    </h2>
                  </div>

                  <DemoPrototypeNote language={language} context="submit" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                    <div className="rounded-2xl bg-[#F6F8FA] border border-[#D9DEE5] p-4">
                      <div className="text-xs text-[#5F6368]">
                        {copy.kiosk.applicantLabel}
                      </div>
                      <div className="font-extrabold text-[#123B63] mt-0.5">
                        {resolvedApplicantName}
                      </div>
                      <div className="text-xs text-[#5F6368]">
                        {resolvedApplicantNameGu}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#F6F8FA] border border-[#D9DEE5] p-4">
                      <div className="text-xs text-[#5F6368]">
                        {copy.kiosk.fatherLabel}
                      </div>
                      <div className="font-extrabold text-[#123B63] mt-0.5">
                        {resolvedFatherName}
                      </div>
                      <div className="text-xs text-[#5F6368]">
                        {resolvedFatherNameGu}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#F6F8FA] border border-[#D9DEE5] p-4">
                      <div className="text-xs text-[#5F6368]">
                        {copy.kiosk.talukaLabel}
                      </div>
                      <div className="font-extrabold text-[#123B63] mt-0.5">
                        {normalizedLocationEn}
                      </div>
                      <div className="text-xs text-[#5F6368]">
                        DOB: {normalizedDob}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#F6F8FA] border border-[#D9DEE5] p-4">
                      <div className="text-xs text-[#5F6368]">
                        {getServiceLabel(selectedService, language)}
                      </div>
                      <div className="font-extrabold text-[#123B63] mt-0.5">
                        {activeServiceKey === 'income'
                          ? normalizedOccupation
                          : activeServiceKey === 'domicile'
                            ? normalizedResidence
                            : normalizedCaste}
                      </div>
                      <div className="text-xs text-[#046A38] font-bold">
                        Income: {normalizedIncome}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubmitPacket()}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-base sm:text-lg font-extrabold text-white bg-[#D32828] hover:bg-[#B3261E] rounded-2xl transition-all cursor-pointer"
                  >
                    <FileCheck2 className="h-6 w-6" />
                    <span>
                      {language === 'gu'
                        ? 'મામલતદાર પોર્ટલ પર અરજી સબમિટ કરો'
                        : 'Submit Verified Application to Mamlatdar'}
                    </span>
                  </button>

                  <StepNavFooter
                    language={language}
                    canGoBack={canGoBack}
                    onGoBack={() => goToStage('auto_photo')}
                    confirmCancelOpen={confirmCancelOpen}
                    onToggleConfirmCancel={() => setConfirmCancelOpen((p) => !p)}
                    onConfirmReset={handleHardReset}
                  />
                </div>
              )}

              {/* STEP 12: SUBMITTED + CERTIFICATE UNLOCK */}
              {effectiveStage === 'submitted' && (
                <div className="uidai-card rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="rounded-2xl bg-[#ECF7F0] border border-[#046A38]/40 p-5 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#046A38] text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-[#046A38]">
                        APP ID: {activeApplication?.id || 'GJ-TLK-2026-NEW'}
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#123B63] mt-0.5">
                        {isCertificateIssued
                          ? copy.kiosk.issuedBannerTitle
                          : language === 'gu'
                            ? 'તમારી અરજી મામલતદાર ડેશબોર્ડ પર મોકલાઈ ગઈ છે!'
                            : 'Application Submitted to Mamlatdar Portal!'}
                      </h2>
                      <p className="text-sm text-[#5F6368] mt-1">
                        {isCertificateIssued
                          ? copy.kiosk.issuedBannerSub
                          : language === 'gu'
                            ? 'હવે મામલતદાર પોર્ટલ પર જઈ ૧-ક્લિક DSC સહીથી મંજૂર કરો — તરત જ અહીં પ્રિન્ટ ખુલી જશે.'
                            : 'Switch to the Mamlatdar Officer Portal to approve with 1-click DSC and unlock instant printing here.'}
                      </p>
                    </div>
                  </div>

                  <DemoPrototypeNote language={language} context="submit" />

                  <div className="flex flex-wrap gap-3">
                    {isCertificateIssued && activeApplication ? (
                      <button
                        type="button"
                        onClick={() => setShowCertModal(true)}
                        className="flex-1 min-w-[240px] inline-flex items-center justify-center gap-2.5 px-6 py-4 text-base font-extrabold text-white bg-[#046A38] hover:bg-[#03542C] rounded-2xl cursor-pointer"
                      >
                        <Printer className="h-5 w-5" />
                        <span>{copy.kiosk.viewCertificateBtn}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveView('mamlatdar')}
                        className="flex-1 min-w-[240px] inline-flex items-center justify-center gap-2.5 px-6 py-4 text-base font-extrabold text-white bg-[#123B63] hover:bg-[#0D2B49] rounded-2xl cursor-pointer"
                      >
                        <ShieldCheck className="h-5 w-5" />
                        <span>{copy.kiosk.switchToOfficerBtn}</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleHardReset}
                      className="inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#EEF2F7] rounded-2xl cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>
                        {language === 'gu' ? 'નવી અરજી' : 'New Application'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showCertModal && activeApplication && (
        <OfficialCertificateModal
          application={activeApplication}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </section>
  );
}

function STAGE_CONTENT_WELCOME(language: LanguageCode) {
  if (language === 'gu') {
    return {
      primary:
        'સેવા એઆઈ પર તમારું સ્વાગત છે! આજે તમારે કઈ સરકારી સેવા કે દાખલો કઢાવવો છે?',
      secondary: 'Welcome to SevaAI! Which certificate do you need today?',
    };
  }
  if (language === 'hi') {
    return {
      primary:
        'सेवा-एआई पर आपका स्वागत है! आज आपको कौन-सी सरकारी सेवा या प्रमाण पत्र चाहिए?',
      secondary: 'Welcome to SevaAI! Which certificate do you need today?',
    };
  }
  return {
    primary:
      'Welcome to SevaAI! Which government certificate or service do you need today?',
    secondary: 'સેવા એઆઈ પર તમારું સ્વાગત છે! તમારે શું સેવા જોઈએ છે?',
  };
}
