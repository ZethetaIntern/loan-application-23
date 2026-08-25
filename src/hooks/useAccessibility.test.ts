import { describe, expect, it } from 'vitest';
import { useFocusFirstError, useStepFocusTrap } from './useAccessibility';

describe('useAccessibility', () => {
  it('exports useFocusFirstError as a function', () => {
    expect(typeof useFocusFirstError).toBe('function');
  });

  it('exports useStepFocusTrap as a function', () => {
    expect(typeof useStepFocusTrap).toBe('function');
  });
});
