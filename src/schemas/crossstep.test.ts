import { describe, expect, it } from 'vitest'
import type { ApplicationData } from '../types/application'
import {
  affordabilityGate,
  employmentAllowedForLoanType,
  isCoApplicantRequired,
  kycVerified,
  maxTenureMonthsByAge,
  missingDocumentKinds,
  requiredDocumentKinds,
  tenureWithinAgeLimit,
} from './crossstep'

function baseApplication(): ApplicationData {
  return {
    step1: { loanType: 'personal', amount: 500_000, tenureMonths: 36, loanPurpose: 'Wedding' },
    personal: {
      fullName: 'Rahul Sharma',
      dateOfBirth: '1992-04-15',
      gender: 'male',
      maritalStatus: 'single',
      fatherName: 'Ramesh Sharma',
      motherName: 'Sunita Sharma',
      email: 'rahul@example.in',
      emailVerified: true,
      mobile: '9876543210',
      mobileOtpVerified: true,
    },
    kyc: {
      pan: 'ABCPZ1234F',
      panStatus: 'verified',
      aadhaar: '234123412346',
      aadhaarStatus: 'verified',
      aadhaarConsent: true,
    },
    address: {
      current: {
        line1: '12 MG Road',
        pinCode: '560001',
        city: 'Bengaluru',
        state: 'Karnataka',
        residenceType: 'owned',
        yearsAtAddress: 3,
      },
      sameAsPermanent: true,
    },
    employment: {
      employmentType: 'salaried',
      yearsExperience: 5,
      companyName: 'InfoEdge Ltd',
      designation: 'Engineer',
      monthlySalary: 90_000,
    },
    coApplicant: {},
    documents: { documents: [] },
    consents: { accuracy: false, creditCheck: false, terms: false, communications: false },
  }
}

describe('age and tenure coupling', () => {
  it('caps tenure so maturity stays before age 65', () => {
    const cap = maxTenureMonthsByAge('1990-12-31', new Date('2026-01-01'))
    expect(cap).toBe((65 - 35) * 12)
    expect(tenureWithinAgeLimit('1990-12-31', 300)).toBe(false)
    expect(tenureWithinAgeLimit('1990-12-31', 240)).toBe(true)
  })

  it('handles invalid dates defensively', () => {
    expect(Number.isNaN(maxTenureMonthsByAge('not-a-date'))).toBe(true)
    expect(tenureWithinAgeLimit('not-a-date', 60)).toBe(false)
  })
})

describe('co-applicant visibility rules', () => {
  it('always shows for home loans regardless of amount', () => {
    expect(isCoApplicantRequired({ loanType: 'home', amount: 100_000 })).toBe(true)
  })

  it('triggers above the threshold only for personal loans', () => {
    expect(isCoApplicantRequired({ loanType: 'personal', amount: 500_000 })).toBe(false)
    expect(isCoApplicantRequired({ loanType: 'personal', amount: 500_001 })).toBe(true)
  })

  it('uses the business threshold of ₹20L', () => {
    expect(isCoApplicantRequired({ loanType: 'business', amount: 2_000_000 })).toBe(false)
    expect(isCoApplicantRequired({ loanType: 'business', amount: 2_000_001 })).toBe(true)
  })
})

describe('employment restrictions per loan type', () => {
  it('forces self-employed or business owners onto business loans', () => {
    expect(employmentAllowedForLoanType('business', 'business_owner')).toBe(true)
    expect(employmentAllowedForLoanType('business', 'self_employed')).toBe(true)
    expect(employmentAllowedForLoanType('business', 'salaried')).toBe(false)
    expect(employmentAllowedForLoanType('personal', 'salaried')).toBe(true)
    expect(employmentAllowedForLoanType('home', 'business_owner')).toBe(false)
  })
})

