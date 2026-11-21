import {LanguageCode, ServiceKey} from './types';
import {getServiceKey} from './i18n';

export type KioskStage =
  | 'greeting'
  | 'confirm_service'
  | 'prepare_docs'
  | 'collect_name'
  | 'collect_father'
  | 'collect_village_dob'
  | 'collect_caste_income'
  | 'doc_scan_animation'
  | 'auto_photo'
  | 'final_review'
  | 'submitted';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  subText?: string;
}

export interface StageContent {
  aiPrompt: string;
  aiPromptSub: string;
  explainText: string;
  explainTextSub: string;
}

export const STAGE_CONTENT: Record<
  LanguageCode,
  Record<KioskStage, StageContent>
> = {
  gu: {
    greeting: {
      aiPrompt:
        'સેવા એઆઈ (SevaAI) પર તમારું સ્વાગત છે! આજે તમારે કઈ સરકારી સેવા કે દાખલો કઢાવવો છે?',
      aiPromptSub:
        'Welcome to SevaAI! Which government certificate or service do you need today?',
      explainText:
        'તમે માઈક બટન દબાવીને બોલી શકો છો અથવા નીચેથી તમારે કયો દાખલો કઢાવવો છે તે પસંદ કરી શકો છો.',
      explainTextSub:
        'Tap the mic button to speak or select the certificate service you need below.',
    },
    confirm_service: {
      aiPrompt:
        'સમજાઈ ગયું! શું તમારે "જાતિનો દાખલો (Caste Certificate)" કઢાવવો છે? કૃપા કરીને "હા" કહો.',
      aiPromptSub:
        'Got it! Do you want to apply for a "Caste Certificate (Jati Pramanpatra)"? Please confirm Yes.',
      explainText:
        'હું કન્ફર્મ કરી રહ્યો છું કે આપણે પસંદ કરેલા દાખલાની અરજી શરૂ કરીએ છીએ. આગળ વધવા માટે "હા" પર ક્લિક કરો.',
      explainTextSub:
        'Confirming your selected certificate application. Tap "Yes" to proceed.',
    },
    prepare_docs: {
      aiPrompt:
        'સરસ! પ્રક્રિયા શરૂ કરતા પહેલા આ ૫ દસ્તાવેજો હાથવગા તૈયાર રાખો, જેથી તમારું કામ ઝડપથી પૂરું થાય.',
      aiPromptSub:
        'Great! Before we begin, please keep these 5 documents handy in your hand for fast processing.',
      explainText:
        'આ પ્રોટોટાઈપમાં હમણાં અસલી કાગળ સ્કેન કરવાની જરૂર નથી, માત્ર લિસ્ટ જોઈને "તૈયાર છે" દબાવો.',
      explainTextSub:
        'In this prototype, you do not need physical papers yet—review the checklist and tap Ready.',
    },
    collect_name: {
      aiPrompt:
        'ચાલો શરૂ કરીએ. સૌ પ્રથમ, તમારું પૂરું નામ બોલો અથવા લખો (જેમ કે રમેશભાઈ કનુભાઈ પટેલ).',
      aiPromptSub:
        'Let us begin. First, please tell me your full name (e.g., Rameshbhai Kanubhai Patel).',
      explainText:
        'તમારા આધાર કાર્ડ અને દસ્તાવેજો મુજબ પૂરું નામ આપો. હું ગુજરાતી અને અંગ્રેજી સ્પેલિંગ આપમેળે ચેક કરીશ.',
      explainTextSub:
        'Provide your full name as per Aadhaar. I will verify Gujarati and English spelling automatically.',
    },
    collect_father: {
      aiPrompt: 'આભાર! હવે તમારા પિતાનું પૂરું નામ જણાવો.',
      aiPromptSub: 'Thank you! Now please tell me your father’s full name.',
      explainText:
        'અરજી અને રેશન કાર્ડ સાથે વંશાવળી મેળવવા માટે પિતાનું નામ લખો અથવા બોલો.',
      explainTextSub:
        'Father’s name is required to verify family details across your Ration Card and records.',
    },
    collect_village_dob: {
      aiPrompt:
        'ખૂબ સરસ. હવે તમારું ગામ, તાલુકો અને જન્મ તારીખ જણાવો.',
      aiPromptSub:
        'Great. Now please confirm your Village, Taluka, and Date of Birth.',
      explainText:
        'તમારું રહેઠાણ ગામ (દા.ત. કુંડળ, તા. સાણંદ) અને જન્મ તારીખ (૧૪/૦૮/૧૯૯૮) ચકાસો.',
      explainTextSub:
        'Verify your village, taluka, and date of birth matching your documents.',
    },
    collect_caste_income: {
      aiPrompt:
        'હવે તમારી જાતિ / પેટા-જાતિ અને પરિવારની વાર્ષિક આવક જણાવો.',
      aiPromptSub:
        'Now please share your Caste / Sub-caste and annual family income.',
      explainText:
        'SEBC / OBC / SC / ST વર્ગ માટે જાતિ અને આવકની વિગત અહીં ભરવાની રહેશે.',
      explainTextSub:
        'Enter your caste category and annual income for eligibility verification.',
    },
    doc_scan_animation: {
      aiPrompt:
        'હવે દસ્તાવેજ સ્કેનિંગનો સમય છે! જુઓ કે નીચેની ઓવરહેડ સ્કેન પ્લેટ પર દસ્તાવેજો કેવી રીતે સ્કેન થાય છે.',
      aiPromptSub:
        'Now let us scan your documents! Watch the animated laser scan simulation on the bottom plate.',
      explainText:
        'હજી હાર્ડવેર પ્રોટોટાઈપ હોવાથી અહીં અસલી કાગળ મૂકવાની જરૂર નથી — આ એનિમેશન બતાવે છે કે કિઓસ્ક કેવી રીતે ૫ દસ્તાવેજ સ્કેન અને OCR ચેક કરે છે.',
      explainTextSub:
        'Since hardware scanning is simulated in this prototype, this animation demonstrates how the kiosk laser-scans and OCR-matches all 5 documents.',
    },
    auto_photo: {
      aiPrompt:
        'બધા દસ્તાવેજો ૧૦૦% મેચ થઈ ગયા છે! હવે ઉપરના કેમેરા સામે જુઓ — AI આપમેળે તમારો પાસપોર્ટ સાઈઝ ફોટો પાડી રહ્યું છે.',
      aiPromptSub:
        'All documents matched 100%! Please look at the top camera — AI is automatically capturing your passport-size photo.',
      explainText:
        'તમારે કોઈ બટન દબાવવાની જરૂર નથી. કેમેરા ૩ સેકન્ડમાં આપમેળે ફોટો પાડીને પાછળનું બેકગ્રાઉન્ડ સાફ કરી દેશે.',
      explainTextSub:
        'No manual capture needed. The top WDR camera automatically takes a clean passport photo and records your voice declaration.',
    },
    final_review: {
      aiPrompt:
        'છેલ્લે તમારી બધી વિગતો, સ્કેન થયેલા દસ્તાવેજો અને પાસપોર્ટ ફોટો ચકાસી લો. બધું સાચું હોય તો અરજી સબમિટ કરો.',
      aiPromptSub:
        'Please review all your entered details, scanned documents, and passport photo before final submission.',
      explainText:
        'જો કોઈ વિગત બદલવી હોય તો તમે અહીંથી સુધારી શકો છો, નહિતર "અરજી સબમિટ કરો" બટન દબાવો.',
      explainTextSub:
        'You can verify every field one last time before sending the error-free packet to the Mamlatdar Officer.',
    },
    submitted: {
      aiPrompt:
        'અભિનંદન! તમારી અરજી મામલતદાર ડેશબોર્ડ પર મોકલાઈ ગઈ છે. હવે અધિકારી ૧-ક્લિક ડિજિટલ સહીથી દાખલો મંજૂર કરશે.',
      aiPromptSub:
        'Congratulations! Your application is transmitted to the Mamlatdar Dashboard for 1-click DSC approval.',
      explainText:
        'હવે ઉપરથી "2. Mamlatdar Officer Dashboard" પર જાઓ અને ૧-ક્લિકથી દાખલો મંજૂર કરો — તરત જ અહીં પ્રિન્ટ માટે ખુલી જશે!',
      explainTextSub:
        'Switch to the Mamlatdar Officer Dashboard to approve with DSC, then return here to print the official certificate.',
    },
  },
  hi: {
    greeting: {
      aiPrompt:
        'सेवा-एआई (SevaAI) पर आपका स्वागत है! आज आपको कौन-सी सरकारी सेवा या प्रमाण पत्र चाहिए?',
      aiPromptSub:
        'Welcome to SevaAI! Which government certificate or service do you need today?',
      explainText:
        'आप माइक दबाकर बोल सकते हैं या नीचे से अपनी आवश्यक सेवा चुन सकते हैं।',
      explainTextSub:
        'Tap the mic button to speak or choose the certificate service below.',
    },
    confirm_service: {
      aiPrompt:
        'समझ गया! क्या आपको "जाति प्रमाण पत्र (Caste Certificate)" बनवाना है? कृपया "हाँ" कहें।',
      aiPromptSub:
        'Got it! Do you want to apply for a "Caste Certificate"? Please confirm Yes.',
      explainText: 'आगे बढ़ने के लिए "हाँ" पर टैप करें या बोलें।',
      explainTextSub: 'Tap or say "Yes" to confirm your certificate application.',
    },
    prepare_docs: {
      aiPrompt:
        'बहुत बढ़िया! शुरू करने से पहले ये 5 दस्तावेज़ अपने हाथ में तैयार रखें ताकि प्रक्रिया जल्दी पूरी हो।',
      aiPromptSub:
        'Great! Keep these 5 documents handy before we start the step-by-step flow.',
      explainText:
        'अभी यह प्रोटोटाइप है, इसलिए असली कागज़ स्कैन नहीं करने हैं। सूची देखकर "तैयार हैं" दबाएँ।',
      explainTextSub:
        'No physical papers are needed in this prototype. Review the list and tap Ready.',
    },
    collect_name: {
      aiPrompt:
        'आइए शुरू करते हैं। सबसे पहले अपना पूरा नाम बोलें या लिखें (जैसे रमेशभाई कनुभाई पटेल)।',
      aiPromptSub:
        'First, please tell me your full name (e.g., Rameshbhai Kanubhai Patel).',
      explainText:
        'आधार और दस्तावेज़ों के अनुसार अपना नाम दें। स्पेलिंग की जाँच स्वतः हो जाएगी।',
      explainTextSub:
        'Provide your full name matching Aadhaar for automatic spelling verification.',
    },
    collect_father: {
      aiPrompt: 'धन्यवाद! अब अपने पिता का पूरा नाम बताएँ।',
      aiPromptSub: 'Thank you! Now please tell me your father’s full name.',
      explainText: 'आवेदन में परिवार सत्यापन के लिए पिता का नाम आवश्यक है।',
      explainTextSub: 'Father’s name verifies family details across records.',
    },
    collect_village_dob: {
      aiPrompt: 'बहुत अच्छे! अब अपना गाँव, तालुका और जन्म तिथि बताएँ।',
      aiPromptSub: 'Now please confirm your Village, Taluka, and Date of Birth.',
      explainText: 'गाँव का नाम और जन्म तिथि दस्तावेज़ों के अनुसार दर्ज करें।',
      explainTextSub: 'Verify your village, taluka, and DOB.',
    },
    collect_caste_income: {
      aiPrompt: 'अब अपनी जाति / उप-जाति और परिवार की वार्षिक आय बताएँ।',
      aiPromptSub: 'Now share your Caste / Sub-caste and annual family income.',
      explainText: 'श्रेणी और आय की जानकारी सत्यापन के लिए दर्ज करें।',
      explainTextSub: 'Enter category and annual income.',
    },
    doc_scan_animation: {
      aiPrompt:
        'अब दस्तावेज़ स्कैनिंग का समय है! देखें कि नीचे की स्कैन प्लेट पर सभी 5 दस्तावेज़ कैसे स्कैन होते हैं।',
      aiPromptSub:
        'Watch the animated laser scan simulation demonstrating how the kiosk scans all 5 documents.',
      explainText:
        'यह एनिमेशन दिखाता है कि हार्डवेयर स्कैन प्लेट पर दस्तावेज़ कैसे लेज़र स्कैन और OCR मैच होते हैं।',
      explainTextSub:
        'This animation shows how the bottom LED platen scans and OCR-matches all 5 documents.',
    },
    auto_photo: {
      aiPrompt:
        'सभी दस्तावेज़ 100% मैच हो गए! अब ऊपर के कैमरे की ओर देखें — AI अपने आप आपका पासपोर्ट फोटो ले रहा है।',
      aiPromptSub:
        'All documents matched 100%! Look at the top camera — AI is auto-capturing your passport photo.',
      explainText:
        'कैमरा 3 सेकंड में स्वतः पासपोर्ट साइज फोटो खींचकर बैकग्राउंड साफ़ कर देगा।',
      explainTextSub: 'AI automatically captures and cleans your passport photo.',
    },
    final_review: {
      aiPrompt:
        'अंत में अपनी सभी जानकारी, स्कैन किए गए दस्तावेज़ और पासपोर्ट फोटो जाँच लें, फिर आवेदन सबमिट करें।',
      aiPromptSub:
        'Finally, review all your details, scanned documents, and passport photo before submitting.',
      explainText: 'सब कुछ सही होने पर "आवेदन सबमिट करें" दबाएँ।',
      explainTextSub: 'Verify every field and submit to the Mamlatdar Officer.',
    },
    submitted: {
      aiPrompt:
        'बधाई हो! आपका आवेदन मामलातदार डैशबोर्ड पर भेज दिया गया है। अब अधिकारी 1-क्लिक DSC से स्वीकृति देंगे।',
      aiPromptSub:
        'Submitted to Mamlatdar Dashboard! Switch to Officer Dashboard for 1-click DSC approval.',
      explainText:
        'ऊपर "2. Mamlatdar Officer Dashboard" में जाकर 1-क्लिक DSC स्वीकृति दें।',
      explainTextSub:
        'Open Mamlatdar Officer Dashboard to approve and unlock your printable certificate.',
    },
  },
  en: {
    greeting: {
      aiPrompt:
        'Welcome to SevaAI! Which government service or certificate do you need today?',
      aiPromptSub:
        'સેવા એઆઈ પર તમારું સ્વાગત છે! આજે તમારે કઈ સેવા જોઈએ છે?',
      explainText:
        'Tap the Microphone to speak or pick a service card below.',
      explainTextSub: 'માઈક દબાવીને બોલો અથવા નીચેથી સેવા પસંદ કરો.',
    },
    confirm_service: {
      aiPrompt:
        'Understood! Do you want to apply for a "Caste Certificate (Jati Pramanpatra)"? Please say or tap Yes.',
      aiPromptSub:
        'શું તમારે જાતિનો દાખલો (Caste Certificate) કઢાવવો છે? કૃપા કરીને હા કહો.',
      explainText:
        'I am confirming your selected service before listing the required documents.',
      explainTextSub:
        'આગળ વધતા પહેલા હું તમારી પસંદ કરેલી સેવા કન્ફર્મ કરી રહ્યો છું.',
    },
    prepare_docs: {
      aiPrompt:
        'Great! Before we begin, please keep these 5 documents handy so your application completes smoothly.',
      aiPromptSub:
        'સરસ! પ્રક્રિયા શરૂ કરતા પહેલા આ ૫ દસ્તાવેજો હાથવગા તૈયાર રાખો.',
      explainText:
        'Because this is a prototype, no physical scanning is needed—simply review the 5 required documents and tap Ready.',
      explainTextSub:
        'પ્રોટોટાઈપ હોવાથી હમણાં અસલી કાગળની જરૂર નથી, માત્ર લિસ્ટ ચકાસો.',
    },
    collect_name: {
      aiPrompt:
        'Let us start! First, please speak or enter your full name (for example: Rameshbhai Kanubhai Patel).',
      aiPromptSub: 'સૌ પ્રથમ, તમારું પૂરું નામ બોલો અથવા લખો.',
      explainText:
        'Your name will be checked phonetically between Gujarati and English to avoid spelling rejections.',
      explainTextSub:
        'ગુજરાતી અને અંગ્રેજી સ્પેલિંગ ભૂલ ટાળવા માટે પૂરું નામ આપો.',
    },
    collect_father: {
      aiPrompt: 'Thank you! Next, please tell me your father’s full name.',
      aiPromptSub: 'આભાર! હવે તમારા પિતાનું પૂરું નામ જણાવો.',
      explainText:
        'Your father’s name links your application to the family Ration Card and records.',
      explainTextSub:
        'પિતાનું નામ રેશન કાર્ડ અને રેકોર્ડ સાથે મેળવવા માટે જરૂરી છે.',
    },
    collect_village_dob: {
      aiPrompt:
        'Great. Now please tell me or confirm your Village, Taluka, and Date of Birth.',
      aiPromptSub: 'હવે તમારું ગામ, તાલુકો અને જન્મ તારીખ જણાવો.',
      explainText:
        'Make sure your Date of Birth matches your Aadhaar and official records.',
      explainTextSub:
        'તમારી જન્મ તારીખ આધાર અને દસ્તાવેજો મુજબ હોવી જરૂરી છે.',
    },
    collect_caste_income: {
      aiPrompt:
        'Almost done with details! Please provide your Caste / Sub-caste and annual family income.',
      aiPromptSub: 'હવે તમારી જાતિ / પેટા-જાતિ અને વાર્ષિક આવક જણાવો.',
      explainText:
        'This final detail completes your verification packet before scanning.',
      explainTextSub: 'આ વિગત સ્કેનિંગ પહેલાં ફોર્મ પૂર્ણ કરવા માટે જરૂરી છે.',
    },
    doc_scan_animation: {
      aiPrompt:
        'Now watch the Document Scan Animation! This shows how the physical kiosk laser-scans your 5 documents on the bottom tray.',
      aiPromptSub:
        'હવે જુઓ કે નીચેની સ્કેન પ્લેટ પર ૫ દસ્તાવેજો કેવી રીતે લેસર સ્કેન થાય છે.',
      explainText:
        'No real paper upload is required in this prototype—the animated simulation shows document placement, laser sweep, and 100% OCR matching.',
      explainTextSub:
        'આ એનિમેશન બતાવે છે કે હાર્ડવેર આવશે ત્યારે દસ્તાવેજો કેવી રીતે ઓટોમેટિક સ્કેન થશે.',
    },
    auto_photo: {
      aiPrompt:
        'All 5 documents matched 100%! Look at the top camera—AI is automatically capturing your passport-size photo.',
      aiPromptSub:
        'ઉપરના કેમેરા સામે જુઓ — AI આપમેળે તમારો પાસપોર્ટ સાઈઝ ફોટો પાડી રહ્યું છે.',
      explainText:
        'The top WDR camera runs a 3-second countdown, takes a live portrait, cleans the background to passport spec, and records voice consent.',
      explainTextSub:
        'કેમેરા આપમેળે ફોટો પાડીને પાસપોર્ટ સાઈઝમાં તૈયાર કરી દેશે.',
    },
    final_review: {
      aiPrompt:
        'Please review all your details, scanned documents, and passport photo below before final submission.',
      aiPromptSub:
        'છેલ્લે તમારી બધી વિગતો, સ્કેન થયેલા દસ્તાવેજો અને ફોટો ચકાસી લો.',
      explainText:
        'Verify everything looks accurate, then submit your 100% error-free packet to the Mamlatdar Officer.',
      explainTextSub: 'બધી વિગતો ચકાસીને અરજી સબમિટ કરો.',
    },
    submitted: {
      aiPrompt:
        'Application submitted! Switch to the Mamlatdar Officer Dashboard to approve with 1-click DSC and unlock your printable certificate.',
      aiPromptSub:
        'અરજી સબમિટ થઈ ગઈ છે! મામલતદાર ડેશબોર્ડ પરથી ૧-ક્લિક મંજૂરી આપો.',
      explainText:
        'Open Tab 2 (Mamlatdar Officer Dashboard) and click Approve with DSC.',
      explainTextSub: 'ઉપરથી બીજા ટેબમાં જઈને મામલતદારની સહીથી મંજૂરી આપો.',
    },
  },
};

