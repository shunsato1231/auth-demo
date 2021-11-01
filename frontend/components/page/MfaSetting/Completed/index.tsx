import React from 'react';
import { Stack, Typography, Link } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { theme } from '~/theme/default';
export const Completed: React.FC = (): JSX.Element => {
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
        設定が完了しました
      </Typography>
      <CheckCircle
        sx={{
          fill: theme.palette.primary.main,
          fontSize: 180,
        }}
      />
      <Link
        href="/"
        variant="body2"
        color="inherit"
        sx={{
          mt: 4,
        }}>
        ホームに戻る
      </Link>
    </Stack>
  );
};
