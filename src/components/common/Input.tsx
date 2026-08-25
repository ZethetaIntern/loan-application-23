import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ── Error ─────────────────────────────────────────────────────────── */
export function ErrorMessage({ id, children }: { id?: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
      {children}
    </p>
  );
}

/* ── HelpText ──────────────────────────────────────────────────────── */
export function HelpText({ id, children }: { id?: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1 text-sm text-gray-500">
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
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
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
          className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className ?? ''}`}
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