const SERVICE_DISPLAY_NAMES: Record<
  ServiceKey,
  Record<LanguageCode, string>
> = {
  caste: {
    gu: 'જાતિનો દાખલો (Caste Certificate)',
    hi: 'जाति प्रमाण पत्र (Caste Certificate)',
    en: 'Caste Certificate (Jati Pramanpatra)',
  },
  income: {
    gu: 'આવકનો દાખલો (Income Certificate)',
    hi: 'आय प्रमाण पत्र (Income Certificate)',
    en: 'Taluka Income Certificate',
  },
  domicile: {
    gu: 'રહેઠાણનો દાખલો (Domicile Certificate)',
    hi: 'निवास प्रमाण पत्र (Domicile Certificate)',
    en: 'Domicile Certificate',
  },
};

export function getServiceLabel(
  selectedService: string,
  language: LanguageCode
): string {
  const key = getServiceKey(selectedService);
  return SERVICE_DISPLAY_NAMES[key][language];
}

export function detectServiceFromText(
  text: string
): {key: ServiceKey; fullEn: string} | null {
  const t = text.toLowerCase();
  if (t.includes('આવક') || t.includes('आय') || t.includes('income')) {
    return {key: 'income', fullEn: 'Taluka Income Certificate'};
  }
  if (
    t.includes('રહેઠાણ') ||
    t.includes('નિવાસ') ||
    t.includes('निवास') ||
    t.includes('domicile') ||
    t.includes('residence')
  ) {
    return {key: 'domicile', fullEn: 'Domicile Certificate'};
  }
  if (t.includes('જાતિ') || t.includes('जाति') || t.includes('caste')) {
    return {key: 'caste', fullEn: 'Caste Certificate (Jati Pramanpatra)'};
  }
  return null;
}

