import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import type { ApplicationData } from '../../types/application';
import { Select, Input, Checkbox } from '../../components/common';
import CurrencyInput from '../../components/common/CurrencyInput';
import { usePinCodeLookup } from '../../services/pincode';

type Step4 = ApplicationData['address']

export function Step4Address() {
  const {
    register, watch, setValue, formState: { errors },
  } = useFormContext<Step4>();
  const currentPin = watch('current.pinCode');
  const pinLookup = usePinCodeLookup(currentPin);
  const sameAsPermanent = watch('sameAsPermanent');
  const residenceType = watch('current.residenceType');
  const yearsAtAddress = watch('current.yearsAtAddress');
  const [showPrevious, setShowPrevious] = useState(false);

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-gray-900">Current Address</legend>

        <Input.Field {...register('current.line1')} label="Address Line 1" required error={errors.current?.line1?.message} autoComplete="address-line1" />
        <Input.Field {...register('current.line2')} label="Address Line 2" error={errors.current?.line2?.message} autoComplete="address-line2" />

        <div>
          <Input.Field
            {...register('current.pinCode')}
            label="PIN Code"
            required
            inputMode="numeric"
            maxLength={6}
            autoComplete="postal-code"
            error={errors.current?.pinCode?.message}
            helpText={pinLookup?.found ? `${pinLookup.city}, ${pinLookup.state} — ${pinLookup.postOffice}` : undefined}
          />
          <input type="hidden" {...register('current.city')} value={pinLookup?.city ?? watch('current.city')} />
          <input type="hidden" {...register('current.state')} value={pinLookup?.state ?? watch('current.state')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input.Field {...register('current.city')} label="City" required error={errors.current?.city?.message} />
          <Input.Field {...register('current.state')} label="State" required error={errors.current?.state?.message} />
        </div>

        <Select
          {...register('current.residenceType')}
          name="current.residenceType"
          label="Residence Type"
          required
          value={residenceType}
          onChange={(e) => setValue('current.residenceType', e.target.value as Step4['current']['residenceType'])}
          options={[
            { value: 'owned', label: 'Owned' },
            { value: 'rented', label: 'Rented' },
            { value: 'company_provided', label: 'Company Provided' },
            { value: 'family', label: 'Family Owned' },
          ]}
          error={errors.current?.residenceType?.message}
        />

        {residenceType === 'rented' && (
          <CurrencyInput
            name="current.monthlyRent"
            label="Monthly Rent"
            required
            value={watch('current.monthlyRent') ?? 0}
            onChange={(v) => setValue('current.monthlyRent', v, { shouldValidate: true })}
            error={errors.current?.monthlyRent?.message}
          />
        )}

        <Input.Field
          {...register('current.yearsAtAddress', { valueAsNumber: true })}
          label="Years at Current Address"
          type="number"
          min={0}
          max={50}
          required
          error={errors.current?.yearsAtAddress?.message}
        />

        {Number.isFinite(yearsAtAddress) && yearsAtAddress < 1 && (
          <Checkbox
            name="showPrevious"
            label="I need to provide a previous address"
            checked={showPrevious}
            onChange={(e) => setShowPrevious(e.target.checked)}
          />
        )}
      </fieldset>

      {showPrevious && (
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-gray-900">Previous Address</legend>
          <Input.Field {...register('previous.line1')} label="Address Line 1" required error={errors.previous?.line1?.message} />
          <Input.Field {...register('previous.pinCode')} label="PIN Code" required maxLength={6} inputMode="numeric" error={errors.previous?.pinCode?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input.Field {...register('previous.city')} label="City" required error={errors.previous?.city?.message} />
            <Input.Field {...register('previous.state')} label="State" required error={errors.previous?.state?.message} />
          </div>
        </fieldset>
      )}

      <Checkbox
        {...register('sameAsPermanent')}
        name="sameAsPermanent"
        label="Permanent address is the same as current address"
        checked={sameAsPermanent}
        onChange={(e) => setValue('sameAsPermanent', e.target.checked)}
      />

      {!sameAsPermanent && (
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-gray-900">Permanent Address</legend>
          <Input.Field {...register('permanent.line1')} label="Address Line 1" required error={errors.permanent?.line1?.message} />
          <Input.Field {...register('permanent.pinCode')} label="PIN Code" required maxLength={6} inputMode="numeric" error={errors.permanent?.pinCode?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input.Field {...register('permanent.city')} label="City" required error={errors.permanent?.city?.message} />
            <Input.Field {...register('permanent.state')} label="State" required error={errors.permanent?.state?.message} />
          </div>
        </fieldset>
      )}
    </div>
  );
}
