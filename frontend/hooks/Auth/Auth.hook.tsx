import axios, { AxiosError } from 'axios';
import { useLocalStorage } from '../LocalStorage/LocalStorage.hook';
import { User, Token } from './Auth.types';

interface IErrorResponse {
  code: string;
  message: string;
  error_user_title: string;
  error_user_message: string;
}
export interface AuthContextType {
  flag: userAuthType;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifiedMfa: (code: string) => Promise<void>;
  getMfaQr: () => Promise<string>;
  enabledMfa: () => Promise<void>;
}

export type userAuthType = {
  mfaEnabled: boolean;
  mfaVerified: boolean;
  tokenVerified: boolean;
};

export const useAuth = (): AuthContextType => {
  const [token, setToken] = useLocalStorage<string>('token', '');
  const initialAuth: userAuthType = {
    mfaEnabled: false,
    mfaVerified: false,
    tokenVerified: false,
  };
  const [flag, setFlag] = useLocalStorage<userAuthType>('flag', initialAuth);

  const signUp = async (email: string, password: string) => {
    const url = '/api/auth/signup';
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
  };

  const signIn = async (email: string, password: string) => {
    const url = '/api/auth/signin';
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
      console.log(user.token);
      console.log(token);
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
  };

  const signOut = async () => {
    await setToken('');
    await setFlag({
      mfaEnabled: false,
      mfaVerified: false,
      tokenVerified: false,
    });
  };

  const verifiedMfa = async (code: string) => {
    const url = '/api/auth/verify_mfa';
    const data = { code, token };
    try {
      const response = await axios({
        method: 'POST',
        url,
        data,
        withCredentials: true,
      });
      // setToken
      const token: Token = response.data;
      await setToken(token);
      // setFlag
      const newAuth = flag;
      newAuth.mfaVerified = true;
      await setFlag(newAuth);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw (err as AxiosError<IErrorResponse>).response?.data;
      } else {
        throw err;
      }
    }
  };

  const getMfaQr = async () => {
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

      const base64 = new Buffer(response.data, 'binary').toString('base64');
      const prefix = `data:${response.headers['content-type']};base64,`;

      return prefix + base64;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw (err as AxiosError<IErrorResponse>).response?.data;
      } else {
        throw err;
      }
    }
  };

  const enabledMfa = async () => {
    const url = '/api/auth/enabled_mfa';
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios({
        method: 'POST',
        url,
        headers,
        withCredentials: true,
      });
      // setToken
      const token: Token = response.data;
      await setToken(token);
      // setFlag
      await setFlag({
        mfaEnabled: true,
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
  };

  return {
    flag,
    signUp,
    signIn,
    signOut,
    verifiedMfa,
    getMfaQr,
    enabledMfa,
  };
};
