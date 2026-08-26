import { fillStep1, fillPersonalAndSubmit } from './step2-personal.cy';

describe('Step 3 – KYC Verification', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
    fillStep1();
    fillPersonalAndSubmit();
    cy.contains('Step 3 of');
  });

  it('renders PAN and Aadhaar inputs with verify buttons', () => {
    cy.get('input[name="pan"]').should('exist');
    cy.contains('button', 'Verify PAN').should('exist');
    cy.get('input[name="aadhaar"]').should('exist');
    cy.contains('button', 'Verify Aadhaar').should('exist');
    cy.get('input[name="aadhaarConsent"]').should('exist');
  });

  it('verifies PAN and Aadhaar, then advances to step 4', () => {
    cy.get('input[name="pan"]').type('AAAPA1234P', { delay: 0 });
    cy.contains('button', 'Verify PAN').should('not.be.disabled').click();
    cy.contains('✓ Verified', { timeout: 5000 });
    cy.get('input[name="aadhaar"]').type('123456789010', { delay: 0 });
    cy.get('input[name="aadhaarConsent"]').check();
    cy.contains('button', 'Verify Aadhaar').should('not.be.disabled').click();
    cy.get('span.bg-green-100', { timeout: 8000 }).should('have.length', 2);
    cy.get('button[type="submit"]').click();
    cy.contains('Step 4 of', { timeout: 8000 });
  });
});
