import React from 'react';
import { useHomePage } from './hook';

import { Container, Typography, Stack, Button, Box } from '@mui/material';
export const Home: React.FC = (): JSX.Element => {
  const { signOut, mfaEnabledFlag, pushMfaSetting, email } = useHomePage();

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
        Home
      </Typography>
      <Stack
        spacing={2}
        sx={{
          textAlign: 'center',
        }}>
        <Box
          component="p"
          sx={{
            mb: 2,
          }}>
          <Typography component="span" fontWeight="bold">
            {email}
          </Typography>
          としてログインしています。
        </Box>
        {mfaEnabledFlag ? (
          <p>2段階認証は正しく設定されています。</p>
        ) : (
          <>
            <p>2段階認証が設定されていません。</p>
            <p>下記のボタンから設定してください。</p>
          </>
        )}
      </Stack>

      <Stack
        sx={{
          mt: {
            xs: 12,
          },
        }}
        spacing={4}>
        {!mfaEnabledFlag && (
          <Button
            type="submit"
            variant="contained"
            size="medium"
            fullWidth
            onClick={() => pushMfaSetting()}>
            2段階認証を有効にする
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          size="medium"
          fullWidth
          onClick={() => signOut()}>
          サインアウト
        </Button>
      </Stack>
    </Container>
  );
};
