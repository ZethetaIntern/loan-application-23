import { PAN_ENTITY_TYPES } from './constants';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const INDIVIDUAL_ONLY_TYPES = new Set<string>(['personal', 'home']);

type LoanTypeForPan = 'personal' | 'home' | 'business'

export interface PanValidation {
  valid: boolean
  message: string
}

export function validatePan(pan: string, loanType?: LoanTypeForPan): PanValidation {
  const value = pan.trim().toUpperCase();

  if (!PAN_REGEX.test(value)) {
    return {
      valid: false,
      message:
        'PAN must be 10 characters in format AAAAA9999A (5 uppercase letters, 4 digits, 1 letter).',
    };
  }

  const fourthChar = value[3];
  if (!(PAN_ENTITY_TYPES as readonly string[]).includes(fourthChar)) {
    return {
      valid: false,
      message:
        'PAN 4th character must indicate entity type (P for Individual, C for Company, etc.).',
    };
  }

  if (INDIVIDUAL_ONLY_TYPES.has(loanType ?? '') && fourthChar !== 'P') {
    return {
      valid: false,
      message: `PAN 4th character must be P for ${loanType === 'business' ? 'this loan type' : 'personal and home loans'} (found ${fourthChar}).`,
    };
  }

  if (loanType === 'business' && !['P', 'C', 'F'].includes(fourthChar)) {
    return {
      valid: false,
      message: 'Business loans accept PAN of individuals (P), companies (C) or firms (F) only.',
    };
  }

  return { valid: true, message: '' };
}

const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

function verhoeffSum(digits: string, offset: number): number {
  let c = 0;
  const reversed = digits.split('').reverse();
  reversed.forEach((char, index) => {
    c = VERHOEFF_D[c][VERHOEFF_P[(index + offset) % 8][Number(char)]];
  });
  return c;
}

export function verhoeffCheckDigit(baseDigits: string): number {
  return VERHOEFF_INV[verhoeffSum(baseDigits, 1)];
}

export function validateAadhaar(aadhaar: string): boolean {
  const value = aadhaar.replace(/\s/g, '');
  if (!/^[0-9]{12}$/.test(value)) return false;
  if (/^(\d)\1{11}$/.test(value)) return false;
  return verhoeffSum(value, 0) === 0;
}

export function maskPan(pan: string): string {
  if (!PAN_REGEX.test(pan)) return pan;
  return `******${pan.slice(6)}`;
}

export function maskAadhaar(aadhaar: string): string {
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length !== 12) return aadhaar;
  return `XXXX XXXX ${digits.slice(8)}`;
}
