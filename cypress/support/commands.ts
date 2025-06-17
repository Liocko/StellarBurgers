/// <reference types="cypress" />
import { SELECTORS, INGREDIENTS } from './selectors';

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
      addIngredientToConstructor(ingredientName: string): Chainable<void>;
      addBunToConstructor(): Chainable<void>;
      createFullBurger(): Chainable<void>;
      openIngredientModal(ingredientName: string): Chainable<void>;
      closeModal(): Chainable<void>;
      waitForAppLoad(): Chainable<void>;
    }
  }
}

// Команда для установки токенов авторизации
Cypress.Commands.add('setAuthTokens', () => {
  cy.window().then((window) => {
    window.localStorage.setItem('accessToken', 'Bearer test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
});

// Команда для очистки токенов авторизации
Cypress.Commands.add('clearAuthTokens', () => {
  cy.window().then((window) => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  });
});

// Команда для добавления ингредиента в конструктор через кнопку
Cypress.Commands.add('addIngredientToConstructor', (ingredientName: string) => {
  cy.get(SELECTORS.INGREDIENT_ITEM)
    .contains(ingredientName)
    .closest(SELECTORS.INGREDIENT_ITEM)
    .find(SELECTORS.ADD_INGREDIENT_BTN)
    .find('button')
    .click();
  // Ждем, пока Redux обработает изменение состояния
  cy.wait(100);
});

// Команда для добавления булки в конструктор
Cypress.Commands.add('addBunToConstructor', () => {
  cy.addIngredientToConstructor(INGREDIENTS.CRATER_BUN);
});

// Команда для создания полного бургера
Cypress.Commands.add('createFullBurger', () => {
  cy.addBunToConstructor();
  cy.addIngredientToConstructor(INGREDIENTS.BIO_CUTLET);
  cy.addIngredientToConstructor(INGREDIENTS.SPICY_SAUCE);
});

// Команда для открытия модального окна ингредиента
Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.get(SELECTORS.INGREDIENT_ITEM)
    .contains(ingredientName)
    .click();
  cy.get(SELECTORS.MODAL).should('be.visible');
});

// Команда для закрытия модального окна
Cypress.Commands.add('closeModal', () => {
  cy.get(SELECTORS.MODAL_CLOSE_BTN).click();
  cy.get(SELECTORS.MODAL).should('not.exist');
});

// Команда для ожидания полной загрузки приложения
Cypress.Commands.add('waitForAppLoad', () => {
  cy.wait('@getIngredients');
  cy.get('h1').should('contain', 'Соберите бургер');
  cy.get(SELECTORS.INGREDIENTS_SECTION).should('exist');
  cy.get(SELECTORS.CONSTRUCTOR_SECTION).should('exist');
});

export {};
