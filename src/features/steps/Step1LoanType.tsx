import { useFormContext } from 'react-hook-form';
import type { ApplicationData } from '../../types/application';
import { RadioGroup, Select, Input } from '../../components/common';
import CurrencyInput from '../../components/common/CurrencyInput';
import { ANNUAL_RATES, LOAN_PURPOSES } from '../../utils/constants';
import { breakdownFor } from '../../services/emicalculator';

type Step1 = ApplicationData['step1']

const TENURE_OPTIONS: Record<Step1['loanType'], Array<{ value: string; label: string }>> = {
  personal: Array.from({ length: 5 }, (_, i) => ({ value: String(12 + i * 12), label: `${12 + i * 12} months` })),
  home: Array.from({ length: 26 }, (_, i) => ({ value: String(60 + i * 12), label: `${(60 + i * 12) / 12} years` })),
  business: Array.from({ length: 11 }, (_, i) => ({ value: String(12 + i * 12), label: `${12 + i * 12} months` })),
};

export function Step1LoanType() {
  const { watch, setValue, formState: { errors } } = useFormContext<Step1>();
  const loanType = watch('loanType');
  const amount = watch('amount');
  const tenureMonths = watch('tenureMonths');

  const breakdown = amount > 0 && tenureMonths > 0
    ? breakdownFor(loanType, amount, tenureMonths)
    : null;

  return (
    <div className="space-y-6">
      <RadioGroup
        name="loanType"
        label="Loan Type"
        required
        value={loanType}
        onChange={(v) => {
          setValue('loanType', v as Step1['loanType'], { shouldValidate: true });
          setValue('loanPurpose', '', { shouldValidate: true });
        }}
        orientation="horizontal"
        options={[
          { value: 'personal', label: 'Personal', description: `Rate: ${(ANNUAL_RATES.personal * 100).toFixed(1)}%` },
          { value: 'home', label: 'Home', description: `Rate: ${(ANNUAL_RATES.home * 100).toFixed(1)}%` },
          { value: 'business', label: 'Business', description: `Rate: ${(ANNUAL_RATES.business * 100).toFixed(1)}%` },
        ]}
        error={errors.loanType?.message}
      />

      <CurrencyInput
        name="amount"
        label="Loan Amount"
        required
        value={amount}
        onChange={(v) => setValue('amount', v, { shouldValidate: true })}
        error={errors.amount?.message}
        helpText="Min ₹50,000"
      />

      <Select
        name="tenureMonths"
        label="Loan Tenure"
        required
        value={tenureMonths ? String(tenureMonths) : ''}
        onChange={(e) => setValue('tenureMonths', Number(e.target.value), { shouldValidate: true })}
        options={TENURE_OPTIONS[loanType] ?? []}
        placeholder="Select tenure"
        error={errors.tenureMonths?.message}
      />

      <Select
        name="loanPurpose"
        label="Loan Purpose"
        required
        value={watch('loanPurpose')}
        onChange={(e) => setValue('loanPurpose', e.target.value, { shouldValidate: true })}
        options={LOAN_PURPOSES}
        placeholder="Select purpose"
        error={errors.loanPurpose?.message}
      />

      <Input.Field
        name="referralCode"
        label="Referral Code (optional)"
        value={watch('referralCode') ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('referralCode', e.target.value)}
        error={errors.referralCode?.message}
      />

      {breakdown && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <h4 className="mb-2 font-medium text-gray-700">EMI Breakdown</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>Monthly EMI</div>
            <div className="font-medium">
              ₹
              {breakdown.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div>Total Interest</div>
            <div className="font-medium">
              ₹
              {breakdown.totalCostOfBorrowing.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div>Total Payable</div>
            <div className="font-medium">
              ₹
              {(amount + breakdown.totalCostOfBorrowing).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div>Processing Fee</div>
            <div className="font-medium">
              ₹
              {breakdown.processingFee.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
