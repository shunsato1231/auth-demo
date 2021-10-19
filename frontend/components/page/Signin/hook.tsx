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
      required: 'required email',
      pattern: {
        value: regex.email,
        message: 'invalid email',
      },
    },
  };
  const passwordControllerProps: UseControllerProps = {
    name: 'password',
    control: useSigninForm.control,
    defaultValue: '',
    rules: {
      required: 'required password',
      pattern: {
        value: regex.password,
        message: 'invalid password',
      },
    },
  };
  const signin = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      auth.signIn(email, password).catch((err) => {
        console.log(err);
      });
    },
    [auth]
  );

  const useMfaVerifyForm = useForm({ mode: 'onTouched' });
  const codeControllerProps = {
    name: 'code',
    control: useMfaVerifyForm.control,
    defaultValue: '',
    rules: {
      required: 'required code',
      validate: (value: string) =>
        value.length === 6 || 'Please enter the code in 6 digits',
    },
  };
  const verifyMfa = useCallback(
    ({ code }: { code: string }) => {
      auth.verifiedMfa(code).catch((err) => {
        console.error(err);
      });
    },
    [auth]
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
