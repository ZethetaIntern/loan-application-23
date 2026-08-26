describe('Step 1 – Loan Type & Amount', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
  });

  it('renders loan type radios, amount input and selects', () => {
    cy.get('input[name="loanType"][value="personal"]').should('be.visible');
    cy.get('input[name="loanType"][value="home"]').should('be.visible');
    cy.get('input[name="loanType"][value="business"]').should('be.visible');
    cy.get('input[name="amount"]').should('exist');
    cy.get('select[name="tenureMonths"]').should('exist');
    cy.get('select[name="loanPurpose"]').should('exist');
  });

  it('validates required fields and advances on valid input', () => {
    cy.get('button[type="submit"]').click();
    cy.get('[role="alert"]').should('be.visible');

    cy.get('input[name="loanType"][value="personal"]').click();
    cy.get('input[name="amount"]').clear().type('50000', { delay: 0 });
    cy.get('select[name="tenureMonths"]').select('24');
    cy.get('select[name="loanPurpose"]').select('medical');
    cy.get('button[type="submit"]').click();
    cy.contains('Step 2 of');
  });
});
