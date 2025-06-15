import orderReducer, { createOrder, clearOrder } from '../orderSlice';
import { TOrder } from '../../../utils/types';

const mockOrder: TOrder = {
  _id: '67654321',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2023-12-07T17:00:00.000Z',
  updatedAt: '2023-12-07T17:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2', '3']
};

describe('orderSlice', () => {
  const initialState = {
    order: null,
    isLoading: false,
    error: null
  };

  test('should return the initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      order: null,
      isLoading: true,
      error: null
    });
  });

  test('should handle createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      order: mockOrder,
      isLoading: false,
      error: null
    });
  });

  test('should handle createOrder.rejected', () => {
    const errorMessage = 'Failed to create order';
    const action = {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      order: null,
      isLoading: false,
      error: errorMessage
    });
  });

  test('should handle createOrder.rejected without error message', () => {
    const action = {
      type: createOrder.rejected.type,
      error: {}
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      order: null,
      isLoading: false,
      error: 'Failed to create order'
    });
  });

  test('should handle clearOrder', () => {
    const stateWithOrder = {
      order: mockOrder,
      isLoading: false,
      error: null
    };

    const action = clearOrder();
    const state = orderReducer(stateWithOrder, action);

    expect(state).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
  });

  test('should clear error when starting new order request', () => {
    const stateWithError = {
      order: null,
      isLoading: false,
      error: 'Previous error'
    };

    const action = { type: createOrder.pending.type };
    const state = orderReducer(stateWithError, action);

    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });
});
