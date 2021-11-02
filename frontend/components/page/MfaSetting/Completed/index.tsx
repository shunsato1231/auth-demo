import React from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { theme } from '~/theme/default';
export interface CompletedProps {
  signOut: () => Promise<void>;
}
export const Completed: React.FC<CompletedProps> = ({
  signOut,
}): JSX.Element => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        height: '100%',
        py: {
          xs: 6,
          md: 8,
        },
        px: {
          xs: 4,
          md: 6,
        },
      }}
      component="section">
      <Typography
        variant="body1"
        component="h1"
        color="primary"
        sx={{
          mb: 2,
        }}>
        設定が完了しました。ログインし直してください。
      </Typography>
      <CheckCircle
        sx={{
          fill: theme.palette.primary.main,
          fontSize: 180,
        }}
      />
      <Button
        variant="text"
        onClick={signOut}
        sx={{
          mt: 4,
        }}>
        <Typography variant="body2" color="inherit">
          ログインページに戻る
        </Typography>
      </Button>
    </Stack>
  );
};
