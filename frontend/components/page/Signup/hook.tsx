import { useCallback } from 'react';
import { useForm, UseFormReturn, UseControllerProps } from 'react-hook-form';
import { useAuthContext } from '~/hooks/Auth/Auth.context';
import { regex } from '~/utils/regex';

export interface useSignInType {
  useSignUpForm: UseFormReturn;
  emailControllerProps: UseControllerProps;
  passwordControllerProps: UseControllerProps;
  confirmPasswordControllerProps: UseControllerProps;
  signUp: ({ email, password }: { email: string; password: string }) => void;
}

export const useSignUpPage = (): useSignInType => {
  /**
   * auth context
   */
  const auth = useAuthContext();

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
      auth.signUp(email, password).catch((res) => {
        res.errors.map(
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
      });
    },
    [auth, useSignUpForm]
  );

  return {
    useSignUpForm,
    emailControllerProps,
    passwordControllerProps,
    confirmPasswordControllerProps,
    signUp,
  };
};
