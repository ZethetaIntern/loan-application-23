import { describe, expect, it } from 'vitest'
import { LOAN_PURPOSES, TENURE_LIMITS, ANNUAL_RATES, CO_APPLICANT_THRESHOLDS, EMPLOYMENT_ALLOWED_BY_LOAN_TYPE, PROCESSING_FEE_RATE, PROCESSING_FEE_MIN, PROCESSING_FEE_MAX } from './constants'

describe('constants', () => {
  it('has valid tenure limits for all loan types', () => {
    for (const [type, limits] of Object.entries(TENURE_LIMITS)) {
      expect(limits.minMonths).toBeGreaterThan(0)
      expect(limits.maxMonths).toBeGreaterThan(limits.minMonths)
      expect(type).toBeDefined()
    }
  })

  it('has valid annual rates', () => {
    expect(ANNUAL_RATES.personal).toBeGreaterThan(0)
    expect(ANNUAL_RATES.home).toBeLessThan(ANNUAL_RATES.personal)
    expect(ANNUAL_RATES.business).toBeGreaterThan(ANNUAL_RATES.personal)
  })

  it('has valid co-applicant thresholds', () => {
    expect(CO_APPLICANT_THRESHOLDS.personal).toBe(500_000)
    expect(CO_APPLICANT_THRESHOLDS.home).toBe(Number.POSITIVE_INFINITY)
    expect(CO_APPLICANT_THRESHOLDS.business).toBe(2_000_000)
  })

  it('has loan purposes', () => {
    expect(LOAN_PURPOSES.length).toBeGreaterThan(5)
    LOAN_PURPOSES.forEach((p) => {
      expect(p.value).toBeTruthy()
      expect(p.label).toBeTruthy()
    })
  })

  it('has valid processing fee constants', () => {
    expect(PROCESSING_FEE_RATE).toBe(0.01)
    expect(PROCESSING_FEE_MIN).toBe(2000)
    expect(PROCESSING_FEE_MAX).toBe(25000)
  })

  it('employment types match loan types', () => {
    expect(EMPLOYMENT_ALLOWED_BY_LOAN_TYPE.personal).toContain('salaried')
    expect(EMPLOYMENT_ALLOWED_BY_LOAN_TYPE.business).toContain('business_owner')
    expect(EMPLOYMENT_ALLOWED_BY_LOAN_TYPE.business).not.toContain('salaried')
  })
})
