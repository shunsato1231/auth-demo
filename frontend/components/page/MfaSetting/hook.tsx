import { useEffect, useState } from 'react';
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

  const toggleMfaSettingCode = (
    _: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    if (isExpanded) {
      // TODO: get from api
      const key = 'hogehoge';
      setMfaSettingCode(key);
    } else {
      setMfaSettingCode('');
    }
  };

  return {
    activeStep,
    toForwardStep,
    toBackwardStep,
    qrCode,
    toggleMfaSettingCode,
    mfaSettingCode,
  };
};
