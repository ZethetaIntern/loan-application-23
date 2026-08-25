import { describe, expect, it } from 'vitest'
import {
  breakdownFor,
  checkAffordability,
  emiOf,
  processingFeeFor,
} from './emicalculator'
import { formatAmountInput, formatInr, formatRupees, formatTenure, parseAmountInput } from '../utils/formatters'

describe('EMI engine', () => {
  it('computes the standard reducing-balance EMI', () => {
    const emi = emiOf(1_000_000, 0.105, 60)
    expect(emi).toBeGreaterThan(21_400)
    expect(emi).toBeLessThan(21_600)
  })

  it('handles zero-tenure and zero-principal safely', () => {
    expect(emiOf(0, 0.105, 60)).toBe(0)
    expect(emiOf(100_000, 0.105, 0)).toBe(0)
  })

  it('charges a 1% fee clamped between ₹2,000 and ₹25,000', () => {
    expect(processingFeeFor(500_000)).toBe(5_000)
    expect(processingFeeFor(100_000)).toBe(2_000)
    expect(processingFeeFor(10_000_000)).toBe(25_000)
  })

  it('applies the per-type fixed rates', () => {
    const personal = breakdownFor('personal', 500_000, 36)
    const home = breakdownFor('home', 5_000_000, 240)
    const business = breakdownFor('business', 2_000_000, 60)
    expect(personal.annualRate).toBe(0.105)
    expect(home.annualRate).toBe(0.085)
    expect(business.annualRate).toBe(0.14)
    expect(personal.totalCostOfBorrowing).toBeGreaterThan(0)
  })
})

describe('affordability gate', () => {
  const base = {
    applicantMonthlyIncome: 80_000,
    amount: 500_000,
    tenureMonths: 36,
    loanType: 'personal' as const,
  }

  it('approves when EMI stays under half of income', () => {
    const result = checkAffordability(base)
    expect(result.withinLimit).toBe(true)
    expect(result.ratio).toBeLessThan(0.5)
  })

  it('counts rent and existing EMIs as obligations', () => {
    const withRent = checkAffordability({ ...base, monthlyRent: 25_000 })
    const without = checkAffordability(base)
    expect(withRent.ratio).toBeGreaterThan(without.ratio)
  })

  it('adds co-applicant income to the denominator', () => {
    const tight = { ...base, applicantMonthlyIncome: 60_000, amount: 1_000_000 }
    const solo = checkAffordability(tight)
    const together = checkAffordability({ ...tight, coApplicantMonthlyIncome: 60_000 })
    expect(solo.withinLimit).toBe(false)
    expect(together.withinLimit).toBe(true)
  })

  it('rejects zero income outright', () => {
    expect(checkAffordability({ ...base, applicantMonthlyIncome: 0 }).withinLimit).toBe(false)
  })
})

describe('INR formatting', () => {
  it('groups digits the Indian way', () => {
    expect(formatInr(1050000)).toBe('10,50,000')
    expect(formatRupees(50000)).toBe('₹50,000')
  })

  it('round-trips currency inputs through grouping', () => {
    const formatted = formatAmountInput('1234567')
    expect(formatted).toBe('12,34,567')
    expect(parseAmountInput(formatted)).toBe(1234567)
  })

  it('strips leading zeros and junk from input', () => {
    expect(formatAmountInput('00123')).toBe('123')
    expect(formatAmountInput('12ab')).toBe('12')
    expect(parseAmountInput('')).toBeNaN()
  })

  it('formats tenure compactly', () => {
    expect(formatTenure(24)).toBe('2 yr')
    expect(formatTenure(30)).toBe('2 yr 6 mo')
  })
})
