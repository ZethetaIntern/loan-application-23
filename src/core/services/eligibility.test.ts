import { describe, expect, it } from 'vitest';
import { computeEligibility, maxAffordablePrincipal, monthlyPayment } from './eligibility';

describe('monthlyPayment', () => {
  it('returns 0 for zero months', () => {
    expect(monthlyPayment(10_000, 0.079, 0)).toBe(0);
  });

  it('computes the standard amortization formula', () => {
    expect(monthlyPayment(10_000, 0.079, 60)).toBeCloseTo(202.3, 0);
  });

  it('falls back to linear split at 0% rate', () => {
    expect(monthlyPayment(12_000, 0, 24)).toBeCloseTo(500);
  });
});

describe('maxAffordablePrincipal', () => {
  it('returns 0 for zero months', () => {
    expect(maxAffordablePrincipal(500, 0.079, 0)).toBe(0);
  });

  it('inverts monthlyPayment', () => {
    const principal = 15_000;
    const emi = monthlyPayment(principal, 0.089, 36);
    expect(maxAffordablePrincipal(emi, 0.089, 36)).toBeCloseTo(principal, 2);
  });
});

describe('computeEligibility', () => {
  const base = {
    monthlyIncome: 3_000,
    otherIncome: 0,
    existingMonthlyObligations: 200,
    annualRate: 0.079,
    durationMonths: 48,
  };

  it('approves when the requested amount fits capacity', () => {
    const result = computeEligibility({ ...base, amount: 30_000 });
    expect(result.decision).toBe('approved');
    expect(result.maxInstallment).toBeCloseTo(3_000 * 0.4 - 200, 6);
    expect(result.requestedEmi).toBe(monthlyPayment(30_000, 0.079, 48));
    expect(result.debtRatio).toBeCloseTo((result.requestedEmi + 200) / 3_000, 10);
  });

  it('makes a rounded counter-offer when the request exceeds capacity', () => {
    const result = computeEligibility({ ...base, amount: 60_000 });
    expect(result.decision).toBe('counter_offer');
    expect(result.counterAmount).toBeDefined();
    expect(result.counterAmount! % 100).toBe(0);
    expect(result.counterAmount!).toBeLessThanOrEqual(result.maxEligibleAmount);
    expect(result.counterAmount!).toBeGreaterThan(40_000);
  });

  it('rejects when even a counter-offer is impossible', () => {
    const result = computeEligibility({
      monthlyIncome: 500,
      otherIncome: 0,
      existingMonthlyObligations: 150,
      annualRate: 0.079,
      durationMonths: 6,
      amount: 20_000,
    });
    expect(result.decision).toBe('rejected');
    expect(result.maxInstallment).toBeCloseTo(50, 6);
  });

  it('rejects applicants with no income at all', () => {
    const result = computeEligibility({
      monthlyIncome: 0,
      otherIncome: 0,
      existingMonthlyObligations: 0,
      annualRate: 0.079,
      durationMonths: 24,
      amount: 5_000,
    });
    expect(result.decision).toBe('rejected');
    expect(result.debtRatio).toBe(Infinity);
  });

  it('includes other income in total capacity', () => {
    const withoutOther = computeEligibility({ ...base, amount: 45_000, otherIncome: 0 });
    const withOther = computeEligibility({ ...base, amount: 45_000, otherIncome: 800 });
    expect(withOther.decision).not.toBe('rejected');
    expect(withOther.maxInstallment).toBeGreaterThan(withoutOther.maxInstallment);
  });
});
