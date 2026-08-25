import { describe, expect, it } from 'vitest';
import type { ApplicationDraft } from '../types';
import { monthlyIncomeOf, validateCrossStep } from './crossStep';

function draft(overrides: Partial<ApplicationDraft> = {}): ApplicationDraft {
  return {
    loanType: 'personal',
    amount: 20_000,
    durationMonths: 48,
    firstName: 'Hazem',
    lastName: 'Ben Ali',
    birthDate: '1990-01-01',
    nationalId: '09876543',
    maritalStatus: 'single',
    dependents: 0,
    email: 'hazem@example.tn',
    phone: '20123456',
    address: {
      street: '12 Rue de la Liberté', city: 'Tunis', governorate: 'Tunis', postalCode: '1000',
    },
    employmentStatus: 'salaried',
    monthlySalary: 3_000,
    otherIncome: 0,
    existingMonthlyObligations: 0,
    documents: [],
    ...overrides,
  };
}

describe('monthlyIncomeOf', () => {
  it('uses the salary for employees and retirees', () => {
    expect(monthlyIncomeOf(draft())).toBe(3_000);
    expect(monthlyIncomeOf(draft({ employmentStatus: 'retired' }))).toBe(3_000);
  });

  it('derives monthly income from annual revenue for self-employed', () => {
    expect(monthlyIncomeOf(draft({ employmentStatus: 'self_employed', annualRevenue: 36_000 }))).toBeCloseTo(3_000);
  });
});

describe('validateCrossStep', () => {
  it('is silent for an affordable request', () => {
    expect(validateCrossStep(draft({ amount: 30_000 }))).toHaveLength(0);
  });

  it('flags amounts above capacity with the eligible maximum', () => {
    const issues = validateCrossStep(
      draft({
        employmentStatus: 'self_employed',
        annualRevenue: 12_000,
        amount: 30_000,
        monthlySalary: undefined,
      }),
    );
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].message).toMatch(/Montant éligible maximum/);
  });

  it('prevents financing more than the property price', () => {
    const issues = validateCrossStep(
      draft({
        loanType: 'home', propertyPrice: 200_000, downPayment: 25_000, amount: 190_000,
      }),
    );
    expect(issues.some((i) => /prix du bien/.test(i.message))).toBe(true);
  });

  it('caps home loan maturity at age 75', () => {
    const issues = validateCrossStep(
      draft({ loanType: 'home', birthDate: '1960-06-15', durationMonths: 240 }),
    );
    const durationIssue = issues.find((i) => i.field === 'durationMonths');
    expect(durationIssue).toBeDefined();
    expect(durationIssue!.message).toMatch(/75 ans/);
  });

  it('limits business loans to 50% of annual revenue', () => {
    const issues = validateCrossStep(
      draft({
        loanType: 'business',
        employmentStatus: 'self_employed',
        annualRevenue: 100_000,
        amount: 60_000,
      }),
    );
    expect(issues.some((i) => /50 %/.test(i.message))).toBe(true);
  });

  it('does not apply the revenue rule to salaried business applicants', () => {
    const issues = validateCrossStep(
      draft({ loanType: 'business', employmentStatus: 'salaried', amount: 60_000 }),
    );
    expect(issues.every((i) => !/50 %/.test(i.message))).toBe(true);
  });
});
