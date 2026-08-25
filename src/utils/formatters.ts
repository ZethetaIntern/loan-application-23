const inrFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

export function formatInr(amount: number): string {
  return inrFormatter.format(Math.round(amount))
}

export function formatRupees(amount: number): string {
  return `₹${formatInr(amount)}`
}

const digitOnly = /^\d*$/

export function formatAmountInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
  if (!digitOnly.test(digits) || digits === '') return ''
  return inrFormatter.format(Number(digits))
}

export function parseAmountInput(formatted: string): number {
  const digits = formatted.replace(/[^0-9]/g, '')
  return digits === '' ? Number.NaN : Number(digits)
}

export function formatTenure(months: number): string {
  if (months < 12) return `${months} months`
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (rest === 0) return `${years} yr`
  return `${years} yr ${rest} mo`
}