export function getStageCopy(
  language: LanguageCode,
  stage: KioskStage,
  selectedService: string
): StageContent {
  const base = STAGE_CONTENT[language][stage];
  const key = getServiceKey(selectedService);
  const svcName = SERVICE_DISPLAY_NAMES[key][language];
  const svcGu = SERVICE_DISPLAY_NAMES[key].gu;
  const svcEn = SERVICE_DISPLAY_NAMES[key].en;

  if (stage === 'confirm_service') {
    if (language === 'gu') {
      return {
        ...base,
        aiPrompt: `સમજાઈ ગયું! શું તમારે "${svcGu}" કઢાવવો છે? કૃપા કરીને "હા" કહો.`,
        aiPromptSub: `Got it! Do you want to apply for "${svcEn}"? Please confirm Yes.`,
      };
    }
    if (language === 'hi') {
      return {
        ...base,
        aiPrompt: `समझ गया! क्या आपको "${svcName}" बनवाना है? कृपया "हाँ" कहें।`,
        aiPromptSub: `Got it! Do you want to apply for "${svcEn}"? Please confirm Yes.`,
      };
    }
    return {
      ...base,
      aiPrompt: `Understood! Do you want to apply for "${svcEn}"? Please say or tap Yes.`,
      aiPromptSub: `શું તમારે "${svcGu}" કઢાવવો છે? કૃપા કરીને હા કહો.`,
    };
  }

  if (stage === 'collect_caste_income') {
    if (key === 'income') {
      if (language === 'gu') {
        return {
          aiPrompt:
            'હવે તમારા પરિવારની વાર્ષિક આવક અને વ્યવસાય (ખેતી/નોકરી/ધંધો) જણાવો.',
          aiPromptSub:
            'Now please share your annual family income and occupation/income source.',
          explainText:
            'આવકના દાખલા માટે તમારો વ્યવસાય અને કુલ વાર્ષિક આવક (દા.ત. ₹1,85,000) અહીં દાખલ કરો.',
          explainTextSub:
            'Enter your occupation and total annual family income for your Income Certificate.',
        };
      }
      if (language === 'hi') {
        return {
          aiPrompt:
            'अब अपने परिवार की वार्षिक आय और व्यवसाय (खेती/नौकरी/व्यापार) बताएँ।',
          aiPromptSub: 'Now share your annual family income and occupation.',
          explainText:
            'आय प्रमाण पत्र के लिए अपना व्यवसाय और कुल वार्षिक आय दर्ज करें।',
          explainTextSub:
            'Enter your occupation and annual family income for verification.',
        };
      }
      return {
        aiPrompt:
          'Almost done with details! Please provide your occupation and total annual family income.',
        aiPromptSub:
          'હવે તમારા પરિવારની વાર્ષિક આવક અને વ્યવસાય જણાવો.',
        explainText:
          'Annual income and source are verified against Talati Panchkyas & ration card records.',
        explainTextSub: 'તલાટી પંચનામા મુજબ વાર્ષિક આવક અને વ્યવસાયની વિગત આપો.',
      };
    }

    if (key === 'domicile') {
      if (language === 'gu') {
        return {
          aiPrompt:
            'હવે તમે ગુજરાતમાં કેટલા વર્ષથી રહો છો અને તમારો વ્યવસાય જણાવો.',
          aiPromptSub:
            'Now please share how many years you have resided in Gujarat and your occupation.',
          explainText:
            'રહેઠાણના દાખલા માટે ગુજરાતમાં ૧૦+ વર્ષના વસવાટની વિગત અહીં ભરવાની રહેશે.',
          explainTextSub:
            'Enter your years of permanent residence in Gujarat for the Domicile Certificate.',
        };
      }
      if (language === 'hi') {
        return {
          aiPrompt:
            'अब बताएँ कि आप गुजरात में कितने वर्षों से रह रहे हैं और आपका व्यवसाय क्या है।',
          aiPromptSub:
            'Now confirm your years of residence in Gujarat and occupation.',
          explainText:
            'निवास प्रमाण पत्र के लिए गुजरात में स्थायी निवास के वर्षों की जानकारी दर्ज करें।',
          explainTextSub:
            'Enter your years of residence in Gujarat for Domicile verification.',
        };
      }
      return {
        aiPrompt:
          'Almost done! Please confirm how many years you have lived in Gujarat and your occupation.',
        aiPromptSub:
          'હવે ગુજરાતમાં વસવાટના વર્ષો અને તમારો વ્યવસાય જણાવો.',
        explainText:
          'Domicile Certificates verify 10+ years of continuous residence in Gujarat.',
        explainTextSub: 'ગુજરાતમાં ૧૦+ વર્ષના વસવાટની વિગત દાખલ કરો.',
      };
    }
  }

  return base;
}

