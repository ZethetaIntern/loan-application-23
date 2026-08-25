describe('Step 3 — KYC Verification', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('label', 'Personal').click()
    cy.get('input[name="amount"]').clear().type('200000')
    cy.get('select[name="tenureMonths"]').select('36')
    cy.get('select[name="loanPurpose"]').select('debt_consolidation')
    cy.get('button[type="submit"]').click()

    cy.get('input[name="fullName"]').type('Priya Sharma')
    cy.get('input[name="dateOfBirth"]').type('1995-05-10')
    cy.get('input[name="fatherName"]').type('Raj Sharma')
    cy.get('input[name="motherName"]').type('Sunita Sharma')
    cy.get('input[name="email"]').type('priya@test.com')
    cy.get('button:contains("Verify")').first().click()
    cy.get('input[name="mobile"]').type('9876543210')
    cy.get('button:contains("Verify")').last().click()
    cy.get('button[type="submit"]').click()
    cy.contains('h2', 'Identity Verification').should('be.visible')
  })

  it('validates PAN format', () => {
    cy.get('input[name="pan"]').type('INVALID')
    cy.contains('button', 'Verify PAN').click()
    cy.contains('format AAAAA9999A').should('exist')
  })

  it('validates Aadhaar is 12 digits', () => {
    cy.get('input[name="aadhaar"]').type('123')
    cy.contains('button', 'Verify Aadhaar').click()
    cy.contains('12 digits').should('exist')
  })

  it('requires Aadhaar consent checkbox', () => {
    cy.contains('button[type="submit"]', 'Save & Next').click()
    cy.contains('Aadhaar consent is mandatory').should('exist')
  })
})
