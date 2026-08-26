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
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-mist">₹</span>
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
            className={`w-full rounded-xl border bg-white py-2.5 pr-3.5 pl-8 text-sm text-ink transition-colors duration-200 hover:border-mist/50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-line'
            } ${className ?? ''}`}
            placeholder="0"
            {...rest}
          />
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
CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
