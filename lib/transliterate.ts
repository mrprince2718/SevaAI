export type IndicTargetScript = 'gu' | 'hi';

const GU_REGEX = /[\u0A80-\u0AFF]/;
const HI_REGEX = /[\u0900-\u097F]/;
const INDIC_REGEX = /[\u0900-\u097F\u0A80-\u0AFF]/;

export function containsGujaratiScript(text: string): boolean {
  return GU_REGEX.test(text);
}

export function containsDevanagariScript(text: string): boolean {
  return HI_REGEX.test(text);
}

export function containsIndicScript(text: string): boolean {
  return INDIC_REGEX.test(text);
}

const GU_DIGITS = '૦૧૨૩૪૫૬૭૮૯';
const HI_DIGITS = '०१२३४५६७८९';

export function normalizeIndicDigits(text: string): string {
  return text
    .replace(/[\u0AE6-\u0AEF]/g, (ch) => String(ch.charCodeAt(0) - 0x0ae6))
    .replace(/[\u0966-\u096F]/g, (ch) => String(ch.charCodeAt(0) - 0x0966));
}

// High-precision dictionary for common Gujarati / Hindi citizen names, surnames, locations & gov terms
const INDIC_TO_EN_WORDS: Record<string, string> = {
  // Demo & Common Names (Gujarati)
  'રમેશ': 'Ramesh',
  'રમેશભાઈ': 'Rameshbhai',
  'કનુ': 'Kanu',
  'કનુભાઈ': 'Kanubhai',
  'નાથા': 'Natha',
  'નાથાભાઈ': 'Nathabhai',
  'મીના': 'Meena',
  'મીનાબેન': 'Meenaben',
  'હર્ષદ': 'Harshad',
  'હર્ષદભાઈ': 'Harshadbhai',
  'મગન': 'Magan',
  'મગનભાઈ': 'Maganbhai',
  'પ્રકાશ': 'Prakash',
  'પ્રકાશભાઈ': 'Prakashbhai',
  'ભીખુ': 'Bhikhu',
  'ભીખુભાઈ': 'Bhikhubhai',
  'છગન': 'Chhagan',
  'છગનભાઈ': 'Chhaganbhai',
  'મહેશ': 'Mahesh',
  'મહેશભાઈ': 'Maheshbhai',
  'સુરેશ': 'Suresh',
  'સુરેશભાઈ': 'Sureshbhai',
  'રાજેશ': 'Rajesh',
  'રાજેશભાઈ': 'Rajeshbhai',
  'દિનેશ': 'Dinesh',
  'દિનેશભાઈ': 'Dineshbhai',
  'કિરણ': 'Kiran',
  'કિરણભાઈ': 'Kiranbhai',
  'કિરણબેન': 'Kiranben',
  'સંજય': 'Sanjay',
  'સંજયભાઈ': 'Sanjaybhai',
  'વિજય': 'Vijay',
  'વિજયભાઈ': 'Vijaybhai',
  'અજય': 'Ajay',
  'ભરત': 'Bharat',
  'ભરતભાઈ': 'Bharatbhai',
  'કિશોર': 'Kishor',
  'કિશોરભાઈ': 'Kishorbhai',
  'જીતેન્દ્ર': 'Jitendra',
  'નિલેશ': 'Nilesh',
  'પરેશ': 'Paresh',
  'હિતેશ': 'Hitesh',
  'મુકેશ': 'Mukesh',
  'યોગેશ': 'Yogesh',
  'નરેશ': 'Naresh',
  'નરેન્દ્ર': 'Narendra',
  'અમિત': 'Amit',
  'રોહિત': 'Rohit',
  'રાહુલ': 'Rahul',
  'હાર્દિક': 'Hardik',
  'કૌશિક': 'Kaushik',
  'આશિષ': 'Ashish',
  'મનોજ': 'Manoj',
  'અશોક': 'Ashok',
  'વિક્રમ': 'Vikram',
  'દિલીપ': 'Dilip',
  'ગોપાલ': 'Gopal',
  'રવિ': 'Ravi',
  'વિશાલ': 'Vishal',
  'દર્શન': 'Darshan',
  'પાર્થ': 'Parth',
  'ધવલ': 'Dhaval',
  'ચિરાગ': 'Chirag',
  'કૃણાલ': 'Krunal',
  'સાગર': 'Sagar',
  'ગીતા': 'Geeta',
  'ગીતાબેન': 'Geetaben',
  'સીતા': 'Seeta',
  'સીતાબેન': 'Seetaben',
  'લક્ષ્મી': 'Laxmi',
  'લક્ષ્મીબેન': 'Laxmiben',
  'રેખા': 'Rekha',
  'રેખાબેન': 'Rekhaben',
  'આશા': 'Asha',
  'આશાબેન': 'Ashaben',
  'પૂજા': 'Pooja',
  'પાયલ': 'Payal',
  'નેહા': 'Neha',
  'નિશા': 'Nisha',
  'પ્રિયા': 'Priya',
  'દિવ્યા': 'Divya',
  'કાજલ': 'Kajal',
  'હિના': 'Hina',
  'શ્રી': 'Shri',
  'શ્રીમતી': 'Smt.',
  'કુમાર': 'Kumar',
  'ભાઈ': 'Bhai',
  'બેન': 'Ben',

  // Common Surnames (Gujarati)
  'પટેલ': 'Patel',
  'સોલંકી': 'Solanki',
  'ઠાકોર': 'Thakor',
  'પરમાર': 'Parmar',
  'ચૌહાણ': 'Chauhan',
  'રાઠોડ': 'Rathod',
  'વાઘેલા': 'Vaghela',
  'ગોહિલ': 'Gohil',
  'જાડેજા': 'Jadeja',
  'ઝાલા': 'Zala',
  'પંડ્યા': 'Pandya',
  'જોશી': 'Joshi',
  'શાહ': 'Shah',
  'મહેતા': 'Mehta',
  'દેસાઈ': 'Desai',
  'મોદી': 'Modi',
  'ચૌધરી': 'Chaudhary',
  'પ્રજાપતિ': 'Prajapati',
  'પંચાલ': 'Panchal',
  'સોની': 'Soni',
  'સુથાર': 'Suthar',
  'લુહાર': 'Luhar',
  'દરજી': 'Darji',
  'વાળંદ': 'Valand',
  'રબારી': 'Rabari',
  'ભરવાડ': 'Bharwad',
  'આહીર': 'Ahir',
  'કોળી': 'Koli',
  'ક્ષત્રિય': 'Kshatriya',
  'રાજપૂત': 'Rajput',
  'બ્રાહ્મણ': 'Brahmin',
  'ગામીત': 'Gamit',
  'વસાવા': 'Vasava',
  'તડવી': 'Tadvi',
  'ભીલ': 'Bhil',
  'બારીયા': 'Bariya',
  'રાવળ': 'Raval',
  'ત્રિવેદી': 'Trivedi',
  'દવે': 'Dave',
  'ભટ્ટ': 'Bhatt',
  'વ્યાસ': 'Vyas',
  'શુક્લ': 'Shukla',
  'શર્મા': 'Sharma',
  'વર્મા': 'Verma',
  'સિંહ': 'Singh',
  'યાદવ': 'Yadav',
  'ગુપ્તા': 'Gupta',
  'ખાન': 'Khan',
  'શેખ': 'Shaikh',
  'મન્સૂરી': 'Mansuri',
  'મલેક': 'Malek',

  // Common Places & Talukas (Gujarati)
  'કુંડળ': 'Kundal',
  'સાણંદ': 'Sanand',
  'વિરોચનનગર': 'Virochannagar',
  'ગોરજ': 'Goraj',
  'અમદાવાદ': 'Ahmedabad',
  'ગાંધીનગર': 'Gandhinagar',
  'સુરત': 'Surat',
  'વડોદરા': 'Vadodara',
  'રાજકોટ': 'Rajkot',
  'ભાવનગર': 'Bhavnagar',
  'જામનગર': 'Jamnagar',
  'જૂનાગઢ': 'Junagadh',
  'મહેસાણા': 'Mehsana',
  'આણંદ': 'Anand',
  'ખેડા': 'Kheda',
  'નડિયાદ': 'Nadiad',
  'ધોળકા': 'Dholka',
  'બાવળા': 'Bavla',
  'વિરમગામ': 'Viramgam',
  'દસ્ક્રોઈ': 'Daskroi',
  'કલોલ': 'Kalol',
  'કડી': 'Kadi',
  'પાટણ': 'Patan',
  'પાલનપુર': 'Palanpur',
  'ભુજ': 'Bhuj',
  'કચ્છ': 'Kutch',
  'ભરૂચ': 'Bharuch',
  'અંકલેશ્વર': 'Ankleshwar',
  'વલસાડ': 'Valsad',
  'નવસારી': 'Navsari',
  'ગોધરા': 'Godhra',
  'મોરબી': 'Morbi',
  'સુરેન્દ્રનગર': 'Surendranagar',
  'પોરબંદર': 'Porbandar',
  'અમરેલી': 'Amreli',
  'તા': 'Tal.',
  'તાલુકો': 'Taluka',
  'જિ': 'Dist.',
  'જિલ્લો': 'District',
  'ગામ': 'Village',
  'ગુજરાત': 'Gujarat',

  // Occupations / Residence / Caste terms
  'ખેતી': 'Agriculture / Farming',
  'ખેડૂત': 'Farmer',
  'નોકરી': 'Service / Job',
  'ધંધો': 'Business',
  'વેપાર': 'Business',
  'મજૂરી': 'Labour',
  'ગૃહિણી': 'Homemaker',
  'વિદ્યાર્થી': 'Student',
  'જન્મથી': 'Since Birth',
  'વર્ષ': 'Years',
  'બક્ષીપંચ': 'SEBC / Baxi Panch',

  // Common Hindi Equivalents
  'रमेश': 'Ramesh',
  'रमेशभाई': 'Rameshbhai',
  'कनु': 'Kanu',
  'कनुभाई': 'Kanubhai',
  'नाथा': 'Natha',
  'नाथाभाई': 'Nathabhai',
  'मीना': 'Meena',
  'मीनाबेन': 'Meenaben',
  'हर्षद': 'Harshad',
  'हर्षदभाई': 'Harshadbhai',
  'प्रकाश': 'Prakash',
  'प्रकाशभाई': 'Prakashbhai',
  'भीखुभाई': 'Bhikhubhai',
  'महेश': 'Mahesh',
  'महेशभाई': 'Maheshbhai',
  'सुरेश': 'Suresh',
  'सुरेशभाई': 'Sureshbhai',
  'राजेश': 'Rajesh',
  'राजेशभाई': 'Rajeshbhai',
  'दिनेश': 'Dinesh',
  'राहुल': 'Rahul',
  'अमित': 'Amit',
  'विजय': 'Vijay',
  'संजय': 'Sanjay',
  'पटेल': 'Patel',
  'सोलंकी': 'Solanki',
  'ठाकोर': 'Thakor',
  'परमार': 'Parmar',
  'चौहान': 'Chauhan',
  'राठौड़': 'Rathod',
  'पांड्या': 'Pandya',
  'जोशी': 'Joshi',
  'शाह': 'Shah',
  'मेहता': 'Mehta',
  'देसाई': 'Desai',
  'मोदी': 'Modi',
  'चौधरी': 'Chaudhary',
  'प्रजापति': 'Prajapati',
  'शर्मा': 'Sharma',
  'वर्मा': 'Verma',
  'सिंह': 'Singh',
  'यादव': 'Yadav',
  'राजपूत': 'Rajput',
  'कुंडल': 'Kundal',
  'साणंद': 'Sanand',
  'अहमदाबाद': 'Ahmedabad',
  'गांधीनगर': 'Gandhinagar',
  'सूरत': 'Surat',
  'वडोदरा': 'Vadodara',
  'राजकोट': 'Rajkot',
  'भाई': 'Bhai',
  'बेन': 'Ben',
  'कुमार': 'Kumar',
  'श्री': 'Shri',
  'तालुका': 'Taluka',
  'जिला': 'District',
  'गाँव': 'Village',
  'खेती': 'Agriculture / Farming',
  'नौकरी': 'Service / Job',
  'व्यापार': 'Business',
  'वर्ष': 'Years',
};

