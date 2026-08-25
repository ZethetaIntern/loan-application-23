import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

interface SelectProps extends ComponentPropsWithoutRef<'select'> {
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
        <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
        </label>
        <select
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
        {helpText && <p id={helpId} className="mt-1 text-sm text-gray-500">{helpText}</p>}
        {error && <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';

export default Select;
