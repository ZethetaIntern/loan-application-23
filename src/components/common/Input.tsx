import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

const FIELD_BASE = 'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-mist/60 transition-colors duration-200 hover:border-mist/50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15';

/* ── Error ─────────────────────────────────────────────────────────── */
export function ErrorMessage({ id, children }: { id?: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" aria-live="polite" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600">
      <span aria-hidden="true" className="mt-px">⚠</span>
      <span>{children}</span>
    </p>
  );
}

/* ── HelpText ──────────────────────────────────────────────────────── */
export function HelpText({ id, children }: { id?: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-mist">
      {children}
    </p>
  );
}

/* ── Label ─────────────────────────────────────────────────────────── */
export function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
      {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
    </label>
  );
}

/* ── Field ─────────────────────────────────────────────────────────── */
export interface FieldProps extends ComponentPropsWithoutRef<'input'> {
  error?: string
  helpText?: string
  label: string
  required?: boolean
  wrapperClassName?: string
}

export const InputField = forwardRef<HTMLInputElement, FieldProps>(
  ({
    id, name, label, required, error, helpText, wrapperClassName, className, ...rest
  }, ref) => {
    const fieldId = (id ?? name) as string;
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;
    return (
      <div className={wrapperClassName}>
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <input
          ref={ref}
          id={fieldId}
          name={name}
          aria-required={required || undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={[error ? errorId : null, helpText ? helpId : null].filter(Boolean).join(' ') || undefined}
          className={`${FIELD_BASE} ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-line'} ${className ?? ''}`}
          {...rest}
        />
        {helpText && <HelpText id={helpId}>{helpText}</HelpText>}
        <ErrorMessage id={errorId}>{error}</ErrorMessage>
      </div>
    );
  },
);
InputField.displayName = 'InputField';

export const Input = {
  Field: InputField, Label, Error: ErrorMessage, HelpText,
};