// Build reverse dictionaries EN (lowercase) -> GU and HI
const EN_TO_GU_WORDS: Record<string, string> = {};
const EN_TO_HI_WORDS: Record<string, string> = {};

for (const [indic, en] of Object.entries(INDIC_TO_EN_WORDS)) {
  const key = en.toLowerCase();
  if (containsGujaratiScript(indic) && !EN_TO_GU_WORDS[key]) {
    EN_TO_GU_WORDS[key] = indic;
  } else if (containsDevanagariScript(indic) && !EN_TO_HI_WORDS[key]) {
    EN_TO_HI_WORDS[key] = indic;
  }
}

// Explicit override for key English phrases/words
Object.assign(EN_TO_GU_WORDS, {
  tal: 'તા.',
  'tal.': 'તા.',
  taluka: 'તાલુકો',
  dist: 'જિ.',
  'dist.': 'જિ.',
  district: 'જિલ્લો',
  village: 'ગામ',
  agriculture: 'ખેતી',
  farming: 'ખેતી',
  farmer: 'ખેડૂત',
  small: 'નાના',
  years: 'વર્ષ',
  since: 'થી',
  birth: 'જન્મ',
  patel: 'પટેલ',
  sebc: 'SEBC',
  obc: 'OBC',
});

Object.assign(EN_TO_HI_WORDS, {
  tal: 'ता.',
  'tal.': 'ता.',
  taluka: 'तालुका',
  dist: 'जि.',
  'dist.': 'जि.',
  district: 'जिला',
  village: 'गाँव',
  agriculture: 'खेती',
  farming: 'खेती',
  farmer: 'किसान',
  years: 'वर्ष',
  since: 'से',
  birth: 'जन्म',
  patel: 'पटेल',
  sebc: 'SEBC',
  obc: 'OBC',
  kunbi: 'कुनबी',
  kadva: 'कड़वा',
  virochannagar: 'विरोचननगर',
  goraj: 'गोरज',
  nathabhai: 'नाथाभाई',
  maganbhai: 'मगनभाई',
  bhikhubhai: 'भीखुभाई',
  chhaganbhai: 'छगनभाई',
});

