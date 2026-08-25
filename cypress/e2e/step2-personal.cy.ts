describe('Step 2 — Personal Information', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe()
    cy.contains('label', 'Personal').click()
    cy.get('input[name="amount"]').clear().type('200000')
    cy.get('select[name="tenureMonths"]').select('36')
    cy.get('select[name="loanPurpose"]').select('debt_consolidation')
    cy.get('button[type="submit"]').click()
    cy.contains('h2', 'Personal Information').should('be.visible')
  })

  it('validates full name is required', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('Name must be 2–100 letters').should('exist')
    cy.checkA11y()
  })

  it('validates date of birth and age range', () => {
    cy.get('input[name="fullName"]').type('Priya Sharma')
    cy.get('input[name="dateOfBirth"]').type('2010-01-01')
    cy.get('button[type="submit"]').click()
    cy.contains('age must be between 21 and 65').should('exist')
    cy.checkA11y()
  })

  it('validates Indian mobile format', () => {
    cy.get('input[name="fullName"]').type('Priya Sharma')
    cy.get('input[name="dateOfBirth"]').type('1995-05-10')
    cy.get('input[name="fatherName"]').type('Raj Sharma')
    cy.get('input[name="motherName"]').type('Sunita Sharma')
    cy.get('input[name="email"]').type('priya@test.com')
    cy.get('button:contains("Verify")').first().click()
    cy.get('input[name="mobile"]').type('1234567890')
    cy.get('button[type="submit"]').click()
    cy.contains('valid 10-digit Indian mobile').should('exist')
    cy.checkA11y()
  })
})
