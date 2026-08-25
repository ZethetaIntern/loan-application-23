import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusFirstError, useStepFocusTrap } from './useAccessibility';

describe('useFocusFirstError', () => {
  it('focuses the first matching element by id', () => {
    const { result } = renderHook(() => useFocusFirstError());
    const el = document.createElement('input');
    el.id = 'field-error-1';
    document.body.appendChild(el);
    const focusSpy = vi.spyOn(el, 'focus');

    result.current(['field-error-1', 'field-error-2']);

    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(el);
  });

  it('does nothing when no ids match', () => {
    const { result } = renderHook(() => useFocusFirstError());
    result.current(['nonexistent']);
  });
});

describe('useStepFocusTrap', () => {
  it('returns a function', () => {
    const container = document.createElement('div');
    const stepRef = { current: container };
    const { result } = renderHook(() => useStepFocusTrap(stepRef as React.RefObject<HTMLDivElement>));
    expect(typeof result.current).toBe('function');
  });

  it('wraps focus from last to first on Tab', () => {
    const container = document.createElement('div');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(container);

    const stepRef = { current: container };
    const { result } = renderHook(() => useStepFocusTrap(stepRef as React.RefObject<HTMLDivElement>));

    btn2.focus();
    const trap = result.current;
    const preventDefault = vi.fn();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });
    Object.defineProperty(document, 'activeElement', { value: btn2, writable: true, configurable: true });
    trap(event);
    expect(preventDefault).toHaveBeenCalled();
    expect(btn1.focus).toBeDefined();

    document.body.removeChild(container);
  });

  it('wraps focus from first to last on Shift+Tab', () => {
    const container = document.createElement('div');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(container);

    const stepRef = { current: container };
    const { result } = renderHook(() => useStepFocusTrap(stepRef as React.RefObject<HTMLDivElement>));

    btn1.focus();
    const trap = result.current;
    const preventDefault = vi.fn();
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });
    Object.defineProperty(document, 'activeElement', { value: btn1, writable: true, configurable: true });
    trap(event);
    expect(preventDefault).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('does nothing when container is null', () => {
    const stepRef = { current: null };
    const { result } = renderHook(() => useStepFocusTrap(stepRef as React.RefObject<HTMLDivElement | null>));
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    result.current(event);
  });

  it('does nothing when no focusable children', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const stepRef = { current: container };
    const { result } = renderHook(() => useStepFocusTrap(stepRef as React.RefObject<HTMLDivElement>));
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    result.current(event);
    document.body.removeChild(container);
  });

  it('ignores non-Tab keypresses', () => {
    const container = document.createElement('div');
    const btn = document.createElement('button');
    container.appendChild(btn);
    document.body.appendChild(container);
    const stepRef = { current: container };
    const { result } = renderHook(() => useStepFocusTrap(stepRef as React.RefObject<HTMLDivElement>));
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    result.current(event);
    expect(event.defaultPrevented).toBe(false);
    document.body.removeChild(container);
  });
});