// Character tables for algorithmic Indic -> English transliteration
const GU_VOWELS: Record<string, string> = {
  '\u0A85': 'a',
  '\u0A86': 'aa',
  '\u0A87': 'i',
  '\u0A88': 'ee',
  '\u0A89': 'u',
  '\u0A8A': 'oo',
  '\u0A8B': 'ru',
  '\u0A8D': 'e',
  '\u0A8F': 'e',
  '\u0A90': 'ai',
  '\u0A91': 'o',
  '\u0A93': 'o',
  '\u0A94': 'au',
};

const GU_CONSONANTS: Record<string, string> = {
  '\u0A95': 'k',
  '\u0A96': 'kh',
  '\u0A97': 'g',
  '\u0A98': 'gh',
  '\u0A99': 'ng',
  '\u0A9A': 'ch',
  '\u0A9B': 'chh',
  '\u0A9C': 'j',
  '\u0A9D': 'jh',
  '\u0A9E': 'ny',
  '\u0A9F': 't',
  '\u0AA0': 'th',
  '\u0AA1': 'd',
  '\u0AA2': 'dh',
  '\u0AA3': 'n',
  '\u0AA4': 't',
  '\u0AA5': 'th',
  '\u0AA6': 'd',
  '\u0AA7': 'dh',
  '\u0AA8': 'n',
  '\u0AAA': 'p',
  '\u0AAB': 'ph',
  '\u0AAC': 'b',
  '\u0AAD': 'bh',
  '\u0AAE': 'm',
  '\u0AAF': 'y',
  '\u0AB0': 'r',
  '\u0AB2': 'l',
  '\u0AB3': 'l',
  '\u0AB5': 'v',
  '\u0AB6': 'sh',
  '\u0AB7': 'sh',
  '\u0AB8': 's',
  '\u0AB9': 'h',
};

