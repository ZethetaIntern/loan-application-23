import { useFormContext } from 'react-hook-form'
import type { ApplicationData } from '../../types/application'
import Checkbox from '../../components/common/Checkbox'
import { useWizard } from '../../context/WizardContext'
import { formatRupees } from '../../utils/formatters'
import { breakdownFor } from '../../services/emicalculator'

type Step8 = ApplicationData['consents']

export function Step8Consents() {
  const { register, formState: { errors } } = useFormContext<Step8>()
  const { data } = useWizard()
  const { step1, personal, kyc, employment } = data

  const breakdown = step1.amount > 0 && step1.tenureMonths > 0
    ? breakdownFor(step1.loanType, step1.amount, step1.tenureMonths)
    : null

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-base font-semibold text-gray-900">Application Summary</h3>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <dl className="grid grid-cols-2 gap-y-2">
            <dt className="text-gray-500">Loan Type</dt>
            <dd className="font-medium capitalize">{step1.loanType}</dd>
            <dt className="text-gray-500">Amount</dt>
            <dd className="font-medium">{formatRupees(step1.amount)}</dd>
            <dt className="text-gray-500">Tenure</dt>
            <dd className="font-medium">{step1.tenureMonths} months</dd>
            <dt className="text-gray-500">Purpose</dt>
            <dd className="font-medium">{step1.loanPurpose}</dd>
            <dt className="text-gray-500">Applicant</dt>
            <dd className="font-medium">{personal.fullName}</dd>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium">{personal.email}</dd>
            <dt className="text-gray-500">Mobile</dt>
            <dd className="font-medium">{personal.mobile}</dd>
            <dt className="text-gray-500">PAN</dt>
            <dd className="font-medium">{kyc.pan}</dd>
            <dt className="text-gray-500">Employment</dt>
            <dd className="font-medium capitalize">{employment.employmentType?.replace('_', ' ')}</dd>
          </dl>
          {breakdown && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="mb-2 font-medium text-gray-700">EMI Breakdown</h4>
              <dl className="grid grid-cols-2 gap-y-1">
                <dt className="text-gray-500">Monthly EMI</dt>
                <dd className="font-medium">{formatRupees(breakdown.emi)}</dd>
                <dt className="text-gray-500">Total Interest</dt>
                <dd className="font-medium">{formatRupees(breakdown.totalCostOfBorrowing)}</dd>
                <dt className="text-gray-500">Total Payable</dt>
                <dd className="font-medium">{formatRupees(step1.amount + breakdown.totalCostOfBorrowing)}</dd>
                <dt className="text-gray-500">Processing Fee</dt>
                <dd className="font-medium">{formatRupees(breakdown.processingFee)}</dd>
              </dl>
            </div>
          )}
        </div>
      </section>

      {data.documents.signatureDataUrl && (
        <section>
          <h3 className="mb-2 text-sm font-medium text-gray-700">E-Signature</h3>
          <img src={data.documents.signatureDataUrl} alt="Your signature" className="h-16 border border-gray-200 bg-white p-1" />
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-gray-900">Mandatory Consents</h3>
        <Checkbox
          {...register('accuracy')}
          name="accuracy"
          label="I declare that all information provided in this application is true, complete, and correct to the best of my knowledge."
          error={errors.accuracy?.message}
        />
        <Checkbox
          {...register('creditCheck')}
          name="creditCheck"
          label="I authorise LendSwift and its partner NBFCs to access my credit information from CIBIL/Experian/Equifax for the purpose of this loan application."
          error={errors.creditCheck?.message}
        />
        <Checkbox
          {...register('terms')}
          name="terms"
          label="I have read and agree to the Terms and Conditions, Privacy Policy, and Fair Practices Code of LendSwift."
          error={errors.terms?.message}
        />
        <Checkbox
          {...register('communications')}
          name="communications"
          label="I consent to receive communications (SMS, email, WhatsApp) related to this application."
          error={errors.communications?.message}
        />
      </section>
    </div>
  )
}
