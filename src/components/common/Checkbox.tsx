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
        <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-2.5 text-sm text-ink">
          <input
            ref={ref}
            type="checkbox"
            id={fieldId}
            name={name}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-mist/60 accent-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${
              error ? 'outline outline-red-400' : ''
            } ${className ?? ''}`}
            {...rest}
          />
          <span className="leading-relaxed">{label}</span>
        </label>
        {error && (
          <p id={errorId} role="alert" aria-live="polite" className="mt-1.5 ml-7 flex items-start gap-1 text-xs font-medium text-red-600">
            <span aria-hidden="true" className="mt-px">⚠</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
