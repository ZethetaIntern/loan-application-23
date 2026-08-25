describe('Keyboard Navigation', () => {
  it('can navigate Step 1 using only keyboard', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.get('body').type('{tab}')
    cy.focused().should('have.attr', 'type', 'radio')
    cy.focused().type('{rightarrow}')
    cy.focused().should('have.value', 'home')
    cy.focused().type('{rightarrow}')
    cy.focused().type('{rightarrow}')
    cy.focused().should('have.value', 'personal')

    cy.focused().tab()
    cy.focused().should('have.attr', 'name', 'amount')
    cy.focused().type('200000')
    cy.checkA11y()
  })
})
