import { configureStore } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

import authReducer from '../store/auth';

export const store = configureStore({
  reducer: {
    authReducer: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/getMfaQr/rejected'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = ThunkDispatch<RootState, void, Action>;
