/// <reference types="cypress" />

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    
    // Перехватываем запрос на получение данных пользователя
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Перехватываем запрос на создание заказа
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // Перехватываем запросы авторизации
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
      fixture: 'user.json'
    }).as('loginUser');

    // Устанавливаем токены авторизации
    cy.setAuthTokens();

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should load the application and display ingredients', () => {
    // Проверяем загрузку основных элементов
    cy.get('h1').should('contain', 'Соберите бургер');
    cy.get('[data-cy="ingredients-section"]').should('exist');
    cy.get('[data-cy="constructor-section"]').should('exist');
    
    // Проверяем наличие категорий ингредиентов
    cy.contains('Булки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
    cy.contains('Начинки').should('be.visible');
  });

  it('should add ingredient to constructor via drag and drop', () => {
    // Добавляем булку
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-item"]')
      .trigger('dragstart');
    
    cy.get('[data-cy="constructor-section"]')
      .trigger('drop');

    // Проверяем, что булка добавилась
    cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i');

    // Добавляем начинку
    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient-item"]')
      .trigger('dragstart');
    
    cy.get('[data-cy="constructor-ingredients"]')
      .trigger('drop');

    // Проверяем, что начинка добавилась
    cy.get('[data-cy="constructor-ingredients"]')
      .should('contain', 'Биокотлета из марсианской Магнолии');

    // Проверяем обновление цены
    cy.get('[data-cy="order-button"]').should('be.visible');
  });

  it('should add ingredient via click on button', () => {
    // Добавляем ингредиент через кнопку
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"] button')
      .click({ force: true });

    // Даем время Redux обработать action
    cy.wait(1000);

    // Проверяем, что булка добавилась
    cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
    
    // Добавляем соус
    cy.get('[data-cy="ingredient-item"]')
      .contains('Соус Spicy-X')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    // Проверяем, что соус добавился
    cy.get('[data-cy="constructor-ingredients"]')
      .should('contain', 'Соус Spicy-X');
  });

  it('should open and close ingredient modal', () => {
    // Кликаем на ингредиент для открытия модального окна
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .click();

    // Проверяем, что модальное окно открылось
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should('be.visible');
    
    // Проверяем, что отображаются правильные данные ингредиента
    cy.get('[data-cy="ingredient-details"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-cy="ingredient-details"]').should('contain', 'Калории');
    cy.get('[data-cy="ingredient-details"]').should('contain', 'Белки');
    cy.get('[data-cy="ingredient-details"]').should('contain', 'Жиры');
    cy.get('[data-cy="ingredient-details"]').should('contain', 'Углеводы');

    // Закрываем модальное окно по кнопке
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('should close modal by clicking overlay', () => {
    // Открываем модальное окно
    cy.get('[data-cy="ingredient-item"]')
      .contains('Соус Spicy-X')
      .click();

    cy.get('[data-cy="modal"]').should('be.visible');
    
    // Проверяем правильные данные для соуса
    cy.get('[data-cy="ingredient-details"]').should('contain', 'Соус Spicy-X');

    // Закрываем по клику на оверлей
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('should close modal by pressing Escape', () => {
    // Открываем модальное окно
    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .click();

    cy.get('[data-cy="modal"]').should('be.visible');
    
    // Проверяем правильные данные для начинки
    cy.get('[data-cy="ingredient-details"]').should('contain', 'Биокотлета из марсианской Магнолии');

    // Закрываем по нажатию Escape
    cy.get('body').type('{esc}');
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('should display correct ingredient data in modal for different ingredients', () => {
    // Тестируем разные типы ингредиентов
    const ingredients = [
      { name: 'Краторная булка N-200i', type: 'bun' },
      { name: 'Соус Spicy-X', type: 'sauce' },
      { name: 'Биокотлета из марсианской Магнолии', type: 'main' }
    ];

    ingredients.forEach((ingredient) => {
      // Открываем модальное окно для каждого ингредиента
      cy.get('[data-cy="ingredient-item"]')
        .contains(ingredient.name)
        .click();

      // Проверяем, что модальное окно открылось с правильными данными
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="ingredient-details"]').should('contain', ingredient.name);
      
      // Проверяем наличие всех необходимых полей
      cy.get('[data-cy="ingredient-details"]').should('contain', 'Калории');
      cy.get('[data-cy="ingredient-details"]').should('contain', 'Белки');
      cy.get('[data-cy="ingredient-details"]').should('contain', 'Жиры');
      cy.get('[data-cy="ingredient-details"]').should('contain', 'Углеводы');

      // Закрываем модальное окно
      cy.get('[data-cy="modal-close-btn"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  it('should create order successfully', () => {
    // Добавляем булку
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    // Добавляем начинку
    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    // Добавляем соус
    cy.get('[data-cy="ingredient-item"]')
      .contains('Соус Spicy-X')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    // Проверяем, что все ингредиенты добавились
    cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-cy="constructor-ingredients"]').should('contain', 'Биокотлета из марсианской Магнолии');
    cy.get('[data-cy="constructor-ingredients"]').should('contain', 'Соус Spicy-X');
    cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i');

    // Кликаем на кнопку оформления заказа
    cy.get('[data-cy="order-button"]').click();

    // Ожидаем запрос на создание заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно с заказом открылось
    cy.get('[data-cy="order-modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', '034536');

    // Закрываем модальное окно
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get('[data-cy="order-modal"]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredients"]').should('be.empty');
  });

  it('should handle order creation without authentication', () => {
    // Очищаем токены авторизации
    cy.clearAuthTokens();
    cy.reload();
    cy.wait('@getIngredients');

    // Добавляем ингредиенты
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    // Пытаемся создать заказ без авторизации
    cy.get('[data-cy="order-button"]').click();

    // Проверяем переход на страницу входа
    cy.url().should('include', '/login');
  });

  it('should display ingredient counter when added to constructor', () => {
    // Проверяем изначальное состояние (счетчик не должен отображаться)
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .find('.counter')
      .should('not.exist');

    // Добавляем булку (должна добавиться с счетчиком 2)
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .find('.counter')
      .should('contain', '2');

    // Добавляем начинку
    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .find('.counter')
      .should('contain', '1');

    // Добавляем тот же ингредиент еще раз
    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .find('.counter')
      .should('contain', '2');
  });

  it('should remove ingredients from constructor', () => {
    // Добавляем ингредиенты
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient-item"]')
      .find('[data-cy="add-ingredient-btn"]')
      .click();

    // Проверяем, что ингредиенты добавились
    cy.get('[data-cy="constructor-ingredients"]')
      .should('contain', 'Биокотлета из марсианской Магнолии');

    // Удаляем начинку из конструктора
    cy.get('[data-cy="constructor-ingredients"]')
      .find('[data-cy="constructor-element"]')
      .find('.constructor-element__action')
      .click();

    // Проверяем, что ингредиент удалился
    cy.get('[data-cy="constructor-ingredients"]')
      .should('not.contain', 'Биокотлета из марсианской Магнолии');

    // Проверяем обновление счетчика
    cy.get('[data-cy="ingredient-item"]')
      .contains('Биокотлета из марсианской Магнолии')
      .find('.counter')
      .should('not.exist');
  });
});
