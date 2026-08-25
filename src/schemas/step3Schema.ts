import { z } from 'zod';
import type { LoanType } from '../types/domain';
import { validateAadhaar, validatePan } from '../utils/validators';

export const step3SchemaFactory = (loanType: LoanType) => z
  .object({
    pan: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN must be in the format AAAAA9999A.'),
    panStatus: z.enum(['idle', 'verifying', 'verified', 'rejected']),
    aadhaar: z
      .string()
      .trim()
      .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits.'),
    aadhaarStatus: z.enum(['idle', 'verifying', 'verified', 'rejected']),
    aadhaarConsent: z.literal(true, { error: 'Aadhaar consent is mandatory to proceed.' }),
    voterId: z
      .string()
      .trim()
      .regex(/^[A-Z]{3}\d{7}$/, 'Voter ID must be 3 letters followed by 7 digits.')
      .optional()
      .or(z.literal('')),
    passportNumber: z
      .string()
      .trim()
      .regex(/^[A-Z]\d{7}$/, 'Passport number must be 1 letter followed by 7 digits.')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const panResult = validatePan(data.pan, loanType);
    if (!panResult.valid) {
      ctx.addIssue({ code: 'custom', path: ['pan'], message: panResult.message });
    }
    if (!validateAadhaar(data.aadhaar)) {
      ctx.addIssue({
        code: 'custom',
        path: ['aadhaar'],
        message: 'Aadhaar failed Verhoeff checksum. Please re-enter your 12-digit Aadhaar number.',
      });
    }
    if (data.panStatus !== 'verified') {
      ctx.addIssue({ code: 'custom', path: ['panStatus'], message: 'PAN verification is incomplete.' });
    }
    if (data.aadhaarStatus !== 'verified') {
      ctx.addIssue({ code: 'custom', path: ['aadhaarStatus'], message: 'Aadhaar verification is incomplete.' });
    }
  });
