export type LoanType = 'personal' | 'home' | 'business'

export type EmploymentType = 'salaried' | 'self_employed' | 'business_owner'

export type MaritalStatus = 'single' | 'married'

export type ResidenceType = 'owned' | 'rented' | 'company_provided' | 'family'

export type Relationship = 'spouse' | 'parent' | 'sibling' | 'business_partner'

export type Gender = 'male' | 'female' | 'other'

export interface AddressDraft {
  line1: string
  line2?: string
  pinCode: string
  city: string
  state: string
  residenceType: ResidenceType
  monthlyRent?: number
  yearsAtAddress: number
}

export interface StoredDocument {
  id: string
  kind: string
  fileName: string
  originalSizeBytes: number
  compressedSizeBytes: number
  dataUrl: string
  uploadedAt: string
}

export interface KycResult {
  field: 'pan' | 'aadhaar'
  status: 'verified' | 'rejected'
  message: string
  checkedAt: string
}

export interface EmiBreakdown {
  emi: number
  totalCostOfBorrowing: number
  processingFee: number
  annualRate: number
}

export interface AffordabilityInput {
  applicantMonthlyIncome: number
  coApplicantMonthlyIncome: number
  existingMonthlyEmi: number
  monthlyRent: number
  amount: number
  tenureMonths: number
  annualRate: number
}
