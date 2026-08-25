import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { ZodError } from 'zod'
import type { ApplicationData } from '../types/application'
import { isCoApplicantRequired } from '../schemas/crossstep'
import { clearDraft, loadDraft } from '../services/draftstorage'

export interface StepDefinition {
  key: string
  title: string
  schemaFactory: (application: ApplicationData) => { parse: (data: unknown) => unknown }
}

export interface WizardState {
  visibleSteps: StepDefinition[]
  stepIndex: number
  data: ApplicationData
  validationError?: { stepKey: string; message: string }
  submittedRef?: string
  draftTimestamp?: string
  isDraftLoaded: boolean
}

export interface WizardContextValue extends WizardState {
  patch: (key: string, partial: Record<string, unknown>) => void
  next: () => boolean
  setStep: (index: number) => void
  submit: (referenceNumber: string) => void
  startFresh: () => void
}

const DEFAULT_DATA: ApplicationData = {
  step1: { loanType: 'personal', amount: 0, tenureMonths: 0, loanPurpose: '' },
  personal: {
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    maritalStatus: 'single',
    fatherName: '',
    motherName: '',
    email: '',
    emailVerified: false,
    mobile: '',
    mobileOtpVerified: false,
  },
  kyc: { pan: '', panStatus: 'idle', aadhaar: '', aadhaarStatus: 'idle', aadhaarConsent: false },
  address: {
    current: { line1: '', pinCode: '', city: '', state: '', residenceType: 'owned', yearsAtAddress: 0 },
    sameAsPermanent: true,
  },
  employment: { employmentType: 'salaried', yearsExperience: 0 },
  coApplicant: {},
  documents: { documents: [] },
  consents: { accuracy: false, creditCheck: false, terms: false, communications: false },
}

export const WizardContext = createContext<WizardContextValue | null>(null)

function computeVisible(steps: StepDefinition[], loanType: string, amount: number): StepDefinition[] {
  const showCoApp = isCoApplicantRequired({ loanType: loanType as ApplicationData['step1']['loanType'], amount })
  return steps.filter((step) => step.key !== 'coApplicant' || showCoApp)
}

export const WizardProvider = ({
  children,
  steps,
  initialData,
}: {
  children: ReactNode
  steps: StepDefinition[]
  initialData?: ApplicationData
}) => {
  const stepsRef = useRef(steps)
  const seedData = initialData ?? DEFAULT_DATA
  const [state, setState] = useState<WizardState>(() => {
    const visibleSteps = computeVisible(stepsRef.current, seedData.step1.loanType, seedData.step1.amount)
    return {
      visibleSteps,
      stepIndex: 0,
      data: seedData,
      isDraftLoaded: false,
    }
  })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const loanType = seedData.step1.loanType
      const draft = await loadDraft<ApplicationData>(loanType)
      if (cancelled || !draft) return
      setState((prev) => ({
        ...prev,
        stepIndex: draft.step ?? 0,
        data: draft.state ?? prev.data,
        isDraftLoaded: true,
        draftTimestamp: draft.timestamp,
      }))
    }
    void load()
    return () => { cancelled = true }
  }, [])

  const patch = useCallback(
    (key: string, partial: Record<string, unknown>) => {
      setState((prev) => {
        const currentSlice = (prev.data as unknown as Record<string, unknown>)[key]
        const nextData = { ...prev.data, [key]: { ...(currentSlice as Record<string, unknown>), ...partial } } as ApplicationData
        const updatedSteps = computeVisible(stepsRef.current, nextData.step1.loanType, nextData.step1.amount)
        return { ...prev, data: nextData, visibleSteps: updatedSteps }
      })
    },
    [],
  )

  const next = useCallback((): boolean => {
    let passed = false
    setState((prev) => {
      const step = prev.visibleSteps[prev.stepIndex]
      if (!step) return prev
      try {
        step.schemaFactory(prev.data).parse((prev.data as unknown as Record<string, unknown>)[step.key])
        passed = true
        const nextIndex = Math.min(prev.stepIndex + 1, prev.visibleSteps.length - 1)
        return { ...prev, stepIndex: nextIndex, validationError: undefined }
      } catch (error) {
        const zErr = error as ZodError
        const message = zErr.issues?.[0]?.message ?? 'Invalid input'
        return { ...prev, validationError: { stepKey: step.key, message } }
      }
    })
    return passed
  }, [])

  const setStep = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      stepIndex: Math.max(0, Math.min(index, prev.visibleSteps.length - 1)),
      validationError: undefined,
    }))
  }, [])

  const submit = useCallback((referenceNumber: string) => {
    setState((prev) => ({
      ...prev,
      stepIndex: prev.visibleSteps.length,
      submittedRef: referenceNumber,
      data: { ...prev.data, referenceNumber, submittedAt: new Date().toISOString() } as ApplicationData,
    }))
    void clearDraft('personal')
    void clearDraft('home')
    void clearDraft('business')
  }, [])

  const startFresh = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stepIndex: 0,
      data: { ...DEFAULT_DATA, step1: { ...DEFAULT_DATA.step1, loanType: prev.data.step1.loanType } },
      visibleSteps: computeVisible(stepsRef.current, prev.data.step1.loanType, prev.data.step1.amount),
      isDraftLoaded: false,
      draftTimestamp: undefined,
      validationError: undefined,
    }))
  }, [])

  const value = useMemo<WizardContextValue>(
    () => ({
      ...state,
      patch,
      next,
      setStep,
      submit,
      startFresh,
    }),
    [state, patch, next, setStep, submit, startFresh],
  )

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext)
  if (!context) throw new Error('useWizard must be called within WizardProvider')
  return context
}
