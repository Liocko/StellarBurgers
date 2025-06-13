/// <reference types="cypress" />

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    
    // Перехватываем запрос на получение данных пользователя
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Перехватываем запрос на создание заказа
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should load ingredients', () => {
    // Ждем загрузки ингредиентов
    cy.get('h1').should('contain', 'Соберите бургер');
    // Проверим, что компоненты загрузились
    cy.get('main').should('exist');
  });
});
