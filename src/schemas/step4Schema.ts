import { z } from 'zod';
import { lookupPinCode } from '../services/pincode';

const addressLineSchema = z.string().trim().min(5, 'Address must be at least 5 characters.');
const pinCodeSchema = z.string().trim().regex(/^[1-9]\d{5}$/, 'PIN code must be exactly 6 digits.');
const cityStateSchema = z.string().trim().min(2, 'City and state are required.');

const requiredAddressPartSchema = z.object({
  line1: addressLineSchema,
  line2: z.string().trim().max(200).optional(),
  pinCode: pinCodeSchema,
  city: cityStateSchema,
  state: cityStateSchema,
});

export const step4Schema = z
  .object({
    current: z.object({
      line1: addressLineSchema,
      line2: z.string().trim().max(200).optional(),
      pinCode: pinCodeSchema,
      city: cityStateSchema,
      state: cityStateSchema,
      residenceType: z.enum(['owned', 'rented', 'company_provided', 'family']),
      monthlyRent: z.number({ message: 'Rent amount is required.' }).optional(),
      yearsAtAddress: z
        .number({ message: 'Years at address is required.' })
        .int()
        .min(0, 'Cannot be negative.')
        .max(50, 'Maximum 50 years.'),
    }),
    sameAsPermanent: z.boolean(),
    permanent: requiredAddressPartSchema.optional(),
    previous: z
      .object({
        line1: addressLineSchema,
        pinCode: pinCodeSchema,
        city: cityStateSchema,
        state: cityStateSchema,
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const lookup = lookupPinCode(data.current.pinCode);
    if (!lookup.found) {
      ctx.addIssue({
        code: 'custom',
        path: ['current', 'pinCode'],
        message: 'PIN code is not recognised. Please enter a valid Indian PIN.',
      });
    }

    if (data.current.residenceType === 'rented' && (!data.current.monthlyRent || data.current.monthlyRent <= 0)) {
      ctx.addIssue({ code: 'custom', path: ['current', 'monthlyRent'], message: 'Monthly rent amount is required.' });
    }

    if (Number.isFinite(data.current.yearsAtAddress) && data.current.yearsAtAddress < 1 && !data.previous) {
      ctx.addIssue({
        code: 'custom',
        path: ['previous'],
        message: 'Please provide your previous address since you have been at the current address for less than 1 year.',
      });
    }

    if (!data.sameAsPermanent && !data.permanent) {
      ctx.addIssue({
        code: 'custom',
        path: ['permanent'],
        message: 'Permanent address is required when it differs from the current address.',
      });
    }
  });
