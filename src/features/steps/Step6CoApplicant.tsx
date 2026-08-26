import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import type { ApplicationData } from '../../types/application';
import { Select, Input } from '../../components/common';
import CurrencyInput from '../../components/common/CurrencyInput';
import Checkbox from '../../components/common/Checkbox';
import MaskedInput from '../../components/common/MaskedInput';
import { useWizard } from '../../context/WizardContext';

type Step6 = ApplicationData['coApplicant']

export function Step6CoApplicant() {
  const {
    register, watch, setValue, formState: { errors },
  } = useFormContext<Step6>();
  const { data } = useWizard();
  const panStatus = watch('panStatus');

  useEffect(() => {
    if (!data.coApplicant.pan) {
      setValue('pan', '');
      setValue('panStatus', 'idle');
    }
  }, [data.coApplicant.pan, setValue]);

  const verifyPan = async () => {
    setValue('panStatus', 'verifying');
    const { verifyPan: api } = await import('../../services/kyc');
    const result = await api(watch('pan') ?? '', data.step1.loanType);
    setValue('panStatus', result.status);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-mist">
        A co-applicant is required for home loans and loans above ₹5L (personal) / ₹20L (business).
      </p>

      <Input.Field {...register('name')} label="Co-Applicant Full Name" required error={errors.name?.message} />

      <Select
        {...register('relationship')}
        name="relationship"
        label="Relationship"
        required
        value={watch('relationship') ?? ''}
        onChange={(e) => setValue('relationship', e.target.value as Step6['relationship'])}
        options={[
          { value: 'spouse', label: 'Spouse' },
          { value: 'parent', label: 'Parent' },
          { value: 'sibling', label: 'Sibling' },
          { value: 'business_partner', label: 'Business Partner' },
        ]}
        error={errors.relationship?.message}
      />

      <div>
        <MaskedInput name="pan" value={watch('pan') ?? ''} onChange={(e) => setValue('pan', e.target.value, { shouldValidate: true })} label="PAN Number" required kind="pan" error={errors.pan?.message} />
        <div className="mt-2 flex items-center gap-2">
          <button type="button" onClick={verifyPan} disabled={panStatus === 'verifying' || !watch('pan')} className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-deep disabled:opacity-50 active:scale-[0.98]">
            {panStatus === 'verifying' ? 'Verifying…' : 'Verify PAN'}
          </button>
          {panStatus === 'verified' && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">✓ Verified</span>}
          {panStatus === 'rejected' && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">✗ Rejected</span>}
        </div>
        {errors.panStatus && <p role="alert" className="mt-1 text-sm text-red-600">{errors.panStatus.message}</p>}
      </div>

      <CurrencyInput
        name="monthlyIncome"
        label="Co-Applicant Monthly Income"
        required
        value={watch('monthlyIncome') ?? 0}
        onChange={(v) => setValue('monthlyIncome', v, { shouldValidate: true })}
        error={errors.monthlyIncome?.message}
      />

      <Checkbox
        {...register('consent')}
        name="consent"
        label="I, the co-applicant, consent to this loan application and authorise LendSwift to verify my details."
        error={errors.consent?.message}
      />
    </div>
  );
}
