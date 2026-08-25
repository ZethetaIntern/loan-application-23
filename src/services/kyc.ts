import type { KycResult, LoanType } from '../types/domain';
import { validateAadhaar, validatePan } from '../utils/validators';

export const KYC_VERIFY_DELAY_MS = 1500;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function verifyPan(pan: string, loanType: LoanType): Promise<KycResult> {
  await wait(KYC_VERIFY_DELAY_MS);
  const checkedAt = new Date().toISOString();
  const validation = validatePan(pan, loanType);

  if (!validation.valid) {
    return {
      field: 'pan', status: 'rejected', message: validation.message, checkedAt,
    };
  }

  const normalized = pan.trim().toUpperCase();
  if (normalized.endsWith('Z')) {
    return {
      field: 'pan',
      status: 'rejected',
      message: 'Name mismatch with Income Tax records. Please double-check your PAN.',
      checkedAt,
    };
  }

  return {
    field: 'pan', status: 'verified', message: 'PAN verified successfully.', checkedAt,
  };
}

export async function verifyAadhaar(aadhaar: string): Promise<KycResult> {
  await wait(KYC_VERIFY_DELAY_MS);
  const checkedAt = new Date().toISOString();

  if (!validateAadhaar(aadhaar)) {
    return {
      field: 'aadhaar',
      status: 'rejected',
      message: 'Aadhaar failed the Verhoeff checksum. Please re-enter all 12 digits.',
      checkedAt,
    };
  }

  const digits = aadhaar.replace(/\D/g, '');
  if (digits.endsWith('0000')) {
    return {
      field: 'aadhaar',
      status: 'rejected',
      message: 'Aadhaar not found in UIDAI sandbox records.',
      checkedAt,
    };
  }

  return {
    field: 'aadhaar', status: 'verified', message: 'Aadhaar verified successfully.', checkedAt,
  };
}
