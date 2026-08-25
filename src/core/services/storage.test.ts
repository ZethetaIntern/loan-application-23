// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import type { ApplicationDraft } from '../types'
import { clearStoredDraft, loadStoredDraft, saveStoredDraft, SCHEMA_VERSION } from './storage'

const STORAGE_KEY = 'dhahabi.draft'

function draft(): ApplicationDraft {
  return {
    loanType: 'personal',
    amount: 15_000,
    durationMonths: 36,
    firstName: 'Hazem',
    lastName: 'Ben Ali',
    birthDate: '1990-01-01',
    nationalId: '09876543',
    maritalStatus: 'single',
    dependents: 0,
    email: 'hazem@example.tn',
    phone: '20123456',
    address: { street: '12 Rue de la Liberté', city: 'Tunis', governorate: 'Tunis', postalCode: '1000' },
    employmentStatus: 'salaried',
    monthlySalary: 3_000,
    otherIncome: 0,
    existingMonthlyObligations: 0,
    documents: [],
  }
}

describe('draft storage', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips a saved draft', () => {
    expect(saveStoredDraft(4, draft())).toBe(true)
    const loaded = loadStoredDraft()
    expect(loaded).not.toBeNull()
    expect(loaded!.version).toBe(SCHEMA_VERSION)
    expect(loaded!.stepIndex).toBe(4)
    expect(loaded!.draft.amount).toBe(15_000)
  })

  it('returns null when nothing is stored', () => {
    expect(loadStoredDraft()).toBeNull()
  })

  it('survives corrupted payloads without throwing', () => {
    localStorage.setItem(STORAGE_KEY, '{not json at all')
    expect(loadStoredDraft()).toBeNull()
  })

  it('purges drafts from an incompatible schema version', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: SCHEMA_VERSION + 99, stepIndex: 0, updatedAt: '', draft: draft() }),
    )
    expect(loadStoredDraft()).toBeNull()
  })

  it('clears the stored draft', () => {
    saveStoredDraft(2, draft())
    clearStoredDraft()
    expect(loadStoredDraft()).toBeNull()
  })
})
