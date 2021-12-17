import {
  CSRF_ACCESS_TOKEN_NAME,
  CSRF_REFRESH_TOKEN_NAME,
  IError,
} from '@utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from '~/utils/getCookie';

export interface Error {
  field: string;
  code: string;
  message: string;
}

export interface ErrorResponse {
  resource: string;
  code: string;
  message: string;
  errors?: [Error];
}

export interface User {
  email: string;
  mfaEnabled: boolean;
  token: string;
}

const http = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

const getRefreshToken = () =>
  http
    .post(
      'api/auth/refresh_token',
      {},
      {
        withCredentials: true,
        headers: { 'X-CSRF-TOKEN': getCookie(CSRF_REFRESH_TOKEN_NAME) || '' },
      }
    )
    .then(() => getCookie(CSRF_ACCESS_TOKEN_NAME));

let refreshTokenPromise: Promise<string | undefined> | null;

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (
      error.response.data.code !== 'invalid_token' ||
      error.response.data.resource === 'refresh_token' ||
      error.config._retry
    ) {
      return Promise.reject(error);
    }

    if (!refreshTokenPromise) {
      error.config._retry = true;
      refreshTokenPromise = getRefreshToken().then((token) => {
        refreshTokenPromise = null;
        return token;
      });
    }

    return refreshTokenPromise.then((token) => {
      error.config.headers['X-CSRF-TOKEN'] = token;
      return http.request(error.config);
    });
  }
);

const get = async <T extends unknown>(
  url: string,
  params?: { [key: string]: unknown },
  timeout?: number,
  setCsrfAccessToken = true
) => {
  const config: { [index: string]: unknown } = {};
  const XCsrfTokenHeader = {
    'X-CSRF-TOKEN': getCookie(CSRF_ACCESS_TOKEN_NAME) || '',
  };

  if (setCsrfAccessToken) config.headers = XCsrfTokenHeader;
  if (params) config.params = params;
  if (timeout) config.timeout = timeout;

  return http.get<unknown, AxiosResponse<T>>(url, config);
};

const post = async <T extends unknown>(
  url: string,
  params = {},
  timeout?: number,
  setCsrfAccessToken = true
) => {
  const config: { [index: string]: unknown } = {};
  const XCsrfTokenHeader = {
    'X-CSRF-TOKEN': getCookie(CSRF_ACCESS_TOKEN_NAME) || '',
  };

  if (setCsrfAccessToken) config.headers = XCsrfTokenHeader;
  if (timeout) config.timeout = timeout;

  return http.post<unknown, AxiosResponse<T>>(url, params, config);
};

const handleError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    throw (err as AxiosError<IError>).response?.data;
  } else {
    throw err;
  }
};

export default {
  signUp: async (email: string, password: string): Promise<User> => {
    try {
      const res = await post<User>('/api/auth/signUp', { email, password });
      const user = res.data;
      return user;
    } catch (err) {
      return handleError(err);
    }
  },
  signIn: async (email: string, password: string): Promise<User> => {
    try {
      const res = await post<User>('/api/auth/signIn', { email, password });
      const user = res.data;
      return user;
    } catch (err) {
      return handleError(err);
    }
  },
  signOut: async (): Promise<void> => {
    try {
      await post('/api/auth/signout');
    } catch (err) {
      return handleError(err);
    }
  },
  verifyMfa: async (code: string): Promise<void> => {
    try {
      await post<string>('/api/auth/verify_mfa', { code });
    } catch (err) {
      return handleError(err);
    }
  },
  getMfaQr: async (): Promise<string> => {
    try {
      const res = await get<string>('/api/auth/mfa_qr_code');
      const qrCode = res.data;

      return qrCode;
    } catch (err) {
      return handleError(err);
    }
  },
  getMfaSettingCode: async (): Promise<string> => {
    try {
      const res = await get<string>('/api/auth/mfa_setting_code');
      const code = res.data;
      return code;
    } catch (err) {
      return handleError(err);
    }
  },
  enableMfa: async (code1: string, code2: string): Promise<void> => {
    try {
      await post<string>('/api/auth/enable_mfa', { code1, code2 });
    } catch (err) {
      return handleError(err);
    }
  },
};
