import { useCallback, useMemo } from 'react';
import { useForm, UseControllerProps } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Dispatch } from '~/store';
import {
  authSelector,
  signIn as storeSignIn,
  signOut as storeSignOut,
  verifyMfa as storeVerifyMfa,
} from '~/store/auth';
import { regex } from '~/utils/regex';
import { SignInFormProps } from './SignInForm';
import { VerifyMfaFormProps } from './VerifyMfaForm';

export interface useSignInType {
  step: number;
  SignInFormProps: SignInFormProps;
  VerifyMfaFormProps: VerifyMfaFormProps;
}

export const useSignInPage = (): useSignInType => {
  /**
   * store
   */
  const auth = useSelector(authSelector);
  const dispatch = useDispatch<Dispatch>();

  /**
   * slider steps
   */
  const step = useMemo(() => {
    return auth.tokenVerified ? 2 : 1;
  }, [auth]);

  /**
   * signInForm
   */
  const useSignInForm = useForm({ mode: 'onTouched' });
  const emailControllerProps: UseControllerProps = {
    name: 'email',
    control: useSignInForm.control,
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
    control: useSignInForm.control,
    defaultValue: '',
    rules: {
      required: 'パスワードを入力してください。',
      pattern: {
        value: regex.password,
        message: 'パスワードの形式が正しくありません。',
      },
    },
  };
  const signIn = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      dispatch(storeSignIn({ email, password }))
        .then(unwrapResult)
        .catch((err) => {
          if (err.errors) {
            err.errors.map(
              (error: { field: string; message: string; code: string }) => {
                if (error.field) {
                  useSignInForm.setError(error.field, {
                    type: 'manual',
                    message: error.message,
                  });
                } else {
                  alert(error.message);
                }
              }
            );
          }
        });
    },
    [dispatch, useSignInForm]
  );

  /**
   * verifyMfa form
   */
  const useVerifyMfaForm = useForm({ mode: 'onTouched' });
  const codeControllerProps = {
    name: 'code',
    control: useVerifyMfaForm.control,
    defaultValue: '',
    rules: {
      required: 'ワンタイムパスワードを入力してください。',
      validate: (value: string) =>
        value.length === 6 || 'ワンタイムパスワードは6桁で入力してください。',
    },
  };

  const verifyMfa = useCallback(
    ({ code }: { code: string }) => {
      dispatch(storeVerifyMfa(code))
        .then(unwrapResult)
        .catch((err) => {
          if (err.errors) {
            err.errors.map(
              (error: { field: string; message: string; code: string }) => {
                if (error.field) {
                  useVerifyMfaForm.setError(error.field, {
                    type: 'manual',
                    message: error.message,
                  });
                } else {
                  alert(error.message);
                }
              }
            );
          }
        });
    },
    [dispatch, useVerifyMfaForm]
  );
  const cancelVerifyMfa = useCallback(async () => {
    dispatch(storeSignOut())
      .then(unwrapResult)
      .then(() => {
        useSignInForm.reset({ password: '', email: '' });
        useVerifyMfaForm.reset({ code: '' });
      });
  }, [dispatch, useSignInForm, useVerifyMfaForm]);

  return {
    step,
    SignInFormProps: {
      useSignInForm,
      emailControllerProps,
      passwordControllerProps,
      signIn,
    },
    VerifyMfaFormProps: {
      useVerifyMfaForm,
      codeControllerProps,
      verifyMfa,
      cancelVerifyMfa,
    },
  };
};