export interface DoubtChip {
  id: string;
  labelGu: string;
  labelHi: string;
  labelEn: string;
}

export const COMMON_DOUBTS: DoubtChip[] = [
  {
    id: 'no_father_cert',
    labelGu: 'પિતાનો જાતિનો દાખલો ન હોય તો?',
    labelHi: 'पिता का जाति प्रमाण पत्र न हो तो?',
    labelEn: 'No father caste certificate?',
  },
  {
    id: 'spelling_mistake',
    labelGu: 'નામના સ્પેલિંગમાં ભૂલ હશે તો?',
    labelHi: 'नाम की स्पेलिंग में गलती हो तो?',
    labelEn: 'What if spelling differs?',
  },
  {
    id: 'time_fees',
    labelGu: 'દાખલો કેટલા સમયમાં અને કેટલી ફીમાં મળશે?',
    labelHi: 'प्रमाण पत्र कितने समय और शुल्क में मिलेगा?',
    labelEn: 'Processing time & fee?',
  },
  {
    id: 'how_scan',
    labelGu: 'અસલી કાગળ કેવી રીતે સ્કેન થશે?',
    labelHi: 'असली दस्तावेज़ कैसे स्कैन होंगे?',
    labelEn: 'How will real scanning work?',
  },
];

export function resolveCitizenDoubt(
  query: string,
  language: LanguageCode,
  stage: KioskStage
): {reply: string; replySub: string} {
  const q = query.toLowerCase();

  const isFather =
    q.includes('પિતા') ||
    q.includes('पिता') ||
    q.includes('father') ||
    q.includes('no_father_cert');
  const isSpelling =
    q.includes('સ્પેલિંગ') ||
    q.includes('ભૂલ') ||
    q.includes('स्पेलिंग') ||
    q.includes('spelling') ||
    q.includes('spelling_mistake');
  const isTimeFee =
    q.includes('સમય') ||
    q.includes('ફી') ||
    q.includes('समय') ||
    q.includes('शुल्क') ||
    q.includes('time') ||
    q.includes('fee') ||
    q.includes('time_fees');
  const isScan =
    q.includes('સ્કેન') ||
    q.includes('કાગળ') ||
    q.includes('स्कैन') ||
    q.includes('scan') ||
    q.includes('how_scan');

  if (isFather) {
    if (language === 'gu') {
      return {
        reply:
          'ચિંતા ના કરો! જો પિતાનો જાતિનો દાખલો ન હોય તો દાદા કે કાકાનો જાતિનો દાખલો અથવા જૂનો રેવન્યુ રેકોર્ડ (૭/૧૨ ઉતારો કે ગામ નમૂનો) પણ કિઓસ્ક પર સ્કેન કરી શકાય છે.',
        replySub:
          'If Father’s Caste Certificate is unavailable, grandfather/uncle’s certificate or old 7/12 revenue lineage proof works too.',
      };
    }
    if (language === 'hi') {
      return {
        reply:
          'चिंता न करें! यदि पिता का जाति प्रमाण पत्र नहीं है, तो दादा या चाचा का जाति प्रमाण पत्र या पुराना राजस्व रिकॉर्ड (7/12) भी स्कैन किया जा सकता है।',
        replySub:
          'Grandfather/uncle caste certificate or old revenue records can be scanned as lineage proof.',
      };
    }
    return {
      reply:
        'No worries! If your father’s caste certificate isn’t available, you can scan a paternal uncle/grandfather’s caste certificate or old 7/12 revenue lineage record.',
      replySub: 'પિતાનો દાખલો ન હોય તો દાદા/કાકાનો દાખલો અથવા ૭/૧૨ નો ઉતારો ચાલી શકે છે.',
    };
  }

  if (isSpelling) {
    if (language === 'gu') {
      return {
        reply:
          'તેના માટે જ SevaAI બન્યું છે! અમારું એઆઈ ગુજરાતી અને અંગ્રેજી બંનેમાં ફોનેટિક સ્પેલિંગ ચેક કરે છે અને અરજી સબમિટ થતા પહેલા જ ભૂલ સુધારી આપે છે, જેથી દાખલો રિજેક્ટ ન થાય.',
        replySub:
          'SevaAI checks Gujarati & English spellings phonetically before submission so applications never get rejected.',
      };
    }
    if (language === 'hi') {
      return {
        reply:
          'इसीलिए SevaAI बनाया गया है! यह आवेदन जमा होने से पहले ही सभी दस्तावेज़ों में नाम की स्पेलिंग का मिलान करके त्रुटि ठीक कर देता है।',
        replySub:
          'SevaAI cross-checks spellings across all documents before submission to prevent rejection.',
      };
    }
    return {
      reply:
        'That is exactly why SevaAI exists! Our phonetic OCR matches Gujarati and English spellings across all 5 documents before submission, dropping rejection rates to 0%.',
      replySub: 'સબમિટ કરતા પહેલા જ AI બધા દસ્તાવેજોના સ્પેલિંગ 100% મેચ કરે છે.',
    };
  }

  if (isTimeFee) {
    if (language === 'gu') {
      return {
        reply:
          'SevaAI દ્વારા પૂરી પ્રક્રિયા માત્ર ૧૦ મિનિટમાં પૂર્ણ થાય છે! સામાન્ય સરકારી ફી ₹૨૦ (ચલણ મુજબ) છે અને વચેટિયાને એક પણ રૂપિયો આપવો પડતો નથી.',
        replySub:
          'Complete processing takes ~10 minutes with only standard ₹20 govt fee and ₹0 middleman cost.',
      };
    }
    if (language === 'hi') {
      return {
        reply:
          'SevaAI से पूरी प्रक्रिया केवल 10 मिनट में पूरी होती है और केवल मानक ₹20 सरकारी शुल्क लगता है, कोई बिचौलिया खर्च नहीं।',
        replySub:
          'Takes ~10 minutes with standard ₹20 government fee and zero middleman fees.',
      };
    }
    return {
      reply:
        'With SevaAI, the entire process takes ~10 minutes instead of 15 days, with only the standard ₹20 government fee and ₹0 middleman charges.',
      replySub: 'સંપૂર્ણ પ્રક્રિયા ૧૦ મિનિટમાં અને માત્ર ₹૨૦ સરકારી ફીમાં પૂરી થાય છે.',
    };
  }

  if (isScan) {
    if (language === 'gu') {
      return {
        reply:
          'અસલી હાર્ડવેરમાં નીચે એક ખુલ્લી LED સ્કેન પ્લેટ હશે. તમારે માત્ર કાગળ મૂકવાનો રહેશે — ૧૬MP ઓવરહેડ કેમેરા જાતે જ ફોટો પાડીને OCR કરી લેશે. હમણાં પ્રોટોટાઈપમાં અમે તેનું એનિમેશન બતાવીએ છીએ.',
        replySub:
          'In production hardware, you simply place documents on the open LED tray and the 16MP overhead camera scans them automatically.',
      };
    }
    if (language === 'hi') {
      return {
        reply:
          'असली कियोस्क में नीचे खुली LED स्कैन प्लेट होगी। कागज़ रखने पर 16MP ओवरहेड कैमरा स्वतः स्कैन और OCR करेगा। अभी प्रोटोटाइप में एनिमेशन दिखाया जा रहा है।',
        replySub:
          'In production hardware, an open LED tray with 16MP overhead camera scans documents automatically.',
      };
    }
    return {
      reply:
        'In the physical kiosk hardware, you simply lay each paper on the bottom open LED tray—the 16MP overhead camera scans even folded/laminated cards automatically without jamming.',
      replySub: 'અસલી હાર્ડવેરમાં ખુલ્લી LED ટ્રે પર મૂકેલા દસ્તાવેજ ૧૬MP કેમેરાથી આપમેળે સ્કેન થશે.',
    };
  }

  // Fallback contextual explanation for current stage
  const current = STAGE_CONTENT[language][stage];
  return {
    reply: current.explainText,
    replySub: current.explainTextSub,
  };
}
