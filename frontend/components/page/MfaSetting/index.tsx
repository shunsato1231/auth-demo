import React from 'react';

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
    DeviceDescProps,
    QrCodeScanProps,
    VerifyProps,
    CompletedProps,
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
          <DeviceDesc {...DeviceDescProps} />
          <QrCodeScan {...QrCodeScanProps} />
          <Verify {...VerifyProps} />
          <Completed {...CompletedProps} />
        </Slider>
      </Card>
    </Container>
  );
};
