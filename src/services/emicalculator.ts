import type { EmiBreakdown, LoanType } from '../types/domain';
import {
  ANNUAL_RATES,
  PROCESSING_FEE_MAX,
  PROCESSING_FEE_MIN,
  PROCESSING_FEE_RATE,
} from '../utils/constants';

export function emiOf(principal: number, annualRate: number, tenureMonths: number): number {
  if (tenureMonths <= 0 || principal <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return principal / tenureMonths;
  return (principal * r * (1 + r) ** tenureMonths) / ((1 + r) ** tenureMonths - 1);
}

export function processingFeeFor(principal: number): number {
  const raw = principal * PROCESSING_FEE_RATE;
  return Math.min(PROCESSING_FEE_MAX, Math.max(PROCESSING_FEE_MIN, raw));
}

export function breakdownFor(loanType: LoanType, principal: number, tenureMonths: number): EmiBreakdown {
  const annualRate = ANNUAL_RATES[loanType];
  const emi = emiOf(principal, annualRate, tenureMonths);
  return {
    emi: Math.round(emi),
    totalCostOfBorrowing: Math.round(emi * tenureMonths - principal),
    processingFee: processingFeeFor(principal),
    annualRate,
  };
}

export interface AffordabilityResult {
  totalEmi: number
  combinedIncome: number
  ratio: number
  withinLimit: boolean
}

export function checkAffordability(input: {
  applicantMonthlyIncome: number
  coApplicantMonthlyIncome?: number
  existingMonthlyEmi?: number
  monthlyRent?: number
  amount: number
  tenureMonths: number
  loanType: LoanType
}): AffordabilityResult {
  const rate = ANNUAL_RATES[input.loanType];
  const requestedEmi = emiOf(input.amount, rate, input.tenureMonths);
  const combinedIncome = input.applicantMonthlyIncome + (input.coApplicantMonthlyIncome ?? 0);
  const obligations = (input.existingMonthlyEmi ?? 0) + (input.monthlyRent ?? 0);
  const ratio = combinedIncome > 0 ? (requestedEmi + obligations) / combinedIncome : Number.POSITIVE_INFINITY;
  return {
    totalEmi: requestedEmi,
    combinedIncome,
    ratio,
    withinLimit: ratio <= 0.5 && combinedIncome > 0,
  };
}
