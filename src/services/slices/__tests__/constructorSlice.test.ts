import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '../../../utils/types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun_large.png',
  image_mobile: 'bun_mobile.png'
};

const mockIngredient: TIngredient = {
  _id: '2',
  name: 'Начинка',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'ingredient.png',
  image_large: 'ingredient_large.png',
  image_mobile: 'ingredient_mobile.png'
};

const mockSauce: TIngredient = {
  _id: '3',
  name: 'Соус',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce_large.png',
  image_mobile: 'sauce_mobile.png'
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('should return the initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle adding a bun', () => {
    const actual = constructorReducer(initialState, addIngredient(mockBun));
    expect(actual.bun).toEqual(expect.objectContaining(mockBun));
    expect(actual.bun).toHaveProperty('id');
    expect(actual.ingredients).toEqual([]);
  });

  test('should replace existing bun when adding new bun', () => {
    const stateWithBun = {
      bun: mockBun,
      ingredients: []
    };
    
    const newBun = { ...mockBun, _id: '4', name: 'Новая булка' };
    const actual = constructorReducer(stateWithBun, addIngredient(newBun));
    
    expect(actual.bun).toEqual(expect.objectContaining(newBun));
    expect(actual.bun).toHaveProperty('id');
    expect(actual.ingredients).toEqual([]);
  });

  test('should handle adding an ingredient', () => {
    const actual = constructorReducer(initialState, addIngredient(mockIngredient));
    expect(actual.bun).toBeNull();
    expect(actual.ingredients).toHaveLength(1);
    expect(actual.ingredients[0]).toEqual(
      expect.objectContaining({
        ...mockIngredient,
        id: expect.any(String)
      })
    );
  });

  test('should handle adding multiple ingredients', () => {
    let state = constructorReducer(initialState, addIngredient(mockIngredient));
    state = constructorReducer(state, addIngredient(mockSauce));
    
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining(mockIngredient)
    );
    expect(state.ingredients[1]).toEqual(
      expect.objectContaining(mockSauce)
    );
  });

  test('should handle removing an ingredient', () => {
    const stateWithIngredient = constructorReducer(initialState, addIngredient(mockIngredient));
    const ingredientId = stateWithIngredient.ingredients[0].id;
    
    const actual = constructorReducer(stateWithIngredient, removeIngredient(ingredientId));
    expect(actual.ingredients).toHaveLength(0);
    expect(actual.bun).toBeNull();
  });

  test('should handle moving ingredients', () => {
    let state = constructorReducer(initialState, addIngredient(mockIngredient));
    state = constructorReducer(state, addIngredient(mockSauce));
    
    const actual = constructorReducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    
    expect(actual.ingredients).toHaveLength(2);
    expect(actual.ingredients[0]).toEqual(
      expect.objectContaining(mockSauce)
    );
    expect(actual.ingredients[1]).toEqual(
      expect.objectContaining(mockIngredient)
    );
  });

  test('should handle clearing constructor', () => {
    let state = constructorReducer(initialState, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockIngredient));
    
    const actual = constructorReducer(state, clearConstructor());
    expect(actual).toEqual(initialState);
  });
});
