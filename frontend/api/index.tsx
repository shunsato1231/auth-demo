export interface ErrorResponse {
  resource: string;
  code: string;
  message: string;
  errors?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
  errorStatus?: string;
}

export interface User {
  email: string;
  mfaEnabled: boolean;
  token: string;
}

const fetchAPI = async (
  url: string,
  options: { [key: string]: unknown },
  ms: number,
  abortMessage: string,
  abortSignal?: AbortSignal
) => {
  let errorMessage = '';
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    errorMessage = 'サーバからの応答がありません';
    controller.abort();
  }, ms);
  if (abortSignal) {
    abortSignal.addEventListener('abort', () => controller.abort());
    errorMessage = abortMessage;
  }
  const promise = window.fetch(url, { signal: controller.signal, ...options });
  return promise
    .finally(() => clearTimeout(timeout))
    .catch((err) => {
      return err;
    })
    .then((res) => handleError(res, url, errorMessage));
};

export const get = async (
  url: string,
  params?: { [key: string]: unknown },
  ms = 5000,
  abortSignal?: AbortSignal,
  abortMessage = '通信が中断されました'
): Promise<unknown> => {
  const options: { [index: string]: unknown } = {};
  options.method = 'GET';
  options.headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (params) options.params = JSON.stringify(params);

  return fetchAPI(url, options, ms, abortMessage, abortSignal);
};

export const post = async (
  url: string,
  body?: { [key: string]: unknown },
  ms = 5000,
  abortSignal?: AbortSignal,
  abortMessage = '通信が中断されました'
): Promise<unknown> => {
  const options: { [index: string]: unknown } = {};
  options.method = 'POST';
  options.headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (body) options.body = JSON.stringify(body);

  return fetchAPI(url, options, ms, abortMessage, abortSignal);
};

const handleError = async (
  res: Response,
  url: string,
  errorMessage?: string
) => {
  if (res.ok) {
    return res.json();
  }

  let error;

  try {
    await res.json().then((err) => {
      error = err;
    });
  } catch {
    let errorStatus;
    switch (errorMessage) {
      case 'サーバからの応答がありません':
        errorStatus = '[504] Gateway Timeout';
        break;
      default:
        errorStatus = res?.status ? `[${res.status}] ${res.statusText}` : '';
        break;
    }

    error = {
      resource: url,
      code: res.status || 'unexpected_failure',
      message: errorMessage || 'エラーが発生しました。',
      errorStatus,
    };
  }

  throw error;
};

export default {
  signUp: async (email: string, password: string): Promise<User> => {
    const res = await post('/api/auth/signUp', { email, password });
    return res as User;
  },
  signIn: async (email: string, password: string): Promise<User> => {
    const res = await post('/api/auth/signIn', { email, password });
    return res as User;
  },
  verifyMfa: async (code: string): Promise<void> => {
    await post('/api/auth/verify_mfa', { code });
  },
  getMfaQr: async (): Promise<string> => {
    const res = await get('/api/auth/mfa_qr_code');
    return res as string;
  },
  getMfaSettingCode: async (): Promise<string> => {
    const res = await get('/api/auth/mfa_setting_code');
    return res as string;
  },
  enableMfa: async (code1: string, code2: string): Promise<void> => {
    await post('/api/auth/enable_mfa', { code1, code2 });
  },
};
