import { fillStep1, fillPersonalAndSubmit, fillKycAndSubmit, fillAddressAndSubmit, fillSalariedAndSubmit } from './step2-personal.cy';

describe('Step 6 – Co-Applicant & Guarantor', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
    cy.get('input[name="loanType"][value="home"]').click();
    cy.get('input[name="amount"]').clear().type('5000000', { delay: 0 });
    cy.get('select[name="tenureMonths"]').select('240');
    cy.get('select[name="loanPurpose"]').select('medical');
    cy.get('button[type="submit"]').click();
    fillPersonalAndSubmit();
    fillKycAndSubmit();
    fillAddressAndSubmit();
    fillSalariedAndSubmit();
    cy.contains('Step 6 of');
  });

  it('renders co-applicant fields for home loan', () => {
    cy.get('input[name="name"]').should('exist');
    cy.get('select[name="relationship"]').should('exist');
    cy.get('input[name="pan"]').should('exist');
    cy.contains('button', 'Verify PAN').should('exist');
  });

  it('fills co-applicant details', () => {
    cy.get('input[name="name"]').type('Co Applicant');
    cy.get('select[name="relationship"]').select('spouse');
    cy.get('input[name="pan"]').clear().type('AAAPA1234P', { delay: 0 });
    cy.contains('button', 'Verify PAN').should('not.be.disabled').click();
    cy.contains('✓ Verified', { timeout: 5000 });
  });
});
