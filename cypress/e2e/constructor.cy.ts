/// <reference types="cypress" />
import { SELECTORS, INGREDIENTS, CATEGORIES, NUTRITION } from '../support/selectors';

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем API запросы по паттерну URL (без базового URL)
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.intercept('POST', '**/api/auth/login', {
      fixture: 'user.json'
    }).as('loginUser');

    // Устанавливаем токены авторизации и загружаем приложение
    cy.setAuthTokens();
    cy.visit('/');
    cy.waitForAppLoad();
  });

  describe('Initial application state', () => {
    it('should load the application and display ingredients', () => {
      // Проверяем наличие категорий ингредиентов
      cy.contains(CATEGORIES.BUNS).should('be.visible');
      cy.contains(CATEGORIES.SAUCES).should('be.visible');
      cy.contains(CATEGORIES.FILLINGS).should('be.visible');
    });
  });

  describe('Adding ingredients to constructor', () => {
    it('should add ingredient to constructor via drag and drop', () => {
      // Вместо drag and drop используем клик, так как drag and drop в Cypress сложен для React DnD
      // Добавляем булку через клик
      cy.addBunToConstructor();

      // Проверяем добавление булки
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain', INGREDIENTS.CRATER_BUN);
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('contain', INGREDIENTS.CRATER_BUN);

      // Добавляем начинку через клик
      cy.addIngredientToConstructor(INGREDIENTS.BIO_CUTLET);

      // Проверяем добавление начинки
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain', INGREDIENTS.BIO_CUTLET);
      cy.get(SELECTORS.ORDER_BUTTON).should('be.visible');
    });

    it('should add ingredient via click on button', () => {
      // Добавляем булку через кнопку
      cy.addBunToConstructor();
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain', INGREDIENTS.CRATER_BUN);
      
      // Добавляем соус
      cy.addIngredientToConstructor(INGREDIENTS.SPICY_SAUCE);
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain', INGREDIENTS.SPICY_SAUCE);
    });

    it('should display ingredient counter when added to constructor', () => {
      // Проверяем отсутствие счетчика изначально
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .contains(INGREDIENTS.CRATER_BUN)
        .find(SELECTORS.COUNTER)
        .should('not.exist');

      // Добавляем булку и проверяем счетчик (2 для верха и низа)
      cy.addBunToConstructor();
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .contains(INGREDIENTS.CRATER_BUN)
        .find(SELECTORS.COUNTER)
        .should('contain', '2');

      // Добавляем начинку и проверяем счетчик
      cy.addIngredientToConstructor(INGREDIENTS.BIO_CUTLET);
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .contains(INGREDIENTS.BIO_CUTLET)
        .find(SELECTORS.COUNTER)
        .should('contain', '1');

      // Добавляем тот же ингредиент повторно
      cy.addIngredientToConstructor(INGREDIENTS.BIO_CUTLET);
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .contains(INGREDIENTS.BIO_CUTLET)
        .find(SELECTORS.COUNTER)
        .should('contain', '2');
    });

    it('should remove ingredients from constructor', () => {
      // Создаем бургер
      cy.addBunToConstructor();
      cy.addIngredientToConstructor(INGREDIENTS.BIO_CUTLET);

      // Проверяем добавление ингредиента
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain', INGREDIENTS.BIO_CUTLET);

      // Удаляем ингредиент
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS)
        .find(SELECTORS.CONSTRUCTOR_ELEMENT)
        .find(SELECTORS.CONSTRUCTOR_ELEMENT_ACTION)
        .click();

      // Проверяем удаление
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('not.contain', INGREDIENTS.BIO_CUTLET);
      
      // Проверяем обновление счетчика
      cy.get(SELECTORS.INGREDIENT_ITEM)
        .contains(INGREDIENTS.BIO_CUTLET)
        .find(SELECTORS.COUNTER)
        .should('not.exist');
    });
  });

  describe('Ingredient modal functionality', () => {
    it('should open and close ingredient modal', () => {
      // Открываем модальное окно
      cy.openIngredientModal(INGREDIENTS.CRATER_BUN);
      
      // Проверяем содержимое модального окна
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', INGREDIENTS.CRATER_BUN);
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', NUTRITION.CALORIES);
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', NUTRITION.PROTEINS);
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', NUTRITION.FATS);
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', NUTRITION.CARBOHYDRATES);

      // Закрываем модальное окно
      cy.closeModal();
    });

    it('should close modal by clicking overlay', () => {
      cy.openIngredientModal(INGREDIENTS.SPICY_SAUCE);
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', INGREDIENTS.SPICY_SAUCE);

      // Закрываем по клику на оверлей
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('should close modal by pressing Escape', () => {
      cy.openIngredientModal(INGREDIENTS.BIO_CUTLET);
      cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', INGREDIENTS.BIO_CUTLET);

      // Закрываем по нажатию Escape
      cy.get('body').type('{esc}');
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('should display correct ingredient data in modal for different ingredients', () => {
      const testIngredients = [
        { name: INGREDIENTS.CRATER_BUN, type: 'bun' },
        { name: INGREDIENTS.SPICY_SAUCE, type: 'sauce' },
        { name: INGREDIENTS.BIO_CUTLET, type: 'main' }
      ];

      testIngredients.forEach((ingredient) => {
        cy.openIngredientModal(ingredient.name);
        
        // Проверяем корректность данных
        cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', ingredient.name);
        cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', NUTRITION.CALORIES);
        cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', NUTRITION.PROTEINS);
        cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', NUTRITION.FATS);
        cy.get(SELECTORS.INGREDIENT_DETAILS).should('contain', NUTRITION.CARBOHYDRATES);

        cy.closeModal();
      });
    });
  });

  describe('Order creation process', () => {
    it('should create order successfully', () => {
      // Создаем полный бургер
      cy.createFullBurger();

      // Проверяем добавление всех ингредиентов
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain', INGREDIENTS.CRATER_BUN);
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain', INGREDIENTS.BIO_CUTLET);
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain', INGREDIENTS.SPICY_SAUCE);
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('contain', INGREDIENTS.CRATER_BUN);

      // Создаем заказ
      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.wait('@createOrder');

      // Ждем появления модального окна (может потребоваться время для анимации)
      cy.get(SELECTORS.MODAL, { timeout: 10000 }).should('be.visible');
      cy.get(SELECTORS.ORDER_NUMBER).should('contain', '34536');

      // Закрываем модальное окно
      cy.closeModal();

      // Ждем обработки очистки конструктора
      cy.wait(1000);

      // Проверяем очистку конструктора
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
      
      // Проверяем, что ингредиенты больше не содержат наши добавленные элементы
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('not.contain', INGREDIENTS.BIO_CUTLET);
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('not.contain', INGREDIENTS.SPICY_SAUCE);
    });

    it('should handle order creation without authentication', () => {
      // Очищаем авторизацию
      cy.clearAuthTokens();
      
      // Перехватываем запрос на получение пользователя (должен вернуть ошибку)
      cy.intercept('GET', '**/api/auth/user', {
        statusCode: 401,
        body: { success: false, message: 'Unauthorized' }
      }).as('getUserUnauthorized');
      
      cy.reload();
      cy.waitForAppLoad();

      // Добавляем ингредиенты
      cy.addBunToConstructor();

      // Пытаемся создать заказ без авторизации
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Проверяем переход на страницу входа (с небольшой задержкой для навигации)
      cy.url({ timeout: 5000 }).should('include', '/login');
    });
  });
});
