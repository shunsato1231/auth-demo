import React from 'react';
import { useSignInPage } from './hook';
import { SignInForm } from './SignInForm';
import { VerifyMfaForm } from './VerifyMfaForm';
import { Slider } from '~/components/ui/Slider';

import { Box } from '@mui/material';

export const SignIn: React.FC = (): JSX.Element => {
  const { step, SignInFormProps, VerifyMfaFormProps } = useSignInPage();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
      }}>
      <Slider activeStep={step}>
        <SignInForm {...SignInFormProps} />
        <VerifyMfaForm {...VerifyMfaFormProps} />
      </Slider>
    </Box>
  );
};
