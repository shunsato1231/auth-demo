import React, { useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Card,
  Box,
  Stack,
  TextField,
} from '@mui/material';
import { useAuthContext } from '~/hooks/Auth/Auth.context';
export const MfaSetting: React.FC = (): JSX.Element => {
  const auth = useAuthContext();
  const [qrImage, setQrImage] = useState<string>('');
  useEffect(() => {
    (async () => {
      try {
        const img = await auth.getMfaQr();
        setQrImage(img);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

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
          mb: 12,
        }}>
        Mfa setting
      </Typography>
      <Card
        variant="outlined"
        sx={{
          width: ['100%', 700],
        }}>
        <Box
          sx={{
            my: {
              xs: 6,
              md: 8,
            },
            mx: {
              xs: 4,
              md: 6,
            },
          }}>
          <Stack alignItems="center">
            <img src={qrImage} />
            <Typography variant="body2" component="p">
              こちらのQRコードを登録してください。
            </Typography>
            <TextField
              label="One time token"
              placeholder="Place enter One time password"
              fullWidth
            />
          </Stack>
        </Box>
      </Card>
    </Container>
  );
};
