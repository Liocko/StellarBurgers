import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    data: [],
    isLoading: false,
    error: null
  };

  test('should return the initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('should handle getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      data: [],
      isLoading: true,
      error: null
    });
  });

  test('should handle getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      data: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('should handle getIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      data: [],
      isLoading: false,
      error: errorMessage
    });
  });

  test('should handle getIngredients.rejected without error message', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: {}
    };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      data: [],
      isLoading: false,
      error: 'Failed to fetch ingredients'
    });
  });

  test('should clear error when starting new request', () => {
    const stateWithError = {
      data: [],
      isLoading: false,
      error: 'Previous error'
    };

    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(stateWithError, action);

    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });
});
