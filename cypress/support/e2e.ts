import '@testing-library/cypress/add-commands'
import 'cypress-axe'
import 'cypress-real-events/support'

Cypress.on('window:before:load', (win) => {
  win.localStorage.clear()
})
