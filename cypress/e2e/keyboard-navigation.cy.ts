describe('Keyboard Navigation', () => {
  it('can navigate Step 1 using only keyboard', () => {
    cy.visit('/')
    cy.get('body').type('{tab}') // focus first interactive
    cy.focused().should('have.attr', 'type', 'radio')
    cy.focused().type('{rightarrow}') // select Home
    cy.focused().should('have.value', 'home')
    cy.focused().type('{rightarrow}') // select Business
    cy.focused().type('{rightarrow}') // back to Personal
    cy.focused().should('have.value', 'personal')

    // Tab to amount
    cy.focused().tab()
    cy.focused().should('have.attr', 'name', 'amount')
    cy.focused().type('200000')
  })
})