const GU_MATRAS: Record<string, string> = {
  '\u0ABE': 'a',
  '\u0ABF': 'i',
  '\u0AC0': 'ee',
  '\u0AC1': 'u',
  '\u0AC2': 'oo',
  '\u0AC3': 'ru',
  '\u0AC5': 'e',
  '\u0AC7': 'e',
  '\u0AC8': 'ai',
  '\u0AC9': 'o',
  '\u0ACB': 'o',
  '\u0ACC': 'au',
};

const HI_VOWELS: Record<string, string> = {
  '\u0905': 'a',
  '\u0906': 'aa',
  '\u0907': 'i',
  '\u0908': 'ee',
  '\u0909': 'u',
  '\u090A': 'oo',
  '\u090B': 'ru',
  '\u090F': 'e',
  '\u0910': 'ai',
  '\u0913': 'o',
  '\u0914': 'au',
};

const HI_CONSONANTS: Record<string, string> = {
  '\u0915': 'k',
  '\u0916': 'kh',
  '\u0917': 'g',
  '\u0918': 'gh',
  '\u0919': 'ng',
  '\u091A': 'ch',
  '\u091B': 'chh',
  '\u091C': 'j',
  '\u091D': 'jh',
  '\u091E': 'ny',
  '\u091F': 't',
  '\u0920': 'th',
  '\u0921': 'd',
  '\u0922': 'dh',
  '\u0923': 'n',
  '\u0924': 't',
  '\u0925': 'th',
  '\u0926': 'd',
  '\u0927': 'dh',
  '\u0928': 'n',
  '\u092A': 'p',
  '\u092B': 'ph',
  '\u092C': 'b',
  '\u092D': 'bh',
  '\u092E': 'm',
  '\u092F': 'y',
  '\u0930': 'r',
  '\u0932': 'l',
  '\u0933': 'l',
  '\u0935': 'v',
  '\u0936': 'sh',
  '\u0937': 'sh',
  '\u0938': 's',
  '\u0939': 'h',
};

const HI_MATRAS: Record<string, string> = {
  '\u093E': 'a',
  '\u093F': 'i',
  '\u0940': 'ee',
  '\u0941': 'u',
  '\u0942': 'oo',
  '\u0943': 'ru',
  '\u0947': 'e',
  '\u0948': 'ai',
  '\u094B': 'o',
  '\u094C': 'au',
};

