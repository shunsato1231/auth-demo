import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { User, ErrorResponse } from '~/api';
import { RootState } from '..';

export const signUp = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: ErrorResponse }
>('auth/signUp', async ({ email, password }, thunkAPI) => {
  try {
    return await api.signUp(email, password);
  } catch (err) {
    const res = err as ErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const signIn = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: ErrorResponse }
>('auth/signIn', async ({ email, password }, thunkAPI) => {
  try {
    return await api.signIn(email, password);
  } catch (err) {
    const res = err as ErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const signOut = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: string }
>('auth/signOut', async (_, thunkAPI) => {
  try {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        data: 'dataToServiceWorker',
      });
    } else {
      throw new Error();
    }
  } catch (err) {
    return thunkAPI.rejectWithValue(String(err));
  }
});

export const verifyMfa = createAsyncThunk<
  undefined,
  string,
  { rejectValue: ErrorResponse }
>('auth/verifyMfa', async (code, thunkAPI) => {
  try {
    await api.verifyMfa(code);
  } catch (err) {
    const res = err as ErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const getMfaQr = createAsyncThunk<
  string,
  undefined,
  { rejectValue: ErrorResponse }
>('auth/getMfaQr', async (_, thunkAPI) => {
  try {
    return await api.getMfaQr();
  } catch (err) {
    const res = err as ErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const getMfaSettingCode = createAsyncThunk<
  string,
  undefined,
  { rejectValue: ErrorResponse }
>('auth/getMfaSettingCode', async (_, thunkAPI) => {
  try {
    return await api.getMfaSettingCode();
  } catch (err) {
    const res = err as ErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const enableMfa = createAsyncThunk<
  undefined,
  { code1: string; code2: string },
  { rejectValue: ErrorResponse }
>('auth/enableMfa', async ({ code1, code2 }, thunkAPI) => {
  try {
    await api.enableMfa(code1, code2);
  } catch (err) {
    const res = err as ErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export type Severity = 'success' | 'error';

export interface AuthState {
  email: string;
  mfaEnabled: boolean;
  mfaVerified: boolean;
  tokenVerified: boolean;
  loading: boolean;
  alert: {
    message: string;
    severity: 'success' | 'error';
    errorStatus: string;
  };
}

const initialState: AuthState = {
  email: '',
  mfaEnabled: false,
  mfaVerified: false,
  tokenVerified: false,
  loading: false,
  alert: {
    message: '',
    severity: 'success',
    errorStatus: '',
  },
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * signUp
     */
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signUp.fulfilled, (state) => {
      state.loading = false;
      state.mfaEnabled = false;
      state.tokenVerified = false;
      state.alert = {
        severity: 'success',
        message: '新規登録が完了しました。サインインしてください。',
        errorStatus: '',
      };
    });
    builder.addCase(signUp.rejected, (state, { payload }) => {
      state.loading = false;
      state.alert = {
        severity: 'error',
        message: payload?.message || '',
        errorStatus: payload?.errorStatus || '',
      };
      if (payload?.code === 'invalid_token') {
        state.tokenVerified = false;
        state.mfaVerified = false;
      }
    });
    /**
     * signIn
     */
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signIn.fulfilled, (state, { payload }) => {
      state.email = payload.email;
      state.loading = false;
      state.mfaEnabled = payload.mfaEnabled;
      state.mfaVerified = false;
      state.tokenVerified = true;
      state.alert = {
        severity: 'success',
        message: 'サインインしました',
        errorStatus: '',
      };
    });
    builder.addCase(signIn.rejected, (state, { payload }) => {
      state.loading = false;
      state.mfaEnabled = false;
      state.mfaVerified = false;
      state.tokenVerified = false;
      state.alert = {
        severity: 'error',
        message: payload?.message || '',
        errorStatus: payload?.errorStatus || '',
      };
      if (payload?.code === 'invalid_token') {
        state.tokenVerified = false;
        state.mfaVerified = false;
      }
    });
    /**
     * signOut
     */
    builder.addCase(signOut.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.loading = false;
      state.email = '';
      state.mfaEnabled = false;
      state.mfaVerified = false;
      state.tokenVerified = false;
      state.alert = {
        severity: 'success',
        message: 'サインアウトしました',
        errorStatus: '',
      };
    });
    builder.addCase(signOut.rejected, (state) => {
      state.loading = false;
      state.alert = {
        severity: 'error',
        message: 'サインアウト時にエラーが発生しました。',
        errorStatus: '',
      };
    });
    /**
     * verifyMfa
     */
    builder.addCase(verifyMfa.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyMfa.fulfilled, (state) => {
      state.loading = false;
      state.mfaVerified = true;
      state.alert = {
        severity: 'success',
        message: '2段階認証が完了しました',
        errorStatus: '',
      };
    });
    builder.addCase(verifyMfa.rejected, (state, { payload }) => {
      state.loading = false;
      state.alert = {
        severity: 'error',
        message: payload?.message || '',
        errorStatus: payload?.errorStatus || '',
      };
      if (payload?.code === 'invalid_token') {
        state.tokenVerified = false;
        state.mfaVerified = false;
      }
    });
    /**
     * getMfaQr
     */
    builder.addCase(getMfaQr.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMfaQr.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getMfaQr.rejected, (state, { payload }) => {
      state.loading = false;
      state.alert = {
        severity: 'error',
        message: payload?.message || '',
        errorStatus: payload?.errorStatus || '',
      };
      if (payload?.code === 'invalid_token') {
        state.tokenVerified = false;
        state.mfaVerified = false;
      }
    });
    /**
     * getMfaSettingCode
     */
    builder.addCase(getMfaSettingCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMfaSettingCode.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getMfaSettingCode.rejected, (state, { payload }) => {
      state.loading = false;
      state.alert = {
        severity: 'error',
        message: payload?.message || '',
        errorStatus: payload?.errorStatus || '',
      };
      if (payload?.code === 'invalid_token') {
        state.tokenVerified = false;
        state.mfaVerified = false;
      }
    });
    /**
     * enableMfa
     */
    builder.addCase(enableMfa.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(enableMfa.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(enableMfa.rejected, (state, { payload }) => {
      state.loading = false;
      state.alert = {
        severity: 'error',
        message: payload?.message || '',
        errorStatus: payload?.errorStatus || '',
      };
      if (payload?.code === 'invalid_token') {
        state.tokenVerified = false;
        state.mfaVerified = false;
      }
    });
  },
});

export default slice.reducer;

export const authSelector = (state: RootState): AuthState => state.authReducer;
