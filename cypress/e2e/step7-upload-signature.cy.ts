import { fillStep1, fillPersonalAndSubmit, fillKycAndSubmit, fillAddressAndSubmit, fillSalariedAndSubmit } from './step2-personal.cy';

describe('Step 7 – Document Upload & E-Signature', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
    fillStep1();
    fillPersonalAndSubmit();
    fillKycAndSubmit();
    fillAddressAndSubmit();
    fillSalariedAndSubmit();
    cy.contains('Step 6 of');
  });

  it('renders file upload area and signature canvas', () => {
    cy.get('[role="button"][aria-label*="Drop files"]').should('exist');
    cy.get('canvas').should('exist');
  });

  it('renders Clear button for signature', () => {
    cy.contains('button', 'Clear').should('exist');
    cy.contains('button', 'Clear').click();
  });
});
