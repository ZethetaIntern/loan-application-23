import { describe, expect, it } from 'vitest'
import { usePinCodeLookup, lookupPinCode } from './pincode'

describe('usePinCodeLookup', () => {
  it('returns city and state for valid Mumbai PIN', () => {
    const result = usePinCodeLookup('400001')
    expect(result.found).toBe(true)
    expect(result.city).toBe('Mumbai')
    expect(result.state).toBe('Maharashtra')
    expect(result.postOffice).toBe('Fort')
  })

  it('returns not found for unknown PIN', () => {
    expect(usePinCodeLookup('999999').found).toBe(false)
  })

  it('returns not found for invalid format', () => {
    expect(usePinCodeLookup('000000').found).toBe(false)
    expect(usePinCodeLookup('123').found).toBe(false)
    expect(usePinCodeLookup('').found).toBe(false)
  })

  it('returns not found for undefined', () => {
    expect(usePinCodeLookup(undefined as unknown as string).found).toBe(false)
  })
})

describe('lookupPinCode', () => {
  it('returns record with city/state/postOffice', () => {
    const result = lookupPinCode('110001')
    expect(result.found).toBe(true)
    expect(result.record).toBeDefined()
    expect(result.record?.city).toBe('New Delhi')
    expect(result.record?.state).toBe('Delhi')
  })
})
