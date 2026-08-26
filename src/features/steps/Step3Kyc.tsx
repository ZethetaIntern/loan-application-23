import { useFormContext } from 'react-hook-form';
import type { ApplicationData } from '../../types/application';
import MaskedInput from '../../components/common/MaskedInput';
import Checkbox from '../../components/common/Checkbox';
import { useWizard } from '../../context/WizardContext';

type Step3 = ApplicationData['kyc']

export function Step3Kyc() {
  const {
    register, watch, setValue, formState: { errors },
  } = useFormContext<Step3>();
  const { data } = useWizard();
  const { loanType } = data.step1;
  const panStatus = watch('panStatus');
  const aadhaarStatus = watch('aadhaarStatus');

  const verifyPan = async () => {
    setValue('panStatus', 'verifying');
    const { verifyPan: api } = await import('../../services/kyc');
    const result = await api(watch('pan'), loanType);
    setValue('panStatus', result.status);
  };

  const verifyAadhaar = async () => {
    setValue('aadhaarStatus', 'verifying');
    const { verifyAadhaar: api } = await import('../../services/kyc');
    const result = await api(watch('aadhaar'));
    setValue('aadhaarStatus', result.status);
  };

  return (
    <div className="space-y-6">
      <div>
        <MaskedInput name="pan" value={watch('pan') ?? ''} onChange={(e) => setValue('pan', e.target.value, { shouldValidate: true })} label="PAN Number" required kind="pan" error={errors.pan?.message} helpText="Format: AAAAA9999A" />
        <div className="mt-2 flex items-center gap-2">
          <button type="button" onClick={verifyPan} disabled={panStatus === 'verifying' || !watch('pan')} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
            {panStatus === 'verifying' ? 'Verifying…' : 'Verify PAN'}
          </button>
          {panStatus === 'verified' && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">✓ Verified</span>}
          {panStatus === 'rejected' && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">✗ Rejected — please re-enter</span>}
        </div>
        {errors.panStatus && <p role="alert" className="mt-1 text-sm text-red-600">{errors.panStatus.message}</p>}
      </div>

      <div>
        <MaskedInput name="aadhaar" value={watch('aadhaar') ?? ''} onChange={(e) => setValue('aadhaar', e.target.value, { shouldValidate: true })} label="Aadhaar Number" required kind="aadhaar" error={errors.aadhaar?.message} helpText="12 digits" />
        <div className="mt-2 flex items-center gap-2">
          <button type="button" onClick={verifyAadhaar} disabled={aadhaarStatus === 'verifying' || !watch('aadhaar')} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
            {aadhaarStatus === 'verifying' ? 'Verifying…' : 'Verify Aadhaar'}
          </button>
          {aadhaarStatus === 'verified' && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">✓ Verified</span>}
          {aadhaarStatus === 'rejected' && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">✗ Rejected</span>}
        </div>
        {errors.aadhaarStatus && <p role="alert" className="mt-1 text-sm text-red-600">{errors.aadhaarStatus.message}</p>}
      </div>

      <Checkbox
        {...register('aadhaarConsent')}
        name="aadhaarConsent"
        label="I authorise LendSwift to verify my Aadhaar details with UIDAI for KYC purposes."
        error={errors.aadhaarConsent?.message}
      />

      <MaskedInput {...register('voterId')} name="voterId" label="Voter ID (optional)" kind="aadhaar" helpText="Optional — 3 letters + 7 digits" />
    </div>
  );
}
