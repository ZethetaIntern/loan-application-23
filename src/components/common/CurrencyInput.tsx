import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { formatRupees } from '../../utils/formatters';

interface CurrencyInputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'onChange'> {
  label: string
  required?: boolean
  error?: string
  helpText?: string
  onChange?: (value: number) => void
  value?: number
  wrapperClassName?: string
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({
    id, name, label, required, error, helpText, onChange, value, wrapperClassName, className, ...rest
  }, ref) => {
    const fieldId = id ?? name;
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      onChange?.(raw ? Number(raw) : 0);
    };

    const displayValue = value ? formatRupees(value) : '';

    return (
      <div className={wrapperClassName}>
        <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
          <input
            ref={ref}
            id={fieldId}
            name={name}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-required={required || undefined}
            aria-invalid={!!error || undefined}
            aria-describedby={[error ? errorId : null, helpText ? helpId : null].filter(Boolean).join(' ') || undefined}
            value={displayValue}
            onChange={handleChange}
            className={`w-full rounded border py-2 pl-7 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${className ?? ''}`}
            placeholder="₹ 0"
            {...rest}
          />
        </div>
        {helpText && <p id={helpId} className="mt-1 text-sm text-gray-500">{helpText}</p>}
        {error && <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);
CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
