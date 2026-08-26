import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import type { ApplicationData } from '../../types/application';
import { RadioGroup, Select, Input } from '../../components/common';

type Step2 = ApplicationData['personal']

export function Step2Personal() {
  const {
    register, watch, setValue, formState: { errors },
  } = useFormContext<Step2>();
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailOtpError, setEmailOtpError] = useState('');
  const [mobileOtpError, setMobileOtpError] = useState('');
  const emailVerified = watch('emailVerified');
  const mobileOtpVerified = watch('mobileOtpVerified');

  const verifyEmail = () => {
    if (emailOtp === '123456') {
      setValue('emailVerified', true, { shouldValidate: true });
      setEmailOtpError('');
    } else {
      setEmailOtpError('Invalid OTP. For this demo, use 123456.');
    }
  };
  const verifyMobile = () => {
    if (mobileOtp === '123456') {
      setValue('mobileOtpVerified', true, { shouldValidate: true });
      setMobileOtpError('');
    } else {
      setMobileOtpError('Invalid OTP. For this demo, use 123456.');
    }
  };

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
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} placeholder="Enter OTP" maxLength={6} className="w-32 rounded-xl border border-line bg-white px-3 py-2 text-sm font-mono tracking-widest text-ink placeholder:font-sans placeholder:tracking-normal placeholder:text-mist/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" />
              <button type="button" onClick={verifyEmail} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-deep active:scale-[0.98]">Verify</button>
            </div>
            <p className="mt-1.5 text-xs text-mist">Demo OTP: 123456</p>
            {emailOtpError && <p role="alert" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600"><span aria-hidden="true">⚠</span><span>{emailOtpError}</span></p>}
          </div>
        ) : (
          <span className="mt-1.5 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">✓ Verified</span>
        )}
        {errors.emailVerified && <p role="alert" className="mt-1 text-sm text-red-600">{errors.emailVerified.message}</p>}
      </div>

      <div>
        <Input.Field {...register('mobile')} label="Mobile Number" type="tel" required error={errors.mobile?.message} autoComplete="tel" placeholder="9876543210" />
        {!mobileOtpVerified ? (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <input type="text" value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value)} placeholder="Enter OTP" maxLength={6} className="w-32 rounded-xl border border-line bg-white px-3 py-2 text-sm font-mono tracking-widest text-ink placeholder:font-sans placeholder:tracking-normal placeholder:text-mist/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" />
              <button type="button" onClick={verifyMobile} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-deep active:scale-[0.98]">Verify</button>
            </div>
            <p className="mt-1.5 text-xs text-mist">Demo OTP: 123456</p>
            {mobileOtpError && <p role="alert" className="mt-1.5 flex items-start gap-1 text-xs font-medium text-red-600"><span aria-hidden="true">⚠</span><span>{mobileOtpError}</span></p>}
          </div>
        ) : (
          <span className="mt-1.5 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">✓ Verified</span>
        )}
        {errors.mobileOtpVerified && <p role="alert" className="mt-1 text-sm text-red-600">{errors.mobileOtpVerified.message}</p>}
      </div>

      <Input.Field {...register('alternateMobile')} label="Alternate Mobile (optional)" type="tel" error={errors.alternateMobile?.message} autoComplete="tel" />
    </div>
  );
}
