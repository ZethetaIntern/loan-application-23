import { z } from 'zod'
import type { LoanType } from '../types/domain'

const PURPOSES: Record<LoanType, [string, ...string[]]> = {
  personal: ['Debt consolidation', 'Home renovation', 'Medical expenses', 'Wedding', 'Travel', 'Education', 'Other'],
  home: ['Purchase new home', 'Purchase resale property', 'Construction', 'Extension', 'Balance transfer'],
  business: ['Working capital', 'Equipment purchase', 'Business expansion', 'Inventory financing'],
}

const LIMITS: Record<LoanType, { max: number; tenureMin: number; tenureMax: number }> = {
  personal: { max: 1_000_000, tenureMin: 12, tenureMax: 60 },
  home: { max: 10_000_000, tenureMin: 60, tenureMax: 360 },
  business: { max: 5_000_000, tenureMin: 12, tenureMax: 120 },
}

export const step1Schema = z
  .object({
    loanType: z.enum(['personal', 'home', 'business']),
    amount: z.number({ message: 'Loan amount is required.' }),
    tenureMonths: z.number({ message: 'Loan tenure is required.' }),
    loanPurpose: z.string().min(1, 'Please select a purpose.'),
    referralCode: z
      .string()
      .regex(/^[A-Za-z0-9]{6,10}$/, 'Referral code must be 6–10 alphanumeric characters.')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: 'Loan amount is required.' })
      return
    }
    if (data.amount < 50_000) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: 'Minimum loan amount is ₹50,000.' })
    }
    const limits = LIMITS[data.loanType]
    if (data.amount > limits.max) {
      ctx.addIssue({
        code: 'custom',
        path: ['amount'],
        message: `Maximum for ${data.loanType} loans is ₹${limits.max.toLocaleString('en-IN')}.`,
      })
    }
    if (!Number.isFinite(data.tenureMonths) || data.tenureMonths <= 0) {
      ctx.addIssue({ code: 'custom', path: ['tenureMonths'], message: 'Loan tenure is required.' })
      return
    }
    if (data.tenureMonths < limits.tenureMin || data.tenureMonths > limits.tenureMax) {
      ctx.addIssue({
        code: 'custom',
        path: ['tenureMonths'],
        message: `Tenure must be between ${limits.tenureMin} and ${limits.tenureMax} months.`,
      })
    }
    if (!PURPOSES[data.loanType]?.includes(data.loanPurpose)) {
      ctx.addIssue({ code: 'custom', path: ['loanPurpose'], message: 'Please select a valid purpose.' })
    }
  })
