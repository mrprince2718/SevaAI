'use client';

import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {DEMO_SIX_DOCUMENTS, UI_COPY} from './i18n';
import {getStageCopy} from './conversational-kiosk';
import {primeBuiltInSpeech, speakBuiltIn} from './built-in-speech';
import {ApplicationRecord, LanguageCode, ViewMode} from './types';

const STORAGE_KEY = 'sevaai_taluka_applications_v1';
const KIOSK_APP_ID_KEY = 'sevaai_active_kiosk_app_id_v1';

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'GJ-TLK-2026-84102',
    certificateType: 'Income Certificate (Aavak No Dakhlo)',
    certificateTypeGu: 'તાલુકા આવકનો દાખલો',
    certificateTypeHi: 'तालुका आय प्रमाण पत्र',
    applicantName: 'Meenaben Harshadbhai Solanki',
    applicantNameGu: 'મીનાબેન હર્ષદભાઈ સોલંકી',
    fatherName: 'Harshadbhai Maganbhai Solanki',
    fatherNameGu: 'હર્ષદભાઈ મગનભાઈ સોલંકી',
    village: 'Virochannagar',
    taluka: 'Sanand',
    district: 'Ahmedabad',
    casteCategory: 'General (EWS Eligible)',
    subCaste: 'Rajput',
    dob: '22/04/1995',
    annualIncome: '₹1,42,000',
    aadhaarMasked: 'XXXX-XXXX-7193',
    submittedAt: '17 Nov 2026, 09:42 AM',
    status: 'Pending Mamlatdar DSC',
    aiScore: 100,
    spellingMismatches: 0,
    documents: DEMO_SIX_DOCUMENTS.map((doc) => ({
      ...doc,
      extractedName: 'Meenaben Harshadbhai Solanki',
      extractedNameGu: 'મીનાબેન હર્ષદભાઈ સોલંકી',
      extractedFatherName: 'Harshadbhai Maganbhai Solanki',
      extractedFatherNameGu: 'હર્ષદભાઈ મગનભાઈ સોલંકી',
      extractedCasteOrDetail:
        doc.docType === 'income'
          ? 'Annual Income: ₹1,42,000 · Talati Verified'
          : doc.docType === 'aadhaar'
            ? 'Address: Virochannagar, Tal. Sanand, Ahmedabad'
            : 'Verified Match · 0 Discrepancies',
    })),
  },
  {
    id: 'GJ-TLK-2026-83945',
    certificateType: 'Domicile Certificate (Rehvasi Dakhlo)',
    certificateTypeGu: 'રહેઠાણનો દાખલો',
    certificateTypeHi: 'निवास प्रमाण पत्र',
    applicantName: 'Prakashbhai Bhikhubhai Thakor',
    applicantNameGu: 'પ્રકાશભાઈ ભીખુભાઈ ઠાકોર',
    fatherName: 'Bhikhubhai Chhaganbhai Thakor',
    fatherNameGu: 'ભીખુભાઈ છગનભાઈ ઠાકોર',
    village: 'Goraj',
    taluka: 'Sanand',
    district: 'Ahmedabad',
    casteCategory: 'SEBC',
    subCaste: 'Thakor',
    dob: '03/11/1991',
    annualIncome: '₹1,10,000',
    aadhaarMasked: 'XXXX-XXXX-2204',
    submittedAt: '17 Nov 2026, 09:10 AM',
    approvedAt: '17 Nov 2026, 09:14 AM',
    officerName: 'Shri M. K. Jadeja (Mamlatdar, Sanand)',
    dscTokenId: 'DSC-GJ-AHM-2026-9941A',
    status: 'Certificate Issued',
    aiScore: 100,
    spellingMismatches: 0,
    documents: DEMO_SIX_DOCUMENTS.map((doc) => ({
      ...doc,
      extractedName: 'Prakashbhai Bhikhubhai Thakor',
      extractedNameGu: 'પ્રકાશભાઈ ભીખુભાઈ ઠાકોર',
      extractedFatherName: 'Bhikhubhai Chhaganbhai Thakor',
      extractedFatherNameGu: 'ભીખુભાઈ છગનભાઈ ઠાકોર',
      extractedCasteOrDetail: '15+ Years Residence Verified · Tal. Sanand',
    })),
  },
];

interface SevaContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  kioskLaunchMode: 'manual' | 'demo';
  kioskLaunchSeq: number;
  kioskPreselectedService: string | null;
  launchKiosk: (
    mode: 'manual' | 'demo',
    preselectedService?: string
  ) => void;
  applications: ApplicationRecord[];
  selectedApplicationId: string;
  setSelectedApplicationId: (id: string) => void;
  activeKioskAppId: string | null;
  setActiveKioskAppId: (id: string | null) => void;
  submitApplication: (record: ApplicationRecord) => void;
  approveApplicationWithDSC: (id: string) => void;
  resetAllDemoData: () => void;
}

const SevaContext = createContext<SevaContextValue | null>(null);

