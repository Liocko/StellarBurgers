import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice, constructorSlice, orderSlice } from '../slices';

const rootReducer = {
  ingredients: ingredientsSlice,
  burgerConstructor: constructorSlice,
  order: orderSlice
};

describe('rootReducer', () => {
  test('should return the initial state when called with undefined state and unknown action', () => {
    const store = configureStore({
      reducer: rootReducer
    });
    
    const state = store.getState();
    
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
  });

  test('should have correct initial state structure', () => {
    const store = configureStore({
      reducer: rootReducer
    });
    
    const state = store.getState();
    
    expect(state.ingredients).toEqual({
      data: [],
      isLoading: false,
      error: null
    });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(state.order).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
  });
});
