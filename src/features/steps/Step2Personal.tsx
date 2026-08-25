import { useFormContext } from 'react-hook-form'
import { useState } from 'react'
import type { ApplicationData } from '../../types/application'
import { RadioGroup, Select, Input } from '../../components/common'

type Step2 = ApplicationData['personal']

export function Step2Personal() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<Step2>()
  const [emailOtp, setEmailOtp] = useState('')
  const [mobileOtp, setMobileOtp] = useState('')
  const emailVerified = watch('emailVerified')
  const mobileOtpVerified = watch('mobileOtpVerified')

  const verifyEmail = () => {
    if (emailOtp === '123456') setValue('emailVerified', true, { shouldValidate: true })
  }
  const verifyMobile = () => {
    if (mobileOtp === '123456') setValue('mobileOtpVerified', true, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <Input.Field {...register('fullName')} label="Full Name" required error={errors.fullName?.message} autoComplete="given-name" />

      <Input.Field
        {...register('dateOfBirth')}
        label="Date of Birth"
        type="date"
        required
        error={errors.dateOfBirth?.message}
        autoComplete="bday"
        max={new Date().toISOString().split('T')[0]}
      />

      <RadioGroup
        name="gender"
        label="Gender"
        required
        value={watch('gender')}
        onChange={(v) => setValue('gender', v as Step2['gender'])}
        orientation="horizontal"
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
        ]}
      />

      <Select
        name="maritalStatus"
        label="Marital Status"
        required
        value={watch('maritalStatus')}
        onChange={(e) => setValue('maritalStatus', e.target.value as Step2['maritalStatus'])}
        options={[
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
        ]}
        error={errors.maritalStatus?.message}
      />

      <Input.Field {...register('fatherName')} label="Father's Name" required error={errors.fatherName?.message} />
      <Input.Field {...register('motherName')} label="Mother's Name" required error={errors.motherName?.message} />

      <div>
        <Input.Field {...register('email')} label="Email Address" type="email" required error={errors.email?.message} autoComplete="email" />
        {!emailVerified ? (
          <div className="mt-2 flex gap-2">
            <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} placeholder="Enter OTP" className="w-32 rounded border border-gray-300 px-2 py-1 text-sm" />
            <button type="button" onClick={verifyEmail} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">Verify</button>
          </div>
        ) : (
          <span className="mt-1 inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">✓ Verified</span>
        )}
        {errors.emailVerified && <p role="alert" className="mt-1 text-sm text-red-600">{errors.emailVerified.message}</p>}
      </div>

      <div>
        <Input.Field {...register('mobile')} label="Mobile Number" type="tel" required error={errors.mobile?.message} autoComplete="tel" placeholder="9876543210" />
        {!mobileOtpVerified ? (
          <div className="mt-2 flex gap-2">
            <input type="text" value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value)} placeholder="Enter OTP" className="w-32 rounded border border-gray-300 px-2 py-1 text-sm" />
            <button type="button" onClick={verifyMobile} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">Verify</button>
          </div>
        ) : (
          <span className="mt-1 inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">✓ Verified</span>
        )}
        {errors.mobileOtpVerified && <p role="alert" className="mt-1 text-sm text-red-600">{errors.mobileOtpVerified.message}</p>}
      </div>

      <Input.Field {...register('alternateMobile')} label="Alternate Mobile (optional)" type="tel" error={errors.alternateMobile?.message} autoComplete="tel" />
    </div>
  )
}
