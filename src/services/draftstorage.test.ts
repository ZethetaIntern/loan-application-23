// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import type { LoanType } from '../types/domain'
import {
  clearDraft,
  draftKey,
  deriveKey,
  encryptJson,
  decryptJson,
  loadDraft,
  purgeExpiredDrafts,
  saveDraft,
} from './draftstorage'
import { DRAFT_TTL_MS } from '../utils/constants'

const sampleState = { step1: { loanType: 'personal', amount: 500_000 }, nested: { ok: true } }

describe('AES-GCM primitives', () => {
  it('round-trips an encrypted payload', async () => {
    const key = await deriveKey('test-passphrase')
    const { iv, cipher } = await encryptJson(key, sampleState)
    expect(iv).not.toBe(cipher)
    const restored = await decryptJson<typeof sampleState>(key, iv, cipher)
    expect(restored).toEqual(sampleState)
  })

  it('fails to decrypt with the wrong key material', async () => {
    const keyA = await deriveKey('passphrase-a')
    const keyB = await deriveKey('passphrase-b')
    const { iv, cipher } = await encryptJson(keyA, sampleState)
    await expect(decryptJson(keyB, iv, cipher)).rejects.toThrow()
  })
})

describe('draft persistence', () => {
  const loanType: LoanType = 'personal'

  beforeEach(() => localStorage.clear())

  it('stores an encrypted envelope under the lendswift_draft_[loanType] key', async () => {
    const savedAt = await saveDraft(loanType, 3, sampleState)
    const raw = localStorage.getItem(draftKey(loanType))
    expect(raw).toBeTruthy()
    expect(raw).not.toContain('step1')
    const envelope = JSON.parse(raw ?? '{}')
    expect(envelope.version).toBe('1.0')
    expect(envelope.step).toBe(3)
    expect(new Date(savedAt).getTime()).not.toBeNaN()
  })

  it('restores the exact state through loadDraft', async () => {
    await saveDraft(loanType, 2, sampleState)
    const loaded = await loadDraft<typeof sampleState>(loanType)
    expect(loaded?.state).toEqual(sampleState)
    expect(loaded?.step).toBe(2)
    expect(loaded?.loanType).toBe(loanType)
  })

  it('purges drafts older than the 72h TTL on read', async () => {
    await saveDraft(loanType, 1, sampleState)
    const raw = JSON.parse(localStorage.getItem(draftKey(loanType))!)
    raw.timestamp = new Date(Date.now() - DRAFT_TTL_MS - 60_000).toISOString()
    localStorage.setItem(draftKey(loanType), JSON.stringify(raw))
    expect(await loadDraft(loanType)).toBeNull()
    expect(localStorage.getItem(draftKey(loanType))).toBeNull()
  })

  it('clears corrupted payloads instead of crashing', async () => {
    localStorage.setItem(draftKey(loanType), '{broken json')
    expect(await loadDraft(loanType)).toBeNull()
    expect(localStorage.getItem(draftKey(loanType))).toBeNull()
  })

  it('removes the entry on explicit clear', async () => {
    await saveDraft(loanType, 0, sampleState)
    clearDraft(loanType)
    expect(await loadDraft(loanType)).toBeNull()
  })
})

describe('expired draft sweeper', () => {
  beforeEach(() => localStorage.clear())

  it('sweeps stale envelopes across loan types and keeps fresh ones', async () => {
    await saveDraft('personal', 1, { a: 1 })
    await saveDraft('home', 2, { b: 2 })
    const staleKey = draftKey('business')
    localStorage.setItem(
      staleKey,
      JSON.stringify({
        version: '1.0',
        timestamp: new Date(Date.now() - DRAFT_TTL_MS - 1).toISOString(),
        step: 0,
        loanType: 'business',
        iv: 'x',
        cipher: 'y',
      }),
    )
    expect(purgeExpiredDrafts()).toBe(1)
    expect(localStorage.getItem(staleKey)).toBeNull()
    expect(localStorage.getItem(draftKey('personal'))).not.toBeNull()
  })
})
