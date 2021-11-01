import React from 'react';
import { Stack, Button, Typography, Link } from '@mui/material';
import { OpenInNew, ChevronRight } from '@mui/icons-material';
import { theme } from '~/theme/default';
export interface DeviceDescProps {
  toNext: () => void;
}
export const DeviceDesc: React.FC<DeviceDescProps> = ({
  toNext,
}): JSX.Element => {
  return (
    <Stack
      justifyContent="space-between"
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
        variant="subtitle1"
        component="h1"
        sx={{
          fontWeight: 600,
          textAlign: 'center',
        }}>
        互換性のあるアプリケーションをインストールしてください。
      </Typography>
      <Stack
        spacing={4}
        justifyContent="space-around"
        sx={{
          flexGrow: 0.5,
          my: 6,
        }}>
        <Typography variant="body2" component="p">
          <Link
            sx={{
              mx: 1,
            }}
            href="https://authy.com/"
            target="_blank">
            Authy
            <OpenInNew
              sx={{
                fontSize: 13,
                fill: theme.palette.primary.main,
                ml: '2px',
              }}
            />
          </Link>
          や
          <Link
            sx={{
              mx: 1,
            }}
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ja&gl=US"
            target="_blank">
            Google Authenticator
            <OpenInNew
              sx={{
                fontSize: 13,
                fill: theme.palette.primary.main,
                ml: '2px',
              }}
            />
          </Link>
          などの二段階認証に対応したアプリケーションをPCまたはモバイルデバイスにインストールしてください。
        </Typography>
        <Typography variant="body2" component="p">
          詳しくは
          <Link
            sx={{
              mx: 1,
            }}
            href="https://aws.amazon.com/jp/iam/features/mfa/?audit=2019q1"
            target="_blank">
            こちらのページ
            <OpenInNew
              sx={{
                fontSize: 13,
                fill: theme.palette.primary.main,
                ml: '2px',
              }}
            />
          </Link>
          を参考にしてください。
        </Typography>
      </Stack>
      <Button
        onClick={() => toNext()}
        variant="outlined"
        sx={{
          ml: 'auto',
          pr: 2,
        }}>
        次のステップへ
        <ChevronRight
          sx={{
            fill: theme.palette.primary.light,
            ml: 1,
          }}
        />
      </Button>
    </Stack>
  );
};
