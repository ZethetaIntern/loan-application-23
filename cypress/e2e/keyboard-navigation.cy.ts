describe('Keyboard Navigation', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
  });

  it('navigates form fields with Tab key', () => {
    cy.get('input[name="loanType"][value="personal"]').focus().should('be.focused');
    cy.realPress('Tab');
    cy.focused().should('not.have.attr', 'name', 'loanType');
  });

  it('submits step with Enter key', () => {
    cy.get('input[name="loanType"][value="personal"]').click();
    cy.get('input[name="amount"]').clear().type('50000', { delay: 0 });
    cy.get('select[name="tenureMonths"]').select('24');
    cy.get('select[name="loanPurpose"]').select('medical');
    cy.get('button[type="submit"]').focus().type('{enter}');
    cy.contains('Step 2 of');
  });
});
