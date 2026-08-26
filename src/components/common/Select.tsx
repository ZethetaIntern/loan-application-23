import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'type'> {
  label: string
  required?: boolean
  error?: string
  helpText?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
  wrapperClassName?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    id, name, label, required, error, helpText, options, placeholder, wrapperClassName, className, ...rest
  }, ref) => {
    const fieldId = id ?? name;
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;
    return (
      <div className={wrapperClassName}>
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            name={name}
            aria-required={required || undefined}
            aria-invalid={!!error || undefined}
            aria-describedby={[error ? errorId : null, helpText ? helpId : null].filter(Boolean).join(' ') || undefined}
            className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-ink transition-colors duration-200 hover:border-mist/50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-line'
            } ${className ?? ''}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-mist"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {helpText && <p id={helpId} className="mt-1.5 text-xs text-mist">{helpText}</p>}
        {error && (
          <p id={errorId} role="alert" aria-live="polite" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600">
            <span aria-hidden="true" className="mt-px">⚠</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';

export default Select;
