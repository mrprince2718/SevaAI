export type LanguageCode = 'gu' | 'hi' | 'en';

export type ServiceKey = 'caste' | 'income' | 'domicile';

export type ViewMode = 'home' | 'kiosk' | 'mamlatdar' | 'blueprint' | 'grant';

export type ApplicationStatus = 'Pending Mamlatdar DSC' | 'Certificate Issued';

export interface OcrCrossCheckDoc {
  id: string;
  order: number;
  titleEn: string;
  titleGu: string;
  titleHi: string;
  docNumber: string;
  extractedName: string;
  extractedNameGu: string;
  extractedFatherName: string;
  extractedFatherNameGu: string;
  extractedCasteOrDetail: string;
  verificationBadge: string;
  statusNote: string;
  matchScore: number;
  docType: 'aadhaar' | 'school' | 'ration' | 'father_caste' | 'income' | 'webcam';
}

export interface ApplicationRecord {
  id: string;
  certificateType: string;
  certificateTypeGu: string;
  certificateTypeHi: string;
  applicantName: string;
  applicantNameGu: string;
  fatherName: string;
  fatherNameGu: string;
  village: string;
  taluka: string;
  district: string;
  casteCategory: string;
  subCaste: string;
  dob: string;
  annualIncome: string;
  aadhaarMasked: string;
  submittedAt: string;
  approvedAt?: string;
  officerName?: string;
  dscTokenId?: string;
  status: ApplicationStatus;
  aiScore: number;
  spellingMismatches: number;
  documents: OcrCrossCheckDoc[];
}
