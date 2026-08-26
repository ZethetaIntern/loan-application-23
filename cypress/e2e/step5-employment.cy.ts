import { fillStep1, fillPersonalAndSubmit, fillKycAndSubmit, fillAddressAndSubmit } from './step2-personal.cy';

describe('Step 5 – Employment & Income', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
    fillStep1();
    fillPersonalAndSubmit();
    fillKycAndSubmit();
    fillAddressAndSubmit();
  });

  it('shows salaried fields when salaried is selected', () => {
    cy.get('input[name="employmentType"][value="salaried"]').click();
    cy.get('input[name="companyName"]').should('exist');
    cy.get('input[name="designation"]').should('exist');
    cy.get('input[name="monthlySalary"]').should('exist');
  });

  it('shows self-employed fields when self-employed is selected', () => {
    cy.get('input[name="employmentType"][value="self_employed"]').click();
    cy.get('input[name="businessName"]').should('exist');
    cy.get('input[name="businessType"]').should('exist');
    cy.get('input[name="annualTurnover"]').should('exist');
    cy.get('input[name="monthlyBusinessIncome"]').should('exist');
  });
});
