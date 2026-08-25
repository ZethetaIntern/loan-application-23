import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { maskAadhaar, maskPan } from '../../utils/validators'

interface MaskedInputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label: string
  required?: boolean
  error?: string
  helpText?: string
  kind: 'pan' | 'aadhaar'
  wrapperClassName?: string
}

const MASKERS = { pan: maskPan, aadhaar: maskAadhaar }
const PATTERNS = { pan: 'AAAAA9999A', aadhaar: 'XXXX XXXX XXXX' }
const MAX_LEN = { pan: 10, aadhaar: 12 }

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ id, name, label, required, error, helpText, kind, value, onChange, wrapperClassName, className, ...rest }, ref) => {
    const fieldId = id ?? name
    const errorId = `${fieldId}-error`
    const helpId = `${fieldId}-help`
    const mask = MASKERS[kind]
    const display = typeof value === 'string' && value.length > 0 ? mask(value) : ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, MAX_LEN[kind])
      onChange?.({ target: { value: raw } } as React.ChangeEvent<HTMLInputElement>)
    }

    return (
      <div className={wrapperClassName}>
        <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          id={fieldId}
          name={name}
          type="text"
          autoComplete="off"
          aria-required={required || undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={[error ? errorId : null, helpText ? helpId : null].filter(Boolean).join(' ') || undefined}
          value={display}
          onChange={handleChange}
          placeholder={PATTERNS[kind]}
          className={`w-full rounded border px-3 py-2 text-sm font-mono uppercase tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className ?? ''}`}
          {...rest}
        />
        {helpText && <p id={helpId} className="mt-1 text-sm text-gray-500">{helpText}</p>}
        {error && <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)
MaskedInput.displayName = 'MaskedInput'

export default MaskedInput
