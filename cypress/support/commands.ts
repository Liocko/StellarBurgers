/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>
      clearAuthTokens(): Chainable<void>
    }
  }
}

Cypress.Commands.add('setAuthTokens', () => {
  window.localStorage.setItem('refreshToken', 'fake-refresh-token');
  cy.setCookie('accessToken', 'fake-access-token', { 
    httpOnly: false,
    secure: false 
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  window.localStorage.removeItem('refreshToken');
  cy.clearCookie('accessToken');
});

export {};
