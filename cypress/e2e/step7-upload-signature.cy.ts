describe('File Upload & E-Signature', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe()
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

    cy.get('button[type="submit"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains('h2', 'Document Upload').should('exist')
  })

  it('shows upload zone with drag and drop area', () => {
    cy.contains('Drop files here').should('exist')
    cy.contains('browse').should('exist')
    cy.checkA11y()
  })

  it('shows signature canvas with clear button', () => {
    cy.contains('E-Signature').should('exist')
    cy.contains('Clear').should('exist')
    cy.contains('Draw your signature above').should('exist')
    cy.checkA11y()
  })

  it('validates signature is required on submit', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('Please capture your e-signature').should('exist')
    cy.checkA11y()
  })
})
