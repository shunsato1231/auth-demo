import React from 'react';
import { FormProvider } from 'react-hook-form';

import { Container, Typography, Card, Box } from '@mui/material';
import { GetAppRounded, QrCode, CheckRounded } from '@mui/icons-material';

import { Slider } from '~/components/ui/Slider';
import { Stepper } from '~/components/ui/Stepper';
import { DeviceDesc } from './DeviceDesc';
import { QrCodeScan } from './QrCodeScan';
import { Verify } from './Verify';
import { Completed } from './Completed';
import { useMfaSettingPage } from './hook';

export const MfaSetting: React.FC = (): JSX.Element => {
  const steps = ['Install App', 'Scan QR code', 'Verify code'];
  const icons: { [index: string]: React.ReactElement } = {
    1: <GetAppRounded />,
    2: <QrCode />,
    3: <CheckRounded />,
  };
  const {
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
  } = useMfaSettingPage({
    stepLength: 3,
  });

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: {
          xs: 4,
        },
      }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        fontWeight="bold"
        sx={{
          color: 'primary.main',
        }}>
        Mfa setting
      </Typography>
      <Box
        sx={{
          width: ['90%', 450],
          mt: 10,
          mb: 5,
        }}>
        <Stepper activeStep={activeStep} steps={steps} icons={icons} />
      </Box>
      <Card
        variant="outlined"
        sx={{
          width: ['100%', 580, 700],
        }}>
        <Slider activeStep={activeStep + 1}>
          <DeviceDesc toForwardStep={toForwardStep} />
          <QrCodeScan
            toForwardStep={toForwardStep}
            toBackwardStep={toBackwardStep}
            qrCode={qrCode}
            toggleMfaSettingCode={toggleMfaSettingCode}
            mfaSettingCode={mfaSettingCode}
          />
          <FormProvider {...useVerifyForm}>
            <Verify
              toBackwardStep={toBackwardStep}
              code1ControllerProps={code1ControllerProps}
              code2ControllerProps={code2ControllerProps}
              verify={verify}
            />
          </FormProvider>
          <Completed signOut={signOut} />
        </Slider>
      </Card>
    </Container>
  );
};
