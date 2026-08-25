import type { StepDefinition } from '../context/WizardContext';
import { step1Schema } from './step1Schema';
import { step2Schema } from './step2Schema';
import { step3SchemaFactory } from './step3Schema';
import { step4Schema } from './step4Schema';
import { step5SchemaFactory } from './step5Schema';
import { step6SchemaFactory } from './step6Schema';
import { step7Schema } from './step7Schema';
import { step8Schema } from './step8Schema';

export const STEP_DEFINITIONS: StepDefinition[] = [
  { key: 'step1', title: 'Loan Type & Amount', schemaFactory: () => step1Schema },
  { key: 'personal', title: 'Personal Information', schemaFactory: () => step2Schema },
  { key: 'kyc', title: 'Identity Verification (KYC)', schemaFactory: (app) => step3SchemaFactory(app.step1.loanType) },
  { key: 'address', title: 'Address Information', schemaFactory: () => step4Schema },
  { key: 'employment', title: 'Employment & Income', schemaFactory: (app) => step5SchemaFactory(app.step1.loanType) },
  { key: 'coApplicant', title: 'Co-Applicant & Guarantor', schemaFactory: (app) => step6SchemaFactory(app.step1.loanType) },
  { key: 'documents', title: 'Document Upload & E-Signature', schemaFactory: () => step7Schema },
  { key: 'consents', title: 'Review & Consent', schemaFactory: () => step8Schema },
];
