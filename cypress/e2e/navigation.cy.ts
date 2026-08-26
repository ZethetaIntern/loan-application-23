describe('Wizard Navigation', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
  });

  it('progresses through all steps with Save & Next', () => {
    cy.contains('Step 1 of');
    cy.contains('button', 'Save & Continue').should('be.visible');

    cy.get('input[name="loanType"][value="personal"]').click();
    cy.get('input[name="amount"]').clear().type('50000', { delay: 0 });
    cy.get('select[name="tenureMonths"]').select('24');
    cy.get('select[name="loanPurpose"]').select('medical');
    cy.get('button[type="submit"]').click();

    cy.contains('Step 2 of');
    cy.contains('button', 'Previous').should('be.visible');
  });

  it('navigates back with Previous button', () => {
    cy.get('input[name="loanType"][value="personal"]').click();
    cy.get('input[name="amount"]').clear().type('50000', { delay: 0 });
    cy.get('select[name="tenureMonths"]').select('24');
    cy.get('select[name="loanPurpose"]').select('medical');
    cy.get('button[type="submit"]').click();
    cy.contains('Step 2 of');
    cy.contains('button', 'Previous').click();
    cy.contains('Step 1 of');
    cy.get('input[name="loanType"][value="personal"]').should('be.checked');
  });
});