describe('affordability gate with rent and co-applicant income', () => {
  it('passes the healthy baseline application', () => {
    const result = affordabilityGate(baseApplication())
    expect(result.ok).toBe(true)
    expect(result.ratio).toBeLessThan(0.5)
  })

  it('counts monthly rent when the applicant is renting', () => {
    const application = baseApplication()
    application.address.current.residenceType = 'rented'
    application.address.current.monthlyRent = 40_000
    expect(affordabilityGate(application).ok).toBe(false)
  })

  it('recovers when a co-applicant contributes income', () => {
    const application = baseApplication()
    application.step1.amount = 900_000
    application.address.current.residenceType = 'rented'
    application.address.current.monthlyRent = 30_000
    expect(affordabilityGate(application).ok).toBe(false)
    application.coApplicant.monthlyIncome = 50_000
    expect(affordabilityGate(application).ok).toBe(true)
  })

  it('fails hard without any income', () => {
    const application = baseApplication()
    application.employment.monthlySalary = 0
    const result = affordabilityGate(application)
    expect(result.ratio).toBe(Number.POSITIVE_INFINITY)
    expect(result.ok).toBe(false)
  })
})

describe('document requirements matrix', () => {
  it('requires salary slips for salaried applicants and ITR otherwise', () => {
    const salaried = requiredDocumentKinds({
      ...baseApplication(),
      step1: { loanType: 'personal', amount: 100_000, tenureMonths: 12, loanPurpose: 'x' },
      employment: { ...baseApplication().employment, employmentType: 'salaried' },
      kyc: { panStatus: 'idle' } as ApplicationData['kyc'],
    })
    expect(salaried.mandatory).toContain('salary_slip')
    expect(salaried.mandatory).not.toContain('itr')

    const selfEmployed = requiredDocumentKinds({
      ...baseApplication(),
      step1: { loanType: 'personal', amount: 100_000, tenureMonths: 12, loanPurpose: 'x' },
      employment: { ...baseApplication().employment, employmentType: 'self_employed' },
      kyc: { panStatus: 'verified' } as ApplicationData['kyc'],
    })
    expect(selfEmployed.mandatory).toContain('itr')
    expect(selfEmployed.mandatory).not.toContain('salary_slip')
  })

  it('adds property documents for home loans and GST returns for business loans', () => {
    const home = requiredDocumentKinds({
      ...baseApplication(),
      step1: { loanType: 'home', amount: 5_000_000, tenureMonths: 240, loanPurpose: 'x' },
      employment: { ...baseApplication().employment, employmentType: 'salaried' },
      kyc: { panStatus: 'verified' } as ApplicationData['kyc'],
    })
    expect(home.mandatory).toContain('property_documents')

    const business = requiredDocumentKinds({
      ...baseApplication(),
      step1: { loanType: 'business', amount: 1_000_000, tenureMonths: 60, loanPurpose: 'x' },
      employment: { ...baseApplication().employment, employmentType: 'business_owner' },
      kyc: { panStatus: 'verified' } as ApplicationData['kyc'],
    })
    expect(business.mandatory).toContain('gst_returns')
    expect(business.mandatory).toContain('business_registration')
  })

  it('makes the PAN copy optional once PAN verification succeeded', () => {
    const application = baseApplication()
    application.kyc.panStatus = 'verified'
    application.documents.documents = []
    const missing = missingDocumentKinds(application)
    expect(missing).not.toContain('pan_card')
    expect(missing).toContain('aadhaar_front')

    application.kyc.panStatus = 'rejected'
    expect(missingDocumentKinds(application)).toContain('pan_card')
  })
})

describe('kyc completion check', () => {
  it('requires both verifications plus explicit aadhaar consent', () => {
    const app = baseApplication()
    expect(kycVerified(app.kyc)).toBe(true)
    app.kyc.aadhaarConsent = false
    expect(kycVerified(app.kyc)).toBe(false)
    app.kyc.aadhaarConsent = true
    app.kyc.panStatus = 'idle'
    expect(kycVerified(app.kyc)).toBe(false)
  })
})