const LABIAL_CONSONANTS = new Set([
  '\u0AAA', '\u0AAB', '\u0AAC', '\u0AAD', '\u0AAE',
  '\u092A', '\u092B', '\u092C', '\u092D', '\u092E',
]);

function transliterateIndicWordAlgorithmic(word: string): string {
  const isGu = containsGujaratiScript(word);
  const vowels = isGu ? GU_VOWELS : HI_VOWELS;
  const consonants = isGu ? GU_CONSONANTS : HI_CONSONANTS;
  const matras = isGu ? GU_MATRAS : HI_MATRAS;
  const virama = isGu ? '\u0ACD' : '\u094D';
  const anusvara = isGu ? '\u0A82' : '\u0902';
  const chandrabindu = isGu ? '\u0A81' : '\u0901';
  const visarga = isGu ? '\u0A83' : '\u0903';
  const nukta = isGu ? '\u0ABC' : '\u093C';

  // Common conjunct clusters
  const ksh = isGu ? '\u0A95\u0ACD\u0AB7' : '\u0915\u094D\u0937';
  const gny = isGu ? '\u0A9C\u0ACD\u0A9E' : '\u091C\u094D\u091E';
  const tr = isGu ? '\u0AA4\u0ACD\u0AB0' : '\u0924\u094D\u0930';
  const shr = isGu ? '\u0AB6\u0ACD\u0AB0' : '\u0936\u094D\u0930';

  const chars = Array.from(word);
  let out = '';
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];
    const next3 = chars.slice(i, i + 3).join('');

    // Special conjuncts
    if (next3 === ksh || next3 === gny || next3 === tr || next3 === shr) {
      const clusterRom =
        next3 === ksh
          ? 'ksh'
          : next3 === gny
            ? isGu
              ? 'gny'
              : 'gy'
            : next3 === tr
              ? 'tr'
              : 'shr';
      i += 3;
      const after = chars[i];
      if (after && matras[after]) {
        out += clusterRom + matras[after];
        i += 1;
      } else if (after === virama) {
        out += clusterRom;
        i += 1;
      } else {
        // Check end of word
        const hasMore = i < chars.length;
        out += clusterRom + (hasMore ? 'a' : '');
      }
      continue;
    }

    if (vowels[ch]) {
      out += vowels[ch];
      i += 1;
      continue;
    }

    if (consonants[ch]) {
      let base = consonants[ch];
      i += 1;
      if (chars[i] === nukta) {
        if (ch === '\u0A9C' || ch === '\u091C') base = 'z';
        else if (ch === '\u0AAB' || ch === '\u092B') base = 'f';
        i += 1;
      }

      const after = chars[i];
      if (after === virama) {
        out += base;
        i += 1;
      } else if (after && matras[after]) {
        out += base + matras[after];
        i += 1;
      } else {
        // Inherent schwa 'a' deletion heuristic for Indian names:
        // Keep 'a' unless it is the final consonant of a multi-syllable word
        const isLast = i >= chars.length;
        const onlyAnusvaraFollows =
          i === chars.length - 1 && (chars[i] === anusvara || chars[i] === chandrabindu);

        // Also check 3-syllable CV-CV-CV schwa drop at end of multi-syllable words
        if ((isLast || onlyAnusvaraFollows) && out.length > 0) {
          out += base;
        } else {
          out += base + 'a';
        }
      }
      continue;
    }

    if (ch === anusvara || ch === chandrabindu) {
      const nextChar = chars[i + 1];
      out += nextChar && LABIAL_CONSONANTS.has(nextChar) ? 'm' : 'n';
      i += 1;
      continue;
    }

    if (ch === visarga) {
      out += 'h';
      i += 1;
      continue;
    }

    if (ch >= '\u0AE6' && ch <= '\u0AEF') {
      out += String(ch.charCodeAt(0) - 0x0ae6);
      i += 1;
      continue;
    }
    if (ch >= '\u0966' && ch <= '\u096F') {
      out += String(ch.charCodeAt(0) - 0x0966);
      i += 1;
      continue;
    }

    out += ch;
    i += 1;
  }

  // Natural phonetic touch-ups for Indian names
  out = out
    .replace(/aa$/i, 'a') // e.g. મીના -> Meena, પૂજા -> Pooja (already a from matra, aa at start stays)
    .replace(/bhaai\b/gi, 'bhai')
    .replace(/bhaaee\b/gi, 'bhai')
    .replace(/bhaee\b/gi, 'bhai')
    .replace(/bhaai/gi, 'bhai')
    .replace(/kumaar/gi, 'kumar')
    .replace(/patela\b/gi, 'patel');

  return out;
}

