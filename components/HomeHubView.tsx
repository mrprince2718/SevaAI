'use client';

import React, {useEffect, useState} from 'react';
import {
  MonitorSmartphone,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Mic,
  Keyboard,
  FileCheck2,
  Sparkles,
  Play,
  Rocket,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Clock,
  IndianRupee,
  Zap,
} from 'lucide-react';
import {useSeva} from '@/lib/seva-store';
import {UI_COPY} from '@/lib/i18n';
import {
  cancelBuiltInSpeech,
  primeBuiltInSpeech,
  speakBuiltIn,
  subscribeSpeechSnapshot,
} from '@/lib/built-in-speech';
import SevaRobot3D from './SevaRobot3D';
import DemoPrototypeNote from './DemoPrototypeNote';

export default function HomeHubView() {
  const {language, setActiveView, launchKiosk, applications} = useSeva();
  const [homeSpeaking, setHomeSpeaking] = useState(false);
  const [homeMuted, setHomeMuted] = useState(false);
  const [talukaCount, setTalukaCount] = useState<number>(25);

  // Interactive Taluka Deployment Simulator calculations (₹68,000/unit)
  const hardwareCapex = talukaCount * 68000;
  const annualCertificates = talukaCount * 36000; // ~100 apps/day/taluka
  const citizenSavingsInr = annualCertificates * 1200; // ₹1,200 saved in touts & travel
  const officerHoursSaved = Math.round((annualCertificates * 14.75) / 60);

  const formatCrOrLakhs = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(2)} L`;
  };

  useEffect(() => {
    return subscribeSpeechSnapshot((snap) => {
      setHomeSpeaking(snap.isSpeaking);
    });
  }, []);

  const pendingCount = applications.filter(
    (a) => a.status === 'Pending Mamlatdar DSC'
  ).length;
  const issuedCount = applications.filter(
    (a) => a.status === 'Certificate Issued'
  ).length;

  const citizenQuickServices = [
    {
      serviceValue: 'Caste Certificate (Jati Pramanpatra)',
      title:
        language === 'gu'
          ? 'જાતિનો દાખલો'
          : language === 'hi'
            ? 'जाति प्रमाण पत्र'
            : 'Caste Certificate',
      desc:
        language === 'gu'
          ? 'SEBC / OBC / SC / ST જાતિનું પ્રમાણપત્ર અવાજ અને OCR થી.'
          : 'Voice-guided SEBC/OBC/SC/ST caste verification packet.',
      status: language === 'gu' ? '૧૦ મિનિટમાં તૈયાર' : 'Instant AI OCR',
    },
    {
      serviceValue: 'Taluka Income Certificate',
      title:
        language === 'gu'
          ? 'આવકનો દાખલો'
          : language === 'hi'
            ? 'आय प्रमाण पत्र'
            : 'Income Certificate',
      desc:
        language === 'gu'
          ? 'તલાટી પંચનામા અને ૭/૧૨ ઉતારા મુજબ પરિવારની આવક.'
          : 'Family income verification for schemes & scholarships.',
      status: language === 'gu' ? '₹૦ વચેટિયા ખર્ચ' : 'Zero Middleman Fee',
    },
    {
      serviceValue: 'Domicile Certificate',
      title:
        language === 'gu'
          ? 'રહેઠાણનો દાખલો'
          : language === 'hi'
            ? 'निवास प्रमाण पत्र'
            : 'Domicile Certificate',
      desc:
        language === 'gu'
          ? 'ગુજરાતમાં ૧૦+ વર્ષના કાયમી વસવાટનું પ્રમાણપત્ર.'
          : '10+ years permanent Gujarat residence verification.',
      status: language === 'gu' ? '૦% સ્પેલિંગ ભૂલ' : '0% Spelling Errors',
    },
  ];

  const portalModules = [
    {
      id: 'kiosk' as const,
      number: '01',
      title:
        language === 'gu'
          ? 'નાગરિક સેવા કિઓસ્ક'
          : language === 'hi'
            ? 'नागरिक सेवा कियोस्क'
            : 'Citizen Kiosk Terminal',
      subtitle:
        language === 'gu'
          ? '3D AI રોબોટ સાથે એક-એક સરળ સવાલ, અવાજથી ફોર્મ, ઓટોરાઈટ અને સ્કેન.'
          : 'Full-focus 3D AI guide with single questions, voice & AutoWrite.',
      badge: language === 'gu' ? 'લાઈવ ટર્મિનલ' : 'Live Terminal',
      icon: <MonitorSmartphone className="h-5 w-5" />,
    },
    {
      id: 'mamlatdar' as const,
      number: '02',
      title:
        language === 'gu'
          ? 'મામલતદાર અધિકારી પોર્ટલ'
          : language === 'hi'
            ? 'मामलातदार अधिकारी पोर्टल'
            : 'Mamlatdar Officer Portal',
      subtitle:
        language === 'gu'
          ? 'કિઓસ્કથી આવેલી અરજીઓ ૧-ક્લિક DSC સહીથી તરત મંજૂર કરો.'
          : 'Review citizen packets and approve with 1-click DSC.',
      badge: `${pendingCount} Pending · ${issuedCount} Issued`,
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      id: 'blueprint' as const,
      number: '03',
      title:
        language === 'gu'
          ? 'હાર્ડવેર અને ₹૬૮,૦૦૦ BOM'
          : language === 'hi'
            ? 'हार्डवेयर और ₹68,000 BOM'
            : 'Hardware & ₹68,000 BOM',
      subtitle:
        language === 'gu'
          ? '૧૬MP ઓવરહેડ સ્કેન પ્લેટ, ૨૧.૫" ટચસ્ક્રીન અને ફેસ-કેમ બ્લુપ્રિન્ટ.'
          : language === 'hi'
            ? '16MP स्कैन प्लेट, 21.5" टचस्क्रीन और फेस-कैम ब्लूप्रिंट।'
            : '5-zone kiosk schematic with 16MP scan platen & 21.5" touch display.',
      badge: '₹68,000 Make-in-India',
      icon: <Cpu className="h-5 w-5" />,
    },
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Main Clean Two-Column Layout Inspired by myAadhaar Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 Cols): Navy Authority Banner + Calm Lavender Grouped Service Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* Authoritative Navy #123B63 Banner + Primary Aadhaar Red #D32828 CTA */}
          <div className="uidai-hero-gradient rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FAB401]">
                <Sparkles className="h-4 w-4" />
                <span>SevaAI · સ્માર્ટ તાલુકા ઈ-ગવર્નન્સ પોર્ટલ</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {language === 'gu'
                  ? 'દસ્તાવેજ બનાવવા છે? માત્ર ૧ ક્લિકથી શરૂ કરો'
                  : language === 'hi'
                    ? 'सरकारी दस्तावेज़ बनवाना है? एक क्लिक में शुरू करें'
                    : 'Need a Government Certificate? Start in One Click'}
              </h1>

              <p className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
                {language === 'gu'
                  ? 'નાના બાળકથી લઈને વડીલ સુધી દરેક સમજી શકે તેવું સરળ AI માર્ગદર્શન — જાતિ, આવક કે રહેઠાણનો દાખલો ૧૦ મિનિટમાં તૈયાર કરો.'
                  : language === 'hi'
                    ? 'हर नागरिक के लिए अत्यंत सरल AI मार्गदर्शन — जाति, आय या निवास प्रमाण पत्र 10 मिनट में तैयार करें।'
                    : 'Built to be crystal clear for every citizen — apply for Caste, Income, or Domicile certificates effortlessly with our 3D AI guide.'}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => launchKiosk('manual')}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-extrabold text-white bg-[#D32828] hover:bg-[#B3261E] active:scale-[0.98] rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <Rocket className="h-5 w-5" />
                  <span>
                    {language === 'gu'
                      ? 'શરૂ કરો (Start Application)'
                      : language === 'hi'
                        ? 'शुरू करें (Start)'
                        : 'Start Application'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => launchKiosk('demo')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-extrabold text-[#202124] bg-[#FAB401] hover:bg-[#F0A900] rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  <Play className="h-4 w-4 fill-current text-[#202124]" />
                  <span>
                    {language === 'gu'
                      ? 'સ્ટાર્ટ ડેમો (Step-by-Step)'
                      : language === 'hi'
                        ? 'स्टार्ट डेमो (Step-by-Step)'
                        : 'Start Guided Demo'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* myAadhaar-Style Grouped Soft Lavender Service Container */}
          <div className="myaadhaar-lavender-panel rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#202124]">
                  {language === 'gu'
                    ? 'તાલુકા પ્રમાણપત્ર સેવાઓ'
                    : language === 'hi'
                      ? 'तालुका प्रमाण पत्र सेवाएँ'
                      : 'Taluka Certificate Services'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
                  {language === 'gu'
                    ? 'કોઈપણ સેવા પસંદ કરીને સીધી અરજી શરૂ કરો'
                    : 'Select any service below to open the guided kiosk'}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ECF7F0] border border-[#046A38]/25 text-xs font-bold text-[#046A38]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>0% Rejection Rate</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {citizenQuickServices.map((svc) => (
                <button
                  key={svc.serviceValue}
                  type="button"
                  onClick={() => launchKiosk('manual', svc.serviceValue)}
                  className="bg-white border border-[#D9DEE5] hover:border-[#123B63] rounded-2xl p-5 text-left transition-all cursor-pointer flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="h-10 w-10 rounded-xl bg-[#F6F8FA] border border-[#D9DEE5] text-[#123B63] flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-extrabold text-[#202124] group-hover:text-[#123B63]">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-[#5F6368] leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-[#046A38]">
                      {svc.status}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="h-8 w-8 rounded-full border border-[#D9DEE5] group-hover:border-[#123B63] group-hover:bg-[#123B63] group-hover:text-white text-[#202124] flex items-center justify-center transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-bold text-[#5F6368]">
                        ₹20 Gov Fee
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* All 3 System Modules (Clean White Cards with #D9DEE5 Border) */}
          <div className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#202124]">
              {language === 'gu'
                ? 'સંપૂર્ણ પોર્ટલ વિભાગો (All Platform Sections)'
                : language === 'hi'
                  ? 'संपूर्ण पोर्टल अनुभाग (All Platform Sections)'
                  : 'All Platform Modules'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {portalModules.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() =>
                    mod.id === 'kiosk'
                      ? launchKiosk('manual')
                      : setActiveView(mod.id)
                  }
                  className="bg-white border border-[#D9DEE5] hover:border-[#123B63] rounded-2xl p-5 text-left transition-all cursor-pointer flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-[#F6F8FA] border border-[#D9DEE5] text-[#123B63] group-hover:bg-[#123B63] group-hover:text-white transition-colors flex items-center justify-center">
                          {mod.icon}
                        </div>
                        <span className="font-mono text-xs font-bold text-[#5F6368]">
                          MODULE {mod.number}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#046A38]">
                        {mod.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base sm:text-lg font-extrabold text-[#202124]">
                        {mod.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D9DEE5] text-xs sm:text-sm font-bold text-[#123B63]">
                    <span>
                      {language === 'gu' ? 'વિભાગ ખોલો' : 'Open Section'}
                    </span>
                    <span className="h-7 w-7 rounded-full border border-[#D9DEE5] group-hover:border-[#123B63] group-hover:bg-[#123B63] group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 Cols): 3D Cute Robot + Warm Sand Quick-Action Cards (Just Like Screenshot) */}
        <div className="lg:col-span-4 space-y-5">
          <SevaRobot3D
            compact
            isSpeaking={homeSpeaking}
            isMuted={homeMuted}
            onToggleMute={() => {
              const next = !homeMuted;
              setHomeMuted(next);
              if (next) cancelBuiltInSpeech();
            }}
            onReplay={() => {
              primeBuiltInSpeech(language);
              const primary =
                language === 'gu'
                  ? 'નમસ્તે! હું સેવા-એઆઈ છું. તમારો દાખલો બનાવવા "શરૂ કરો" દબાવો!'
                  : language === 'hi'
                    ? 'नमस्ते! मैं सेवा-एआई हूँ। आवेदन के लिए "शुरू करें" दबाएँ!'
                    : 'Namaste! I am SevaAI. Tap Start Application to begin!';
              const secondary =
                language === 'gu'
                  ? 'અથવા સ્ટેપ-બાય-સ્ટેપ જોવા "સ્ટાર્ટ ડેમો" દબાવો.'
                  : language === 'hi'
                    ? 'या स्टेप-बाय-स्टेप देखने के लिए "स्टार्ट डेमो" दबाएँ।'
                    : 'Or tap Start Demo for the hands-free showcase.';
              speakBuiltIn({
                text: primary,
                subText: secondary,
                language,
                speechLocale: UI_COPY[language].speechLocale,
                isMuted: homeMuted,
              });
            }}
            language={language}
            subtitlePrimary={
              language === 'gu'
                ? 'નમસ્તે! હું સેવા-એઆઈ છું. તમારો દાખલો બનાવવા "શરૂ કરો" દબાવો!'
                : language === 'hi'
                  ? 'नमस्ते! मैं सेवा-एआई हूँ। आवेदन के लिए "शुरू करें" दबाएँ!'
                  : 'Namaste! I am SevaAI. Tap Start Application to begin!'
            }
            subtitleSecondary={
              language === 'gu'
                ? 'અથવા સ્ટેપ-બાય-સ્ટેપ જોવા "સ્ટાર્ટ ડેમો" દબાવો.'
                : language === 'hi'
                  ? 'या स्टेप-बाय-स्टेप देखने के लिए "स्टार्ट डेमो" दबाएँ।'
                  : 'Or tap Start Demo for the hands-free showcase.'
            }
          />

          {/* Warm Sand Highlight Card (Inspired by myAadhaar Beta Right Cards) */}
          <div className="myaadhaar-sand-panel rounded-3xl p-5 space-y-4">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#FAB401] text-[#202124] text-xs font-extrabold">
                {language === 'gu' ? 'શું તમે જાણો છો?' : 'Did you know?'}
              </span>
              <h3 className="font-display text-base font-bold text-[#202124] pt-1">
                {language === 'gu'
                  ? 'SevaAI નાગરિકની બોલી અને લખાણ સમજીને ૦% ભૂલ સાથે અરજી બનાવે છે.'
                  : 'SevaAI cross-checks Gujarati & English spelling across all documents before submission.'}
              </h3>
            </div>

            <div className="bg-white border border-[#ECE3D0] rounded-2xl p-4 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#202124]">
                {language === 'gu'
                  ? 'દરેક વિગત માત્ર ૧ ક્લિકમાં તપાસો'
                  : 'Verify & edit every detail easily'}
              </span>
              <button
                type="button"
                onClick={() => launchKiosk('manual')}
                className="px-4 py-2 text-xs font-extrabold text-white bg-[#123B63] hover:bg-[#0D2C4A] rounded-full cursor-pointer shrink-0"
              >
                {language === 'gu' ? 'શરૂ કરો' : 'Start'}
              </button>
            </div>
          </div>

          {/* Compact Trust Strip */}
          <div className="bg-white border border-[#D9DEE5] rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#F6F8FA] border border-[#D9DEE5] text-[#123B63] flex items-center justify-center shrink-0">
                <Mic className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#202124]">
                  Voice + ✨ ઓટોરાઈટ (AutoWrite)
                </div>
                <div className="text-[#5F6368]">Gujarati, Hindi &amp; English</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#F6F8FA] border border-[#D9DEE5] text-[#123B63] flex items-center justify-center shrink-0">
                <Keyboard className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#202124]">
                  Touch + External Keyboard/Mouse
                </div>
                <div className="text-[#5F6368]">Tap any field to edit on-screen</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#ECF7F0] border border-[#046A38]/20 text-[#046A38] flex items-center justify-center shrink-0">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#202124]">
                  Real-Time Mamlatdar DSC Sync
                </div>
                <div className="text-[#5F6368]">Instant officer queue delivery</div>
              </div>
            </div>
          </div>

          <DemoPrototypeNote language={language} context="form" />
        </div>
      </div>

      {/* Interactive Statewide Scale, Cost, Certificates & Savings Simulator */}
      <div className="bg-white border border-[#D9DEE5] rounded-3xl p-6 sm:p-7 space-y-5 shadow-[0_6px_20px_-8px_rgba(18,59,99,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3EAF5]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#EEF4FB] border border-[#D9DEE5] text-[#123B63] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="h-5 w-5 text-[#D32828]" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#123B63]">
                {language === 'gu'
                  ? 'લાઇવ તાલુકા ડિપ્લોયમેન્ટ અને બચત સિમ્યુલેટર (ROI Simulator)'
                  : language === 'hi'
                    ? 'लाइव तालुका परिनियोजन और बचत सिम्युलेटर (ROI Simulator)'
                    : 'Interactive Taluka Deployment & Savings Simulator'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
                {language === 'gu'
                  ? 'તાલુકાઓની સંખ્યા પસંદ કરો અને જુઓ: કુલ ખર્ચ (₹૬૮,૦૦૦/કિઓસ્ક), દર વર્ષે ઇસ્યુ થતા સર્ટિફિકેટ, નાગરિક બચત અને કામની ઝડપ.'
                  : language === 'hi'
                    ? 'तालुका की संख्या चुनें और देखें: कुल लागत (₹68,000/कियोस्क), वार्षिक प्रमाणपत्र, नागरिक बचत और कार्य गति।'
                    : 'Slide to project kiosk cost (₹68,000/unit), annual certificates issued, citizen savings, and officer hours saved.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-[#5F6368]">
                {language === 'gu'
                  ? 'પસંદ કરેલ તાલુકા'
                  : language === 'hi'
                    ? 'चयनित तालुका'
                    : 'Selected Scale'}
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#123B63] tabular-nums">
                {talukaCount}{' '}
                <span className="text-base font-bold text-[#D32828]">
                  {language === 'gu' ? 'તાલુકા' : language === 'hi' ? 'तालुका' : 'Talukas'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Range Slider + Quick Scale Presets */}
        <div className="space-y-3">
          <input
            type="range"
            min={1}
            max={252}
            value={talukaCount}
            onChange={(e) => setTalukaCount(Number(e.target.value))}
            aria-label="Number of Talukas Deployed"
            className="w-full accent-[#D32828] cursor-pointer h-2"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            {[
              {count: 1, labelGu: '૧ તાલુકો (Pilot)', labelEn: '1 Taluka (Pilot)'},
              {count: 33, labelGu: '૩૩ જિલ્લા (૧-૧)', labelEn: '33 Districts (1 each)'},
              {count: 125, labelGu: '૧૨૫ તાલુકા', labelEn: '125 Talukas'},
              {count: 252, labelGu: '૨૫૨ તાલુકા (આખું ગુજરાત)', labelEn: '252 Talukas (All Gujarat)'},
            ].map((preset) => {
              const isPreset = talukaCount === preset.count;
              return (
                <button
                  key={preset.count}
                  type="button"
                  onClick={() => setTalukaCount(preset.count)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                    isPreset
                      ? 'bg-[#123B63] text-white border-[#123B63]'
                      : 'bg-[#F6F8FA] text-[#5F6368] border-[#D9DEE5] hover:border-[#123B63] hover:text-[#123B63]'
                  }`}
                >
                  {language === 'gu' ? preset.labelGu : preset.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Impact & Cost Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#5F6368]">
              <span>
                {language === 'gu'
                  ? 'કુલ કિઓસ્ક ખર્ચ (Total Cost)'
                  : language === 'hi'
                    ? 'कुल कियोस्क लागत'
                    : 'Total Kiosk Cost'}
              </span>
              <IndianRupee className="h-4 w-4 text-[#123B63]" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-[#123B63] tabular-nums pt-1">
              {formatCrOrLakhs(hardwareCapex)}
            </div>
            <div className="text-[11px] font-medium text-[#5F6368]">
              {talukaCount} {language === 'gu' ? 'યુનિટ × ₹૬૮,૦૦૦/કિઓસ્ક' : 'units × ₹68,000/kiosk'}
            </div>
          </div>

          <div className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#5F6368]">
              <span>
                {language === 'gu'
                  ? 'દર વર્ષે ઇસ્યુ સર્ટિફિકેટ / ફોર્મ'
                  : language === 'hi'
                    ? 'वार्षिक जारी प्रमाणपत्र / फॉर्म'
                    : 'Certificates Issued / Year'}
              </span>
              <FileCheck2 className="h-4 w-4 text-[#123B63]" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-[#123B63] tabular-nums pt-1">
              {annualCertificates.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-medium text-[#5F6368]">
              {language === 'gu'
                ? 'રોજની ~૧૦૦ અરજી / તાલુકો'
                : '~100 applications/day/Taluka'}
            </div>
          </div>

          <div className="bg-[#ECF7F0] border border-[#046A38]/25 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#046A38]">
              <span>
                {language === 'gu'
                  ? 'નાગરિકોની વાર્ષિક બચત'
                  : language === 'hi'
                    ? 'नागरिकों की वार्षिक बचत'
                    : 'Annual Citizen Savings'}
              </span>
              <CheckCircle2 className="h-4 w-4 text-[#046A38]" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-[#046A38] tabular-nums pt-1">
              {formatCrOrLakhs(citizenSavingsInr)}
            </div>
            <div className="text-[11px] font-semibold text-[#046A38]/85">
              {language === 'gu'
                ? 'દલાલો અને ધક્કાનો ₹૧,૨૦૦/ફોર્મ ખર્ચ બચે'
                : 'Eliminates touts & repeat travel'}
            </div>
          </div>

          <div className="bg-[#FFF7F7] border border-[#D32828]/25 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#D32828]">
              <span>
                {language === 'gu'
                  ? 'અધિકારીઓના બચેલા કલાક (મદદ)'
                  : language === 'hi'
                    ? 'अधिकारियों के बचाए गए घंटे'
                    : 'Officer Hours Saved'}
              </span>
              <Clock className="h-4 w-4 text-[#D32828]" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-[#D32828] tabular-nums pt-1">
              {officerHoursSaved.toLocaleString('en-IN')}{' '}
              <span className="text-sm font-bold">
                {language === 'gu' ? 'કલાક' : 'hrs'}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-[#D32828]/85">
              {language === 'gu'
                ? 'ફાઇલ દીઠ ૧૪.૭૫ મિનિટની બચત (૬૦x ઝડપી)'
                : '14.75 min saved per file (60x faster)'}
            </div>
          </div>
        </div>

        {/* Speed & Direct Help Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="flex items-center gap-3 rounded-xl bg-[#FAF6EE] border border-[#ECE3D0] px-4 py-3">
            <Zap className="h-5 w-5 text-[#F0A900] shrink-0" />
            <div className="text-xs">
              <div className="font-extrabold text-[#202124]">
                {language === 'gu' ? 'કામની ઝડપ: ૧૫ દિવસ → ૧૦ મિનિટ' : 'Citizen Speed: 15 Days → 10 Min'}
              </div>
              <div className="text-[#5F6368]">
                {language === 'gu' ? 'નાગરિકે વારંવાર ધક્કા ખાવા ન પડે' : 'Zero repeat trips to Taluka Kacheri'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#FAF6EE] border border-[#ECE3D0] px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-[#046A38] shrink-0" />
            <div className="text-xs">
              <div className="font-extrabold text-[#202124]">
                {language === 'gu' ? 'અધિકારી ચકાસણી: ૧૫ મિનિટ → ૧૫ સેકન્ડ' : 'Officer Scrutiny: 15 Min → 15 Sec'}
              </div>
              <div className="text-[#5F6368]">
                {language === 'gu' ? '૧-ક્લિક DSC થી તરત મંજૂરી' : '60x faster 1-Click DSC approval'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#FAF6EE] border border-[#ECE3D0] px-4 py-3">
            <Sparkles className="h-5 w-5 text-[#123B63] shrink-0" />
            <div className="text-xs">
              <div className="font-extrabold text-[#202124]">
                {language === 'gu' ? 'ફોર્મ રિજેક્શન: ૬૨% → ૦%' : 'Rejection Rate: 62% → 0%'}
              </div>
              <div className="text-[#5F6368]">
                {language === 'gu' ? 'અવાજ અને ૬-ડોક્યુમેન્ટ OCR થી ૧૦૦% ચોકસાઈ' : '100% pre-verified before submission'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
