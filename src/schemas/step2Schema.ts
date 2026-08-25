import { z } from 'zod'
import { ageOn } from '../utils/dates'

const NAME_REGEX = /^[A-Za-z][A-Za-z .]{1,99}$/
const INDIAN_MOBILE = /^[6-9]\d{9}$/

export const step2Schema = z
  .object({
    fullName: z.string().trim().regex(NAME_REGEX, 'Name must be 2–100 letters, spaces or periods.'),
    dateOfBirth: z.string().trim().min(1, 'Date of birth is required.'),
    gender: z.enum(['male', 'female', 'other']),
    maritalStatus: z.enum(['single', 'married']),
    fatherName: z.string().trim().regex(NAME_REGEX, "Father's name must be 2–100 letters, spaces or periods."),
    motherName: z.string().trim().regex(NAME_REGEX, "Mother's name must be 2–100 letters, spaces or periods."),
    email: z.string().trim().email('Please enter a valid email address.'),
    emailVerified: z.literal(true, { error: 'Please verify your email address.' }),
    mobile: z.string().trim().regex(INDIAN_MOBILE, 'Please enter a valid 10-digit Indian mobile number starting with 6–9.'),
    mobileOtpVerified: z.literal(true, { error: 'Please verify your mobile number.' }),
    alternateMobile: z
      .string()
      .trim()
      .regex(INDIAN_MOBILE, 'Alternate mobile must be a valid 10-digit Indian number.')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const age = ageOn(data.dateOfBirth)
    if (Number.isNaN(age)) {
      ctx.addIssue({ code: 'custom', path: ['dateOfBirth'], message: 'Please enter a valid date.' })
      return
    }
    if (age < 21 || age > 65) {
      ctx.addIssue({ code: 'custom', path: ['dateOfBirth'], message: 'Applicant age must be between 21 and 65 years.' })
    }
    if (data.alternateMobile && data.alternateMobile === data.mobile) {
      ctx.addIssue({ code: 'custom', path: ['alternateMobile'], message: 'Alternate mobile must differ from the primary number.' })
    }
  })
