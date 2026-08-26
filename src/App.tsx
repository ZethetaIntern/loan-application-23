import { useForm, FormProvider } from 'react-hook-form';
import type { ApplicationData } from './types/application';
import { WizardProvider, useWizard } from './context/WizardContext';
import { STEP_DEFINITIONS } from './schemas/stepRegistry';
import { ProgressBar, Logo } from './components/common';
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

function SuccessScreen({ reference }: { reference: string }) {
  return (
    <div className="animate-rise-in mx-auto max-w-lg py-10 text-center">
      <div className="animate-pop-check mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="#0b6b4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="font-display text-2xl font-bold text-ink">Application Submitted</h2>
      <p className="mt-2 text-sm text-mist">
        Thank you — your application is complete. Our team will review it and reach out within 2 business days.
      </p>
      <div className="mt-6 rounded-xl border border-line bg-white px-4 py-3">
        <p className="text-xs font-medium tracking-wide text-mist uppercase">Reference number</p>
        <span className="mt-1 block font-mono text-sm font-semibold break-all text-primary">{reference}</span>
      </div>
      <p className="mt-6 text-xs text-mist">
        A confirmation has been sent to your email address. Keep your reference number for any follow-up.
      </p>
    </div>
  );
}

function WizardShell() {
  const {
    visibleSteps, stepIndex, data, validationError, next, setStep, submit, submittedRef,
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
    const isLastStep = stepIndex === visibleSteps.length - 1;
    if (isLastStep) {
      let valid = true;
      try {
        currentStep.schemaFactory(data).parse(stepSlice);
      } catch {
        valid = false;
      }
      if (valid) {
        submit(crypto.randomUUID());
      } else {
        next(stepSlice);
      }
      return;
    }
    const passed = next(stepSlice);
    if (!passed) {
      const err = validationError;
      if (err) methods.setError('root', { message: err.message });
    }
  };

  if (submittedRef) {
    return (
      <div className="app-backdrop flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 pt-6">
          <Logo />
          <div>
            <p className="font-display text-base leading-tight font-bold text-ink">LendSwift</p>
            <p className="text-xs text-mist">Loan application</p>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <SuccessScreen reference={submittedRef} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-backdrop flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="font-display text-base leading-tight font-bold text-ink">LendSwift</p>
            <p className="text-xs text-mist">Loan application</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs font-medium text-mist">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-primary">
            <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          256-bit encrypted
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="shadow-card rounded-3xl border border-line/80 bg-white p-6 sm:p-8">
          <ProgressBar steps={visibleSteps} currentIndex={stepIndex} />

          <div className="mt-8 rounded-2xl border-line/60 bg-gradient-to-b from-primary-soft/40 to-transparent p-px">
            <div className="rounded-2xl bg-white p-5 sm:p-6">
              {currentStep && (
                <h1 className="font-display mb-5 text-lg font-semibold text-ink">{currentStep.title}</h1>
              )}

              {StepComponent && (
                <FormProvider {...methods}>
                  <form
                    key={currentStep.key}
                    className="animate-step-enter"
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                    noValidate
                  >
                    <StepComponent />

                    {validationError && (
                      <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
                        <span aria-hidden="true">⚠</span>
                        <span>{validationError.message}</span>
                      </div>
                    )}

                    <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                      <button
                        type="button"
                        onClick={() => setStep(stepIndex - 1)}
                        disabled={stepIndex === 0}
                        className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-200 hover:border-mist/60 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ← Previous
                      </button>
                      <button
                        type="submit"
                        className="from-primary to-primary-deep shadow-primary/25 rounded-full bg-gradient-to-r px-7 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
                      >
                        {stepIndex === visibleSteps.length - 1 ? 'Submit Application' : 'Save & Continue →'}
                      </button>
                    </div>
                  </form>
                </FormProvider>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 pb-6">
        <p className="text-center text-xs text-mist">
          Your data is encrypted (AES-256-GCM) and stored locally. LendSwift is a demo application — no data leaves your browser.
        </p>
      </footer>
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
