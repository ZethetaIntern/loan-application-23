import { useForm, FormProvider } from 'react-hook-form';
import type { ApplicationData } from './types/application';
import { WizardProvider, useWizard } from './context/WizardContext';
import { STEP_DEFINITIONS } from './schemas/stepRegistry';
import { ProgressBar } from './components/common';
import { Step1LoanType } from './features/steps/Step1LoanType';
import { Step2Personal } from './features/steps/Step2Personal';
import { Step3Kyc } from './features/steps/Step3Kyc';
import { Step4Address } from './features/steps/Step4Address';
import { Step5Employment } from './features/steps/Step5Employment';
import { Step6CoApplicant } from './features/steps/Step6CoApplicant';
import { Step7Documents } from './features/steps/Step7Documents';
import { Step8Consents } from './features/steps/Step8Consents';

const STEP_COMPONENTS: Record<string, React.FC> = {
  step1: Step1LoanType,
  personal: Step2Personal,
  kyc: Step3Kyc,
  address: Step4Address,
  employment: Step5Employment,
  coApplicant: Step6CoApplicant,
  documents: Step7Documents,
  consents: Step8Consents,
};

function WizardShell() {
  const {
    visibleSteps, stepIndex, data, validationError, next, setStep, submittedRef,
  } = useWizard();
  const currentStep = visibleSteps[stepIndex];

  const methods = useForm<ApplicationData>({
    defaultValues: data,
    mode: 'onTouched',
  });

  const StepComponent = currentStep ? STEP_COMPONENTS[currentStep.key] : null;

  const handleSubmit = () => {
    if (!currentStep) return;
    const allValues = methods.getValues();
    const all = allValues as unknown as Record<string, unknown>;
    const stepKey = currentStep.key;
    const stepKeys = visibleSteps.map((s) => s.key);
    const isEmptyObject = (v: unknown): boolean => !!v && typeof v === 'object' && !Array.isArray(v)
      && Object.values(v as Record<string, unknown>).every(
        (x) => x === '' || x === null || x === undefined || (typeof x === 'object' && isEmptyObject(x)),
      );
    const stepSlice = Object.fromEntries(
      Object.entries(all).filter(([key, value]) => {
        const isStepKey = stepKeys.includes(key);
        const isOverwrittenField = key === stepKey && (Array.isArray(value) || value === null || typeof value !== 'object');
        if (isStepKey && !isOverwrittenField) return false;
        if (isEmptyObject(value)) return false;
        return true;
      }),
    );
    const passed = next(stepSlice);
    if (!passed) {
      const err = validationError;
      if (err) methods.setError('root', { message: err.message });
    }
  };

  if (submittedRef) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Application Submitted</h2>
        <p className="text-gray-600">
          Reference:
          <span className="font-mono">{submittedRef}</span>
        </p>
        <p className="mt-4 text-sm text-gray-500">You will receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">LendSwift Loan Application</h1>

      <ProgressBar steps={visibleSteps} currentIndex={stepIndex} />

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {currentStep && (
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{currentStep.title}</h2>
        )}

        {StepComponent && (
          <FormProvider {...methods}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <StepComponent />

              {validationError && (
                <div role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {validationError.message}
                </div>
              )}

              <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(stepIndex - 1)}
                  disabled={stepIndex === 0}
                  className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {stepIndex === visibleSteps.length - 1 ? 'Submit Application' : 'Save & Next'}
                </button>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WizardProvider steps={STEP_DEFINITIONS}>
      <WizardShell />
    </WizardProvider>
  );
}
