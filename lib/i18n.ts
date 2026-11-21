import {LanguageCode, OcrCrossCheckDoc, ServiceKey} from './types';

export function getServiceKey(selectedService: string): ServiceKey {
  const s = selectedService.toLowerCase();
  if (s.includes('income') || s.includes('આવક') || s.includes('आय')) {
    return 'income';
  }
  if (
    s.includes('domicile') ||
    s.includes('residence') ||
    s.includes('રહેઠાણ') ||
    s.includes('निवास')
  ) {
    return 'domicile';
  }
  return 'caste';
}

export const DEMO_CITIZEN = {
  applicantName: 'Rameshbhai Kanubhai Patel',
  applicantNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
  fatherName: 'Kanubhai Nathabhai Patel',
  fatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
  village: 'Kundal',
  taluka: 'Sanand',
  district: 'Ahmedabad',
  casteCategory: 'SEBC (Socially & Educationally Backward Class)',
  subCaste: 'Patel (Kunbi / Kadva - SEBC)',
  dob: '14/08/1998',
  annualIncome: '₹1,85,000',
  occupation: 'Agriculture / Small Farming',
  residenceYears: '28 Years (Since Birth)',
  aadhaarMasked: 'XXXX-XXXX-4829',
};

export const DEMO_SIX_DOCUMENTS: OcrCrossCheckDoc[] = [
  {
    id: 'doc-1',
    order: 1,
    titleEn: 'Aadhaar Card',
    titleGu: 'આધાર કાર્ડ',
    titleHi: 'आधार कार्ड',
    docNumber: 'XXXX-XXXX-4829 (UIDAI Masked)',
    extractedName: 'Rameshbhai Kanubhai Patel',
    extractedNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
    extractedFatherName: 'Kanubhai Nathabhai Patel',
    extractedFatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
    extractedCasteOrDetail: 'Address: Kundal, Tal. Sanand, Ahmedabad - 382110',
    verificationBadge: 'Aadhaar Redacted - Biometric & Address Verified',
    statusNote: 'Biometric & Address Verified',
    matchScore: 100,
    docType: 'aadhaar',
  },
  {
    id: 'doc-2',
    order: 2,
    titleEn: 'School Leaving Certificate',
    titleGu: 'શાળા છોડ્યાનું પ્રમાણપત્ર (LC)',
    titleHi: 'स्कूल लीविंग सर्टिफिकेट',
    docNumber: 'LC-GJ-AHM-2014-8821',
    extractedName: 'Rameshbhai Kanubhai Patel',
    extractedNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
    extractedFatherName: 'Kanubhai Nathabhai Patel',
    extractedFatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
    extractedCasteOrDetail: 'Caste: SEBC (Patel) · DOB: 14/08/1998',
    verificationBadge: 'Caste & Birth Date Matched',
    statusNote: 'Caste & Birth Date Matched',
    matchScore: 100,
    docType: 'school',
  },
  {
    id: 'doc-3',
    order: 3,
    titleEn: 'Ration Card',
    titleGu: 'રેશન કાર્ડ',
    titleHi: 'राशन कार्ड',
    docNumber: 'RC-2407-0098-412',
    extractedName: 'Rameshbhai Kanubhai Patel',
    extractedNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
    extractedFatherName: 'Kanubhai Nathabhai Patel',
    extractedFatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
    extractedCasteOrDetail: 'Head of Family: Kanubhai Nathabhai Patel (Member #3)',
    verificationBadge: 'Family Lineage Matched',
    statusNote: 'Family Lineage Matched',
    matchScore: 100,
    docType: 'ration',
  },
  {
    id: 'doc-4',
    order: 4,
    titleEn: "Father's Caste Certificate",
    titleGu: 'પિતાનું જાતિ પ્રમાણપત્ર',
    titleHi: 'पिता का जाति प्रमाण पत्र',
    docNumber: 'JATI-GJ-1994-04192',
    extractedName: 'Kanubhai Nathabhai Patel (Father)',
    extractedNameGu: 'કનુભાઈ નાથાભાઈ પટેલ (પિતા)',
    extractedFatherName: 'Nathabhai Ranchhod Patel',
    extractedFatherNameGu: 'નાથાભાઈ રણછોડ પટેલ',
    extractedCasteOrDetail: 'Verified Lineage: SEBC (Patel) · Issued Taluka Sanand',
    verificationBadge: 'Blood Relation Verified',
    statusNote: 'Blood Relation Verified',
    matchScore: 100,
    docType: 'father_caste',
  },
  {
    id: 'doc-5',
    order: 5,
    titleEn: 'Taluka Income Certificate',
    titleGu: 'તાલુકા આવકનો દાખલો',
    titleHi: 'तालुका आय प्रमाण पत्र',
    docNumber: 'INC-2026-SND-33108',
    extractedName: 'Rameshbhai Kanubhai Patel',
    extractedNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
    extractedFatherName: 'Kanubhai Nathabhai Patel',
    extractedFatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
    extractedCasteOrDetail: 'Annual Income: ₹1,85,000 (Non-Creamy Layer Eligible)',
    verificationBadge: 'Income Threshold Verified',
    statusNote: 'Income Threshold Verified',
    matchScore: 100,
    docType: 'income',
  },
  {
    id: 'doc-6',
    order: 6,
    titleEn: 'Live Kiosk Webcam Photo & Voice Self-Declaration',
    titleGu: 'લાઈવ ફોટો અને અવાજ દ્વારા સ્વ-ઘોષણા',
    titleHi: 'लाइव वेबकैम फोटो और वॉयस स्व-घोषणा',
    docNumber: 'BIO-LIVE-2026-9941',
    extractedName: 'Rameshbhai Kanubhai Patel',
    extractedNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
    extractedFatherName: 'Kanubhai Nathabhai Patel',
    extractedFatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
    extractedCasteOrDetail: 'WDR Face Match 99.4% · Voice Consent Recorded',
    verificationBadge: 'Liveness & Consent Verified',
    statusNote: 'Liveness & Consent Verified',
    matchScore: 100,
    docType: 'webcam',
  },
];

