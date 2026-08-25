describe('Step 4 — Address with PIN Lookup', () => {
  beforeEach(() => {
    cy.visit('/')
    // Fill steps 1–3 quickly
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

    cy.get('input[name="pan"]').type('ABCDE1234F')
    cy.contains('button', 'Verify PAN').click()
    cy.get('input[name="aadhaar"]').type('123456789012')
    cy.contains('button', 'Verify Aadhaar').click()
    cy.get('input[name="aadhaarConsent"]').check({ force: true })
    cy.get('button[type="submit"]').click()
    cy.contains('h2', 'Address Information').should('be.visible')
  })

  it('auto-fills city and state from PIN code', () => {
    cy.get('input[name="current.pinCode"]').type('400001')
    cy.contains('Fort, Maharashtra').should('exist')
  })

  it('shows rent field when residence type is Rented', () => {
    cy.get('select[name="current.residenceType"]').select('rented')
    cy.contains('label', 'Monthly Rent').should('exist')
  })

  it('validates PIN code format', () => {
    cy.get('input[name="current.pinCode"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.contains('PIN code is not recognised').should('exist')
  })
})
