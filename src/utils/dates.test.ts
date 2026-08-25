import { describe, expect, it } from 'vitest';
import { ageOn } from './dates';

describe('ageOn', () => {
  it('calculates correct age for a past birthday', () => {
    const age = ageOn('1990-01-01', new Date('2025-06-15'));
    expect(age).toBe(35);
  });

  it('calculates correct age before birthday', () => {
    const age = ageOn('1990-12-31', new Date('2025-06-15'));
    expect(age).toBe(34);
  });

  it('returns NaN for invalid date', () => {
    expect(Number.isNaN(ageOn('not-a-date'))).toBe(true);
  });

  it('returns 0 for today', () => {
    const today = new Date('2025-01-01');
    expect(ageOn('2025-01-01', today)).toBe(0);
  });
});