export const SERVICE_DOCUMENTS: Record<ServiceKey, OcrCrossCheckDoc[]> = {
  caste: DEMO_SIX_DOCUMENTS,
  income: [
    DEMO_SIX_DOCUMENTS[0],
    DEMO_SIX_DOCUMENTS[2],
    {
      id: 'inc-doc-3',
      order: 3,
      titleEn: 'Talati / Sarpanch Income Panchkyas',
      titleGu: 'તલાટી / સરપંચ આવકનું પંચનામું',
      titleHi: 'तलाटी / सरपंच आय पंचनामा',
      docNumber: 'PAN-2026-SND-1142',
      extractedName: 'Rameshbhai Kanubhai Patel',
      extractedNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
      extractedFatherName: 'Kanubhai Nathabhai Patel',
      extractedFatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
      extractedCasteOrDetail: 'Verified Annual Family Income: ₹1,85,000',
      verificationBadge: 'Talati Field Verification Matched',
      statusNote: 'Talati Verification Matched',
      matchScore: 100,
      docType: 'income',
    },
    {
      id: 'inc-doc-4',
      order: 4,
      titleEn: 'Electricity Bill / Gram Panchayat Tax Receipt',
      titleGu: 'વીજળી બિલ / ગ્રામ પંચાયત ઘરવેરા પાવતી',
      titleHi: 'बिजली बिल / घर कर रसीद',
      docNumber: 'UGVCL-4410-8921',
      extractedName: 'Kanubhai Nathabhai Patel (Father)',
      extractedNameGu: 'કનુભાઈ નાથાભાઈ પટેલ (પિતા)',
      extractedFatherName: 'Nathabhai Ranchhod Patel',
      extractedFatherNameGu: 'નાથાભાઈ રણછોડ પટેલ',
      extractedCasteOrDetail: 'House #42, Kundal, Tal. Sanand · Utility Active',
      verificationBadge: 'Household Residence Verified',
      statusNote: 'Residence Proof Verified',
      matchScore: 100,
      docType: 'ration',
    },
    {
      id: 'inc-doc-5',
      order: 5,
      titleEn: '7/12 Agriculture Extract / Income Proof',
      titleGu: '૭/૧૨ ઉતારો અથવા આવક / પગારનો પુરાવો',
      titleHi: '7/12 भूमि उतारा / आय प्रमाण',
      docNumber: 'REV-712-KDL-881',
      extractedName: 'Rameshbhai Kanubhai Patel',
      extractedNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
      extractedFatherName: 'Kanubhai Nathabhai Patel',
      extractedFatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
      extractedCasteOrDetail: 'Source: Small Farming · Total Income ₹1,85,000/yr',
      verificationBadge: 'Income Source & Threshold Verified',
      statusNote: 'Income Source Verified',
      matchScore: 100,
      docType: 'income',
    },
    DEMO_SIX_DOCUMENTS[5],
  ],
  domicile: [
    DEMO_SIX_DOCUMENTS[0],
    {
      ...DEMO_SIX_DOCUMENTS[1],
      extractedCasteOrDetail: '10+ Years Continuous Study in Gujarat · DOB: 14/08/1998',
      verificationBadge: 'Gujarat Schooling Tenure Verified',
      statusNote: 'Gujarat Study Tenure Verified',
    },
    DEMO_SIX_DOCUMENTS[2],
    {
      id: 'dom-doc-4',
      order: 4,
      titleEn: 'Electricity Bill / Property Tax Receipt',
      titleGu: 'વીજળી બિલ / મિલકત વેરાની પાવતી',
      titleHi: 'बिजली बिल / संपत्ति कर रसीद',
      docNumber: 'UGVCL-4410-8921',
      extractedName: 'Kanubhai Nathabhai Patel (Father)',
      extractedNameGu: 'કનુભાઈ નાથાભાઈ પટેલ (પિતા)',
      extractedFatherName: 'Nathabhai Ranchhod Patel',
      extractedFatherNameGu: 'નાથાભાઈ રણછોડ પટેલ',
      extractedCasteOrDetail: 'Permanent Address: Kundal, Tal. Sanand (28+ Yrs)',
      verificationBadge: 'Permanent Address Proof Matched',
      statusNote: 'Address Tenure Verified',
      matchScore: 100,
      docType: 'ration',
    },
    {
      id: 'dom-doc-5',
      order: 5,
      titleEn: 'Talati Residence Confirmation / Voter ID',
      titleGu: 'તલાટી રહેઠાણ ખરાઈ / ચૂંટણી કાર્ડ',
      titleHi: 'तलाटी निवास सत्यापन / मतदाता पहचान पत्र',
      docNumber: 'TAL-RES-2026-409',
      extractedName: 'Rameshbhai Kanubhai Patel',
      extractedNameGu: 'રમેશભાઈ કનુભાઈ પટેલ',
      extractedFatherName: 'Kanubhai Nathabhai Patel',
      extractedFatherNameGu: 'કનુભાઈ નાથાભાઈ પટેલ',
      extractedCasteOrDetail: 'Gujarat Domicile Confirmed: 28 Years Residence',
      verificationBadge: '10+ Years Gujarat Domicile Verified',
      statusNote: 'Domicile Tenure Verified',
      matchScore: 100,
      docType: 'school',
    },
    DEMO_SIX_DOCUMENTS[5],
  ],
};

