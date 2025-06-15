/**
 * @jest-environment jsdom
 */
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  registerUser,
  loginUser,
  checkUserAuth,
  updateUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  setUser,
  clearUser,
  setAuthChecked
} from '../userSlice';
import { AppDispatch } from '../../store';

// Mock API functions
jest.mock('../../../utils/burger-api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

const {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} = require('../../../utils/burger-api');

const { setCookie, deleteCookie } = require('../../../utils/cookie');

// Mock localStorage
const localStorageMock = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('userSlice', () => {
  let store: ReturnType<typeof configureStore<{ user: ReturnType<typeof userReducer> }>>;

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockAuthResponse = {
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token'
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer
      }
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().user;
      expect(state).toEqual({
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

  describe('synchronous actions', () => {
    it('should handle setUser', () => {
      store.dispatch(setUser(mockUser));
      const state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle clearUser', () => {
      store.dispatch(setUser(mockUser));
      store.dispatch(clearUser());
      const state = store.getState().user;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle setAuthChecked', () => {
      store.dispatch(setAuthChecked(true));
      const state = store.getState().user;
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('registerUser async action', () => {
    it('should handle registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(undefined, action);
      expect(state.registerUserRequest).toBe(true);
      expect(state.registerUserError).toBeNull();
    });

    it('should handle registerUser.fulfilled', async () => {
      registerUserApi.mockResolvedValue(mockAuthResponse);

      await (store.dispatch as AppDispatch)(registerUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }));

      const state = store.getState().user;
      expect(state.registerUserRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'mock-access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token');
    });

    it('should handle registerUser.rejected', async () => {
      const errorMessage = 'Registration failed';
      registerUserApi.mockRejectedValue(new Error(errorMessage));

      await (store.dispatch as AppDispatch)(registerUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }));

      const state = store.getState().user;
      expect(state.registerUserRequest).toBe(false);
      expect(state.registerUserError).toBe(errorMessage);
    });
  });

  describe('loginUser async action', () => {
    it('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(undefined, action);
      expect(state.loginUserRequest).toBe(true);
      expect(state.loginUserError).toBeNull();
    });

    it('should handle loginUser.fulfilled', async () => {
      loginUserApi.mockResolvedValue(mockAuthResponse);

      await (store.dispatch as AppDispatch)(loginUser({
        email: 'test@example.com',
        password: 'password123'
      }));

      const state = store.getState().user;
      expect(state.loginUserRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'mock-access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token');
    });

    it('should handle loginUser.rejected', async () => {
      const errorMessage = 'Login failed';
      loginUserApi.mockRejectedValue(new Error(errorMessage));

      await (store.dispatch as AppDispatch)(loginUser({
        email: 'test@example.com',
        password: 'password123'
      }));

      const state = store.getState().user;
      expect(state.loginUserRequest).toBe(false);
      expect(state.loginUserError).toBe(errorMessage);
    });
  });

  describe('checkUserAuth async action', () => {
    it('should handle checkUserAuth.fulfilled', async () => {
      getUserApi.mockResolvedValue({ user: mockUser });

      await (store.dispatch as AppDispatch)(checkUserAuth());

      const state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle checkUserAuth.rejected', async () => {
      getUserApi.mockRejectedValue(new Error('Auth check failed'));

      await (store.dispatch as AppDispatch)(checkUserAuth());

      const state = store.getState().user;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser async action', () => {
    it('should handle updateUser.pending', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(undefined, action);
      expect(state.updateUserRequest).toBe(true);
      expect(state.updateUserError).toBeNull();
    });

    it('should handle updateUser.fulfilled', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      updateUserApi.mockResolvedValue({ user: updatedUser });

      await (store.dispatch as AppDispatch)(updateUser({ name: 'Updated Name' }));

      const state = store.getState().user;
      expect(state.updateUserRequest).toBe(false);
      expect(state.user).toEqual(updatedUser);
    });

    it('should handle updateUser.rejected', async () => {
      const errorMessage = 'Update failed';
      updateUserApi.mockRejectedValue(new Error(errorMessage));

      await (store.dispatch as AppDispatch)(updateUser({ name: 'Updated Name' }));

      const state = store.getState().user;
      expect(state.updateUserRequest).toBe(false);
      expect(state.updateUserError).toBe(errorMessage);
    });
  });

  describe('logoutUser async action', () => {
    it('should handle logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = userReducer(undefined, action);
      expect(state.logoutUserRequest).toBe(true);
    });

    it('should handle logoutUser.fulfilled', async () => {
      logoutApi.mockResolvedValue({});

      await (store.dispatch as AppDispatch)(logoutUser());

      const state = store.getState().user;
      expect(state.logoutUserRequest).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    it('should handle logoutUser.rejected', async () => {
      logoutApi.mockRejectedValue(new Error('Logout failed'));

      await (store.dispatch as AppDispatch)(logoutUser());

      const state = store.getState().user;
      expect(state.logoutUserRequest).toBe(false);
    });
  });

  describe('forgotPassword async action', () => {
    it('should handle forgotPassword.pending', () => {
      const action = { type: forgotPassword.pending.type };
      const state = userReducer(undefined, action);
      expect(state.forgotPasswordRequest).toBe(true);
      expect(state.forgotPasswordSuccess).toBe(false);
    });

    it('should handle forgotPassword.fulfilled', async () => {
      forgotPasswordApi.mockResolvedValue({ success: true });

      await (store.dispatch as AppDispatch)(forgotPassword({ email: 'test@example.com' }));

      const state = store.getState().user;
      expect(state.forgotPasswordRequest).toBe(false);
      expect(state.forgotPasswordSuccess).toBe(true);
    });

    it('should handle forgotPassword.rejected', async () => {
      forgotPasswordApi.mockRejectedValue(new Error('Forgot password failed'));

      await (store.dispatch as AppDispatch)(forgotPassword({ email: 'test@example.com' }));

      const state = store.getState().user;
      expect(state.forgotPasswordRequest).toBe(false);
      expect(state.forgotPasswordSuccess).toBe(false);
    });
  });

  describe('resetPassword async action', () => {
    it('should handle resetPassword.pending', () => {
      const action = { type: resetPassword.pending.type };
      const state = userReducer(undefined, action);
      expect(state.resetPasswordRequest).toBe(true);
      expect(state.resetPasswordSuccess).toBe(false);
    });

    it('should handle resetPassword.fulfilled', async () => {
      resetPasswordApi.mockResolvedValue({ success: true });

      await (store.dispatch as AppDispatch)(resetPassword({ password: 'newpassword', token: 'reset-token' }));

      const state = store.getState().user;
      expect(state.resetPasswordRequest).toBe(false);
      expect(state.resetPasswordSuccess).toBe(true);
    });

    it('should handle resetPassword.rejected', async () => {
      resetPasswordApi.mockRejectedValue(new Error('Reset password failed'));

      await (store.dispatch as AppDispatch)(resetPassword({ password: 'newpassword', token: 'reset-token' }));

      const state = store.getState().user;
      expect(state.resetPasswordRequest).toBe(false);
      expect(state.resetPasswordSuccess).toBe(false);
    });
  });
});
