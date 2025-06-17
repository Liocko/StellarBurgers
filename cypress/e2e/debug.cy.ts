/// <reference types="cypress" />
import { SELECTORS, INGREDIENTS } from '../support/selectors';

describe('Debug Test', () => {
  beforeEach(() => {
    // Перехватываем API запросы с относительными путями
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Устанавливаем токены авторизации и загружаем приложение
    cy.setAuthTokens();
    cy.visit('/');
    cy.waitForAppLoad();
  });

  it('should debug ingredient addition', () => {
    // Проверим, что ингредиенты загрузились
    cy.get(SELECTORS.INGREDIENT_ITEM).should('have.length.greaterThan', 0);
    
    // Проверим булку
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .contains(INGREDIENTS.CRATER_BUN)
      .should('be.visible');

    // Найдем кнопку добавления
    cy.get(SELECTORS.INGREDIENT_ITEM)
      .contains(INGREDIENTS.CRATER_BUN)
      .closest(SELECTORS.INGREDIENT_ITEM)
      .find(SELECTORS.ADD_INGREDIENT_BTN)
      .should('be.visible')
      .click();

    // Подождем и проверим DOM
    cy.wait(1000);
    
    // Выводим структуру DOM для отладки
    cy.get(SELECTORS.CONSTRUCTOR_SECTION).then(($el) => {
      console.log('Constructor section HTML:', $el.html());
    });

    // Проверим, есть ли элемент конструктора булки
    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP, { timeout: 10000 })
      .should('exist')
      .should('contain', INGREDIENTS.CRATER_BUN);
  });
});