export const UI_COPY: Record<
  LanguageCode,
  {
    speechLocale: string;
    appTitle: string;
    govSubtitle: string;
    views: {
      kiosk: string;
      mamlatdar: string;
      blueprint: string;
    };
    kiosk: {
      badgeTitle: string;
      heroHeading: string;
      heroSub: string;
      startDemoBtn: string;
      runningDemoBtn: string;
      resetDemoBtn: string;
      voiceOn: string;
      voiceMuted: string;
      replayVoice: string;
      stepATitle: string;
      stepBTitle: string;
      stepCTitle: string;
      applicantLabel: string;
      fatherLabel: string;
      talukaLabel: string;
      casteLabel: string;
      phoneticTitle: string;
      scanPlateTitle: string;
      scanPlateSub: string;
      scanAllBtn: string;
      scanningLabel: string;
      submitBtn: string;
      switchToOfficerBtn: string;
      issuedBannerTitle: string;
      issuedBannerSub: string;
      viewCertificateBtn: string;
    };
    spoken: {
      welcome: string;
      welcomeEn: string;
      stepA: string;
      stepAEn: string;
      stepBStart: string;
      stepBStartEn: string;
      stepBDone: string;
      stepBDoneEn: string;
      stepC: string;
      stepCEn: string;
      approved: string;
      approvedEn: string;
    };
  }
