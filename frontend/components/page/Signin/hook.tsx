import { useCallback, useMemo } from 'react';
import { useForm, UseFormReturn, UseControllerProps } from 'react-hook-form';
import { useAuthContext } from '~/hooks/Auth/Auth.context';
import { regex } from '~/utils/regex';

export interface useSigninType {
  step: number;
  useSigninForm: UseFormReturn;
  emailControllerProps: UseControllerProps;
  passwordControllerProps: UseControllerProps;
  signin: ({ email, password }: { email: string; password: string }) => void;
  useMfaVerifyForm: UseFormReturn;
  codeControllerProps: UseControllerProps;
  verifyMfa: ({ code }: { code: string }) => void;
  cancelVerifyMfa: () => Promise<void>;
}

export const useSigninPage = (): useSigninType => {
  const auth = useAuthContext();

  const step = useMemo(() => {
    return auth.flag.tokenVerified ? 2 : 1;
  }, [auth]);

  const useSigninForm = useForm({ mode: 'onTouched' });
  const emailControllerProps: UseControllerProps = {
    name: 'email',
    control: useSigninForm.control,
    defaultValue: '',
    rules: {
      required: 'メールアドレスを入力してください。',
      pattern: {
        value: regex.email,
        message: 'メールアドレスの形式が正しくありません。',
      },
    },
  };
  const passwordControllerProps: UseControllerProps = {
    name: 'password',
    control: useSigninForm.control,
    defaultValue: '',
    rules: {
      required: 'パスワードを入力してください。',
      pattern: {
        value: regex.password,
        message: 'パスワードの形式が正しくありません。',
      },
    },
  };
  const signin = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      auth.signIn(email, password).catch((res) => {
        res.errors.map(
          (error: { field: string; message: string; code: string }) => {
            if (error.field) {
              useSigninForm.setError(error.field, {
                type: 'manual',
                message: error.message,
              });
            } else {
              alert(error.message);
            }
          }
        );
      });
    },
    [auth, useSigninForm]
  );

  const useMfaVerifyForm = useForm({ mode: 'onTouched' });
  const codeControllerProps = {
    name: 'code',
    control: useMfaVerifyForm.control,
    defaultValue: '',
    rules: {
      required: 'ワンタイムパスワードを入力してください。',
      validate: (value: string) =>
        value.length === 6 || 'ワンタイムパスワードは6桁で入力してください。',
    },
  };
  const verifyMfa = useCallback(
    ({ code }: { code: string }) => {
      auth.verifiedMfa(code).catch((res) => {
        res.errors.map(
          (error: { field: string; message: string; code: string }) => {
            if (error.field) {
              useMfaVerifyForm.setError(error.field, {
                type: 'manual',
                message: error.message,
              });
            } else {
              alert(error.message);
            }
          }
        );
      });
    },
    [auth, useMfaVerifyForm]
  );
  const cancelVerifyMfa = useCallback(async () => {
    auth.signOut().then(async () => {
      useSigninForm.reset({ password: '', email: '' });
      useMfaVerifyForm.reset({ code: '' });
    });
  }, [auth, useSigninForm, useMfaVerifyForm]);

  return {
    step,
    useSigninForm,
    emailControllerProps,
    passwordControllerProps,
    signin,
    useMfaVerifyForm,
    codeControllerProps,
    verifyMfa,
    cancelVerifyMfa,
  };
};
