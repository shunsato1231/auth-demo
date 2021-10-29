import { useEffect, useState } from 'react';
import { useAuthContext } from '~/hooks/Auth/Auth.context';
export interface useSigninType {
  activeStep: number;
  toForwardStep: () => void;
  toBackwardStep: () => void;
  qrCode: string;
}

export const useMfaSettingPage = ({
  stepLength,
}: {
  stepLength: number;
}): useSigninType => {
  const auth = useAuthContext();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string>('');

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

  return {
    activeStep,
    toForwardStep,
    toBackwardStep,
    qrCode,
  };
};
