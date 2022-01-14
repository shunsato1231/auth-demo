import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~/store';

export type Severity = 'success' | 'error';

export interface AlertState {
  loading: boolean;
  alert: {
    message: string;
    severity: Severity;
    errorStatus?: string;
  };
}

const initialState: AlertState = {
  loading: false,
  alert: {
    message: '',
    severity: 'success',
  },
};

const slice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setAlert: (state, { payload: { message, severity, errorStatus } }) => {
      state.alert.severity = severity;
      state.alert.message = message;
      state.alert.errorStatus = errorStatus;
    },
  },
});

export default slice.reducer;
export const { setLoading, setAlert } = slice.actions;

export const alertSelector = (state: RootState): AlertState =>
  state.alertReducer;

export const loadingSelector = (state: RootState): boolean =>
  state.alertReducer.loading;

export const messageSelector = (state: RootState): string =>
  state.alertReducer.alert.message;

export const errorStatusSelector = (state: RootState): string | undefined =>
  state.alertReducer.alert.errorStatus;

export const severitySelector = (state: RootState): Severity =>
  state.alertReducer.alert.severity;
