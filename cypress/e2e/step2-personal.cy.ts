function fillStep1() {
  cy.get('input[name="loanType"][value="personal"]').click();
  cy.get('input[name="amount"]').clear().type('50000', { delay: 0 });
  cy.get('select[name="tenureMonths"]').select('24');
  cy.get('select[name="loanPurpose"]').select('medical');
  cy.get('button[type="submit"]').click();
  cy.contains('Step 2 of');
}

function fillPersonalAndSubmit() {
  cy.get('input[name="fullName"]').type('Test User');
  cy.get('input[name="dateOfBirth"]').type('1990-05-15');
  cy.get('input[name="gender"][value="male"]').click();
  cy.get('select[name="maritalStatus"]').select('single');
  cy.get('input[name="fatherName"]').type('Father Name');
  cy.get('input[name="motherName"]').type('Mother Name');
  cy.get('input[name="email"]').type('test@example.com');
  cy.get('input[placeholder="Enter OTP"]').first().type('123456');
  cy.contains('button', 'Verify').first().click();
  cy.get('input[name="mobile"]').type('9876543210');
  cy.get('input[placeholder="Enter OTP"]').last().type('123456');
  cy.contains('button', 'Verify').last().click();
  cy.get('button[type="submit"]').click();
  cy.contains('Step 3 of');
}

function fillKycAndSubmit() {
  cy.get('input[name="pan"]').type('AAAPA1234P', { delay: 0 });
  cy.contains('button', 'Verify PAN').should('not.be.disabled').click();
  cy.contains('✓ Verified', { timeout: 5000 });
  cy.get('input[name="aadhaar"]').type('123456789010', { delay: 0 });
  cy.get('input[name="aadhaarConsent"]').check();
  cy.contains('button', 'Verify Aadhaar').should('not.be.disabled').click();
  cy.get('span.bg-green-100', { timeout: 8000 }).should('have.length', 2);
  cy.get('button[type="submit"]').click();
  cy.contains('Step 4 of');
}

function fillAddressAndSubmit() {
  cy.get('input[name="current.line1"]').type('123 Test Street');
  cy.get('input[name="current.pinCode"]').type('400001');
  cy.get('input[name="current.city"]').should('have.value', 'Mumbai');
  cy.get('input[name="current.state"]').should('have.value', 'Maharashtra');
  cy.get('select[name="current.residenceType"]').select('owned');
  cy.get('input[name="current.yearsAtAddress"]').clear().type('5');
  cy.get('input[name="sameAsPermanent"]').check();
  cy.get('button[type="submit"]').click();
  cy.contains('Step 5 of');
}

function fillSalariedAndSubmit() {
  cy.get('input[name="employmentType"][value="salaried"]').click();
  cy.get('input[name="yearsExperience"]').clear().type('5');
  cy.get('input[name="companyName"]').type('Test Corp');
  cy.get('input[name="designation"]').type('Engineer');
  cy.get('input[name="monthlySalary"]').clear().type('50000', { delay: 0 });
  cy.get('button[type="submit"]').click();
}

describe('Step 2 – Personal Information', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
    fillStep1();
  });

  it('renders personal info fields', () => {
    cy.get('input[name="fullName"]').should('exist');
    cy.get('input[name="dateOfBirth"]').should('have.attr', 'type', 'date');
    cy.get('input[name="gender"][value="male"]').should('exist');
    cy.get('input[name="gender"][value="female"]').should('exist');
    cy.get('input[name="gender"][value="other"]').should('exist');
    cy.get('select[name="maritalStatus"]').should('exist');
    cy.get('input[name="email"]').should('have.attr', 'type', 'email');
    cy.get('input[name="mobile"]').should('have.attr', 'type', 'tel');
  });

  it('fills personal fields, verifies OTP, and advances to step 3', () => {
    fillPersonalAndSubmit();
  });
});

export { fillStep1, fillPersonalAndSubmit, fillKycAndSubmit, fillAddressAndSubmit, fillSalariedAndSubmit };
