interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioGroupProps {
  name: string
  label: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required,
  orientation = 'vertical',
}: RadioGroupProps) {
  const groupId = `${name}-group`;
  const errorId = `${name}-error`;
  return (
    <fieldset aria-required={required || undefined} aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2 text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </legend>
      <div
        id={groupId}
        role="radiogroup"
        aria-invalid={!!error || undefined}
        className={`flex ${orientation === 'horizontal' ? 'flex-row flex-wrap gap-3' : 'flex-col gap-2.5'}`}
      >
        {options.map((opt) => {
          const optId = `${name}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={`flex flex-1 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
                checked
                  ? 'border-primary bg-primary-soft/60 ring-primary/15 ring-2'
                  : 'border-line bg-white hover:border-primary/40 hover:bg-primary-soft/20'
              } ${opt.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <input
                type="radio"
                id={optId}
                name={name}
                value={opt.value}
                checked={checked}
                disabled={opt.disabled}
                onChange={() => onChange?.(opt.value)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">{opt.label}</span>
                {opt.description && (
                  <span className="mt-0.5 block text-xs text-mist">{opt.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600">
          <span aria-hidden="true" className="mt-px">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}
