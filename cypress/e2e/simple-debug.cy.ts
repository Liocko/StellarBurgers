/// <reference types="cypress" />

describe('Simple Debug Test', () => {
  beforeEach(() => {
    // Перехватываем все API запросы
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.setAuthTokens();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should debug DOM elements and Redux state', () => {
    // Проверяем, что страница загрузилась
    cy.get('h1').should('contain', 'Соберите бургер');
    
    // Проверяем состояние конструктора до добавления
    cy.get('[data-cy="constructor-section"]').should('exist');
    
    // Кликаем на кнопку добавления
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();
    
    // Ждем немного для обработки Redux action
    cy.wait(3000);
    
    // Проверяем, что появились элементы конструктора
    cy.get('[data-cy="constructor-section"]').within(() => {
      // Проверяем наличие любых элементов
      cy.get('*').should('have.length.greaterThan', 0);
    });
    
    // Ищем элементы с текстом булки
    cy.contains('Краторная булка N-200i').should('exist');
    
    // Попробуем найти конструктор булки по альтернативным селекторам
    cy.get('[data-cy="constructor-section"]')
      .find('*')
      .contains('Краторная булка N-200i')
      .should('exist');
  });
});