export function SevaProvider({children}: {children: React.ReactNode}) {
  const [language, setLanguage] = useState<LanguageCode>('gu');
  const [activeView, setActiveView] = useState<ViewMode>('home');
  const [kioskLaunchMode, setKioskLaunchMode] = useState<'manual' | 'demo'>('manual');
  const [kioskLaunchSeq, setKioskLaunchSeq] = useState(0);
  const [kioskPreselectedService, setKioskPreselectedService] = useState<string | null>(null);
  const launchSeqRef = useRef(0);
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>(
    INITIAL_APPLICATIONS[0].id
  );
  const [activeKioskAppId, setActiveKioskAppIdState] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ApplicationRecord[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApplications(parsed);
            setSelectedApplicationId(parsed[0].id);
          }
        } else {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(INITIAL_APPLICATIONS)
          );
        }

        const storedKioskId = window.localStorage.getItem(KIOSK_APP_ID_KEY);
        if (storedKioskId) {
          setActiveKioskAppIdState(storedKioskId);
        }
      } catch {
        // Fallback to in-memory seed if storage unavailable
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Cross-tab storage listener for real-time state syncing
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as ApplicationRecord[];
          if (Array.isArray(parsed)) {
            setApplications(parsed);
          }
        } catch {
          // ignore parse error
        }
      }
      if (e.key === KIOSK_APP_ID_KEY) {
        setActiveKioskAppIdState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const persistApplications = useCallback((next: ApplicationRecord[]) => {
    setApplications(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  }, []);

  const setActiveKioskAppId = useCallback((id: string | null) => {
    setActiveKioskAppIdState(id);
    try {
      if (id) {
        window.localStorage.setItem(KIOSK_APP_ID_KEY, id);
      } else {
        window.localStorage.removeItem(KIOSK_APP_ID_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const submitApplication = useCallback(
    (record: ApplicationRecord) => {
      setApplications((prev) => {
        const filtered = prev.filter((item) => item.id !== record.id);
        const next = [record, ...filtered];
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      setSelectedApplicationId(record.id);
      setActiveKioskAppId(record.id);
    },
    [setActiveKioskAppId]
  );

  const approveApplicationWithDSC = useCallback(
    (id: string) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const dateStr = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const tokenSuffix = Math.floor(1000 + Math.random() * 9000);

      setApplications((prev) => {
        const next = prev.map((app) =>
          app.id === id
            ? {
                ...app,
                status: 'Certificate Issued' as const,
                approvedAt: `${dateStr}, ${timeStr}`,
                officerName: 'Shri M. K. Jadeja (Mamlatdar, Sanand)',
                dscTokenId: `DSC-GJ-SND-2026-${tokenSuffix}`,
              }
            : app
        );
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const resetAllDemoData = useCallback(() => {
    persistApplications(INITIAL_APPLICATIONS);
    setSelectedApplicationId(INITIAL_APPLICATIONS[0].id);
    setActiveKioskAppId(null);
  }, [persistApplications, setActiveKioskAppId]);

  const launchKiosk = useCallback(
    (mode: 'manual' | 'demo', preselectedService?: string) => {
      const nextSeq = launchSeqRef.current + 1;
      launchSeqRef.current = nextSeq;

      primeBuiltInSpeech(language);

      const targetSvc =
        mode === 'demo'
          ? 'Caste Certificate (Jati Pramanpatra)'
          : preselectedService || 'Caste Certificate (Jati Pramanpatra)';
      const targetStage =
        mode === 'manual' && preselectedService ? 'confirm_service' : 'greeting';
      const prompt = getStageCopy(language, targetStage, targetSvc);

      // Start speech synchronously INSIDE the browser click gesture so audio is never blocked!
      speakBuiltIn(
        {
          text: prompt.aiPrompt,
          subText: prompt.aiPromptSub,
          language,
          speechLocale: UI_COPY[language].speechLocale,
          fallbackMs: Math.max(2400, prompt.aiPrompt.length * 68),
        },
        `launch-${nextSeq}`
      );

      setKioskLaunchMode(mode);
      setKioskPreselectedService(preselectedService ?? null);
      setKioskLaunchSeq(nextSeq);
      setActiveKioskAppId(null);
      setActiveView('kiosk');
    },
    [language, setActiveKioskAppId]
  );

  return (
    <SevaContext.Provider
      value={{
        language,
        setLanguage,
        activeView,
        setActiveView,
        kioskLaunchMode,
        kioskLaunchSeq,
        kioskPreselectedService,
        launchKiosk,
        applications,
        selectedApplicationId,
        setSelectedApplicationId,
        activeKioskAppId,
        setActiveKioskAppId,
        submitApplication,
        approveApplicationWithDSC,
        resetAllDemoData,
      }}
    >
      {children}
    </SevaContext.Provider>
  );
}

export function useSeva() {
  const ctx = useContext(SevaContext);
  if (!ctx) {
    throw new Error('useSeva must be used inside SevaProvider');
  }
  return ctx;
}
