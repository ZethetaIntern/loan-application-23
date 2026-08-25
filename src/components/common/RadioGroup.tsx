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
  const groupId = `${name}-group`
  const errorId = `${name}-error`
  return (
    <fieldset aria-required={required || undefined} aria-describedby={error ? errorId : undefined}>
      <legend className="mb-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </legend>
      <div
        id={groupId}
        role="radiogroup"
        aria-invalid={!!error || undefined}
        className={`flex ${orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'}`}
      >
        {options.map((opt) => {
          const optId = `${name}-${opt.value}`
          const checked = value === opt.value
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={`flex cursor-pointer items-start gap-2 rounded border px-3 py-2 text-sm transition ${
                checked ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-300 hover:bg-gray-50'
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
                className="mt-0.5"
              />
              <div>
                <span className="font-medium">{opt.label}</span>
                {opt.description && (
                  <span className="ml-1 text-xs text-gray-500">({opt.description})</span>
                )}
              </div>
            </label>
          )
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  )
}
