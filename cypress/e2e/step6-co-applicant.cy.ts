describe('Step 6 — Co-Applicant (Conditional)', () => {
  it('shows co-applicant step for home loans', () => {
    cy.visit('/')
    cy.contains('label', 'Home').click()
    cy.get('input[name="amount"]').clear().type('5000000')
    cy.get('select[name="tenureMonths"]').select('120')
    cy.get('select[name="loanPurpose"]').select('home_renovation')
    cy.get('button[type="submit"]').click()
    // Skip personal step
    cy.get('input[name="fullName"]').type('Priya Sharma')
    cy.get('input[name="dateOfBirth"]').type('1995-05-10')
    cy.get('input[name="fatherName"]').type('Raj Sharma')
    cy.get('input[name="motherName"]').type('Sunita Sharma')
    cy.get('input[name="email"]').type('priya@test.com')
    cy.get('button:contains("Verify")').first().click()
    cy.get('input[name="mobile"]').type('9876543210')
    cy.get('button:contains("Verify")').last().click()
    cy.get('button[type="submit"]').click()
    // Skip KYC
    cy.get('input[name="pan"]').type('ABCDE1234F')
    cy.contains('button', 'Verify PAN').click()
    cy.get('input[name="aadhaar"]').type('123456789012')
    cy.contains('button', 'Verify Aadhaar').click()
    cy.get('input[name="aadhaarConsent"]').check({ force: true })
    cy.get('button[type="submit"]').click()
    // Skip Address
    cy.get('input[name="current.line1"]').type('12 Marine Drive')
    cy.get('input[name="current.pinCode"]').type('400001')
    cy.get('button[type="submit"]').click()
    // Skip Employment
    cy.get('button[type="submit"]').click()
    // Step 6 should be co-applicant
    cy.contains('h2', 'Co-Applicant').should('exist')
    cy.contains('Co-Applicant Full Name').should('exist')
  })
})
