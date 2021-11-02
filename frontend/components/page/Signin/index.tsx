import React from 'react';
import { useSigninPage } from './hook';
import { SigninForm } from './SigninForm';
import { VerifyMfaForm } from './VerifyMfaForm';
import { Slider } from '~/components/ui/Slider';

import { Box } from '@mui/material';

export const Signin: React.FC = (): JSX.Element => {
  const { step, SigninFormProps, VerifyMfaFormProps } = useSigninPage();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
      }}>
      <Slider activeStep={step}>
        <SigninForm {...SigninFormProps} />
        <VerifyMfaForm {...VerifyMfaFormProps} />
      </Slider>
    </Box>
  );
};
