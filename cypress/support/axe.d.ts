declare global {
  namespace Cypress {
    interface Chainable {
      injectAxe(): Chainable<void>
      checkA11y(context?: string | Node | null, options?: object, callback?: (violations: object[]) => void): Chainable<void>
    }
  }
}

export {}
