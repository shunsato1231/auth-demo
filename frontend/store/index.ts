import { configureStore } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

import authReducer from '../store/auth';
import alertReducer from '../store/alert';

export const store = configureStore({
  reducer: {
    authReducer: authReducer,
    alertReducer: alertReducer,
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
