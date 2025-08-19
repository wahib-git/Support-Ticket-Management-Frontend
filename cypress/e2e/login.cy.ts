/// <reference types="cypress" />

describe('Login Page E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should display login form', () => {
    cy.visit('/login');
    cy.get('h2').contains('Connexion').should('exist');
    cy.get('form').should('exist');
  });
});
