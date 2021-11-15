import axios, { AxiosError, AxiosResponse } from 'axios';
import { Buffer } from 'buffer';

const ACCCESS_TOKEN_KEY = 'access_token';
interface IHeaders {
  accept?: string;
  authorizeation?: string;
  Authorization?: string;
  'Content-Type'?: string;
}

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

const getToken = async () => {
  try {
    const item = window.localStorage.getItem(ACCCESS_TOKEN_KEY);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    return null;
  }
};

const setToken = async (token: string) => {
  try {
    window.localStorage.setItem(ACCCESS_TOKEN_KEY, JSON.stringify(token));
  } catch (error) {
    return null;
  }
};

const getHeaders = async (
  accept = null,
  authorization = null,
  contentType = 'application/json'
) => {
  const result: IHeaders = {};
  const userToken = await getToken();

  if (accept) result['accept'] = accept;
  if (authorization) result['Authorization'] = authorization;
  if (userToken && !authorization) {
    result['Authorization'] = 'Bearer ' + userToken;
  }
  if (contentType) result['Content-Type'] = contentType;

  return result;
};

const handleError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    throw (err as AxiosError<ErrorResponse>).response?.data;
  } else {
    throw err;
  }
};

const get = async <T extends unknown>(
  url: string,
  params?: { [index: string]: unknown },
  headers?: IHeaders,
  timeout?: number,
  responseTypes = 'json'
) => {
  const defaultHeaders = await getHeaders();
  const config: { [index: string]: unknown } = {};

  config.headers = headers ? headers : defaultHeaders;
  config.responseType = responseTypes;
  if (params) config.params = params;
  if (timeout) config.timeout = timeout;

  const result = axios.get<T>(url, config);
  return result;
};

const post = async <T extends unknown>(
  url: string,
  params = {},
  headers?: IHeaders,
  timeout?: number
) => {
  const defaultHeaders = await getHeaders();
  const config: { [index: string]: unknown } = {};

  config.headers = headers ? headers : defaultHeaders;
  if (timeout) config.timeout = timeout;

  const result = axios.post<unknown, AxiosResponse<T>>(url, params, config);
  return result;
};

export default {
  signUp: async (email: string, password: string): Promise<User> => {
    try {
      const res = await post<User>('/api/auth/signUp', { email, password });
      const user = res.data;
      setToken(user.token);
      return user;
    } catch (err) {
      return handleError(err);
    }
  },
  signIn: async (email: string, password: string): Promise<User> => {
    try {
      const res = await post<User>('/api/auth/signIn', { email, password });
      const user = res.data;
      setToken(user.token);
      return user;
    } catch (err) {
      return handleError(err);
    }
  },
  signOut: async (): Promise<void> => {
    await setToken('');
  },
  verifyMfa: async (code: string): Promise<string> => {
    try {
      const res = await post<string>('/api/auth/verify_mfa', { code });
      const token = res.data;
      setToken(token);
      return token;
    } catch (err) {
      return handleError(err);
    }
  },
  getMfaQr: async (): Promise<string> => {
    try {
      const res = await get<string>(
        '/api/auth/mfa_qr_code',
        undefined,
        undefined,
        undefined,
        'arraybuffer'
      );
      const base64 = Buffer.from(res.data, 'binary').toString('base64');
      const prefix = `data:${res.headers['content-type']};base64,`;

      return prefix + base64;
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
  enabledMfa: async (code1: string, code2: string): Promise<string> => {
    try {
      const res = await post<string>('/api/auth/enabled_mfa', { code1, code2 });
      setToken(res.data);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },
};
