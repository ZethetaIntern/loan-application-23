import { useCallback } from 'react';

export function useFocusFirstError() {
  return useCallback((errorIds: string[]) => {
    for (const id of errorIds) {
      const el = document.getElementById(id);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }, []);
}

export function useStepFocusTrap(stepRef: React.RefObject<HTMLDivElement | null>) {
  const trapFocus = useCallback(
    (e: KeyboardEvent) => {
      const container = stepRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [stepRef],
  );

  return trapFocus;
}
