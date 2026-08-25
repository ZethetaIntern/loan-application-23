import type {
  AddressDraft,
  EmploymentType,
  Gender,
  LoanType,
  MaritalStatus,
  Relationship,
  StoredDocument,
} from './domain';

export type VerificationStatus = 'idle' | 'verifying' | 'verified' | 'rejected'

export interface Step1LoanType {
  loanType: LoanType
  amount: number
  tenureMonths: number
  loanPurpose: string
  referralCode?: string
}

export interface Step2Personal {
  fullName: string
  dateOfBirth: string
  gender: Gender
  maritalStatus: MaritalStatus
  fatherName: string
  motherName: string
  email: string
  emailVerified: boolean
  mobile: string
  mobileOtpVerified: boolean
  alternateMobile?: string
}

export interface Step3Kyc {
  pan: string
  panStatus: VerificationStatus
  aadhaar: string
  aadhaarStatus: VerificationStatus
  aadhaarConsent: boolean
  voterId?: string
  passportNumber?: string
}

export interface Step4Address {
  current: AddressDraft
  sameAsPermanent: boolean
  permanent?: Pick<AddressDraft, 'line1' | 'line2' | 'pinCode' | 'city' | 'state'>
  previous?: Pick<AddressDraft, 'line1' | 'pinCode' | 'city' | 'state'>
}

export interface Step5Employment {
  employmentType: EmploymentType
  yearsExperience: number
  companyName?: string
  designation?: string
  monthlySalary?: number
  businessName?: string
  businessType?: string
  annualTurnover?: number
  yearsInBusiness?: number
  monthlyBusinessIncome?: number
  gstNumber?: string
  officeAddress?: string
}

export interface Step6CoApplicant {
  name?: string
  relationship?: Relationship
  pan?: string
  panStatus?: VerificationStatus
  monthlyIncome?: number
  consent?: boolean
  signatureDataUrl?: string
}

export interface Step7Documents {
  documents: StoredDocument[]
  signatureDataUrl?: string
}

export interface Step8Consents {
  accuracy: boolean
  creditCheck: boolean
  terms: boolean
  communications: boolean
}

export interface ApplicationData {
  step1: Step1LoanType
  personal: Step2Personal
  kyc: Step3Kyc
  address: Step4Address
  employment: Step5Employment
  coApplicant: Step6CoApplicant
  documents: Step7Documents
  consents: Step8Consents
  referenceNumber?: string
  submittedAt?: string
}

export const LOAN_PURPOSES: Record<LoanType, string[]> = {
  personal: ['Debt consolidation', 'Home renovation', 'Medical expenses', 'Wedding', 'Travel', 'Education', 'Other'],
  home: ['Purchase new home', 'Purchase resale property', 'Construction', 'Extension', 'Balance transfer'],
  business: ['Working capital', 'Equipment purchase', 'Business expansion', 'Inventory financing'],
};
