import type { EmploymentType, LoanType } from '../types/domain'

export const LOAN_TYPE_PERSONAL = 'personal' as const
export const LOAN_TYPE_HOME = 'home' as const
export const LOAN_TYPE_BUSINESS = 'business' as const

export const MIN_LOAN_AMOUNT = 50_000
export const PERSONAL_MAX_AMOUNT = 1_000_000
export const HOME_MAX_AMOUNT = 10_000_000
export const BUSINESS_MAX_AMOUNT = 5_000_000

export const TENURE_LIMITS: Record<LoanType, { minMonths: number; maxMonths: number }> = {
  personal: { minMonths: 12, maxMonths: 60 },
  home: { minMonths: 60, maxMonths: 360 },
  business: { minMonths: 12, maxMonths: 120 },
}

export const ANNUAL_RATES: Record<LoanType, number> = {
  personal: 0.105,
  home: 0.085,
  business: 0.14,
}

export const PROCESSING_FEE_RATE = 0.01
export const PROCESSING_FEE_MIN = 2_000
export const PROCESSING_FEE_MAX = 25_000

export const MAX_AGE_AT_ENTRY = 65
export const MIN_AGE_AT_ENTRY = 21
export const MAX_AGE_AT_MATURITY = 65

export const MAX_EMI_RATIO = 0.5

export const CO_APPLICANT_THRESHOLDS: Record<LoanType, number> = {
  personal: 500_000,
  home: Number.POSITIVE_INFINITY,
  business: 2_000_000,
}

export const EMPLOYMENT_ALLOWED_BY_LOAN_TYPE: Record<LoanType, EmploymentType[]> = {
  personal: ['salaried', 'self_employed'],
  home: ['salaried', 'self_employed'],
  business: ['business_owner', 'self_employed'],
}

export const MIN_MONTHLY_SALARY = 15_000
export const MIN_ANNUAL_TURNOVER = 300_000
export const MIN_YEARS_IN_BUSINESS = 2

export const AUTO_SAVE_INTERVAL_MS = 30_000
export const DRAFT_TTL_MS = 72 * 60 * 60 * 1000

export const MAX_FILE_SIZE_MB = 5
export const BANK_STATEMENT_MAX_SIZE_MB = 10
export const PHOTO_MAX_SIZE_MB = 2

export const PAN_ENTITY_TYPES = ['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T'] as const
