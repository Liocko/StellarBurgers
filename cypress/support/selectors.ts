// Константы селекторов для Cypress тестов
export const SELECTORS = {
  // Основные секции
  INGREDIENTS_SECTION: '[data-cy="ingredients-section"]',
  CONSTRUCTOR_SECTION: '[data-cy="constructor-section"]',
  
  // Ингредиенты
  INGREDIENT_ITEM: '[data-cy="ingredient-item"]',
  ADD_INGREDIENT_BTN: '[data-cy="add-ingredient-btn"]',
  
  // Конструктор
  CONSTRUCTOR_BUN_TOP: '[data-cy="constructor-bun-top"]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-cy="constructor-bun-bottom"]',
  CONSTRUCTOR_INGREDIENTS: '[data-cy="constructor-ingredients"]',
  CONSTRUCTOR_ELEMENT: '[data-cy="constructor-element"]',
  
  // Кнопки и действия
  ORDER_BUTTON: '[data-cy="order-button"]',
  
  // Модальные окна
  MODAL: '[data-cy="modal"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  MODAL_CLOSE_BTN: '[data-cy="modal-close-btn"]',
  ORDER_MODAL: '[data-cy="order-modal"]',
  
  // Детали ингредиента
  INGREDIENT_DETAILS: '[data-cy="ingredient-details"]',
  ORDER_NUMBER: '[data-cy="order-number"]',
  
  // Счетчики
  COUNTER: '.counter',
  CONSTRUCTOR_ELEMENT_ACTION: '.constructor-element__action'
} as const;

// Константы текста ингредиентов для тестов
export const INGREDIENTS = {
  CRATER_BUN: 'Краторная булка N-200i',
  SPICY_SAUCE: 'Соус Spicy-X',
  BIO_CUTLET: 'Биокотлета из марсианской Магнолии'
} as const;

// Константы категорий
export const CATEGORIES = {
  BUNS: 'Булки',
  SAUCES: 'Соусы',
  FILLINGS: 'Начинки'
} as const;

// Константы для пищевой ценности
export const NUTRITION = {
  CALORIES: 'Калории',
  PROTEINS: 'Белки',
  FATS: 'Жиры',
  CARBOHYDRATES: 'Углеводы'
} as const;
