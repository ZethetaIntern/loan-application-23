import { useFormContext } from 'react-hook-form';
import type { ApplicationData } from '../../types/application';
import { RadioGroup, Input } from '../../components/common';
import CurrencyInput from '../../components/common/CurrencyInput';
import { EMPLOYMENT_ALLOWED_BY_LOAN_TYPE } from '../../utils/constants';

type Step5 = ApplicationData['employment']

export function Step5Employment() {
  type Step5FormValues = Step5 & {
    companyName?: string; designation?: string; monthlySalary?: number;
    businessName?: string; businessType?: string; annualTurnover?: number;
    monthlyBusinessIncome?: number; yearsInBusiness?: number;
    gstNumber?: string; officeAddress?: string;
  };
  const {
    register, watch, setValue, formState: { errors },
  } = useFormContext<Step5FormValues>();
  const employmentType = watch('employmentType');
  const formValues = useFormContext().getValues() as unknown as ApplicationData;
  const loanType = formValues.step1?.loanType ?? 'personal';
  const allowed = EMPLOYMENT_ALLOWED_BY_LOAN_TYPE[loanType] ?? [];

  return (
    <div className="space-y-6">
      <RadioGroup
        name="employmentType"
        label="Employment Type"
        required
        value={employmentType}
        onChange={(v) => setValue('employmentType', v as Step5['employmentType'])}
        orientation="vertical"
        options={allowed.map((e) => ({
          value: e,
          label: e === 'salaried' ? 'Salaried' : e === 'self_employed' ? 'Self-Employed' : 'Business Owner',
        }))}
        error={errors.employmentType?.message}
      />

      <Input.Field
        {...register('yearsExperience', { valueAsNumber: true })}
        label="Years of Experience"
        type="number"
        min={0}
        max={50}
        required
        error={errors.yearsExperience?.message}
      />

      {employmentType === 'salaried' && (
        <div className="space-y-4">
          <Input.Field {...register('companyName')} label="Company Name" required error={(errors as Record<string, { message?: string }>).companyName?.message} />
          <Input.Field {...register('designation')} label="Designation" required error={(errors as Record<string, { message?: string }>).designation?.message} />
          <CurrencyInput
            name="monthlySalary"
            label="Monthly Net Salary"
            required
            value={watch('monthlySalary') ?? 0}
            onChange={(v) => setValue('monthlySalary', v, { shouldValidate: true })}
            error={(errors as Record<string, { message?: string }>).monthlySalary?.message}
          />
        </div>
      )}

      {(employmentType === 'self_employed' || employmentType === 'business_owner') && (
        <div className="space-y-4">
          <Input.Field {...register('businessName')} label="Business Name" required error={(errors as Record<string, { message?: string }>).businessName?.message} />
          <Input.Field {...register('businessType')} label="Business Type" required error={(errors as Record<string, { message?: string }>).businessType?.message} />
          <CurrencyInput
            name="annualTurnover"
            label="Annual Turnover"
            required
            value={watch('annualTurnover') ?? 0}
            onChange={(v) => setValue('annualTurnover', v, { shouldValidate: true })}
            error={(errors as Record<string, { message?: string }>).annualTurnover?.message}
          />
          <CurrencyInput
            name="monthlyBusinessIncome"
            label="Monthly Business Income"
            required
            value={watch('monthlyBusinessIncome') ?? 0}
            onChange={(v) => setValue('monthlyBusinessIncome', v, { shouldValidate: true })}
            error={(errors as Record<string, { message?: string }>).monthlyBusinessIncome?.message}
          />
          <Input.Field {...register('yearsInBusiness', { valueAsNumber: true })} label="Years in Business" type="number" min={0} required error={(errors as Record<string, { message?: string }>).yearsInBusiness?.message} />
          {employmentType === 'business_owner' && (
            <Input.Field {...register('gstNumber')} label="GSTIN" required maxLength={15} helpText="15-character GST Identification Number" error={(errors as Record<string, { message?: string }>).gstNumber?.message} />
          )}
          <Input.Field {...register('officeAddress')} label="Office / Business Address" required error={(errors as Record<string, { message?: string }>).officeAddress?.message} />
        </div>
      )}
    </div>
  );
}
