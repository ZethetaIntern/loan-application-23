import { describe, expect, it } from 'vitest';
import {
  maskAadhaar, maskPan, validateAadhaar, validatePan, verhoeffCheckDigit,
} from './validators';

describe('validatePan', () => {
  it('accepts an individual PAN for personal loans', () => {
    expect(validatePan('ABCPZ1234F', 'personal').valid).toBe(true);
  });

  it('rejects malformed PAN with a specific format message', () => {
    const result = validatePan('abc123', 'personal');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/AAAAA9999A/);
  });

  it('rejects an invalid entity-type 4th character with the specific message', () => {
    const result = validatePan('ABCEZ1234F', 'home');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/4th character must indicate entity type/);
  });

  it('enforces P only for home loans', () => {
    expect(validatePan('ABCCZ5678B', 'home').valid).toBe(false);
    expect(validatePan('ABCPZ5678B', 'home').valid).toBe(true);
  });

  it('allows P, C and F for business loans', () => {
    expect(validatePan('ABCPZ5678B', 'business').valid).toBe(true);
    expect(validatePan('ABCCZ5678B', 'business').valid).toBe(true);
    expect(validatePan('ABCFZ5678B', 'business').valid).toBe(true);
    expect(validatePan('ABCGZ5678B', 'business').valid).toBe(false);
  });
});

describe('Verhoeff checksum for Aadhaar', () => {
  it('matches the classic reference vector', () => {
    expect(verhoeffCheckDigit('236')).toBe(3);
  });

  it('accepts numbers generated with the algorithm', () => {
    for (const base of ['23412341234', '12345678901']) {
      expect(validateAadhaar(`${base}${verhoeffCheckDigit(base)}`)).toBe(true);
    }
  });

  it('rejects wrong lengths', () => {
    expect(validateAadhaar('12345')).toBe(false);
    expect(validateAadhaar('23412341234652')).toBe(false);
  });

  it('rejects a single-digit corruption of a valid number', () => {
    const base = '23412341234';
    const valid = `${base}${verhoeffCheckDigit(base)}`;
    const corruptedLast = valid.slice(0, 11) + String((Number(valid[11]) + 1) % 10);
    expect(validateAadhaar(corruptedLast)).toBe(false);
  });
});

describe('masking helpers', () => {
  it('masks PAN showing last four characters only', () => {
    expect(maskPan('ABCPZ1234F')).toBe('******234F');
  });

  it('masks Aadhaar showing last four digits only', () => {
    expect(maskAadhaar('234123412346')).toBe('XXXX XXXX 2346');
  });
});
