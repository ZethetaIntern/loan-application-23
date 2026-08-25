import { describe, expect, it } from 'vitest'
import {
  contactStepSchema,
  documentsStepSchema,
  employmentStepSchema,
  loanDetailsStepSchema,
  personalStepSchema,
  signatureStepSchema,
} from './schemas'
import type { StoredDocument } from '../types'

const validPersonal = {
  firstName: 'Hazem',
  lastName: 'Ben Ali',
  birthDate: '1995-05-10',
  nationalId: '09876543',
  maritalStatus: 'married' as const,
  dependents: 2,
}

describe('personalStepSchema', () => {
  it('accepts a complete valid profile', () => {
    expect(personalStepSchema.safeParse(validPersonal).success).toBe(true)
  })

  it('rejects a CIN not starting with 0 or 1', () => {
    const result = personalStepSchema.safeParse({ ...validPersonal, nationalId: '12345678' })
    expect(result.success).toBe(false)
  })

  it('rejects minors', () => {
    const result = personalStepSchema.safeParse({ ...validPersonal, birthDate: '2012-01-01' })
    expect(result.success).toBe(false)
  })

  it('rejects more than 15 dependents', () => {
    const result = personalStepSchema.safeParse({ ...validPersonal, dependents: 16 })
    expect(result.success).toBe(false)
  })
})

describe('contactStepSchema', () => {
  const validContact = {
    email: 'hazem@example.tn',
    phone: '+216 20123456',
    address: { street: '12 Rue de la Liberté', city: 'Tunis', governorate: 'Tunis', postalCode: '1000' },
  }

  it('accepts a Tunisian phone with +216 prefix', () => {
    expect(contactStepSchema.safeParse(validContact).success).toBe(true)
  })

  it('rejects invalid postal codes', () => {
    const result = contactStepSchema.safeParse({
      ...validContact,
      address: { ...validContact.address, postalCode: '12' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects phones starting with an invalid digit', () => {
    const result = contactStepSchema.safeParse({ ...validContact, phone: '12345678' })
    expect(result.success).toBe(false)
  })
})

describe('employmentStepSchema', () => {
  it('requires employer, CNSS number and salary for salaried applicants', () => {
    const result = employmentStepSchema.safeParse({
      employmentStatus: 'salaried',
      otherIncome: 0,
      existingMonthlyObligations: 0,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'))
      expect(paths).toContain('employerName')
      expect(paths).toContain('cnssNumber')
      expect(paths).toContain('monthlySalary')
    }
  })

  it('enforces the 200 TND minimum salary', () => {
    const result = employmentStepSchema.safeParse({
      employmentStatus: 'retired',
      monthlySalary: 150,
      otherIncome: 0,
      existingMonthlyObligations: 0,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => /Pension/.test(i.message))).toBe(true)
    }
  })

  it('validates matricule fiscal format for self-employed applicants', () => {
    const base = {
      employmentStatus: 'self_employed' as const,
      businessName: 'Studio X',
      annualRevenue: 60_000,
      yearsInBusiness: 3,
      otherIncome: 0,
      existingMonthlyObligations: 0,
    }
    expect(employmentStepSchema.safeParse({ ...base, matriculeFiscal: '1234567/A/M/001' }).success).toBe(true)
    const bad = employmentStepSchema.safeParse({ ...base, matriculeFiscal: '1234567/a/m/001' })
    expect(bad.success).toBe(false)
    if (!bad.success) {
      expect(bad.error.issues.some((i) => i.path.includes('matriculeFiscal'))).toBe(true)
    }
  })

  it('requires at least one year of activity for self-employed applicants', () => {
    const result = employmentStepSchema.safeParse({
      employmentStatus: 'self_employed',
      businessName: 'Studio X',
      matriculeFiscal: '1234567/A/M/001',
      annualRevenue: 60_000,
      yearsInBusiness: 0,
      otherIncome: 0,
      existingMonthlyObligations: 0,
    })
    expect(result.success).toBe(false)
  })
})

describe('loanDetailsStepSchema', () => {
  it('enforces per-type amount bounds', () => {
    const result = loanDetailsStepSchema('personal').safeParse({ amount: 800, durationMonths: 24 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('amount') && /Entre/.test(i.message))).toBe(true)
    }
  })

  it('enforces per-type duration bounds', () => {
    const result = loanDetailsStepSchema('personal').safeParse({ amount: 30_000, durationMonths: 3 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('durationMonths'))).toBe(true)
    }
  })

  it('requires a purpose outside home loans', () => {
    const result = loanDetailsStepSchema('business').safeParse({ amount: 50_000, durationMonths: 60 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => /Objet du financement/.test(i.message))).toBe(true)
    }
  })

  it('waives purpose for home loans but enforces the 10% down payment', () => {
    const missingPrice = loanDetailsStepSchema('home').safeParse({ amount: 90_000, durationMonths: 180 })
    expect(missingPrice.success).toBe(false)

    const lowDown = loanDetailsStepSchema('home').safeParse({
      amount: 90_000,
      durationMonths: 180,
      propertyPrice: 100_000,
      downPayment: 5_000,
    })
    expect(lowDown.success).toBe(false)
    if (!lowDown.success) {
      expect(lowDown.error.issues.some((i) => /Apport minimum/.test(i.message) && /10 %/.test(i.message))).toBe(true)
    }

    const ok = loanDetailsStepSchema('home').safeParse({
      amount: 90_000,
      durationMonths: 180,
      propertyPrice: 100_000,
      downPayment: 12_000,
    })
    expect(ok.success).toBe(true)
  })

  it('accepts a valid personal loan request', () => {
    const ok = loanDetailsStepSchema('personal').safeParse({
      amount: 10_000,
      durationMonths: 24,
      loanPurpose: 'Travaux',
    })
    expect(ok.success).toBe(true)
  })
})

describe('documentsStepSchema', () => {
  let counter = 0
  const doc = (kind: string): StoredDocument => ({
    id: `doc-${++counter}`,
    kind: kind as StoredDocument['kind'],
    fileName: `${kind}.pdf`,
    originalSizeBytes: 1_000,
    compressedSizeBytes: 400,
    dataUrl: 'data:application/pdf;base64,AAAA',
    uploadedAt: new Date().toISOString(),
  })

  it('reports every missing required document for the loan type', () => {
    const result = documentsStepSchema('personal').safeParse({ documents: [] })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBe(4)
      expect(result.error.issues.every((i) => /Pièce manquante/.test(i.message))).toBe(true)
    }
  })

  it('passes once all required kinds are provided', () => {
    const docs = ['cin_recto', 'cin_verso', 'payslip', 'bank_statement'].map(doc)
    expect(documentsStepSchema('personal').safeParse({ documents: docs }).success).toBe(true)
  })
})

describe('signatureStepSchema', () => {
  it('requires a PNG data URL of sufficient length', () => {
    expect(signatureStepSchema.safeParse({ signatureDataUrl: '' }).success).toBe(false)
    expect(
      signatureStepSchema.safeParse({ signatureDataUrl: `data:image/jpeg;base64,${'A'.repeat(60)}` }).success,
    ).toBe(false)
    expect(
      signatureStepSchema.safeParse({ signatureDataUrl: `data:image/png;base64,${'A'.repeat(60)}` }).success,
    ).toBe(true)
  })
})
