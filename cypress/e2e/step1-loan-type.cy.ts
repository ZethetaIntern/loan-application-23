describe('Step 1 — Loan Type & Amount', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe()
    cy.contains('h2', 'Loan Type & Amount').should('be.visible')
  })

  it('allows selecting each loan type and shows rate info', () => {
    cy.contains('label', 'Personal').click()
    cy.contains('Rate: 10.5%').should('exist')
    cy.contains('label', 'Home').click()
    cy.contains('Rate: 8.5%').should('exist')
    cy.contains('label', 'Business').click()
    cy.contains('Rate: 14.0%').should('exist')
    cy.checkA11y()
  })

  it('validates minimum loan amount', () => {
    cy.contains('label', 'Personal').click()
    cy.get('input[name="amount"]').clear().type('10000')
    cy.get('button[type="submit"]').click()
    cy.contains('Minimum loan amount is ₹50,000').should('exist')
    cy.checkA11y()
  })

  it('validates required tenure and purpose', () => {
    cy.contains('label', 'Personal').click()
    cy.get('input[name="amount"]').clear().type('200000')
    cy.get('button[type="submit"]').click()
    cy.contains('Loan tenure is required').should('exist')
    cy.checkA11y()
  })
})
