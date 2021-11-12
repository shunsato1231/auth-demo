import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { IUser, IErrorResponse } from '~/api';
import { RootState } from '..';

export const signUp = createAsyncThunk<
  IUser,
  { email: string; password: string },
  { rejectValue: IErrorResponse }
>('auth/signUp', async ({ email, password }, thunkAPI) => {
  try {
    return await api.signUp(email, password);
  } catch (err) {
    const res = err as IErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const signIn = createAsyncThunk<
  IUser,
  { email: string; password: string },
  { rejectValue: IErrorResponse }
>('auth/signIn', async ({ email, password }, thunkAPI) => {
  try {
    return await api.signIn(email, password);
  } catch (err) {
    const res = err as IErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const signOut = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: string }
>('auth/signOut', async (_, thunkAPI) => {
  try {
    await api.signOut();
  } catch (err) {
    return thunkAPI.rejectWithValue(String(err));
  }
});

export const verifyMfa = createAsyncThunk<
  undefined,
  string,
  { rejectValue: IErrorResponse }
>('auth/verifyMfa', async (code, thunkAPI) => {
  try {
    await api.verifyMfa(code);
  } catch (err) {
    const res = err as IErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const getMfaQr = createAsyncThunk<
  string,
  undefined,
  { rejectValue: IErrorResponse }
>('auth/getMfaQr', async (_, thunkAPI) => {
  try {
    return await api.getMfaQr();
  } catch (err) {
    const res = err as IErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const getMfaSettingCode = createAsyncThunk<
  string,
  undefined,
  { rejectValue: IErrorResponse }
>('auth/getMfaSettingCode', async (_, thunkAPI) => {
  try {
    return await api.getMfaSettingCode();
  } catch (err) {
    const res = err as IErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export const enabledMfa = createAsyncThunk<
  undefined,
  { code1: string; code2: string },
  { rejectValue: IErrorResponse }
>('auth/enabledMfa', async ({ code1, code2 }, thunkAPI) => {
  try {
    await api.enabledMfa(code1, code2);
  } catch (err) {
    const res = err as IErrorResponse;
    return thunkAPI.rejectWithValue(res);
  }
});

export interface IAuthState {
  mfaEnabled: boolean;
  mfaVerified: boolean;
  tokenVerified: boolean;
  loading: boolean;
}

const initialState: IAuthState = {
  mfaEnabled: false,
  mfaVerified: false,
  tokenVerified: false,
  loading: false,
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
      state.tokenVerified = true;
    });
    builder.addCase(signUp.rejected, (state) => {
      state.loading = false;
      state.mfaEnabled = false;
      state.mfaVerified = false;
      state.tokenVerified = false;
    });
    /**
     * signIn
     */
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signIn.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.mfaEnabled = payload.mfaEnabled;
      state.mfaVerified = false;
      state.tokenVerified = true;
    });
    builder.addCase(signIn.rejected, (state) => {
      state.loading = false;
      state.mfaEnabled = false;
      state.mfaVerified = false;
      state.tokenVerified = false;
    });
    /**
     * signOut
     */
    builder.addCase(signOut.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.loading = false;

      state.mfaEnabled = false;
      state.mfaVerified = false;
      state.tokenVerified = false;
    });
    builder.addCase(signOut.rejected, (state) => {
      state.loading = false;
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
    });
    builder.addCase(verifyMfa.rejected, (state) => {
      state.loading = false;
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
    builder.addCase(getMfaQr.rejected, (state) => {
      state.loading = false;
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
    builder.addCase(getMfaSettingCode.rejected, (state) => {
      state.loading = false;
    });
    /**
     * enabledMfa
     */
    builder.addCase(enabledMfa.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(enabledMfa.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(enabledMfa.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default slice.reducer;

export const authSelector = (state: RootState): IAuthState => state.authReducer;
