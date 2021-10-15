import React from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Typography, Stack, Button } from '@mui/material';
import { useAuthContext } from '~/hooks/Auth/Auth.context';
export const Home: React.FC = (): JSX.Element => {
  const history = useHistory();
  const auth = useAuthContext();

  const signOut = async () => {
    await auth.signOut();
    history.push('signin');
  };
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
      <p>{auth.flag.mfaEnabled}</p>
      {auth.flag.mfaEnabled ? (
        <p>2段階認証は正しく設定されています。</p>
      ) : (
        <>
          <p>2段階認証が設定されていません。</p>
          <p>下記のボタンから設定してください。</p>
        </>
      )}

      <Stack
        sx={{
          mt: {
            xs: 12,
          },
        }}
        spacing={4}>
        {!auth.flag.mfaEnabled && (
          <Button
            type="submit"
            variant="contained"
            size="medium"
            fullWidth
            onClick={() => history.push('/mfa-setting')}>
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
