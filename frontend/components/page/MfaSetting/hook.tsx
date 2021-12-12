import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Dispatch } from '~/store';
import {
  getMfaQr,
  getMfaSettingCode,
  enableMfa,
  signOut as storeSignOut,
} from '~/store/auth';

import { DeviceDescProps } from './DeviceDesc';
import { QrCodeScanProps } from './QrCodeScan';
import { VerifyProps } from './Verify';
import { CompletedProps } from './Completed';

import { useForm } from 'react-hook-form';
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
  /**
   * store
   */
  const dispatch = useDispatch<Dispatch>();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string>('');
  const [mfaSettingCode, setMfaSettingCode] = useState<string>('');

  /**
   * load QR code
   */
  useEffect(() => {
    if (activeStep === 1 && !qrCode) {
      dispatch(getMfaQr())
        .then(unwrapResult)
        .then((res) => {
          setQrCode(res);
        });
    }
  }, [activeStep, dispatch, qrCode]);

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
        dispatch(getMfaSettingCode())
          .then(unwrapResult)
          .then((key) => {
            setMfaSettingCode(key);
          });
      } else {
        setMfaSettingCode('');
      }
    },
    [dispatch]
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
      dispatch(enableMfa({ code1, code2 }))
        .then(unwrapResult)
        .then(() => {
          toForwardStep();
        })
        .catch((err) => {
          if (err?.errors) {
            useVerifyForm.setError('code1', {
              type: 'manual',
              message: 'ワンタイムパスワードが正しくありません。',
            });
            useVerifyForm.setError('code2', {
              type: 'manual',
              message: 'ワンタイムパスワードが正しくありません。',
            });
          }
        });
    },
    [dispatch, toForwardStep, useVerifyForm]
  );

  const signOut = useCallback(async () => {
    dispatch(storeSignOut());
  }, [dispatch]);

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
