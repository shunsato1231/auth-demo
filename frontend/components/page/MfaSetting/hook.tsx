import { useEffect, useState } from 'react';
import { useForm, UseFormReturn, UseControllerProps } from 'react-hook-form';
import { useAuthContext } from '~/hooks/Auth/Auth.context';
export interface useSigninType {
  activeStep: number;
  toForwardStep: () => void;
  toBackwardStep: () => void;
  qrCode: string;
  toggleMfaSettingCode: (
    event: React.SyntheticEvent,
    expanded: boolean
  ) => void;
  mfaSettingCode: string;
  useVerifyForm: UseFormReturn;
  verify: ({ code1, code2 }: { code1: string; code2: string }) => void;
  code1ControllerProps: UseControllerProps;
  code2ControllerProps: UseControllerProps;
  signOut: () => Promise<void>;
}

export const useMfaSettingPage = ({
  stepLength,
}: {
  stepLength: number;
}): useSigninType => {
  const auth = useAuthContext();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string>('');
  const [mfaSettingCode, setMfaSettingCode] = useState<string>('');

  useEffect(() => {
    if (activeStep === 1 && !qrCode) {
      auth.getMfaQr().then((res) => {
        setQrCode(res);
      });
    }
  }, [activeStep, auth, qrCode]);

  const toForwardStep = () => {
    if (stepLength > activeStep) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const toBackwardStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const toggleMfaSettingCode = async (
    _: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    if (isExpanded) {
      // TODO: get from api
      const key = await auth.getMfaSettingCode();
      setMfaSettingCode(key);
    } else {
      setMfaSettingCode('');
    }
  };

  const verify = async ({ code1, code2 }: { code1: string; code2: string }) => {
    try {
      await auth.enabledMfa(code1, code2);
      toForwardStep();
    } catch (err) {
      useVerifyForm.setError('code1', {
        type: 'manual',
        message: 'ワンタイムパスワードが間違えています',
      });
      useVerifyForm.setError('code2', {
        type: 'manual',
        message: 'ワンタイムパスワードが間違えています',
      });
    }
  };

  const useVerifyForm = useForm({ mode: 'onTouched' });
  const code1ControllerProps = {
    name: 'code1',
    control: useVerifyForm.control,
    defaultValue: '',
    rules: {
      required: 'ひとつめのワンタイムパスワードを入力してください。',
      validate: (value: string) =>
        value.length === 6 || 'ワンタイムパスワードは6桁で入力してください。',
    },
  };
  const code2ControllerProps = {
    name: 'code2',
    control: useVerifyForm.control,
    defaultValue: '',
    rules: {
      required: 'ふたつめのワンタイムパスワードを入力してください。',
      validate: (value: string) =>
        value.length === 6 || 'ワンタイムパスワードは6桁で入力してください。',
    },
  };

  const signOut = auth.signOut;

  return {
    activeStep,
    toForwardStep,
    toBackwardStep,
    qrCode,
    toggleMfaSettingCode,
    mfaSettingCode,
    useVerifyForm,
    verify,
    code1ControllerProps,
    code2ControllerProps,
    signOut,
  };
};
