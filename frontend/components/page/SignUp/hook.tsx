import { useCallback } from 'react';
import { useForm, UseFormReturn, UseControllerProps } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Dispatch } from '~/store';
import { signUp as storeSignUp } from '~/store/auth';
import { regex } from '~/utils/regex';
import { useHistory } from 'react-router';

export interface useSignInType {
  useSignUpForm: UseFormReturn;
  emailControllerProps: UseControllerProps;
  passwordControllerProps: UseControllerProps;
  confirmPasswordControllerProps: UseControllerProps;
  signUp: ({ email, password }: { email: string; password: string }) => void;
}

export const useSignUpPage = (): useSignInType => {
  /**
   * routing
   */
  const history = useHistory();

  /**
   * store
   */
  const dispatch = useDispatch<Dispatch>();

  /**
   * signUp form
   */
  const useSignUpForm = useForm({ mode: 'onTouched' });
  const emailControllerProps: UseControllerProps = {
    name: 'email',
    control: useSignUpForm.control,
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
    control: useSignUpForm.control,
    defaultValue: '',
    rules: {
      required: 'パスワードを入力してください。',
      pattern: {
        value: regex.password,
        message: 'パスワードの形式が正しくありません。',
      },
    },
  };
  const confirmPasswordControllerProps: UseControllerProps = {
    name: 'confirmPassword',
    control: useSignUpForm.control,
    defaultValue: '',
    rules: {
      required: '確認用パスワードを入力してください。',
      validate: (value) =>
        value === useSignUpForm.getValues('password') ||
        '確認用パスワードが一致しません',
    },
  };
  const signUp = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      dispatch(storeSignUp({ email, password }))
        .then(unwrapResult)
        .then(() => {
          history.push('signin');
        })
        .catch((err) => {
          if (err?.errors) {
            err.errors.map(
              (error: { field: string; message: string; code: string }) => {
                if (error.field) {
                  useSignUpForm.setError(error.field, {
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
    [dispatch, useSignUpForm]
  );

  return {
    useSignUpForm,
    emailControllerProps,
    passwordControllerProps,
    confirmPasswordControllerProps,
    signUp,
  };
};
