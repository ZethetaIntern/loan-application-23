import { fillStep1, fillPersonalAndSubmit, fillKycAndSubmit } from './step2-personal.cy';

describe('Step 4 – Address Information', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
    fillStep1();
    fillPersonalAndSubmit();
    fillKycAndSubmit();
  });

  it('renders address fields and sameAsPermanent checkbox', () => {
    cy.get('input[name="current.line1"]').should('exist');
    cy.get('input[name="current.pinCode"]').should('exist');
    cy.get('select[name="current.residenceType"]').should('exist');
    cy.get('input[name="current.yearsAtAddress"]').should('have.attr', 'type', 'number');
    cy.get('input[name="sameAsPermanent"]').should('exist');
  });

  it('fills address and advances to step 5', () => {
    cy.get('input[name="current.line1"]').type('123 Test Street');
    cy.get('input[name="current.pinCode"]').type('400001');
    cy.get('input[name="current.city"]').should('have.value', 'Mumbai');
    cy.get('input[name="current.state"]').should('have.value', 'Maharashtra');
    cy.get('select[name="current.residenceType"]').select('owned');
    cy.get('input[name="current.yearsAtAddress"]').clear().type('5');
    cy.get('input[name="sameAsPermanent"]').check();
    cy.get('button[type="submit"]').click();
    cy.contains('Step 5 of');
  });
});
