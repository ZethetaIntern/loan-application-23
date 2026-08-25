import type { ApplicationData, Step1LoanType, Step3Kyc } from '../types/application';
import type { EmploymentType } from '../types/domain';
import { ageOn } from '../utils/dates';
import {
  ANNUAL_RATES,
  CO_APPLICANT_THRESHOLDS,
  EMPLOYMENT_ALLOWED_BY_LOAN_TYPE,
  MAX_AGE_AT_MATURITY,
} from '../utils/constants';
import { checkAffordability } from '../services/emicalculator';

export function maxTenureMonthsByAge(dateOfBirthIso: string, today: Date = new Date()): number {
  const age = ageOn(dateOfBirthIso, today);
  if (Number.isNaN(age)) return Number.NaN;
  const yearsLeft = MAX_AGE_AT_MATURITY - age;
  return Math.max(0, yearsLeft * 12);
}

export function tenureWithinAgeLimit(dateOfBirthIso: string, tenureMonths: number): boolean {
  const cap = maxTenureMonthsByAge(dateOfBirthIso);
  if (Number.isNaN(cap)) return false;
  return tenureMonths <= cap;
}

export function isCoApplicantRequired(step1: Pick<Step1LoanType, 'loanType' | 'amount'>): boolean {
  if (step1.loanType === 'home') return true;
  const threshold = CO_APPLICANT_THRESHOLDS[step1.loanType];
  return step1.amount > threshold;
}

export function employmentAllowedForLoanType(
  loanType: Step1LoanType['loanType'],
  employmentType: EmploymentType,
): boolean {
  return EMPLOYMENT_ALLOWED_BY_LOAN_TYPE[loanType].includes(employmentType);
}

function monthlyIncomeOfEmployment(application: ApplicationData): number {
  const { employment } = application;
  if (employment.employmentType === 'salaried') return employment.monthlySalary ?? 0;
  return employment.monthlyBusinessIncome ?? 0;
}

export function affordabilityGate(application: ApplicationData): { ok: boolean; ratio: number } {
  const result = checkAffordability({
    applicantMonthlyIncome: monthlyIncomeOfEmployment(application),
    coApplicantMonthlyIncome: application.coApplicant.monthlyIncome ?? 0,
    existingMonthlyEmi: 0,
    monthlyRent: application.address.current.residenceType === 'rented'
      ? (application.address.current.monthlyRent ?? 0)
      : 0,
    amount: application.step1.amount,
    tenureMonths: application.step1.tenureMonths,
    loanType: application.step1.loanType,
  });
  return { ok: result.withinLimit, ratio: result.ratio };
}

export interface DocumentRequirement {
  mandatory: string[]
  optionalAfterPanVerification: string[]
}

export function requiredDocumentKinds(application: Pick<ApplicationData, 'step1' | 'employment' | 'kyc'>): DocumentRequirement {
  const panCard = 'pan_card';
  const base = [panCard, 'aadhaar_front', 'aadhaar_back', 'bank_statement', 'photograph'];
  const extra: string[] = [];
  const { loanType } = application.step1;

  if (application.employment.employmentType === 'salaried') extra.push('salary_slip');
  else extra.push('itr');

  if (loanType === 'home') extra.push('property_documents');
  if (loanType === 'business') {
    extra.push('business_registration', 'gst_returns');
  }

  return {
    mandatory: [...base.filter((kind) => kind !== panCard), ...extra],
    optionalAfterPanVerification: [panCard],
  };
}

export function missingDocumentKinds(
  application: Pick<ApplicationData, 'step1' | 'employment' | 'kyc' | 'documents'>,
): string[] {
  const requirement = requiredDocumentKinds(application);
  const uploaded = new Set(application.documents.documents.map((doc) => doc.kind));
  const missing = requirement.mandatory.filter((kind) => !uploaded.has(kind));
  const panNotVerified = application.kyc.panStatus !== 'verified';
  if (panNotVerified) {
    for (const kind of requirement.optionalAfterPanVerification) {
      if (!uploaded.has(kind)) missing.push(kind);
    }
  }
  return missing;
}

export function kycVerified(kyc: Step3Kyc): boolean {
  return kyc.panStatus === 'verified' && kyc.aadhaarStatus === 'verified' && kyc.aadhaarConsent;
}

export function indicativeRateFor(loanType: Step1LoanType['loanType']): number {
  return ANNUAL_RATES[loanType];
}
