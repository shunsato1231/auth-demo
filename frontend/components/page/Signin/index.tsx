import React from 'react';
import { useSigninPage } from './hook';
import { FormProvider } from 'react-hook-form';
import { SigninForm } from './SigninForm';
import { VerifyMfaForm } from './VerifyMfaForm';
import { Slider } from '~/components/ui/Slider';

import { Box } from '@mui/material';

export const Signin: React.FC = (): JSX.Element => {
  const {
    step,
    useSigninForm,
    emailControllerProps,
    passwordControllerProps,
    signin,
    useMfaVerifyForm,
    verifyMfa,
    cancelVerifyMfa,
    codeControllerProps,
  } = useSigninPage();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
      }}>
      <Slider activeStep={step}>
        <FormProvider {...useSigninForm}>
          <SigninForm
            signin={signin}
            emailControllerProps={emailControllerProps}
            passwordControllerProps={passwordControllerProps}
          />
        </FormProvider>
        <FormProvider {...useMfaVerifyForm}>
          <VerifyMfaForm
            verifyMfa={verifyMfa}
            cancelVerifyMfa={cancelVerifyMfa}
            codeControllerProps={codeControllerProps}
          />
        </FormProvider>
      </Slider>
    </Box>
  );
};
