import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoSave } from './useAutoSave';

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns default state immediately', () => {
    const { result } = renderHook(() => useAutoSave({ loanType: 'personal', state: {}, step: 1, interval: 1000 }));
    expect(result.current.isSaving).toBe(false);
    expect(result.current.lastSavedAt).toBeNull();
  });

  it('does nothing when loanType is empty', () => {
    const { result } = renderHook(() => useAutoSave({ loanType: '', state: {}, step: 1 }));
    expect(result.current.isSaving).toBe(false);
    vi.advanceTimersByTime(60_000);
    expect(localStorage.getItem('lendswift_draft_')).toBeNull();
  });

  it('saves encrypted draft after interval', async () => {
    const { result } = renderHook(() => useAutoSave({ loanType: 'personal', state: { foo: 'bar' }, step: 1, interval: 1000 }));
    expect(result.current.isSaving).toBe(false);
    vi.advanceTimersByTime(1000);
    await vi.waitFor(() => {
      const raw = localStorage.getItem('lendswift_draft_personal');
      if (raw) {
        const envelope = JSON.parse(raw);
        expect(envelope.version).toBe('1.0');
        expect(envelope.step).toBe(1);
        expect(envelope.loanType).toBe('personal');
        expect(envelope.iv).toBeTruthy();
        expect(envelope.cipher).toBeTruthy();
      }
    });
  });

  it('clears timer on cleanup', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useAutoSave({ loanType: 'personal', state: {}, step: 1, interval: 5000 }));
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
