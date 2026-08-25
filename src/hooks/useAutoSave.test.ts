import { describe, expect, it } from 'vitest'
import { useAutoSave } from './useAutoSave'

describe('useAutoSave', () => {
  it('exports as a function', () => {
    expect(typeof useAutoSave).toBe('function')
  })
})
