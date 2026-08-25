import { z } from 'zod'
import type { LoanType } from '../types/domain'
import { EMPLOYMENT_ALLOWED_BY_LOAN_TYPE, MIN_ANNUAL_TURNOVER, MIN_MONTHLY_SALARY, MIN_YEARS_IN_BUSINESS } from '../utils/constants'

const GST_NUMBER_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][0-9A-Z]Z[0-9A-Z]{3}$/

export const step5SchemaFactory = (loanType: LoanType) =>
  z
    .object({
      employmentType: z.enum(['salaried', 'self_employed', 'business_owner']),
      yearsExperience: z
        .number({ message: 'Years of experience is required.' })
        .int()
        .min(0, 'Minimum 0 years.')
        .max(50, 'Maximum 50 years.'),
      companyName: z.string().trim().optional(),
      designation: z.string().trim().optional(),
      monthlySalary: z.number({ message: 'Monthly salary is required.' }).optional(),
      businessName: z.string().trim().optional(),
      businessType: z.string().trim().optional(),
      annualTurnover: z.number({ message: 'Annual turnover is required.' }).optional(),
      yearsInBusiness: z.number({ message: 'Years in business is required.' }).optional(),
      monthlyBusinessIncome: z.number({ message: 'Monthly business income is required.' }).optional(),
      gstNumber: z.string().trim().optional(),
      officeAddress: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
      if (!EMPLOYMENT_ALLOWED_BY_LOAN_TYPE[loanType]?.includes(data.employmentType)) {
        ctx.addIssue({
          code: 'custom',
          path: ['employmentType'],
          message: `Employment type "${data.employmentType}" is not permitted for ${loanType} loans.`,
        })
      }

      if (data.employmentType === 'salaried') {
        if (!data.companyName || data.companyName.length < 2) {
          ctx.addIssue({ code: 'custom', path: ['companyName'], message: 'Company name is required.' })
        }
        if (!data.designation || data.designation.length < 2) {
          ctx.addIssue({ code: 'custom', path: ['designation'], message: 'Designation is required.' })
        }
        if (!data.monthlySalary || data.monthlySalary < MIN_MONTHLY_SALARY) {
          ctx.addIssue({
            code: 'custom',
            path: ['monthlySalary'],
            message: `Monthly net salary must be at least ₹${MIN_MONTHLY_SALARY.toLocaleString('en-IN')}.`,
          })
        }
      }

      if (data.employmentType === 'self_employed' || data.employmentType === 'business_owner') {
        if (!data.businessName || data.businessName.length < 2) {
          ctx.addIssue({ code: 'custom', path: ['businessName'], message: 'Business name is required.' })
        }
        if (!data.businessType || data.businessType.length < 2) {
          ctx.addIssue({ code: 'custom', path: ['businessType'], message: 'Business type is required.' })
        }
        if (!Number.isFinite(data.annualTurnover ?? NaN) || (data.annualTurnover ?? 0) < MIN_ANNUAL_TURNOVER) {
          ctx.addIssue({
            code: 'custom',
            path: ['annualTurnover'],
            message: `Annual turnover must be at least ₹${MIN_ANNUAL_TURNOVER.toLocaleString('en-IN')}.`,
          })
        }
        if (!Number.isFinite(data.yearsInBusiness ?? NaN) || (data.yearsInBusiness ?? 0) < MIN_YEARS_IN_BUSINESS) {
          ctx.addIssue({
            code: 'custom',
            path: ['yearsInBusiness'],
            message: `Minimum ${MIN_YEARS_IN_BUSINESS} years in business required.`,
          })
        }
        if (!Number.isFinite(data.monthlyBusinessIncome ?? NaN) || (data.monthlyBusinessIncome ?? 0) < 1_000) {
          ctx.addIssue({ code: 'custom', path: ['monthlyBusinessIncome'], message: 'Monthly business income must be at least ₹1,000.' })
        }
        if (data.employmentType === 'business_owner') {
          if (!data.gstNumber || !GST_NUMBER_REGEX.test(data.gstNumber)) {
            ctx.addIssue({ code: 'custom', path: ['gstNumber'], message: 'Please enter a valid 15-character GSTIN.' })
          }
        }
        if (!data.officeAddress || data.officeAddress.length < 10) {
          ctx.addIssue({ code: 'custom', path: ['officeAddress'], message: 'Please provide a valid office or business address.' })
        }
      }
    })
