import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice, constructorSlice, orderSlice, userSlice } from '../slices';

const rootReducer = {
  ingredients: ingredientsSlice,
  burgerConstructor: constructorSlice,
  order: orderSlice,
  user: userSlice
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
    expect(state).toHaveProperty('user');
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

    expect(state.user).toEqual({
      user: null,
      isAuthenticated: false,
      isAuthChecked: false,
      loginUserRequest: false,
      loginUserError: null,
      registerUserRequest: false,
      registerUserError: null,
      logoutUserRequest: false,
      forgotPasswordRequest: false,
      forgotPasswordSuccess: false,
      resetPasswordRequest: false,
      resetPasswordSuccess: false,
      updateUserRequest: false,
      updateUserError: null
    });
  });
});
