import { describe, expect, it } from 'vitest';
import {
  formatRupees, formatInr, formatAmountInput, parseAmountInput, formatTenure,
} from './formatters';

describe('formatRupees', () => {
  it('formats zero', () => {
    expect(formatRupees(0)).toBe('₹0');
  });

  it('formats lakhs correctly', () => {
    expect(formatRupees(200000)).toBe('₹2,00,000');
  });

  it('formats crores correctly', () => {
    expect(formatRupees(10000000)).toBe('₹1,00,00,000');
  });

  it('rounds decimals', () => {
    expect(formatRupees(1234567.89)).toBe('₹12,34,568');
  });
});

describe('formatInr', () => {
  it('formats using en-IN locale', () => {
    expect(formatInr(200000)).toContain('2,00,000');
  });
});

describe('formatAmountInput / parseAmountInput', () => {
  it('formatAmountInput strips non-digits and formats', () => {
    expect(formatAmountInput('200000')).toBe('2,00,000');
    expect(formatAmountInput('₹50000')).toBe('50,000');
  });

  it('formatAmountInput returns empty for non-digit input', () => {
    expect(formatAmountInput('')).toBe('');
    expect(formatAmountInput('abc')).toBe('');
  });

  it('parseAmountInput strips non-digits', () => {
    expect(parseAmountInput('2,00,000')).toBe(200000);
    expect(parseAmountInput('₹50,000')).toBe(50000);
  });

  it('parseAmountInput returns NaN for empty', () => {
    expect(Number.isNaN(parseAmountInput(''))).toBe(true);
  });
});

describe('formatTenure', () => {
  it('formats months when < 12', () => {
    expect(formatTenure(6)).toBe('6 months');
  });

  it('formats years when divisible by 12', () => {
    expect(formatTenure(12)).toBe('1 yr');
    expect(formatTenure(60)).toBe('5 yr');
  });

  it('formats years and months when not exact', () => {
    expect(formatTenure(18)).toBe('1 yr 6 mo');
  });
});