function toTitleWord(w: string): string {
  if (!w) return '';
  if (/^[0-9]+$/.test(w)) return w;
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function transliterateIndicWord(word: string): string {
  const clean = normalizeIndicDigits(word);
  if (INDIC_TO_EN_WORDS[clean]) {
    return INDIC_TO_EN_WORDS[clean];
  }

  // Handle common Gujarati & Hindi name suffixes for 100% crisp output on unseen first names!
  const compoundSuffixes: {suffix: string; enSuffix: string}[] = [
    {suffix: 'ભાઈ', enSuffix: 'bhai'},
    {suffix: 'भाई', enSuffix: 'bhai'},
    {suffix: 'બેન', enSuffix: 'ben'},
    {suffix: 'बेन', enSuffix: 'ben'},
    {suffix: 'કુમાર', enSuffix: 'kumar'},
    {suffix: 'कुमार', enSuffix: 'kumar'},
    {suffix: 'લાલ', enSuffix: 'lal'},
    {suffix: 'लाल', enSuffix: 'lal'},
    {suffix: 'દાસ', enSuffix: 'das'},
    {suffix: 'दास', enSuffix: 'das'},
    {suffix: 'ચંદ્ર', enSuffix: 'chandra'},
    {suffix: 'चन्द्र', enSuffix: 'chandra'},
    {suffix: 'પ્રસાદ', enSuffix: 'prasad'},
    {suffix: 'प्रसाद', enSuffix: 'prasad'},
    {suffix: 'સિંહ', enSuffix: 'sinh'},
    {suffix: 'सिंह', enSuffix: 'singh'},
  ];

  for (const {suffix, enSuffix} of compoundSuffixes) {
    if (clean.endsWith(suffix) && clean.length > suffix.length) {
      const stem = clean.slice(0, -suffix.length);
      const stemEn = INDIC_TO_EN_WORDS[stem] || toTitleWord(transliterateIndicWordAlgorithmic(stem));
      return `${stemEn}${enSuffix}`;
    }
  }

  const raw = transliterateIndicWordAlgorithmic(clean);
  return toTitleWord(raw);
}

/**
 * Converts Gujarati or Devanagari Hindi text into natural Title Case English.
 * Existing Latin characters, punctuation, and symbols are preserved cleanly.
 */
export function transliterateToEnglish(text: string): string {
  if (!text) return '';
  const digitsNormalized = normalizeIndicDigits(text);
  if (!containsIndicScript(digitsNormalized)) {
    return digitsNormalized;
  }

  // Split by non-word separators while preserving delimiters
  const parts = digitsNormalized.split(/([^\u0900-\u097F\u0A80-\u0AFFA-Za-z0-9]+)/);
  return parts
    .map((part) => {
      if (!part) return '';
      if (containsIndicScript(part)) {
        return transliterateIndicWord(part);
      }
      return part;
    })
    .join('');
}

// Phonetic English -> Indic word conversion when not in dictionary
const ROMAN_CONSONANTS_GU: [string, string][] = [
  ['ksh', 'ક્ષ'],
  ['gny', 'જ્ઞ'],
  ['shr', 'શ્ર'],
  ['chh', 'છ'],
  ['bh', 'ભ'],
  ['ph', 'ફ'],
  ['th', 'થ'],
  ['dh', 'ધ'],
  ['kh', 'ખ'],
  ['gh', 'ઘ'],
  ['ch', 'ચ'],
  ['jh', 'ઝ'],
  ['sh', 'શ'],
  ['ng', 'ંગ'],
  ['ny', 'ન્ય'],
  ['k', 'ક'],
  ['g', 'ગ'],
  ['j', 'જ'],
  ['t', 'ત'],
  ['d', 'દ'],
  ['n', 'ન'],
  ['p', 'પ'],
  ['f', 'ફ'],
  ['b', 'બ'],
  ['m', 'મ'],
  ['y', 'ય'],
  ['r', 'ર'],
  ['l', 'લ'],
  ['v', 'વ'],
  ['w', 'વ'],
  ['s', 'સ'],
  ['h', 'હ'],
  ['z', 'ઝ'],
  ['c', 'ક'],
  ['q', 'ક'],
  ['x', 'ક્સ'],
];

const ROMAN_CONSONANTS_HI: [string, string][] = [
  ['ksh', 'क्ष'],
  ['gny', 'ज्ञ'],
  ['shr', 'श्र'],
  ['chh', 'छ'],
  ['bh', 'भ'],
  ['ph', 'फ'],
  ['th', 'थ'],
  ['dh', 'ध'],
  ['kh', 'ख'],
  ['gh', 'घ'],
  ['ch', 'च'],
  ['jh', 'झ'],
  ['sh', 'श'],
  ['ng', 'ंग'],
  ['ny', 'न्य'],
  ['k', 'क'],
  ['g', 'ग'],
  ['j', 'ज'],
  ['t', 'त'],
  ['d', 'द'],
  ['n', 'न'],
  ['p', 'प'],
  ['f', 'फ'],
  ['b', 'ब'],
  ['m', 'म'],
  ['y', 'य'],
  ['r', 'र'],
  ['l', 'ल'],
  ['v', 'व'],
  ['w', 'व'],
  ['s', 'स'],
  ['h', 'ह'],
  ['z', 'ज़'],
  ['c', 'क'],
  ['q', 'क'],
  ['x', 'क्स'],
];

const ROMAN_VOWELS_GU: [string, string, string][] = [
  ['ai', 'ઐ', 'ૈ'],
  ['au', 'ઔ', 'ૌ'],
  ['aa', 'આ', 'ા'],
  ['ee', 'ઈ', 'ી'],
  ['oo', 'ઊ', 'ૂ'],
  ['a', 'અ', ''],
  ['i', 'ઇ', 'િ'],
  ['u', 'ઉ', 'ુ'],
  ['e', 'એ', 'ે'],
  ['o', 'ઓ', 'ો'],
];

const ROMAN_VOWELS_HI: [string, string, string][] = [
  ['ai', 'ऐ', 'ै'],
  ['au', 'औ', 'ौ'],
  ['aa', 'आ', 'ा'],
  ['ee', 'ई', 'ी'],
  ['oo', 'ऊ', 'ू'],
  ['a', 'अ', ''],
  ['i', 'इ', 'ि'],
  ['u', 'उ', 'ु'],
  ['e', 'ए', 'े'],
  ['o', 'ओ', 'ो'],
];

function transliterateEnglishWordAlgorithmic(
  word: string,
  target: IndicTargetScript
): string {
  const lower = word.toLowerCase();
  const consTable = target === 'gu' ? ROMAN_CONSONANTS_GU : ROMAN_CONSONANTS_HI;
  const vowelTable = target === 'gu' ? ROMAN_VOWELS_GU : ROMAN_VOWELS_HI;
  const virama = target === 'gu' ? '્' : '्';

  let out = '';
  let i = 0;

  while (i < lower.length) {
    const rest = lower.slice(i);

    // Check consonant
    let matchedCons: [string, string] | undefined;
    for (const entry of consTable) {
      if (rest.startsWith(entry[0])) {
        matchedCons = entry;
        break;
      }
    }

    if (matchedCons) {
      const [rom, indicCons] = matchedCons;
      i += rom.length;
      const after = lower.slice(i);

      // Check following vowel
      let matchedVowel: [string, string, string] | undefined;
      for (const v of vowelTable) {
        if (after.startsWith(v[0])) {
          matchedVowel = v;
          break;
        }
      }

      if (matchedVowel) {
        const [vRom, , matra] = matchedVowel;
        i += vRom.length;
        // 'a' has empty matra, whereas 'aa' or final 'a' (e.g. Meena) gets 'ા' / 'ा'
        if (vRom === 'a' && i === lower.length) {
          out += indicCons + (target === 'gu' ? 'ા' : 'ा');
        } else {
          out += indicCons + matra;
        }
      } else {
        // Consonant followed by another consonant or end of word
        // If end of word, omit virama (inherent silent schwa in Gujarati/Hindi names like Patel, Mahesh)
        if (i < lower.length) {
          out += indicCons + virama;
        } else {
          out += indicCons;
        }
      }
      continue;
    }

    // Standalone vowel (start of word or after another vowel)
    let matchedVowel: [string, string, string] | undefined;
    for (const v of vowelTable) {
      if (rest.startsWith(v[0])) {
        matchedVowel = v;
        break;
      }
    }

    if (matchedVowel) {
      out += matchedVowel[1];
      i += matchedVowel[0].length;
      continue;
    }

    out += lower[i];
    i += 1;
  }

  return out;
}

/**
 * Converts English / Romanized Indian names & locations into Gujarati or Hindi script.
 */
export function transliterateFromEnglish(
  text: string,
  target: IndicTargetScript = 'gu'
): string {
  if (!text) return '';
  if (target === 'gu' && containsGujaratiScript(text)) return text;
  if (target === 'hi' && containsDevanagariScript(text)) return text;

  // If converting between Hindi <-> Gujarati script, pivot cleanly via English phonetic layer
  const sourceText = containsIndicScript(text) ? transliterateToEnglish(text) : text;
  const dict = target === 'gu' ? EN_TO_GU_WORDS : EN_TO_HI_WORDS;

  const suffixes: {rom: string; indic: string}[] =
    target === 'gu'
      ? [
          {rom: 'bhai', indic: 'ભાઈ'},
          {rom: 'ben', indic: 'બેન'},
          {rom: 'kumar', indic: 'કુમાર'},
          {rom: 'lal', indic: 'લાલ'},
          {rom: 'das', indic: 'દાસ'},
          {rom: 'sinh', indic: 'સિંહ'},
          {rom: 'singh', indic: 'સિંહ'},
        ]
      : [
          {rom: 'bhai', indic: 'भाई'},
          {rom: 'ben', indic: 'बेन'},
          {rom: 'kumar', indic: 'कुमार'},
          {rom: 'lal', indic: 'लाल'},
          {rom: 'das', indic: 'दास'},
          {rom: 'sinh', indic: 'सिंह'},
          {rom: 'singh', indic: 'सिंह'},
        ];

  const parts = sourceText.split(/([^A-Za-z0-9.]+)/);
  return parts
    .map((part) => {
      if (!part) return '';
      if (!/[A-Za-z]/.test(part)) return part;

      const low = part.toLowerCase();
      if (dict[low]) return dict[low];

      // Strip trailing dot for abbreviations like Tal.
      const noDot = low.replace(/\.$/, '');
      if (dict[noDot]) return dict[noDot];

      for (const {rom, indic} of suffixes) {
        if (noDot.endsWith(rom) && noDot.length > rom.length) {
          const stem = noDot.slice(0, -rom.length);
          const stemIndic =
            dict[stem] || transliterateEnglishWordAlgorithmic(stem, target);
          return `${stemIndic}${indic}`;
        }
      }

      return transliterateEnglishWordAlgorithmic(part, target);
    })
    .join('');
}

/**
 * Normalizes Gujarati/Hindi numerals to ASCII digits and cleans date/income text.
 */
export function normalizeSpokenDateInput(raw: string): string {
  const digits = normalizeIndicDigits(raw).trim();
  const months: Record<string, string> = {
    january: '01', jan: '01', 'જાન્યુઆરી': '01', 'जनवरी': '01',
    february: '02', feb: '02', 'ફેબ્રુઆરી': '02', 'फरवरी': '02',
    march: '03', mar: '03', 'માર્ચ': '03', 'मार्च': '03',
    april: '04', apr: '04', 'એપ્રિલ': '04', 'अप्रैल': '04',
    may: '05', 'મે': '05', 'मई': '05',
    june: '06', jun: '06', 'જૂન': '06', 'जून': '06',
    july: '07', jul: '07', 'જુલાઈ': '07', 'जुलाई': '07',
    august: '08', aug: '08', 'ઓગસ્ટ': '08', 'અગસ્ત': '08', 'अगस्त': '08',
    september: '09', sep: '09', 'સપ્ટેમ્બર': '09', 'सितंबर': '09',
    october: '10', oct: '10', 'ઓક્ટોબર': '10', 'अक्टूबर': '10',
    november: '11', nov: '11', 'નવેમ્બર': '11', 'नवंबर': '11',
    december: '12', dec: '12', 'ડિસેમ્બર': '12', 'दिसंबर': '12',
  };

  const parts = digits
    .replace(/[,|-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 3 && months[parts[1].toLowerCase()]) {
    const dd = parts[0].padStart(2, '0');
    const mm = months[parts[1].toLowerCase()];
    const yyyy = parts[2];
    if (/^\d{1,2}$/.test(dd) && /^\d{4}$/.test(yyyy)) {
      return `${dd}/${mm}/${yyyy}`;
    }
  }

  // Convert spaces/dashes between 3 numbers into DD/MM/YYYY
  if (/^\d{1,2}[\s\-./]+\d{1,2}[\s\-./]+\d{2,4}$/.test(digits)) {
    const [d, m, y] = digits.split(/[\s\-./]+/);
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  }

  return digits;
}

export function normalizeSpokenIncomeInput(raw: string): string {
  const digits = normalizeIndicDigits(raw).trim();
  if (!digits) return '';
  // If purely digits or comma-separated digits, prefix ₹
  const numericOnly = digits.replace(/[,₹\s]/g, '');
  if (/^\d+$/.test(numericOnly)) {
    const val = Number(numericOnly);
    return `₹${val.toLocaleString('en-IN')}`;
  }
  return containsIndicScript(digits) ? transliterateToEnglish(digits) : digits;
}

export function toIndicDigits(text: string, script: IndicTargetScript): string {
  const targetDigits = script === 'gu' ? GU_DIGITS : HI_DIGITS;
  return text.replace(/[0-9]/g, (d) => targetDigits[Number(d)] ?? d);
}
