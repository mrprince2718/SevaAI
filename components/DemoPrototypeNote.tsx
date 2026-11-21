'use client';

import React from 'react';
import {Info} from 'lucide-react';
import {LanguageCode} from '@/lib/types';

interface DemoPrototypeNoteProps {
  language: LanguageCode;
  context?: 'form' | 'scan' | 'photo' | 'submit' | 'dashboard';
  className?: string;
}

const NOTE_COPY: Record<
  LanguageCode,
  Record<'form' | 'scan' | 'photo' | 'submit' | 'dashboard', string>
> = {
  gu: {
    form: 'ફક્ત ડેમો માટે (Demo Prototype): અહીં ભરાતું નામ અને વિગતો ફક્ત ઉદાહરણ છે — ભવિષ્યમાં અસલી એપ નાગરિકો સાથે કેવી રીતે વાત કરીને ફોર્મ ભરશે તેનું આ મોડેલ છે.',
    scan: 'ફક્ત ડેમો માટે (Demo Prototype): અહીં અસલી કાગળ મોકલવાની જરૂર નથી — ભવિષ્યના હાર્ડવેર કિઓસ્કમાં દસ્તાવેજો કેવી રીતે સ્કેન થશે તેનું આ જીવંત ઉદાહરણ છે.',
    photo:
      'ફક્ત ડેમો માટે (Demo Prototype): ભવિષ્યમાં કિઓસ્કનો કેમેરા નાગરિકનો પાસપોર્ટ ફોટો અને અવાજ સંમતિ કેવી રીતે લેશે તેનું આ ઉદાહરણ છે.',
    submit:
      'ફક્ત ડેમો માટે (Demo Prototype): આ અરજી સબમિશન ભવિષ્યમાં મામલતદાર કચેરીએ સીધી ફાઈલ કેવી રીતે જશે તેનું ઉદાહરણ છે.',
    dashboard:
      'ફક્ત ડેમો માટે (Demo Prototype): આ મામલતદાર પોર્ટલ ભવિષ્યમાં કિઓસ્કમાંથી આવેલી અરજીઓ ૧-ક્લિક DSC થી કેવી રીતે મંજૂર થશે તેનું ઉદાહરણ છે.',
  },
  hi: {
    form: 'केवल डेमो के लिए (Demo Prototype): यहाँ दर्ज नाम और विवरण केवल उदाहरण हैं — यह दिखाता है कि भविष्य में असली ऐप नागरिकों से बात करके फॉर्म कैसे भरेगा।',
    scan: 'केवल डेमो के लिए (Demo Prototype): अभी असली कागज़ भेजने की जरूरत नहीं है — यह भविष्य के कियोस्क स्कैनर का उदाहरण है।',
    photo:
      'केवल डेमो के लिए (Demo Prototype): यह दर्शाता है कि भविष्य में कियोस्क कैमरा स्वतः पासपोर्ट फोटो और वॉयस सहमति कैसे लेगा।',
    submit:
      'केवल डेमो के लिए (Demo Prototype): यह केवल डेमो उदाहरण है कि भविष्य में आवेदन सीधे मामलातदार कार्यालय कैसे पहुँचेगा।',
    dashboard:
      'केवल डेमो के लिए (Demo Prototype): यह दर्शाता है कि भविष्य में अधिकारी 1-क्लिक DSC से प्रमाण पत्र कैसे स्वीकृत करेंगे।',
  },
  en: {
    form: 'Demo Prototype Only: Entries shown here are illustrative examples demonstrating how the future live kiosk will talk with citizens and fill applications.',
    scan: 'Demo Prototype Only: No real documents are uploaded here — this illustrates how future kiosk hardware will scan and verify physical papers.',
    photo:
      'Demo Prototype Only: This illustrates how the future kiosk top camera will capture passport photos and voice consent automatically.',
    submit:
      'Demo Prototype Only: This submission simulates how verified citizen packets will route directly to the Mamlatdar Office in production.',
    dashboard:
      'Demo Prototype Only: This officer dashboard illustrates how real-time kiosk applications will be digitally signed (DSC) and issued.',
  },
};

export default function DemoPrototypeNote({
  language,
  context = 'form',
  className = '',
}: DemoPrototypeNoteProps) {
  return (
    <div
      className={`rounded-xl bg-[#FAF6EE] border border-[#E5D8B8] px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-[#202124] leading-relaxed ${className}`}
    >
      <Info className="h-4 w-4 text-[#B45309] shrink-0 mt-0.5" />
      <span className="font-medium">{NOTE_COPY[language][context]}</span>
    </div>
  );
}
