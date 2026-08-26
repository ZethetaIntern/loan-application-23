import { fillStep1, fillPersonalAndSubmit, fillKycAndSubmit, fillAddressAndSubmit, fillSalariedAndSubmit } from './step2-personal.cy';

describe('Step 8 – Review & Consent', () => {
  beforeEach(() => {
    cy.visit('/loan-application/');
    fillStep1();
    fillPersonalAndSubmit();
    fillKycAndSubmit();
    fillAddressAndSubmit();
    fillSalariedAndSubmit();
    cy.contains('Step 6 of');
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from('%PDF-1.4\n%LendSwift test document'),
        fileName: 'test-doc.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      },
      { force: true },
    );
    cy.contains('test-doc.pdf', { timeout: 8000 });
    cy.get('canvas')
      .realMouseDown({ position: 'left', pointerType: 'mouse' })
      .realMouseMove(150, 100, { pointerType: 'mouse' })
      .realMouseUp({ position: 'right', pointerType: 'mouse' });
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.contains('Step 7 of');
  });

  it('displays application summary and consent checkboxes', () => {
    cy.contains('Application Summary');
    cy.contains('Personal');
    cy.contains('Mandatory Consents');
    cy.get('input[name="accuracy"]').should('exist');
    cy.get('input[name="creditCheck"]').should('exist');
    cy.get('input[name="terms"]').should('exist');
    cy.get('input[name="communications"]').should('exist');
    cy.contains('button', 'Submit Application');
  });

  it('checks all consents', () => {
    cy.get('input[name="accuracy"]').check();
    cy.get('input[name="creditCheck"]').check();
    cy.get('input[name="terms"]').check();
    cy.get('input[name="communications"]').check();
    cy.contains('button', 'Submit Application').should('not.be.disabled');
  });
});
