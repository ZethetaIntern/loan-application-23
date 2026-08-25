# LendSwift Loan Application

Multi-step loan application form built with React 19, Vite, Tailwind CSS v4, React Hook Form, and Zod validation.

## Features

- 8-step wizard with progressive validation (Step 1–8)
- Three loan types: Personal, Home, Business — each with unique field requirements
- PAN/Aadhaar masked input with async verification simulation (Verhoeff checksum)
- PIN code lookup auto-fills city, state, and post office
- AES-256-GCM encrypted auto-save with 72-hour TTL
- E-signature capture via signature_pad
- File upload with client-side image compression (Canvas API)
- Co-applicant conditional visibility (home loans, amounts above thresholds)
- Real-time EMI breakdown calculator
- Full keyboard navigation and WCAG 2.1 AA accessibility

## Tech Stack

- React 19 + TypeScript 7
- Vite 8
- Tailwind CSS v4
- React Hook Form 7 + Zod 4
- Cypress 15 + cypress-axe
- Vitest 4 + @vitest/coverage-v8
- ESLint 8 (Airbnb + Airbnb-TypeScript + jsx-a11y)
- Web Crypto API (AES-256-GCM for draft encryption)

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # TypeScript check + production build
npm test             # Run unit tests
npm run test:coverage # Run with coverage report
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix lint issues
npx cypress open     # Open Cypress runner
npx cypress run      # Run E2E tests headless
```

## Project Structure

```
src/
├── components/common/   # Reusable UI: Input, Select, RadioGroup, Checkbox, etc.
├── context/             # WizardContext — state machine for multi-step flow
├── features/steps/      # Step1–Step8 UI components
├── hooks/               # useAutoSave custom hook
├── schemas/             # Zod schemas (step1–step8) + crossstep dependency engine
├── services/            # EMI calculator, KYC verification, PIN lookup, draft storage
├── types/               # ApplicationData, domain types
└── utils/               # Constants, validators, formatters, dates

cypress/
└── e2e/                 # 10 spec files covering all P0 critical paths
```

## Business Rules

| Rule | Detail |
|---|---|
| Min loan | ₹50,000 |
| Max personal | ₹10,00,000 (10L) |
| Max home | ₹1,00,00,000 (1Cr) |
| Max business | ₹50,00,000 (50L) |
| Age range | 21–65 at maturity |
| Co-applicant | Always for home; personal >5L; business >20L |
| Rates | Personal 10.5%, Home 8.5%, Business 14% |
| FOIR limit | 50% |
| Auto-save | AES-256-GCM, every 30s, 72h TTL |
