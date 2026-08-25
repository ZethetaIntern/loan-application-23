describe('Step 5 — Employment & Income', () => {
  beforeEach(() => {
    cy.visit('/')
    // Fast-forward through steps 1–4
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

    cy.get('input[name="current.line1"]').type('12 Marine Drive')
    cy.get('input[name="current.pinCode"]').type('400001')
    cy.get('button[type="submit"]').click()
    cy.contains('h2', 'Employment').should('be.visible')
  })

  it('shows salary fields for salaried employment', () => {
    cy.contains('label', 'Salaried').click()
    cy.contains('label', 'Company Name').should('exist')
    cy.contains('label', 'Designation').should('exist')
    cy.contains('label', 'Monthly Net Salary').should('exist')
  })

  it('shows business fields for self-employed', () => {
    cy.contains('label', 'Self-Employed').click()
    cy.contains('label', 'Business Name').should('exist')
    cy.contains('label', 'Annual Turnover').should('exist')
  })
})
