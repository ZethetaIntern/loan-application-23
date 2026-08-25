import { describe, expect, it } from 'vitest'
import { lookupPinCode } from './pincode'

describe('PIN code lookup', () => {
  it('resolves a metro PIN to city and state', () => {
    const result = lookupPinCode('560034')
    expect(result.found).toBe(true)
    expect(result.record?.city).toBe('Bengaluru')
    expect(result.record?.state).toBe('Karnataka')
  })

  it('includes the post office when known', () => {
    expect(lookupPinCode('400001').record?.postOffice).toBe('Fort')
  })

  it('rejects malformed PINs', () => {
    expect(lookupPinCode('12345').found).toBe(false)
    expect(lookupPinCode('011001').found).toBe(false)
    expect(lookupPinCode('abcabc').found).toBe(false)
  })

  it('reports unknown but well-formed PINs as not found', () => {
    expect(lookupPinCode('999999').found).toBe(false)
  })
})