> = {
  gu: {
    speechLocale: 'gu-IN',
    appTitle: 'SevaAI — સ્માર્ટ તાલુકા કિઓસ્ક',
    govSubtitle: 'ગુજરાત સરકાર · ડિજિટલ ઈન્ડિયા તાલુકા કચેરી',
    views: {
      kiosk: '1. Citizen Kiosk Terminal',
      mamlatdar: '2. Mamlatdar Officer Dashboard',
      blueprint: '3. Hardware & Impact Blueprint',
    },
    kiosk: {
      badgeTitle: 'નાગરિક સેવા સહાયક',
      heroHeading: 'જાતિ પ્રમાણપત્ર (Jati Pramanpatra) સ્વયં-સેવા ટર્મિનલ',
      heroSub: 'અવાજ અને ૬-દસ્તાવેજ લેસર સ્કેન દ્વારા ૧૦૦% ભૂલ-રહિત અરજી.',
      startDemoBtn: 'Start 1-Click Auto Demo',
      runningDemoBtn: 'Auto Demo Running...',
      resetDemoBtn: 'Reset Kiosk',
      voiceOn: 'અવાજ ચાલુ (Voice On)',
      voiceMuted: 'અવાજ બંધ (Muted)',
      replayVoice: 'ફરી સાંભળો',
      stepATitle: 'પગલું A: અવાજ અને નામની ચકાસણી',
      stepBTitle: 'પગલું B: બોટમ સ્કેન પ્લેટ — ૬ દસ્તાવેજ લેસર સ્કેન',
      stepCTitle: 'પગલું C: તાત્કાલિક અરજી સબમિશન',
      applicantLabel: 'અરજદારનું પૂરું નામ',
      fatherLabel: 'પિતાનું નામ',
      talukaLabel: 'ગામ / તાલુકો / જિલ્લો',
      casteLabel: 'જાતિ અને વર્ગ',
      phoneticTitle: 'ગુજરાતી ↔ અંગ્રેજી ફોનેટિક સ્પેલિંગ મેચ',
      scanPlateTitle: 'કિઓસ્ક બોટમ ઓવરહેડ સ્કેન પ્લેટ',
      scanPlateSub: 'દસ્તાવેજ ફ્લેટ ટ્રે પર મૂકો — ઓવરહેડ કેમેરા અને લેસર OCR ચકાસણી',
      scanAllBtn: 'Scan All 6 Documents',
      scanningLabel: 'લેસર સ્કેનિંગ અને OCR ચકાસણી ચાલુ છે...',
      submitBtn: 'Submit Verified Packet',
      switchToOfficerBtn: 'Switch to Mamlatdar Dashboard to Approve',
      issuedBannerTitle: 'પ્રમાણપત્ર મંજૂર અને ઈશ્યૂ થયું (Certificate Issued)',
      issuedBannerSub: 'મામલતદાર શ્રી દ્વારા ડિજિટલ સહી (DSC) થી મંજૂર કરવામાં આવ્યું છે.',
      viewCertificateBtn: 'સત્તાવાર જાતિ પ્રમાણપત્ર જુઓ અને પ્રિન્ટ કરો',
    },
    spoken: {
      welcome:
        'નમસ્તે! હું સેવા-એઆઈ છું. જાતિ પ્રમાણપત્ર માટે તમારું સ્વાગત છે. ચાલો ૧-ક્લિક ઓટો ડેમો શરૂ કરીએ.',
      welcomeEn:
        'Namaste! I am SevaAI. Welcome for Caste Certificate service. Let us start the 1-Click Auto Demo.',
      stepA:
        'રમેશભાઈ કનુભાઈ પટેલ, તમારા નામ અને પિતાના નામનું ગુજરાતી અને અંગ્રેજી ફોનેટિક સ્પેલિંગ ૧૦૦ ટકા ચકાસાઈ ગયું છે.',
      stepAEn:
        'Rameshbhai Kanubhai Patel, your Gujarati and English phonetic spelling has been 100% verified.',
      stepBStart:
        'હવે નીચેની સ્કેન પ્લેટ પર આધાર કાર્ડ, એલસી, રેશન કાર્ડ, પિતાનો દાખલો, આવકનો દાખલો અને લાઈવ ફોટો ક્રમશઃ સ્કેન થઈ રહ્યા છે.',
      stepBStartEn:
        'Now sequentially laser-scanning Aadhaar, School LC, Ration Card, Father Certificate, Income Certificate, and Live Photo on the bottom plate.',
      stepBDone:
        'બધા ૬ દસ્તાવેજોમાં નામ, પિતાનું નામ અને જાતિ ૧૦૦ ટકા મેચ થઈ ગયા છે. શૂન્ય સ્પેલિંગ ભૂલ!',
      stepBDoneEn:
        'All 6 documents matched 100% across name, father name, and caste with zero spelling mismatches!',
      stepC:
        'તમારી અરજી મામલતદાર ડેશબોર્ડ પર મોકલી દેવામાં આવી છે. હવે મામલતદાર શ્રી ૧-ક્લિક ડિજિટલ સહીથી મંજૂરી આપી શકે છે.',
      stepCEn:
        'Your verified application has been transmitted to the Mamlatdar Dashboard for 1-click DSC approval.',
      approved:
        'અભિનંદન! મામલતદાર શ્રી દ્વારા ડિજિટલ સહીથી તમારું જાતિ પ્રમાણપત્ર મંજૂર થઈ ગયું છે. હવે તમે પ્રિન્ટ કરી શકો છો.',
      approvedEn:
        'Congratulations! Your Caste Certificate has been approved with Mamlatdar DSC and is ready to print.',
    },
  },
  hi: {
    speechLocale: 'hi-IN',
    appTitle: 'SevaAI — स्मार्ट तालुका कियोस्क',
    govSubtitle: 'डिजिटल इंडिया · तालुका कचहरी ई-गवर्नेंस',
    views: {
      kiosk: '1. Citizen Kiosk Terminal',
      mamlatdar: '2. Mamlatdar Officer Dashboard',
      blueprint: '3. Hardware & Impact Blueprint',
    },
    kiosk: {
      badgeTitle: 'नागरिक सेवा सहायक',
      heroHeading: 'जाति प्रमाण पत्र (Jati Pramanpatra) स्व-सेवा टर्मिनल',
      heroSub: 'आवाज़ और 6-दस्तावेज़ लेज़र स्कैन के साथ 100% त्रुटि-मुक्त आवेदन।',
      startDemoBtn: 'Start 1-Click Auto Demo',
      runningDemoBtn: 'Auto Demo Running...',
      resetDemoBtn: 'Reset Kiosk',
      voiceOn: 'आवाज़ चालू (Voice On)',
      voiceMuted: 'आवाज़ बंद (Muted)',
      replayVoice: 'फिर से सुनें',
      stepATitle: 'चरण A: आवाज़ और नाम का सत्यापन',
      stepBTitle: 'चरण B: बॉटम स्कैन प्लेट — 6 दस्तावेज़ लेज़र स्कैन',
      stepCTitle: 'चरण C: त्वरित आवेदन सबमिशन',
      applicantLabel: 'आवेदक का पूरा नाम',
      fatherLabel: 'पिता का नाम',
      talukaLabel: 'गाँव / तालुका / जिला',
      casteLabel: 'जाति और श्रेणी',
      phoneticTitle: 'गुजराती / हिंदी ↔ अंग्रेज़ी फ़ोनेटिक स्पेलिंग मिलान',
      scanPlateTitle: 'कियोस्क बॉटम ओवरहेड स्कैन प्लेट',
      scanPlateSub: 'फ्लैट ट्रे पर दस्तावेज़ रखें — ओवरहेड लेज़र OCR सत्यापन',
      scanAllBtn: 'Scan All 6 Documents',
      scanningLabel: 'लेज़र स्कैनिंग और OCR मिलान जारी है...',
      submitBtn: 'Submit Verified Packet',
      switchToOfficerBtn: 'Switch to Mamlatdar Dashboard to Approve',
      issuedBannerTitle: 'प्रमाण पत्र स्वीकृत और जारी (Certificate Issued)',
      issuedBannerSub: 'मामलातदार द्वारा डिजिटल हस्ताक्षर (DSC) से प्रमाणित।',
      viewCertificateBtn: 'आधिकारिक जाति प्रमाण पत्र देखें और प्रिंट करें',
    },
    spoken: {
      welcome:
        'नमस्ते! मैं सेवा-एआई हूँ। जाति प्रमाण पत्र सेवा में आपका स्वागत है। आइए 1-क्लिक ऑटो डेमो शुरू करते हैं।',
      welcomeEn:
        'Namaste! I am SevaAI. Welcome for Caste Certificate service. Let us start the 1-Click Auto Demo.',
      stepA:
        'रमेशभाई कनुभाई पटेल, आपके नाम और पिता के नाम की स्पेलिंग 100 प्रतिशत सत्यापित हो गई है।',
      stepAEn:
        'Rameshbhai Kanubhai Patel, your multilingual phonetic spelling has been 100% verified.',
      stepBStart:
        'अब बॉटम स्कैन प्लेट पर आधार, स्कूल एलसी, राशन कार्ड, पिता का प्रमाण पत्र, आय प्रमाण पत्र और लाइव फोटो स्कैन हो रहे हैं।',
      stepBStartEn:
        'Now sequentially laser-scanning Aadhaar, School LC, Ration Card, Father Certificate, Income Certificate, and Live Photo.',
      stepBDone:
        'सभी 6 दस्तावेज़ों में नाम, पिता का नाम और जाति 100 प्रतिशत मेल खा गए हैं। कोई त्रुटि नहीं!',
      stepBDoneEn:
        'All 6 documents matched 100% across name, father name, and caste with zero spelling mismatches!',
      stepC:
        'आपका आवेदन मामलातदार डैशबोर्ड पर भेज दिया गया है। अब अधिकारी 1-क्लिक डिजिटल हस्ताक्षर से स्वीकृति दे सकते हैं।',
      stepCEn:
        'Your verified application has been transmitted to the Mamlatdar Dashboard for 1-click DSC approval.',
      approved:
        'बधाई हो! मामलातदार द्वारा डिजिटल हस्ताक्षर के साथ आपका जाति प्रमाण पत्र जारी कर दिया गया है।',
      approvedEn:
        'Congratulations! Your Caste Certificate has been approved with Mamlatdar DSC and is ready to print.',
    },
  },
  en: {
    speechLocale: 'en-IN',
    appTitle: 'SevaAI — Smart Taluka Kiosk',
    govSubtitle: 'Digital India · Taluka Kacheri E-Governance',
    views: {
      kiosk: '1. Citizen Kiosk Terminal',
      mamlatdar: '2. Mamlatdar Officer Dashboard',
      blueprint: '3. Hardware & Impact Blueprint',
    },
    kiosk: {
      badgeTitle: 'Citizen Voice Assistant',
      heroHeading: 'Caste Certificate (Jati Pramanpatra) Self-Service Kiosk',
      heroSub: '100% error-free application with multilingual voice AI and 6-document laser OCR verification.',
      startDemoBtn: 'Start 1-Click Auto Demo',
      runningDemoBtn: 'Auto Demo Running...',
      resetDemoBtn: 'Reset Kiosk',
      voiceOn: 'Voice On',
      voiceMuted: 'Muted',
      replayVoice: 'Replay Audio',
      stepATitle: 'Step A: Voice & Name Verification',
      stepBTitle: 'Step B: Bottom Scan Plate — 6-Document Laser Scan',
      stepCTitle: 'Step C: Instant Submission & Tracking',
      applicantLabel: 'Applicant Full Name',
      fatherLabel: 'Father Full Name',
      talukaLabel: 'Village / Taluka / District',
      casteLabel: 'Caste & Category',
      phoneticTitle: 'Gujarati ↔ English Phonetic Spelling Confirmation',
      scanPlateTitle: 'Kiosk Bottom Overhead Scan Plate',
      scanPlateSub: 'Open-bed overhead 16MP macro LED platen with live laser OCR matching',
      scanAllBtn: 'Scan All 6 Documents',
      scanningLabel: 'Laser scanning & cross-checking OCR fields...',
      submitBtn: 'Submit Verified Packet',
      switchToOfficerBtn: 'Switch to Mamlatdar Dashboard to Approve',
      issuedBannerTitle: 'Certificate Issued & Digitally Signed',
      issuedBannerSub: 'Signed via Mamlatdar DSC token and unlocked for citizen printing.',
      viewCertificateBtn: 'View & Print Official Caste Certificate',
    },
    spoken: {
      welcome:
        'Namaste! I am SevaAI, your Taluka Kacheri assistant. Starting the 1-Click Auto Demo for Caste Certificate.',
      welcomeEn: 'ગુજરાતી: નમસ્તે! જાતિ પ્રમાણપત્ર માટે ૧-ક્લિક ઓટો ડેમો શરૂ થઈ રહ્યો છે.',
      stepA:
        'Rameshbhai Kanubhai Patel, phonetic spelling across Gujarati and English scripts is confirmed 100% accurate.',
      stepAEn: 'ગુજરાતી: રમેશભાઈ કનુભાઈ પટેલ — ગુજરાતી અને અંગ્રેજી સ્પેલિંગ ૧૦૦% મેચ.',
      stepBStart:
        'Scanning all 6 supporting documents on the bottom overhead LED plate with real-time laser OCR extraction.',
      stepBStartEn: 'ગુજરાતી: નીચેની સ્કેન પ્લેટ પર ૬ દસ્તાવેજોનું લેસર OCR સ્કેન ચાલુ છે.',
      stepBDone:
        'All 6 documents verified with 100% spelling match and zero discrepancies across lineage and caste.',
      stepBDoneEn: 'ગુજરાતી: બધા ૬ દસ્તાવેજોમાં ૧૦૦% સ્પેલિંગ અને જાતિ ચકાસણી પૂર્ણ.',
      stepC:
        'Application submitted to the Mamlatdar Officer Dashboard. Ready for 1-click Digital Signature approval.',
      stepCEn: 'ગુજરાતી: અરજી મામલતદાર ડેશબોર્ડ પર ૧-ક્લિક DSC મંજૂરી માટે મોકલાઈ છે.',
      approved:
        'Certificate approved with Mamlatdar Digital Signature! You may now print your official Caste Certificate.',
      approvedEn: 'ગુજરાતી: મામલતદારની ડિજિટલ સહી સાથે પ્રમાણપત્ર પ્રિન્ટ માટે તૈયાર છે.',
    },
  },
};
