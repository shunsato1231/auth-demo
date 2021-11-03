import { useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useLocalStorage } from '~/hooks/LocalStorage/LocalStorage.hook';
import { User, Token } from './Auth.types';
import { Buffer } from 'buffer';

interface IErrorResponse {
  code: string;
  message: string;
  error_user_title: string;
  error_user_message: string;
}
export interface AuthContextType {
  flag: userFlagType;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifiedMfa: (code: string) => Promise<void>;
  getMfaQr: () => Promise<string>;
  getMfaSettingCode: () => Promise<string>;
  enabledMfa: (code1: string, code2: string) => Promise<void>;
}

export type userFlagType = {
  mfaEnabled: boolean;
  mfaVerified: boolean;
  tokenVerified: boolean;
};

export const useAuth = (): AuthContextType => {
  const [token, setToken] = useLocalStorage<string>('token', '');
  const initialAuth: userFlagType = {
    mfaEnabled: false,
    mfaVerified: false,
    tokenVerified: false,
  };
  const [flag, setFlag] = useLocalStorage<userFlagType>('flag', initialAuth);

  const signUp = useCallback(
    async (email: string, password: string) => {
      const url = '/api/auth/signUp';
      const data = {
        email,
        password,
      };

      try {
        const res = await axios({
          method: 'POST',
          url: url,
          data: data,
          withCredentials: true,
        });
        const user: User = res.data;

        await setToken(user.token);
        await setFlag({
          mfaEnabled: user.mfaEnabled,
          mfaVerified: false,
          tokenVerified: true,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw (err as AxiosError<IErrorResponse>).response?.data;
        } else {
          throw err;
        }
      }
    },
    [setFlag, setToken]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const url = '/api/auth/signIn';
      const data = {
        email,
        password,
      };

      try {
        const response = await axios({
          method: 'POST',
          url: url,
          data: data,
          withCredentials: true,
        });
        const user: User = response.data;
        await setToken(user.token);
        await setFlag({
          mfaEnabled: user.mfaEnabled,
          mfaVerified: false,
          tokenVerified: true,
        });
      } catch (err) {
        await setFlag({
          mfaEnabled: false,
          mfaVerified: false,
          tokenVerified: false,
        });

        if (axios.isAxiosError(err)) {
          throw (err as AxiosError<IErrorResponse>).response?.data;
        } else {
          throw err;
        }
      }
    },
    [setFlag, setToken]
  );

  const signOut = useCallback(async () => {
    await setToken('');
    await setFlag({
      mfaEnabled: false,
      mfaVerified: false,
      tokenVerified: false,
    });
  }, [setToken, setFlag]);

  const verifiedMfa = useCallback(
    async (code: string) => {
      const url = '/api/auth/verify_mfa';
      const headers = { Authorization: `Bearer ${token}` };
      const data = { code };
      try {
        const response = await axios({
          method: 'POST',
          url,
          data,
          headers,
          withCredentials: true,
        });
        // setToken
        const token: Token = response.data;
        await setToken(token);
        // setFlag
        await setFlag({
          ...flag,
          mfaVerified: true,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw (err as AxiosError<IErrorResponse>).response?.data;
        } else {
          throw err;
        }
      }
    },
    [setToken, setFlag, flag, token]
  );

  const getMfaQr = useCallback(async () => {
    const url = '/api/auth/mfa_qr_code';
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios({
        method: 'GET',
        url,
        headers,
        withCredentials: true,
        responseType: 'arraybuffer',
      });

      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const prefix = `data:${response.headers['content-type']};base64,`;

      return prefix + base64;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw (err as AxiosError<IErrorResponse>).response?.data;
      } else {
        throw err;
      }
    }
  }, [token]);

  const getMfaSettingCode = useCallback(async () => {
    const url = '/api/auth/mfa_setting_code';
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios({
        method: 'GET',
        url,
        headers,
        withCredentials: true,
      });

      return String(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw (err as AxiosError<IErrorResponse>).response?.data;
      } else {
        throw err;
      }
    }
  }, [token]);

  const enabledMfa = useCallback(
    async (code1: string, code2: string) => {
      const url = '/api/auth/enabled_mfa';
      const headers = { Authorization: `Bearer ${token}` };
      const data = { code1, code2 };
      try {
        const response = await axios({
          method: 'POST',
          url,
          data,
          headers,
          withCredentials: true,
        });
        // setToken
        const token: Token = response.data;
        await setToken(token);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw (err as AxiosError<IErrorResponse>).response?.data;
        } else {
          throw err;
        }
      }
    },
    [setToken, token]
  );

  return {
    flag,
    signUp,
    signIn,
    signOut,
    verifiedMfa,
    getMfaQr,
    getMfaSettingCode,
    enabledMfa,
  };
};
