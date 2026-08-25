import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label: React.ReactNode
  error?: string
  wrapperClassName?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    id, name, label, error, wrapperClassName, className, ...rest
  }, ref) => {
    const fieldId = id ?? name;
    const errorId = `${fieldId}-error`;
    return (
      <div className={wrapperClassName}>
        <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-2 text-sm text-gray-700">
          <input
            ref={ref}
            type="checkbox"
            id={fieldId}
            name={name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className ?? ''}`}
            {...rest}
          />
          <span>{label}</span>
        </label>
        {error && (
          <p id={errorId} role="alert" aria-live="polite" className="ml-6 mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
