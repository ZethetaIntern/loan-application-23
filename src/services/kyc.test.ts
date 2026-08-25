import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';
import { KYC_VERIFY_DELAY_MS, verifyAadhaar, verifyPan } from './kyc';
import { validateAadhaar, verhoeffCheckDigit } from '../utils/validators';

describe('KYC verification simulation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function resolve<T>(promise: Promise<T>): Promise<T> {
    await vi.advanceTimersByTimeAsync(KYC_VERIFY_DELAY_MS);
    return promise;
  }

  it('verifies a valid individual PAN after the simulated delay', async () => {
    const result = await resolve(verifyPan('ABCPZ1234F', 'personal'));
    expect(result.status).toBe('verified');
    expect(result.checkedAt).toBeTruthy();
  });

  it('rejects a PAN failing entity-type rules', async () => {
    const result = await resolve(verifyPan('ABCCZ5678B', 'home'));
    expect(result.status).toBe('rejected');
    expect(result.message).toMatch(/P for personal/);
  });

  it('simulates a records mismatch for sentinel PANs ending with Z', async () => {
    const result = await resolve(verifyPan('ABCPZ9999Z', 'personal'));
    expect(result.status).toBe('rejected');
    expect(result.message).toMatch(/Name mismatch/);
  });

  it('rejects an Aadhaar failing the Verhoeff checksum', async () => {
    const validBase = '23412341234';
    const valid = `${validBase}${verhoeffCheckDigit(validBase)}`;
    const corrupted = String((Number(valid[0]) + 1) % 10) + valid.slice(1);
    expect(validateAadhaar(corrupted)).toBe(false);

    const result = await resolve(verifyAadhaar(corrupted));
    expect(result.status).toBe('rejected');
    expect(result.message).toMatch(/Verhoeff/);
  });

  it('accepts a checksum-valid Aadhaar', async () => {
    const validBase = '23412341234';
    const valid = `${validBase}${verhoeffCheckDigit(validBase)}`;
    const result = await resolve(verifyAadhaar(valid));
    expect(result.status).toBe('verified');
  });

  it('reports checksum-valid numbers ending in 0000 as missing from sandbox records', async () => {
    let sandboxNumber: string | null = null;
    for (let i = 1; i < 10_000 && !sandboxNumber; i += 1) {
      const candidate = `${String(i).padStart(8, '0')}0000`;
      if (validateAadhaar(candidate)) sandboxNumber = candidate;
    }
    expect(sandboxNumber).not.toBeNull();

    const result = await resolve(verifyAadhaar(sandboxNumber!));
    expect(result.status).toBe('rejected');
    expect(result.message).toMatch(/UIDAI/);
  });
});
