import { z } from 'zod'
import type { LoanType } from '../types/domain'
import { validatePan } from '../utils/validators'

export const step6SchemaFactory = (loanType: LoanType) =>
  z
    .object({
      name: z.string().trim().min(2, "Co-applicant's name is required."),
      relationship: z.enum(['spouse', 'parent', 'sibling', 'business_partner']),
      pan: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN must be in the format AAAAA9999A.'),
      panStatus: z.enum(['idle', 'verifying', 'verified', 'rejected']),
      monthlyIncome: z.number({ message: "Co-applicant's income is required." }),
      consent: z.literal(true, { error: 'Co-applicant consent is required.' }),
      signatureDataUrl: z
        .string()
        .optional()
        .refine(
          (value) => !value || (value.startsWith('data:image/png;base64,') && value.length > 50),
          'Please provide a valid signature.',
        ),
    })
    .superRefine((data, ctx) => {
      const panResult = validatePan(data.pan, loanType)
      if (!panResult.valid) {
        ctx.addIssue({ code: 'custom', path: ['pan'], message: panResult.message })
      }
      if (data.panStatus !== 'verified') {
        ctx.addIssue({ code: 'custom', path: ['panStatus'], message: 'Co-applicant PAN verification is incomplete.' })
      }
      if (!Number.isFinite(data.monthlyIncome) || data.monthlyIncome < 10_000) {
        ctx.addIssue({ code: 'custom', path: ['monthlyIncome'], message: 'Co-applicant income must be at least ₹10,000.' })
      }
    })
