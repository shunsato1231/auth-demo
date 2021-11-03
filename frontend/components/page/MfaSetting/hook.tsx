import { useCallback, useEffect, useState } from 'react';
import { DeviceDescProps } from './DeviceDesc';
import { QrCodeScanProps } from './QrCodeScan';
import { VerifyProps } from './Verify';
import { CompletedProps } from './Completed';

import { useForm } from 'react-hook-form';
import { useAuthContext } from '~/hooks/Auth/Auth.context';
export interface useSignInType {
  activeStep: number;
  DeviceDescProps: DeviceDescProps;
  QrCodeScanProps: QrCodeScanProps;
  VerifyProps: VerifyProps;
  CompletedProps: CompletedProps;
}

export const useMfaSettingPage = ({
  stepLength,
}: {
  stepLength: number;
}): useSignInType => {
  const auth = useAuthContext();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string>('');
  const [mfaSettingCode, setMfaSettingCode] = useState<string>('');

  /**
   * load QR code
   */
  useEffect(() => {
    if (activeStep === 1 && !qrCode) {
      auth.getMfaQr().then((res) => {
        setQrCode(res);
      });
    }
  }, [activeStep, auth, qrCode]);

  /**
   * steps
   */
  const toForwardStep = useCallback(() => {
    if (stepLength > activeStep) {
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, stepLength]);

  const toBackwardStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  }, [activeStep]);

  /**
   * get MfaString code
   */
  const toggleMfaSettingCode = useCallback(
    async (_: React.SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
        const key = await auth.getMfaSettingCode();
        setMfaSettingCode(key);
      } else {
        setMfaSettingCode('');
      }
    },
    [auth]
  );

  /**
   * verify form
   */
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

  const verify = useCallback(
    async ({ code1, code2 }: { code1: string; code2: string }) => {
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
    },
    [auth, toForwardStep, useVerifyForm]
  );

  const signOut = auth.signOut;

  return {
    activeStep,
    DeviceDescProps: {
      toForwardStep,
    },
    QrCodeScanProps: {
      qrCode,
      toForwardStep,
      toBackwardStep,
      toggleMfaSettingCode,
      mfaSettingCode,
    },
    VerifyProps: {
      useVerifyForm,
      toBackwardStep,
      code1ControllerProps,
      code2ControllerProps,
      verify,
    },
    CompletedProps: {
      signOut,
    },
  };
};
